window.addEventListener("DOMContentLoaded", init);

const colors = ['#04AA6D', '#dce30f', '#e3130f'];

var pcPairs = {}
var inUse = []

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
            inUse.push(id);
            updateQueue();
            startTimer(id);
            break;
        default:
            pcPairs[id] = 0
            document.getElementById(id).style.backgroundColor = colors[0];
            remove_inUse(id); 
            updateQueue();
    }
}

function remove_inUse(id) {
    var newArray = [];
    for (let i = 0; i < inUse.length; i++){
        if (inUse[i] != id){
            newArray.push(inUse[i]);
        }
    }
    inUse = newArray;
}

function updateQueue(){
    var currentQueue = document.getElementById("pc_queue");
    currentQueue.innerHTML = "";
    for(let i = 0; i < inUse.length; i++){
        var li = document.createElement("li");
        li.innerHTML = inUse[i];
        li.id = inUse[i]+String("time");
        currentQueue.appendChild(li);
    }
}

function startTimer(id){
    var maxTime = 7200;
    var li = document.getElementById(id+String("time"));
    var timerID = setInterval(function () {
        maxTime -= 1;
        remaining = new Date(maxTime * 1000).toISOString().substring(11, 16)
        if (maxTime == 1600){
            pcPairs[id] = 2
            document.getElementById(id).style.backgroundColor = colors[2];
        }
        li.innerHTML = id + ": " + remaining;
        if (maxTime == 0) {
            li.innerHTML = id + ": 2 Hour Limit Reached";
            clearInterval(timerID);
        }
    });
}