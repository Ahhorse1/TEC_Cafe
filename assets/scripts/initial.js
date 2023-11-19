window.addEventListener("DOMContentLoaded", init);

const colors = ['#04AA6D', '#dce30f', '#e3130f'];

var pcPairs = {};
var pcPairsTiming = {};
var pcToUser = {}
var userToPC = {}

function init() {

}

function updatePC(id) {
    if (!pcPairs.hasOwnProperty(id)){
        pcPairs[id] = 0;
    }

    switch (pcPairs[id]) {
        case 0:
            let loginForm = document.getElementById("using-loginForm");
            $("#addToUsingModal").modal('show');
            pcPairs[id] = 1
            document.getElementById(id).style.backgroundColor = colors[1];
            pushQueue(id);
            startTimer(id,'addToUsingModal');
            loginForm.reset();
            break;
        default:
            $("#userInfoModal").modal('show');
            let name = pcToUser[id][0]
            let pid = pcToUser[id][1]
            let nameELem = document.getElementById("info-name")
            let pidElem = document.getElementById("info-pid")
            nameELem.innerHTML="Name: "+ name;
            pidElem.innerHTML = "PID: "+ pid;
            let endBtn = document.getElementById("endButton")
            endBtn.addEventListener("click", (e) => {
                e.preventDefault();
                pcPairs[id] = 0;
                document.getElementById(id).style.backgroundColor = colors[0];
                clearInterval(pcPairsTiming[id]);
                removeQueue(id);
                $("#userInfoModal").modal('toggle');
            })
    }
}

function getInfo(id) {
    if (!pcPairs.hasOwnProperty(id) || pcPairs[id] == 0) {
        return;
    }
    let userInfo = pcToUser[id];
    let name = userInfo[0]
    let pid = userInfo[1]
    console.log("works")
    let button = document.getElementById(id);
    button.title = "Name: " + name + "\n" + "PID: " + pid;
}

function pushQueue(id) {
    var currentQueue = document.getElementById("pc_queue");
    var li = document.createElement("li");
    li.innerHTML = id;
    li.id = id + "time";
    currentQueue.appendChild(li);
}

function removeQueue(id) {
    var currentQueue = document.getElementById("pc_queue");
    currentQueue.removeChild(document.getElementById(id+"time"));
}

async function startTimer(id, modalID ,maxTime=7200){
    await submitModal(id, modalID);
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


function submitModal(id, modalID) {
    return new Promise((resolve, reject) => {
        let loginForm = document.getElementById("using-loginForm");
        var name;
        var pid;
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            // e.stopImmediatePropagation();

            name = document.getElementById("using-name");
            pid = document.getElementById("using-pid");

            if (name.value != "" && pid.value != "") {           
                $('#'+modalID).modal('toggle');
                resolve();
            }
            // map to PC
            pcToUser[id] = [name.value, pid.value];
            userToPC[name.value] = id;
            console.log(pcToUser[id]);
        });
    });
    
  }

function dragAndDropItem() {
    const list = document.getElementById('ppl_queue');

    let draggedItem = null;
    let blankItem = document.createElement("li");

    // When first dragging, hide the dragged item
    list.addEventListener('dragstart', function (e) {
        draggedItem = e.target;
        setTimeout(function () {
            draggedItem.style.display = 'none';
        }, 0);
    });
    // While dragging, move the rest of the elements down, insert dragged item 
    list.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const afterElement = findElementAfterDrop(list, e.clientY);
        // insert blank item for visibility purposes (will delete later)
        list.insertBefore(blankItem, afterElement);
        if (afterElement == null) {
            list.appendChild(draggedItem);
        } else {
            list.insertBefore(draggedItem, afterElement);
        }
    });
    // Find the element that should be right after the dragged item
    function findElementAfterDrop(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

        return draggableElements.reduce(function (closest, child) {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    };

    // Once dragging is finished, delete the blank item, show the dragged item
    list.addEventListener('dragend', function (e) {
        if (list.contains(blankItem)) {
            list.removeChild(blankItem);
        }
        draggedItem.style.display = 'block';
        draggedItem = null;
    });
}

// adds user to waitlist after filling in form
function updateWaitlist(){
    $("#addtoWaitlist").modal('show');
    var waitQueue = document.getElementById("ppl_queue");
    let loginForm = document.getElementById("waitlist-loginForm");
    var name;
    var pid;

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        name = document.getElementById("waitlist-name");
        pid = document.getElementById("waitlist-pid");

        if (name.value == "" || pid.value == "") {
            alert("Ensure you input a value in both fields!");
        } else {            
            var li = document.createElement("li");
            li.draggable = true;
            li.ondragstart = dragAndDropItem();
            li.innerHTML = name.value;
            li.id = name+pid;
            waitQueue.appendChild(li);
            loginForm.reset();
            $('#addtoWaitlist').modal('toggle'); 
        }
    });
}
