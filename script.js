
// accessing some constants
const dashboard = document.querySelector(".dashboard");
const page = document.querySelector(".page");
const pageHead = page.firstElementChild;
const taskbox = page.querySelector(".taskbox");
const timeLine = page.querySelector(".timeLine");
const adder = taskbox.firstElementChild;

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
        
        // empty tasks and timeline


        // set card
        let card = evt.target.id;

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
            Array.from(taskbox.children).forEach(task => {
                if(task != adder){
                    taskbox.removeChild(task);
                }
                if(adder.style.display == "none"){
                    adder.style.display = "flex";
                }
            });

            // db renderer
            dbRender();
        }

        // set adder
        setAdder();
        function setAdder(){
            if(taskbox.children.length > 4){
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
            taskbox.insertBefore(newTask, adder);

            // focus managemet
            // manageFocus(adder.previousElementSibling);

            // task events
            // addTaskEvents(adder.previousElementSibling);

            function createTask(){

                // task
                let newTask = document.createElement("div");
                newTask.classList.add("task");

                // title
                let title = document.createElement("p");
                title.classList.add("title");
                title.setAttribute("contenteditable", true);

                // done
                let done = document.createElement("div");
                done.classList.add("done");
                done.innerHTML = `<i class="fa-solid fa-check"></i>`;

                // description
                let description = document.createElement("div");
                description.classList.add("description");
                description.setAttribute("contenteditable", true);

                // append elements to task
                newTask.append(title, done, description);
                return newTask;
            }

            if(taskbox.children.length > 4){
                adder.style.display = "none";
            }
        }

        // focus manager
        function manageFocus(task){

            // title focus
            let inFocus = task.firstElementChild;

            while(!inFocus.classList.contains("time"))
                inFocus.focus();

                // enter event
                inFocus.addEventListener("keyress", enterEvt);

                function enterEvt(evt){
                    if(evt.key == "Enter"){

                        evt.preventDefault();

                        inFocus.removeEventListener("keypress", enterEvt);
                        if(inFocus.classList.contains("title")){
                            inFocus = inFocus.nextElementSibling.nextElementSibling;
                        }
                    }
                }
            
        }
    }
}