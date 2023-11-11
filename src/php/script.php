<?php

require __DIR__ . "/CoordinatesValidator.php";
require __DIR__ . "/HitChecker.php";

@session_start();

if (!isset($_SESSION["results"])) {
    $_SESSION["results"] = array();
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    return;
}

date_default_timezone_set($_POST["timezone"]);

function roundY($y) {
    if ($y < 0) {
        return ceil($y * 1000) / 1000;
    } else {
        return floor($y * 10000) / 10000;
    }
}

$x = (float) $_POST["x"];
$y = (float) roundY($_POST["y"]);
$r = (float) $_POST["r"];

$validator = new CoordinatesValidator($x, $y, $r);
if ($validator->checkData()) {
    $isInArea = HITChecker::isInArea($x, $y, $r);
    $coordsStatus = $isInArea
        ? "<span class='success'>true</span>"
        : "<span class='fail'>false</span>";

    $currentTime = date('Y-m-d H:i:s');
    $benchmarkTime = microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"];

    $newResult = array(
        "x" => $x,
        "y" => $y,
        "r" => $r,
        "coordsStatus" => $coordsStatus,
        "currentTime" => $currentTime,
        "benchmarkTime" => $benchmarkTime
    );

    array_push($_SESSION["results"], $newResult);

    echo "<table id='outputTable'>
        <tr>
            <th>X</th>
            <th>Y</th>
            <th>R</th>
            <th>Результат</th>
            <th>Текущее время</th>
            <th>Время исполнения</th>
        </tr>";

    foreach (array_reverse($_SESSION["results"]) as $tableRow) {
        echo "<tr>";
        echo "<td>" . $tableRow["x"] . "</td>";
        echo "<td>" . $tableRow["y"] . "</td>";
        echo "<td>" . $tableRow["r"] . "</td>";
        echo "<td>" . $tableRow["coordsStatus"] . "</td>";
        echo "<td>" . $tableRow["currentTime"] . "</td>";
        echo "<td>" . $tableRow["benchmarkTime"] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    http_response_code(422);
    return;
}


