window.addEventListener("DOMContentLoaded", init);

const colors = ['#04AA6D', '#dce30f', '#e3130f'];

var pcPairs = {}
var pcPairsTiming = {}

function init() {

}

function updatePC(id) {
    if (!pcPairs.hasOwnProperty(id)){
        pcPairs[id] = 0;
    }

    switch (pcPairs[id]) {
        case 0:
            pcPairs[id] = 1
            document.getElementById(id).style.backgroundColor = colors[1];
            pushQueue(id);
            startTimer(id);
            break;
        default:
            pcPairs[id] = 0
            document.getElementById(id).style.backgroundColor = colors[0];
            clearInterval(pcPairsTiming[id]);
            removeQueue(id);
    }
}

function pushQueue(id) {
    var currentQueue = document.getElementById("pc_queue");
    var li = document.createElement("li");
    li.innerHTML = id;
    li.id = id + "time";
    currentQueue.appendChild(li);
}

function removeQueue(id) {
    document.getElementById(id+"time").remove();
}

function startTimer(id, maxTime=7200){
    pcPairsTiming[id] = setInterval(function () {
        maxTime -= 1;
        remaining = new Date(maxTime * 1000).toISOString().substring(11, 16)
        if (maxTime == 1600){
            pcPairs[id] = 2
            document.getElementById(id).style.backgroundColor = colors[2];
        }
        document.getElementById(id+"time").innerHTML = id + ": " + remaining;
        if (maxTime == 0) {
            document.getElementById(id+"time").innerHTML = id + ": Limit Reached";
            clearInterval(pcPairsTiming[id]);
        }
    });
}