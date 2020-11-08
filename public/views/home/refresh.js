var doRefresh = true;
const minute = 60 * 1000
const time_limit = 1 * minute;

function refresh(xhttp) {
    doRefresh = true;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(xhttp.responseText);
            for (var id in data) {
                loadMachine(id, data[id]);
            }
        }
    };
    xhttp.open("GET", "/status", true);
    xhttp.send();
    console.log("refreshed!");
}

function loadMachine(id, data) {
    // find elements
    var machine = document.getElementById(id);
    var machine_status = machine.getElementsByClassName("machine-status")[0];
    var machine_person = machine.getElementsByClassName("machine-person")[0];
    var machine_time = machine.getElementsByClassName("machine-time")[0];
    // update status and person
    machine_status.innerHTML = data["status"];
    changeColor(machine_status, {"idle": "green", "using": "blue", "complete": "red"}[data["status"]])
    machine_person.innerHTML = (data["person"] == null? "" : data["person"]);
    // update time
    if (data["start_time"] == null) {
        machine_time.innerHTML = "";
        changeColor(machine_time, "black");
        return;
    }
    var remaining_time = data["start_time"] + time_limit - Date.now();
    console.log(remaining_time / 1000);
    var remaining_minute = Math.ceil(remaining_time / parseFloat(minute));
    machine_time.innerHTML = remaining_minute + " min";
    changeColor(machine_time, remaining_minute > 0? "blue" : "red");
}

function changeColor(element, color) {
    ["red", "green", "blue"].forEach(c => {
        element.classList.remove(c);
    });
    if (color == "black") {
        return;
    }
    element.classList.add(color);
}
