// Initial references with proper type assertions
var container = document.querySelector(".container");
var gridButton = document.getElementById("submit-grid");
var gridSize = document.getElementById("size-range");
var hideBtn = document.getElementById("hide-btn");
var colorButton = document.getElementById("color-input");
var eraseBtn = document.getElementById("erase-btn");
var paintBtn = document.getElementById("paint-btn");
var sizeValue = document.getElementById("size-value");
// Events object
var events = {
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
// Device type can be either 'mouse' or 'touch'
var deviceType = 'mouse';
// State variables
var draw = false;
var erase = false;
/**
 * Detects if the current device supports touch events.
 * @returns {boolean} True if touch device, else false.
 */
var isTouchDevice = function () {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    }
    catch (e) {
        deviceType = "mouse";
        return false;
    }
};
// Initialize device type
isTouchDevice();
/**
 * Creates the grid based on the provided size.
 * @param size The number of rows and columns for the grid.
 */
var createGrid = function (size) {
    if (!container)
        return;
    // Clear existing grid
    container.innerHTML = "";
    var count = 0;
    for (var i = 0; i < size; i++) {
        count += 2;
        var rowDiv = document.createElement("div");
        rowDiv.classList.add("gridRow");
        var _loop_1 = function (j) {
            count += 2;
            var col = document.createElement("div");
            col.classList.add("gridCol");
            col.id = "gridCol".concat(count);
            // Event listeners for drawing
            col.addEventListener(events[deviceType].down, function () {
                draw = true;
                col.style.backgroundColor = erase ? "transparent" : colorButton.value;
            });
            col.addEventListener(events[deviceType].move, function (e) {
                handleMoveEvent(e);
            });
            col.addEventListener(events[deviceType].up, function () {
                draw = false;
            });
            rowDiv.appendChild(col);
        };
        for (var j = 0; j < size; j++) {
            _loop_1(j);
        }
        container.appendChild(rowDiv);
    }
};
/**
 * Handles the move events for both mouse and touch inputs.
 * @param e The event object.
 */
var handleMoveEvent = function (e) {
    var elementId;
    if (deviceType === 'mouse') {
        var mouseEvent = e;
        var element = document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY);
        elementId = element === null || element === void 0 ? void 0 : element.id;
    }
    else {
        var touchEvent = e;
        if (touchEvent.touches.length > 0) {
            var touch = touchEvent.touches[0];
            var element = document.elementFromPoint(touch.clientX, touch.clientY);
            elementId = element === null || element === void 0 ? void 0 : element.id;
        }
    }
    if (elementId) {
        checker(elementId);
    }
};
/**
 * Colors the grid cell based on the current state.
 * @param elementId The ID of the grid cell to color.
 */
var checker = function (elementId) {
    var gridColumns = document.querySelectorAll(".gridCol");
    gridColumns.forEach(function (element) {
        if (elementId === element.id) {
            if (draw && !erase) {
                element.style.backgroundColor = colorButton.value;
            }
            else if (draw && erase) {
                element.style.backgroundColor = "transparent";
            }
        }
    });
};
// Event listener for creating grid on button click
gridButton.addEventListener("click", function () {
    var size = parseInt(gridSize.value, 10) || 20;
    createGrid(size);
});
// Event listener for hiding/showing grid lines
hideBtn.addEventListener("click", function () {
    var gridColumns = document.querySelectorAll(".gridCol");
    gridColumns.forEach(function (col) {
        col.classList.toggle('hideGrid');
    });
});
// Event listeners for erase and paint buttons
eraseBtn.addEventListener("click", function () {
    erase = true;
});
paintBtn.addEventListener("click", function () {
    erase = false;
});
// Event listener to display grid size
gridSize.addEventListener("input", function () {
    sizeValue.textContent = gridSize.value;
});
// Initialize grid on window load
window.addEventListener("load", function () {
    gridSize.value = "20";
    createGrid(20);
});
