interface Events {
    mouse: {
      down: string;
      move: string;
      up: string;
    };
    touch: {
      down: string;
      move: string;
      up: string;
    };
}
  
// Initial references with proper type assertions
const container = document.querySelector<HTMLElement>(".container");
const gridButton = document.getElementById("submit-grid") as HTMLButtonElement;
const gridSize = document.getElementById("size-range") as HTMLInputElement;
const hideBtn = document.getElementById("hide-btn") as HTMLButtonElement;
const colorButton = document.getElementById("color-input") as HTMLInputElement;
const eraseBtn = document.getElementById("erase-btn") as HTMLButtonElement;
const paintBtn = document.getElementById("paint-btn") as HTMLButtonElement;
const sizeValue = document.getElementById("size-value") as HTMLElement;

// Events object
const events: Events = {
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
let deviceType: 'mouse' | 'touch' = 'mouse';

// State variables
let draw: boolean = false;
let erase: boolean = false;

/**
 * Detects if the current device supports touch events.
 * @returns {boolean} True if touch device, else false.
 */
const isTouchDevice = (): boolean => {
try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
} catch (e) {
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
const createGrid = (size: number): void => {
if (!container) return;

// Clear existing grid
container.innerHTML = "";
let count = 0;

for (let i = 0; i < size; i++) {
    count += 2;
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("gridRow");

    for (let j = 0; j < size; j++) {
    count += 2;
    const col = document.createElement("div");
    col.classList.add("gridCol");
    col.id = `gridCol${count}`;

    // Event listeners for drawing
    col.addEventListener(events[deviceType].down, () => {
        draw = true;
        col.style.backgroundColor = erase ? "transparent" : colorButton.value;
    });

    col.addEventListener(events[deviceType].move, (e: Event) => {
        handleMoveEvent(e);
    });

    col.addEventListener(events[deviceType].up, () => {
        draw = false;
    });

    rowDiv.appendChild(col);
    }

    container.appendChild(rowDiv);
}
};

/**
 * Handles the move events for both mouse and touch inputs.
 * @param e The event object.
 */
const handleMoveEvent = (e: Event): void => {
let elementId: string | undefined;

if (deviceType === 'mouse') {
    const mouseEvent = e as MouseEvent;
    const element = document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY) as HTMLElement | null;
    elementId = element?.id;
} else {
    const touchEvent = e as TouchEvent;
    if (touchEvent.touches.length > 0) {
    const touch = touchEvent.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;
    elementId = element?.id;
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
const checker = (elementId: string): void => {
const gridColumns = document.querySelectorAll<HTMLElement>(".gridCol");
gridColumns.forEach((element) => {
    if (elementId === element.id) {
    if (draw && !erase) {
        element.style.backgroundColor = colorButton.value;
    } else if (draw && erase) {
        element.style.backgroundColor = "transparent";
    }
    }
});
};

// Event listener for creating grid on button click
gridButton.addEventListener("click", () => {
const size = parseInt(gridSize.value, 10) || 20;
createGrid(size);
});

// Event listener for hiding/showing grid lines
hideBtn.addEventListener("click", () => {
const gridColumns = document.querySelectorAll<HTMLElement>(".gridCol");
gridColumns.forEach((col) => {
    col.classList.toggle('hideGrid');
});
});

// Event listeners for erase and paint buttons
eraseBtn.addEventListener("click", () => {
erase = true;
});

paintBtn.addEventListener("click", () => {
erase = false;
});

// Event listener to display grid size
gridSize.addEventListener("input", () => {
sizeValue.textContent = gridSize.value;
});

// Initialize grid on window load
window.addEventListener("load", () => {
gridSize.value = "20";
createGrid(20);
});
