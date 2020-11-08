function queue(xhttp, action, machine_type) {
    join_form = document.getElementById("join-washing");
    username = join_form.getElementsByClassName("join-usr-input")[0].value;
    password = join_form.getElementsByClassName("join-pwd-input")[0].value;
    // send request
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(xhttp.responseText);
            for (var id in data) {
                loadMachine(id, data[id]);
            }
        }
    };
    xhttp.open("GET", `/queue/${machine_type}/${action}/usr/${username}/pwd/${password}`, true);
    xhttp.send();
    console.log("refreshed!");
}
