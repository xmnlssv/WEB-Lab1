let x;

let y;

let r;

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function validateX() {
    try {
        x = document.querySelector("input[type=radio]:checked").value;
        return true;
    } catch (err) {
        createNotification("Значение X не выбрано");
        return false;
    }
}

function validateY() {
    y = document.querySelector("input[name=Y-input]").value.replace(",", ".");
    if (y === undefined) {
        createNotification("Y не введён");
        return false;
    } else if (!isNumeric(y)) {
        createNotification("Y не число");
        return false;
    } else if (!((y > -3) && (y < 5))) {
        createNotification("Y не входит в область допустимых значений");
        return false;
    } else return true;
}



function validateR() {
    if (isNumeric(r)) return true;
    else {
        createNotification("Значение R не выбрано");
        return false;
    }
}

window.onload = function () {
    function setOnClick(element) {
        element.onclick = function () {
            r = this.value;
            buttons.forEach(function (element) {
                element.style.boxShadow = "";
                element.style.transform = "";
            });
            this.style.boxShadow = "0 0 40px 5px greenyellow";
            this.style.transform = "scale(1.05)";
        }
    }

    let buttons = document.querySelectorAll("input[name=button]");
    buttons.forEach(setOnClick);

    document.getElementById("output").innerHTML = localStorage.getItem("session");
};

document.getElementById("submit").onclick = function () {
    if (validateX() && validateY() && validateR()) {
        const coords = "x=" + encodeURIComponent(x) + "&y=" + encodeURIComponent(y) + "&r=" + encodeURIComponent(r) +
            "&timezone=" + encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone);
        fetch("./php/script.php?" + coords, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" }
        }).then(response => response.text()).then(function (serverAnswer) {
            setPointer(serverAnswer);
            localStorage.setItem("session", serverAnswer);
            document.getElementById("output").innerHTML = serverAnswer;
        }).catch(err => createNotification("Ошибка HTTP " + err.status + ". Повторите попытку позже." + err));
    }
};

function setPointer(serverAnswer) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(serverAnswer, "text/html");
    const row = doc.querySelectorAll('tr')[1];
    if (!row) return;
    const cells = row.getElementsByTagName('td');
    const last = cells[3];

    let pointer = document.getElementById("pointer");

    pointer.style.visibility = "visible";
    pointer.style.fill = last.innerHTML.includes("success") ? "#black" : "#red";

    pointer.setAttribute("cx", x * 60 * 2 / r + 150);
    pointer.setAttribute("cy", -y * 60 * 2 / r + 150);
}

function createNotification(message) {
    let output = document.getElementById("output");
    if (output.contains(document.querySelector(".notification"))) {
        let stub = document.querySelector(".notification");
        stub.textContent = message;
        stub.classList.replace("outputStub", "errorStub");
    } else {
        let notificationTableRow = document.createElement("h4");
        notificationTableRow.innerHTML = "<span class='notification errorStub'></span>";
        output.prepend(notificationTableRow);
        let span = document.querySelector(".notification");
        span.textContent = message;
    }
}




