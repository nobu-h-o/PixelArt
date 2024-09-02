//Initial references
let container = document.querySelector(".container");
let gridButton = document.getElementById("submit-grid");
let gridSize = document.getElementById("size-range");
let hideBtn = document.getElementById("hide-btn");
let colorButton = document.getElementById("color-input");
let eraseBtn = document.getElementById("erase-btn");
let paintBtn = document.getElementById("paint-btn");
let sizeValue = document.getElementById("size-value");

//Events object
let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup",
    },
    touch: {
        down: "touchstart",
        move: "touchmove",
        up: "touchend",
    },
};

let deviceType = "";

//Initially draw and erase would be false
let draw = false;
let erase = false;

//Detect touch device
const isTouchDevice = () => {
    try {
        //We try to create TouchEvent(it would fail for desktops and throw error)
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
};

isTouchDevice();

//Create Grid button
gridButton.addEventListener("click", () => {
    //Initially clear the grid (old grids cleared)
    container.innerHTML = "";
    //count variable for generating unique ids
    let count = 0;
    //loop for creating rows
    for (let i = 0; i < gridSize.value; i++) {
        //incrementing count by 2
        count += 2;
        //Create row div
        let div = document.createElement("div");
        div.classList.add("gridRow");
        //Create Columns
        for (let j = 0; j < gridSize.value; j++) {
            count += 2;
            let col = document.createElement("div");
            col.classList.add("gridCol");
            /* We need unique ids for all columns (for touch screen specifically) */
            col.setAttribute("id", `gridCol${count}`);

            col.addEventListener(events[deviceType].down, () => {
                //user starts drawing
                draw = true;
                //if erase = true then background = transparent else color
                if (erase) {
                    col.style.backgroundColor = "transparent";
                } else {
                    col.style.backgroundColor = colorButton.value;
                }
            });

            col.addEventListener(events[deviceType].move, (e) => {
                /* elementFromPoint returns the element at x,y position of mouse */
                let elementId = document.elementFromPoint(
                    !isTouchDevice() ? e.clientX : e.touches[0].clientX,
                    !isTouchDevice() ? e.clientY : e.touches[0].clientY
                ).id;
                //checker
                checker(elementId);
            });
            //Stop drawing
            col.addEventListener(events[deviceType].up, () => {
                draw = false;
            });
            //append columns
            div.appendChild(col);
        }
        //append grid to container
        container.appendChild(div);
    }
});
function checker(elementId) {
    let gridColumns = document.querySelectorAll(".gridCol");
    //loop through all boxes
    gridColumns.forEach((element) => {
        //if id matches then color
        if (elementId == element.id) {
            if (draw && !erase) {
                element.style.backgroundColor = colorButton.value;
            } else if (draw && erase) {
                element.style.backgroundColor = "transparent";
            }
        }
    });
}

//Hide Grid Button
hideBtn.addEventListener("click", () => {
    // Select all elements with the class "gridCol"
    let gridColumns = document.querySelectorAll(".gridCol");

    // Toggle the 'newStyle' class on each grid column to hide the grid lines (borders)
    gridColumns.forEach((col) => {
        col.classList.toggle('hideGrid');
    });
});



//Erase Button
eraseBtn.addEventListener("click", () => {
    erase = true;
});

//Paint button
paintBtn.addEventListener("click", () => {
    erase = false;
});

//Display grid size
gridSize.addEventListener("input", () => {
    sizeValue.innerHTML = gridSize.value;
});

//Initially create a grid of size 20
window.onload = () => {
    gridSize.value = 20;
    //count variable for generating unique ids
    let count = 0;
    //loop for creating rows
    for (let i = 0; i < gridSize.value; i++) {
        //incrementing count by 2
        count += 2;
        //Create row div
        let div = document.createElement("div");
        div.classList.add("gridRow");
        //Create Columns
        for (let j = 0; j < gridSize.value; j++) {
            count += 2;
            let col = document.createElement("div");
            col.classList.add("gridCol");
            /* We need unique ids for all columns (for touch screen specifically) */
            col.setAttribute("id", `gridCol${count}`);

            /*
            For eg if deviceType = "mouse"
            the statement for the event would be events[mouse].down which equals to mousedown
            if deviceType="touch"
            the statement for event would be events[touch].down which equals to touchstart
             */

            col.addEventListener(events[deviceType].down, () => {
                //user starts drawing
                draw = true;
                //if erase = true then background = transparent else color
                if (erase) {
                    col.style.backgroundColor = "transparent";
                } else {
                    col.style.backgroundColor = colorButton.value;
                }
            });

            col.addEventListener(events[deviceType].move, (e) => {
                /* elementFromPoint returns the element at x,y position of mouse */
                let elementId = document.elementFromPoint(
                    !isTouchDevice() ? e.clientX : e.touches[0].clientX,
                    !isTouchDevice() ? e.clientY : e.touches[0].clientY
                ).id;
                //checker
                checker(elementId);
            });
            //Stop drawing
            col.addEventListener(events[deviceType].up, () => {
                draw = false;
            });
            //append columns
            div.appendChild(col);
        }
        //append grid to container
        container.appendChild(div);
    }
};