
// accessing some constants
const root = document.documentElement;
const modeIcon = document.querySelector(".mode");
const saveIcon = document.querySelector(".save");
const loadIcon = document.querySelector(".load");
const dashboard = document.querySelector(".dashboard");
let page = document.querySelector(".page");
let pageHead = page.firstElementChild;
let taskbox = page.querySelector(".taskbox");
let timeLine = page.querySelector(".timeLine");
let adder = taskbox.firstElementChild;

// local data
let dataBase = {
    "TODAY": {
        "saved": false,
        "card": null
    },
    "THIS WEEK": {
        "saved": false,
        "card": null
    },
    "THIS MONTH": {
        "saved": false,
        "card": null
    },
    "THIS YEAR": {
        "saved": false,
        "card": null
    }
}

//setup mode
let mode = "dark";

modeIcon.addEventListener("click", changeMode);

saveIcon.addEventListener("click", saveFile);

loadIcon.addEventListener("click", loadFile);

// load file
function loadFile(){
    let file = document.createElement("input");
    file.type = "file";
    file.accept = ".json";
    file.click();
}

// save file
function saveFile() {
    // Convert your data to a JSON string
    let file = JSON.stringify(dataBase);

    // Create a Blob from the string
    let blob = new Blob([file], { type: "application/json" });

    // Create a temporary object URL for the Blob
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    // Set the file name for download
    link.download = "todoData.json";

    // Add the link to the document, trigger the download, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(link.href);
}

// change mode
function changeMode(){
    if(mode == "light"){

        root.style.setProperty("--c1", "#FFFFFF");
        root.style.setProperty("--c2", "#bfb5ff");
        root.style.setProperty("--c3", "#3160ED");
        root.style.setProperty("--c4", "#00297A");
        root.style.setProperty("--c5", "#000629");

        mode = "dark";
    }
    else{

        root.style.setProperty("--c5", "#EFEFEF");
        root.style.setProperty("--c4", "#E5DA9F");
        root.style.setProperty("--c3", "#F97F76");
        root.style.setProperty("--c2", "#880D1E");
        root.style.setProperty("--c1", "#0F1020");

        mode = "light";
    }
}

// initial dashboard render
dbRender();


// dashboard renderer
function dbRender(){

    // display
    page.style.display = "none";
    dashboard.style.display = "flex";

    // interactions
    dashboard.addEventListener("mouseover", scaleUp);
    dashboard.addEventListener("click", cardRender);

    function scaleUp(evt){
        if(evt.target.classList.contains("expandable")){
            evt.target.style.height = "15vh";
            displayTasks(evt.target);
            evt.target.addEventListener("mouseleave", scaleDn);
        }
    }
    
    function scaleDn(evt){
        if(evt.target.classList.contains("expandable")){
            evt.target.style.height = "6vh";
            hideTasks(evt.target);
            evt.target.removeEventListener("mouseleave", scaleDn);
        }
    }
    
}

// display tasks
function displayTasks(card){
    let taskDiv = card.firstElementChild;
    taskDiv.style.height = "10vh";
    
    if(dataBase[card.id]["saved"]){
        taskRender();
    }

    // render taskdiv
    function taskRender(){
        taskDiv.innerHTML = "";
        let titles = dataBase[card.id]["card"].querySelectorAll(".title");
        titles.forEach(title => {
            let short = document.createElement("div");
            short.classList.add("shortTask");
            short.setAttribute("id", card.id);
            short.innerHTML = `${title.innerHTML.slice(0, 5)}`;
            taskDiv.append(short);
        })
    }
}

// hide tasks
function hideTasks(card){
    let taskDiv = card.firstElementChild;
    taskDiv.style.height = "0vh";
}

