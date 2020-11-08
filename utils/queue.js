class Queue {
    constructor(num, prefix, time_limit, tolerance) {
        // id
        this.num = num;
        this.prefix = prefix;
        // queue
        this.machines = {};
        for (var i = 0; i < this.num; i++) {
            this.machines[this.prefix + (i + 1)] = {
                "status": "idle",
                "person": null,
                "start_time": null
            };
        }
        this.waitQueue = []
        // time
        this.clock = new Date();
        this.time_limit = time_limit;
        this.tolerance = tolerance;
    }
    existMachines(person) {
        for (var i = 0; i < this.num; i++) {
            if (this.machines[this.prefix + (i + 1)]["person"] == person) {
                return true;
            }
        }
        return false;
    }
    existQueue(person) {
        return this.waitQueue.includes(person);
    }
    exist(person) {
        return this.existMachines(person) || this.existQueue(person);
    }
    countMachines() {
        var count = 0;
        for (var i = 0; i < this.num; i++) {
            if (this.machines[this.prefix + (i + 1)]["person"] != null) {
                count++;
            }
        }
        return count;
    }
    countQueue() {
        return this.waitQueue.length;
    }
    count() {
        return this.countMachines() + this.countQueue();
    }
    add(person) {
        if (this.exist(person)) {
            return;
        }
        this.waitQueue.push(person);
        this.moveForward();
    }
    clear(index) {
        this.machines[index]["status"] = "idle";
        this.machines[index]["person"] = null;
        this.machines[index]["start_time"] = null;
    }
    remove(person) {
        if (this.existMachines(person)) {
            for (var i = 0; i < this.num; i++) {
                if (this.machines[this.prefix + (i + 1)]["person"] == person) {
                    this.clear(this.prefix + (i + 1));
                    break;
                }
            }
            this.moveForward();
        } else if (this.existQueue(person)) {
            var index = this.waitQueue.indexOf(person);
            this.waitQueue.splice(index, 1);
        }
    }
    moveForward() {
        if (this.countMachines() == this.num || this.countQueue() == 0) {
            return;
        }
        var person = this.waitQueue.shift();
        for (var i = 0; i < this.num; i++) {
            var machine = this.machines[this.prefix + (i + 1)];
            if (machine["status"] != "idle") continue;
            machine["status"] = "using";
            machine["person"] = person;
            machine["start_time"] = Date.now();
            break;
        }
        this.moveForward();
    }
    checkFinish() {
        for (var i = 0; i < this.num; i++) {
            var machine = this.machines[this.prefix + (i + 1)];
            if (machine["status"] == "using" && this.overTime(machine)) {
                machine["status"] = "complete";
            }
            if (machine["status"] == "complete" && this.overTolerace(machine)) {
                this.clear(this.prefix + (i + 1));
            }
        }
        this.moveForward();
    }
    overTime(machine) {
        return Date.now() > machine["start_time"] + this.time_limit;
    }
    overTolerace(machine) {
        return Date.now() > machine["start_time"] + this.time_limit + this.tolerance;
    }
    readMachines() {
        return JSON.parse(JSON.stringify(this.machines));
    }
    readQueue() {
        return JSON.parse(JSON.stringify(this.waitQueue));
    }
}

exports.Queue = Queue;
