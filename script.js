const cards = document.querySelectorAll(".card");
const dashboard = document.querySelector(".dashboard");
const page = document.querySelector(".page");
const taskbox = document.querySelector(".tasks");
const timeLine = document.querySelector(".timeLine");
cards.forEach(ele => {
    ele.addEventListener("mouseover", () => {
        ele.style.height = "30vh";
    })

    ele.addEventListener("mouseleave", () => {
        ele.style.height = "6vh";
    })

    ele.addEventListener("click", (evt) => {
        let card = evt.target.id;
        openCard(card);
    })
});

const openCard = (card) => {
    dashboard.style.display = "none";
    let pageHead = page.children[0];
    let pageNo;
    switch(card){
        case "todayCard":
            pageHead.innerHTML = "TODAY";
            tlDisplay(24, "Hour");
            pageNo = 0;
            break;
        case "thisWeekCard":
            pageHead.innerHTML = "THIS WEEK";
            tlDisplay(7, "Day");
            pageNo = 1;
            break;
        case "thisMonthCard":
            pageHead.innerHTML = "THIS MONTH";
            tlDisplay(4, "Week");
            pageNo = 2;
            break;
        case "thisYearCard":
            pageHead.innerHTML = "THIS YEAR";
            tlDisplay(12, "Month");
            pageNo = 3;
            break;
        default:
    }

    page.style.display = "block";

    function tlDisplay(n, unit){
        timeLine.style.gridTemplateRows = `1fr.repeat(${n})`;
    }
    
    timeLine.addEventListener("mouseover", () => {
        timeLine.style.width = "45%";
        taskbox.style.width = "50%";
    })
    timeLine.addEventListener("mouseleave", () => {
        timeLine.style.width = "25%";
        taskbox.style.width = "70%";
    })

    const add = taskbox.querySelector(".addTask");
    add.addEventListener("click", () => {
        if(Array.from(taskbox.children).length == 4){
            add.style.display = "none";
        }
        addTask(add);
    })

    const addTask = (ele) => {
        let newTask = document.createElement("div");
        newTask.setAttribute("class", "task");
        newTask.innerHTML = `<p contenteditable=true>Task</p>
        <div class="done"><i class="fa-solid fa-check"></i></div>
        <div class="description" contenteditable=true>Description</div>
        <div class="time" contenteditable=true>Time</div>`;
        const done = newTask.querySelector(".done");
        done.addEventListener("click", () => {
            done.parentElement.remove();
            add.style.display = "flex";
        })

        let editables = newTask.querySelectorAll(".task p, .description, .time");
        Array.from(editables).forEach(ele => {
            ele.addEventListener("focus", () => {
                if(ele.innerHTML == "Task" || ele.innerHTML == "Description" || ele.innerHTML == "Time"){
                    ele.innerHTML = "";
                }
                addEventListener("keypress", (evt) => {
                    if(evt.key == "Enter"){
                        ele.blur();
                    }
                })
            })
        })
        taskbox.insertBefore(newTask, ele);
    }
}