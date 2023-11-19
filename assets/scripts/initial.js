window.addEventListener("DOMContentLoaded", init);

const colors = ['#04AA6D', '#dce30f', '#e3130f'];

var pcPairs = {}
var pcPairsTiming = {}
var inUse = []

function init() {

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updatePC(id) {
    if (!pcPairs.hasOwnProperty(id)){
        pcPairs[id] = 0;
        $("#assignUserModal").modal('show')
    }

    switch (pcPairs[id]) {
        case 0:
            $("#assignUserModal").modal('show');
            pcPairs[id] = 1
            document.getElementById(id).style.backgroundColor = colors[1];
            inUse.push(id);
            updateQueue();
            startTimer(id);
            
            break;
        default:
            pcPairs[id] = 0
            document.getElementById(id).style.backgroundColor = colors[0];
            clearInterval(pcPairsTiming[id]);
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

function startTimer(id, maxTime=7200){
    pcPairsTiming[id] = setInterval(function () {
        maxTime -= 1;
        remaining = new Date(maxTime * 1000).toISOString().substring(11, 16)
        if (maxTime == 1600){
            pcPairs[id] = 2
            document.getElementById(id).style.backgroundColor = colors[2];
        }
        document.getElementById(id+String("time")).innerHTML = id + ": " + remaining + name;
        if (maxTime == 0) {
            document.getElementById(id+String("time")).innerHTML = id + ": Limit Reached";
            clearInterval(pcPairsTiming[id]);
        }
    });
}

function updateWaitlist(){
    $("#addtoWaitlist").modal('show')
    var waitQueue = document.getElementById("ppl_queue");
    let loginForm = document.getElementById("loginForm");
    var name;
    var pid;

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        name = document.getElementById("name");
        pid = document.getElementById("pid");

        if (name.value == "" || pid.value == "") {
            alert("Ensure you input a value in both fields!");
        } else {
            // perform operation with form input
            alert("This form has been successfully submitted!");
            console.log(
            `This form has a name of ${name.value} and pid of ${pid.value}`
            );
            
            var li = document.createElement("li");
            li.innerHTML = name.value;
            li.id = name+pid;
            waitQueue.appendChild(li);

            name.value = "";
            pid.value = "";
        }
    });

    
    // for(let i = 0; i < inUse.length; i++){
    //     var li = document.createElement("li");
    //     li.innerHTML = inUse[i];
    //     li.id = inUse[i]+String("time");
    //     currentQueue.appendChild(li);
    // }
}