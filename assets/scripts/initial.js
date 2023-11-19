window.addEventListener("DOMContentLoaded", init);

const colors = ['#04AA6D', '#dce30f', '#e3130f'];

var pcPairs = {};
var pcPairsTiming = {};

function init() {

}

function updatePC(id) {
    if (!pcPairs.hasOwnProperty(id)){
        pcPairs[id] = 0;
    }

    switch (pcPairs[id]) {
        case 0:
            $("#assignUserModal").modal('show');
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

async function startTimer(id, maxTime=7200){
    await closeModal();
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


function closeModal() {
    return new Promise((resolve, reject) => {
      var name = document.getElementById("username");
      var pid = document.getElementById("pid");
      var submitButton = document.getElementById("submit");
      submitButton.addEventListener("click", function(){ 
        if (name.value != "" && pid.value != ""){
            resolve();
        }
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