// card renderer
function cardRender(evt){

    if (evt.target.classList.contains("card") || evt.target.classList.contains("tasks") || evt.target.classList.contains("shortTask")){

        // set card
        let card = evt.target.id;

        //is saved
        let saved = dataBase[card]["saved"];
        if(saved){
            page.replaceWith(dataBase[card]["card"]);
            page = dataBase[card]["card"];
            pageHead = page.firstElementChild;
            taskbox = page.querySelector(".taskbox");
            timeLine = page.querySelector(".timeLine");
            adder = taskbox.querySelector(".adder");
        }

        // interaction
        timeLine.addEventListener("mouseover", tlExpand);

        // expand timeline
        function tlExpand(){
            timeLine.style.width = "25%";
            timeLine.style.borderColor = "var(--c2)";

            timeLine.addEventListener("mouseleave", tlShrink);
        }

        // shrink timeline
        function tlShrink(){
            timeLine.removeEventListener("mouseleave", tlShrink);

            timeLine.style.width = "10%";
            timeLine.style.borderColor = "var(--c3)";
        }

        // set unit and n
        let unit;
        let n;
        switch(card){
            case "TODAY":
                unit = "Hour";
                n =  24;
                break;
            case "THIS WEEK":
                unit = "Day";
                n = 7;
                break;
            case "THIS MONTH":
                unit = "Week";
                n = 4;
                break;
            case "THIS YEAR":
                unit = "Month";
                n = 12;
                break;
            default:
        }

        // set Tasks
        let tasks;
        if(!saved){
            tasks = 0;
        }
        else{
            tasks = (Array.from(taskbox.children).length) - 1;
        }

        // display
        page.style.display = "block";
        dashboard.style.display = "none";

        // set head
        pageHead.innerHTML = card;
        if(saved){
            pageHead.classList.remove("headChange");
            pageHead.classList.add("head");
        }

        // set back
        pageHead.addEventListener("mouseover", changeText)

        function changeText(){
            pageHead.innerHTML = "DASHBOARD ?";
            
            // ignore class name, used for fun
            pageHead.classList.add("headChange");
            pageHead.addEventListener("mouseleave", changeAgain);
            pageHead.addEventListener("click", emptyAndDb);
        }

        function changeAgain(){
            pageHead.innerHTML = card;
            pageHead.classList.remove("headChange");
            pageHead.removeEventListener("mouseleave", changeAgain);
        }

        // empty and dashboard
        function emptyAndDb(){

            // remove event listners
            adder.removeEventListener("mouseover", changeAdder);
            adder.removeEventListener("click", addTask);
            timeLine.removeEventListener("mouseover", tlExpand);
            let tlDiv = timeLine.firstElementChild;
            for(let i = 0; i < n; i++){
                tlDiv.removeEventListener("mouseover", divExpand);
                tlDiv = tlDiv.nextElementSibling;
            }

            // save card state
            saveState();

            // remove tasks and timeline
            clearTasks();
            clearTimeline();

            // db renderer
            dbRender();
        }

        // clear tasks
        function clearTasks(){
            taskbox.innerHTML = "";
            taskbox.appendChild(adder);
            adder.style.display = "flex";
            tasks = 0;
        }

        // clear timeline
        function clearTimeline(){
            timeLine.innerHTML = "";
        }

        // set adder
        setAdder();

        // saved tasks events
        if(saved){
            Array.from(taskbox.children).forEach(task => {
                if(task != adder){
                    addTaskEvents(task);
                }
            });
        }
        
        function setAdder(){
            if(tasks >= 4){
                adder.style.display = "none";
            }
            else{

                // display
                adder.style.display = "flex";

                // adder events
                adder.addEventListener("mouseover", changeAdder);
                adder.addEventListener("click", addTask);
            }
        }

        // adder interaction
        function changeAdder(){
            adder.innerHTML = "ADD TASK ?";
            adder.classList.add("adderChange");
            adder.addEventListener("mouseleave", resetAdder);

            function resetAdder(){
                adder.innerHTML = "+";
                adder.classList.remove("adderChange");
                adder.removeEventListener("mouseleave", resetAdder);
            }
        }

        // add task
        function addTask(){
                
            let newTask = createTask();
            tasks++;
            taskbox.insertBefore(newTask, adder);

            // focus managemet
            manageFocus(adder.previousElementSibling.firstElementChild);

            // task events
            addTaskEvents(adder.previousElementSibling);

            function createTask(){

                // task
                let newTask = document.createElement("div");
                newTask.classList.add("task");

                // title
                let title = document.createElement("p");
                title.classList.add("title");

                // done
                let done = document.createElement("div");
                done.classList.add("done");
                done.innerHTML = `<i class="fa-solid fa-check"></i>`;

                // description
                let description = document.createElement("div");
                description.classList.add("description");
                description.innerText = "description";

                // time
                let time = document.createElement("div");
                time.classList.add("time");
                time.innerText = `${unit}s`;

                // append elements to task
                newTask.append(title, done, description, time);
                return newTask;
            }

            if(tasks >= 4){
                adder.style.display = "none";
            }
        }


        // add task events
        function addTaskEvents(task){

            // interactions
            task.addEventListener("mouseover", taskHover);
            task.addEventListener("click", taskClick);

            // task hover
            function taskHover(evt){
                let id = evt.target.classList[0];
                let ele = evt.target;
                if(id != "task"){
                    if(id == "title"){
                        ele.classList.add("titleChange");
                        ele.addEventListener("mouseleave", taskLeave);
                    }
                    else if(id == "description"){
                        ele.classList.add("descriptionChange");
                        ele.addEventListener("mouseleave", taskLeave);
                    }
                    else if(id == "time"){
                        ele.classList.add("timeChange");
                        ele.addEventListener("mouseleave", taskLeave);
                    }
                    else if(id == "done"){
                        ele.classList.add("doneChange");
                        if(mode == "dark"){
                            ele.style.color = "var(--c5)";
                        }
                        ele.addEventListener("mouseleave", taskLeave);
                    }
                    else if(id == "fa-solid"){
                        ele.parentElement.classList.add("doneChange");
                        if(mode == "dark"){
                            ele.parentElement.style.color = "var(--c5)";
                        }
                        ele.parentElement.addEventListener("mouseleave", taskLeave);
                    }
                }
            }

            // task leave
            function taskLeave(evt){
                let id = evt.target.classList[0];
                let ele = evt.target;
                if(id != "task"){
                    if(id == "title"){
                        ele.classList.remove("titleChange");
                        ele.removeEventListener("mouseleave", taskLeave);
                    }
                    else if(id == "description"){
                        ele.classList.remove("descriptionChange");
                        ele.removeEventListener("mouseleave", taskLeave);
                    }
                    else if(id == "time"){
                        ele.classList.remove("timeChange");
                        ele.removeEventListener("mouseleave", taskLeave);
                    }
                    else if(id == "done"){
                        ele.classList.remove("doneChange");
                        ele.style.color = "var(--c2)";
                        ele.removeEventListener("mouseleave", taskLeave);
                    }
                    else if(id == "fa-solid"){
                        ele.parentElement.classList.remove("doneChange");
                        ele.parentElement.style.color = "var(--c2)";
                        ele.parentElement.removeEventListener("mouseleave", taskLeave);
                    }
                }
            }

            // task click
            function taskClick(evt){

                let id = evt.target.classList[0];
                let ele = evt.target;
                if(id == "done"){
                    clearTask(ele.parentElement);
                }
                else if(id == "fa-solid"){
                    clearTask(ele.parentElement.parentElement);
                }
                else if(id != "task"){
                    manageFocus(ele);
                }
            }

            // clear task
            function clearTask(task){

                //save task info
                updateTl(task);

                //remove eventlisteners
                task.removeEventListener("mouseover", taskHover);
                task.removeEventListener("click", taskClick);

                //remove task
                task.remove();
                tasks--;

                //set adder
                if(tasks <= 3){
                    adder.style.display = "flex";
                }
            }
        }

        // focus manager
        function manageFocus(ele){

            // title focus
            let inFocus = ele;

            inFocus.setAttribute("contenteditable", true);
            inFocus.focus();
            if(inFocus.innerHTML == "description" || inFocus.innerHTML == `${unit}s`){
                inFocus.innerHTML = "";
            }

            // enter event
            inFocus.addEventListener("keypress", enterEvt);

            function enterEvt(evt){
                if(evt.key == "Enter") evt.preventDefault();
                if(evt.key == "Enter" && inFocus.innerHTML != ""){

                    evt.preventDefault();

                    inFocus.removeEventListener("keypress", enterEvt);
                    inFocus.blur();
                    inFocus.setAttribute("contenteditable", false);
                    if(inFocus.classList.contains("title")){
                        inFocus.removeEventListener("keypress", enterEvt);
                        inFocus = inFocus.nextElementSibling.nextElementSibling;
                        inFocus.setAttribute("contenteditable", true);
                        inFocus.focus();
                        if(inFocus.innerHTML == "description"){
                            inFocus.innerHTML = "";
                        }
                        inFocus.addEventListener("keypress", enterEvt);
                    }
                    else if(inFocus.classList.contains("description")){
                        inFocus.removeEventListener("keypress", enterEvt);
                        inFocus = inFocus.nextElementSibling;
                        inFocus.setAttribute("contenteditable", true);
                        inFocus.focus();
                        if(inFocus.innerHTML == `${unit}s`){
                            inFocus.innerHTML = "";
                        }
                        inFocus.addEventListener("keypress", enterEvt);
                    }
                    else{
                        let next = ele.parentElement.nextElementSibling;
                            if(next.classList[0] == "task"){
                                manageFocus(next.firstElementChild);
                            }
                    }
                }

                // only nums in time
                else if(inFocus.classList.contains("time")){
                    if(evt.key < "0" || evt.key > "9"){
                        evt.preventDefault();
                    }
                }
            }
        }

        // set timeline
        setTimeline();

        function setTimeline(){
            if(!saved){
                for(let i = 0; i < n; i++){
                    let div = createTlDiv();
                    if(i == n-1) div.style.border = "none";
                    timeLine.append(div);

                    // tl div interactions
                    let tlDiv = timeLine.lastElementChild;

                    tlDiv.addEventListener("mouseover", divExpand);
                }
            }
            else{
                let tlDiv = timeLine.lastElementChild;
                let top = timeLine.firstElementChild;
                do{
                    tlDiv.addEventListener("mouseover", divExpand);
                    tlDiv = tlDiv.previousElementSibling;
                }while(tlDiv != top);
                top.addEventListener("mouseover", divExpand);
            }
        }

        // create tl div
        function createTlDiv(){
            let div = document.createElement("div");
            div.classList.add("tlDiv");
            return div;
        }

        // div expand
        function divExpand(evt){
            let ele = evt.target;
            ele.style.scale = 1.5;
            ele.style.color = "var(--c5)";

            ele.addEventListener("mouseleave", divShrink);
        }

        //div shrink
        function divShrink(evt){
            let ele = evt.target;

            ele.removeEventListener("mouseleave", divShrink);

            ele.style.scale = 1;
            ele.style.color = "transparent";
        }

        // update tl
        function updateTl(task){
            let head = task.firstElementChild.innerHTML;
            let time = task.lastElementChild.innerHTML;
            let div = timeLine.lastElementChild;
            let top = timeLine.firstElementChild;

            for(let i = 0; i < time; i++){
                if(div.style.backgroundColor != "var(--c2)"){
                    div.style.backgroundColor = "var(--c2)";
                    div.innerHTML = head; 
                }
                else{
                    i--;
                }
                if(div == top){
                    Array.from(timeLine.children).forEach(ele => {
                        ele.style.backgroundColor = "var(--gr)";
                    })
                    div = timeLine.lastElementChild;
                }else{
                    div = div.previousElementSibling;
                }
            }
        }

        //savestate
        function saveState(){
            dataBase[card]["saved"] = true;
            
            let state = page.cloneNode(true);
            dataBase[card]["card"] = state;
        }
    }
}
