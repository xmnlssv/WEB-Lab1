<?php

class HitChecker
{
    public static function isInArea($x, $y, $r)
    {
        // Сектор в 1 четверти
        if ($x > 0 && $y > 0) {
            return ($x * $x + $y * $y) <= ($r * $r);
        }
        // Треугольник в 3 четверти
        if ($x < 0 && $y < 0) {
//            return ($x >= -$r / 2) && ($y >= -$r) && (2 * $x + $y >= $r);
            return (-$x <= $r / 2) && (-$y <= $r) && (-2 * $x - $y <= $r);
        }
        // Прямоугольник в 4 четверти
        if ($x >= 0 && $y <= 0) {
            return ($x <= $r / 2) && ($y >= -$r);
        }
        // 2 четверть
        return false;
    }
}
