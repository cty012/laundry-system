var doRefresh = true;
const minute = 60 * 1000
const time_limit = 1 * minute;

function refresh(xhttp) {
    doRefresh = true;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(xhttp.responseText);
            for (var id in data.machines) {
                loadMachine(id, data.machines[id]);
            }
            loadQueue("washer", data.queue["washer"]);
            loadQueue("dryer", data.queue["dryer"]);
        }
    };
    xhttp.open("GET", "/status", true);
    xhttp.send();
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

function loadQueue(machine_type, data) {
    console.log("queue-" + machine_type);
    element = document.getElementById("queue-" + machine_type);
    element.innerHTML = "";
    data.forEach(person => {
        element.innerHTML += `<div class="queue-person">${person}</div>`
    });
}

function queue(xhttp, action, machine_type) {
    join_form = document.getElementById(`join-${machine_type}`);
    username = join_form.getElementsByClassName("join-usr-input")[0].value;
    password = join_form.getElementsByClassName("join-pwd-input")[0].value;
    // send request
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(xhttp.responseText);
            for (var id in data.machines) {
                loadMachine(id, data.machines[id]);
            }
            loadQueue("washer", data.queue["washer"]);
            loadQueue("dryer", data.queue["dryer"]);
        }
    };
    xhttp.open("GET", `/queue/${machine_type}/${action}/usr/${username}/pwd/${password}`, true);
    xhttp.send();
}
