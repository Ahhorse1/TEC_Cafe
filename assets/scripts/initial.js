window.addEventListener("DOMContentLoaded", init);

const colors = ['#04AA6D', '#dce30f', '#e3130f'];

var pcPairs = {}
var inUse = []

function init() {

}

function updatePC(id) {
    if (pcPairs.hasOwnProperty(id)){
        if (pcPairs[id] == 0) {
            pcPairs[id] = 1;
            document.getElementById(id).style.backgroundColor = colors[1];
            inUse.push(id);
        }
        else if (pcPairs[id] == 1) {
            pcPairs[id] = 2;
            document.getElementById(id).style.backgroundColor = colors[2];
        }
        else {
            pcPairs[id] = 0;
            document.getElementById(id).style.backgroundColor = colors[0];
            remove(id);
        }
    }
    else {
        pcPairs[id] = 1;
        document.getElementById(id).style.backgroundColor = colors[1];
        inUse.push(id);
    }

    updateQueue();
}

function remove(id) {
    var newArray = [];
    for (let i = 0; i < inUse.length; i++){
        if (inUse[i] != id){
            newArray.push(inUse[i]);
        }
    }
    inUse = newArray;
}

function updateQueue(){
    var currentQueue = document.getElementById("queue");
    currentQueue.innerHTML = "";
    for(let i = 0; i < inUse.length; i++){
        var li = document.createElement("li");
        li.innerHTML = inUse[i];
        currentQueue.appendChild(li);
    }
}