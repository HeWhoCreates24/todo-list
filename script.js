const cards = document.querySelectorAll(".card");
const dashboard = document.querySelector(".dashboard");
const page = document.querySelector(".page");
const taskbox = document.querySelector(".tasks");
const timeLine = document.querySelector(".timeLine");

let saves = {
    "TODAY" : [false,{
        "TASK" : [],
        "TIME" : 0,
        "DONE" : []
    }],
    "THIS WEEK" : [false,{
        "TASK" : [],
        "TIME" : 0,
        "DONE" : []
    }],
    "THIS MONTH" : [false,{
        "TASK" : [],
        "TIME" : 0,
        "DONE" : []
    }],
    "THIS YEAR" : [false,{
        "TASK" : [],
        "TIME" : 0,
        "DONE" : []
    }]
};

cards.forEach(ele => {
    ele.addEventListener("mouseover", () => {
        ele.style.height = "30vh";
    })

    ele.addEventListener("mouseleave", () => {
        ele.style.height = "6vh";
    })

    ele.addEventListener("click", (evt) => {
        timeLine.innerHTML = "";
        taskbox.innerHTML = `<div class="addTask">
                    +
                </div>`;
        let card = evt.target.id;
        if(!saves[card][0]){
            openCard(card, true);
        }
        else{
            openCard(card, false);
            addSave(card);
        }
    })
});

const openCard = (card, setup) => {
    dashboard.style.display = "none";
    let pageHead = page.children[0];
    let unit;
    switch(card){
        case "TODAY":
            pageHead.innerHTML = "TODAY";
            unit = "Hour";
            tlDisplay(24, unit);
            break;
        case "THIS WEEK":
            pageHead.innerHTML = "THIS WEEK";
            unit = "Day";
            tlDisplay(7, unit);
            break;
        case "THIS MONTH":
            pageHead.innerHTML = "THIS MONTH";
            unit = "Week";
            tlDisplay(4, unit);
            break;
        case "THIS YEAR":
            pageHead.innerHTML = "THIS YEAR";
            unit = "Month";
            tlDisplay(12, unit);
            break;
        default:
    }

    const home = () => {
        page.style.display = "none";
        dashboard.style.display = "flex";
        pageHead.removeEventListener("click", home);
    }

    const save = (field, value) => {
        if(field == "TASK" || field == "DONE"){
            // saves[pageHead.innerHTML][field].push(value);
            saves[pageHead.innerHTML].field.push(value);
            alert("here");
        }
        else if(field == "TIME"){
            saves[pageHead.innerHTML][field] += value;
        }
    }

    pageHead.addEventListener("click", home);

    page.style.display = "block";

    function tlDisplay(n, unit){
        timeLine.style.gridTemplateRows = `1fr.repeat(${n})`;
        for(i = 0; i < n; i++){
            let div = document.createElement("div");
            div.addEventListener("mouseover", () => {
                div.style.scale = "1.5";
                div.style.color = "var(--c5)";
            })
            div.addEventListener("mouseleave", () => {
                div.style.scale = "1";
                div.style.color = "transparent";
            })
            if(i != 0){
                div.style.borderTop = "1px solid var(--c3)";
            }
            timeLine.appendChild(div);
        }
    }
    
    timeLine.addEventListener("mouseover", () => {
        timeLine.style.width = "35%";
        taskbox.style.width = "60%";
    })
    timeLine.addEventListener("mouseleave", () => {
        timeLine.style.width = "15%";
        taskbox.style.width = "80%";
    })

    if(!setup){
        updateTasks();
        updatedTl();
    }

    const updateTasks = () => {
        let tasks = saves[pageHead.innerHTML]["TASK"];
        tasks.forEach(task => {
            taskbox.insertBefore(task, add);
        })
    }

    const add = taskbox.querySelector(".addTask");
    add.addEventListener("click", () => {
        if(Array.from(taskbox.children).length == 4){
            add.style.display = "none";
        }
        addTask(add, unit, timeLine.children.length);
    })
    const addTask = (ele, unit, n) => {
        let newTask = document.createElement("div");
        newTask.setAttribute("class", "task");
        newTask.innerHTML = `<p contenteditable=true>Task</p>
        <div class="done"><i class="fa-solid fa-check"></i></div>
        <div class="description" contenteditable=true>Description</div>
        <div class="time" contenteditable=true>${unit}s</div>`;
        const done = newTask.querySelector(".done");
        done.addEventListener("click", () => {
            let timeUsed = 0;
            timeUsed += Number(done.parentElement.querySelector(".time").innerHTML);
            save("TIME", timeUsed);
            let taskTitle = done.previousElementSibling.innerHTML;
            let div = timeLine.lastElementChild;
            for(let i = 0; i < timeUsed; i++){
                if(div.style.backgroundColor != "var(--c2)"){
                    div.style.backgroundColor = "var(--c2)";
                    div.innerHTML = taskTitle;
                    save("DONE", taskTitle);
                }
                else{
                    i--;
                }
                if(div != timeLine.firstElementChild){
                    div = div.previousElementSibling;
                }
                else{
                    Array.from(timeLine.children).forEach(ele => {
                        ele.style.backgroundColor = "#00ff66";
                    })
                    div = timeLine.lastElementChild;
                }
            }
            done.parentElement.remove();
            add.style.display = "flex";
        })
        taskbox.insertBefore(newTask, ele);

        let editables = ele.previousElementSibling.querySelectorAll("p, .description, .time");
        Array.from(editables).forEach(ele => {
            ele.addEventListener("focus", () => {
                if(ele.innerHTML == "Task" || ele.innerHTML == "Description" || ele.innerHTML == "Days" || ele.innerHTML == "Weeks" || ele.innerHTML == "Months" || ele.innerHTML == "Hours"){
                    ele.innerHTML = "";
                }
                ele.addEventListener("keypress", (evt) => {
                    if(evt.key == "Enter"){
                        evt.preventDefault();
                        ele.blur();
                        save("TASK", ele.parentElement);
                        if(ele.nextElementSibling.classList.contains("done")){
                            ele.nextElementSibling.nextElementSibling.focus();
                        }
                        else if(ele.classList.contains("description")){
                            ele.nextElementSibling.focus();
                        }
                    }
                    if(ele.classList.contains("time") && !((evt.key >= 0 && evt.key <= 9))){
                        evt.preventDefault();
                    }
                })
            })
            if(ele.nextElementSibling.classList.contains("done")){
                ele.focus();
            }
        })
    }
}
