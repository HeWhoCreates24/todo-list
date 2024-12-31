
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
        pageHead.addEventListener("click", dbRender);
        pageHead.addEventListener("mouseleave", changeAgain);
    }

    function changeAgain(){
        pageHead.innerHTML = card;
        pageHead.removeEventListener("mouseleave", changeAgain);
    }

    // set adder
    setAdder();
    function setAdder(){
        if(taskbox.children.length >= 4){
            adder.style.display = "none";
        }
        else{
            adder.style.display = "flex";
        }
    }
}