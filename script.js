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
            pageNo = 0;
            break;
        case "thisWeekCard":
            pageHead.innerHTML = "THIS WEEK";
            pageNo = 1;
            break;
        case "thisMonthCard":
            pageHead.innerHTML = "THIS MONTH";
            pageNo = 2;
            break;
        case "thisYearCard":
            pageHead.innerHTML = "THIS YEAR";
            pageNo = 3;
            break;
        default:
    }
    page.style.display = "block";
    
    timeLine.addEventListener("mouseover", () => {
        timeLine.style.width = "45%";
        taskbox.style.width = "50%";
    })
    timeLine.addEventListener("mouseleave", () => {
        timeLine.style.width = "25%";
        taskbox.style.width = "70%";
    })
    Array.from(taskbox.children).forEach(ele => {
        if(ele.classList.contains("addTask")){
            ele.addEventListener("click", () => {
                if(Array.from(taskbox.children).length == 4){
                    ele.style.display = "none";
                }
                addTask(ele);
            })
        }
    })

    const addTask = (ele) => {
        let newTask = document.createElement("div");
        newTask.setAttribute("class", "task");
        taskbox.insertBefore(newTask, ele);
    }
}