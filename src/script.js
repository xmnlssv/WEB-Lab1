"use strict";

let x;

let y;

let r;

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

  let buttons = document.querySelectorAll("input[name=R-button]");
  buttons.forEach(setOnClick);

  document.getElementById("outputContainer").innerHTML = localStorage.getItem("session");
};

document.getElementById("checkButton").onclick = function () {
  if (validateX() && validateY() && validateR()) {

    fetch("./php/script.php?", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: new URLSearchParams({
        x: encodeURIComponent(x),
        y: encodeURIComponent(y),
        r: encodeURIComponent(r),
        timezone: encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone)
      })
    })
      .then(response => response.text())
      .then(function (serverAnswer) {
        localStorage.setItem("session", serverAnswer);
        document.getElementById("outputContainer").innerHTML = serverAnswer;
      })
      .catch(err => createNotification("Ошибка HTTP " + err.status + ". Повторите попытку позже." + err));
  }
};

function createNotification(message) {
  let outputContainer = document.getElementById("outputContainer");
  if (outputContainer.contains(document.querySelector(".notification"))) {
    let stub = document.querySelector(".notification");
    stub.textContent = message;
    stub.classList.replace("outputStub", "errorStub");
  } else {
    let notificationTableRow = document.createElement("h4");
    notificationTableRow.innerHTML = "<span class='notification errorStub'></span>";
    outputContainer.prepend(notificationTableRow);
    let span = document.querySelector(".notification");
    span.textContent = message;
  }
}

function validateX() {
  try {
    x = document.querySelector("input[type=radio]:checked").value;
    return true;
  } catch (err) {
    createNotification("Значение X Не выбрано");
    return false;
  }
}

function validateY() {
  y = document.querySelector("input[name=Y-input]").value.replace(",", ".");
  const expPattern = /[+\-]?(\d+(\.\d*)?|\.\d+)([eE][+\-]?\d+)?/;
  if (y === undefined) {
    createNotification("Y не введён");
    return false;
  } else if (!isNumeric(y)) {
    createNotification("Y Не число");
    return false;
  } else if (expPattern.test(y)) {
    createNotification("Y не должен быть в экспоненциальной форме");
    return false;
  } else if (!((y > -3) && (y < 5))) {
    createNotification("Y не входит в область допустимых значений");
    return false;
  } else
    return true;
}

function validateR() {
  if (isNumeric(r)) return true;
  else {
    createNotification("Значение R не выбрано");
    return false;
  }
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
