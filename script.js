
// accessing some constants
const root = document.documentElement;
const modeIcon = document.querySelector(".mode");
const dashboard = document.querySelector(".dashboard");
const page = document.querySelector(".page");
const pageHead = page.firstElementChild;
const taskbox = page.querySelector(".taskbox");
const timeLine = page.querySelector(".timeLine");
const adder = taskbox.firstElementChild;

//setup mode
let mode = "dark";

modeIcon.addEventListener("click", changeMode);

// change mode
function changeMode(){
    if(mode == "light"){

        root.style.setProperty("--c1", "#FFFFFF");
        root.style.setProperty("--c2", "#bfb5ff");
        root.style.setProperty("--c3", "#3160ED");
        root.style.setProperty("--c4", "#00297A");
        root.style.setProperty("--c5", "#000629");
        root.style.setProperty("--gr", "#0c8e10");

        mode = "dark";
    }
    else{

        root.style.setProperty("--c5", "#EFEFEF");
        root.style.setProperty("--c4", "#E5DA9F");
        root.style.setProperty("--c3", "#F97F76");
        root.style.setProperty("--c2", "#880D1E");
        root.style.setProperty("--c1", "#0F1020");
        root.style.setProperty("--gr", "#3bff42");

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
        if(evt.target.classList.contains("expandable")) evt.target.style.height = "25vh";
        evt.target.addEventListener("mouseleave", scaleDn);
    }
    
    function scaleDn(evt){
        if(evt.target.classList.contains("expandable")) evt.target.style.height = "6vh";
        evt.target.removeEventListener("mouseleave", scaleDn);
    }
    
}

// card renderer
function cardRender(evt){

    if (evt.target.classList.contains("expandable")){
        
        // set card
        let card = evt.target.id;

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
        let tasks = 0;

        // display
        page.style.display = "block";
        dashboard.style.display = "none";

        // set head
        pageHead.innerHTML = card;

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

            // remove tasks
            clearTasks();

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

        // set adder
        setAdder();
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
                        ele.addEventListener("mouseleave", taskLeave);
                    }
                    else if(id == "fa-solid"){
                        ele.parentElement.classList.add("doneChange");
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
                        ele.removeEventListener("mouseleave", taskLeave);
                    }
                    else if(id == "fa-solid"){
                        ele.parentElement.classList.remove("doneChange");
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
                else{
                    manageFocus(ele);
                }
            }

            // clear task
            function clearTask(task){

                //save task info

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
            for(let i = 0; i < n; i++){

            }
        }
    }
}