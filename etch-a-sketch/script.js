// default features
const DEFAULT_SIZE = 16;
const DEFAULT_MODE = 'color';
const DEFAULT_COLOR = 'black'

let currentColor = DEFAULT_COLOR;
let currentMode = DEFAULT_MODE;
let currentSize = DEFAULT_SIZE;

// get features from html
const colorPicker = document.getElementById('colorPicker');
const colorBtn = document.getElementById('colorBtn');
const rainbowBtn = document.getElementById('rainbowBtn');
const clearBtn = document.getElementById('clearBtn');
const sizeDisplay = document.getElementById('grid-size-display');
const sizeSlider = document.getElementById('grid-size-slider');
const grid = document.getElementById('etch-grid');

// set color
function setColor(newColor) {
    currentColor = newColor;
}

// oninput event for color picker
colorPicker.oninput = (e) => setColor(e.target.value);

// onclick event for color and rainbow button
colorBtn.onclick = () => setMode('color');
rainbowBtn.onclick = () => setMode('rainbow');

// onclick event to clear grid
clearBtn.onclick = () => reloadGrid(currentSize);

// slider events
sizeSlider.onmousemove = (e) => updateSizeDisplay(e.target.value);
sizeSlider.onchange = (e) => changeSize(e.target.value);

function changeSize(value) {
    currentSize = value;
    updateSizeDisplay(value);
    reloadGrid(value);
}

function updateSizeDisplay(value) {
    sizeDisplay.innerHTML = `${value}x${value}`;
}

function reloadGrid(value) {
    clearGrid();
    createGrid(value);
}

function clearGrid() {
    Array.from(grid.childNodes).forEach(gridElement => {
        gridElement.parentNode.removeChild(gridElement);
    })
}

function createGrid(size) {
    // clear grid before recreating
    grid.innerHTML = "";

    const gridWidth = parseInt(window.getComputedStyle(grid).getPropertyValue('width'), 10);

    // create grid cells
    for (let i = 0; i < (size * size); i++) {
        const gridElement = document.createElement('div');
        gridElement.classList.add('grid-cell');

        gridElement.style.width = `${gridWidth / size}px`;
        gridElement.style.height = `${gridWidth / size}px`;
        gridElement.style.boxSizing = `border-box`;
        gridElement.style.border = `1px solid lightgray`;

        // event listener for mouseover the gridElement, coloring the square
        gridElement.addEventListener("mouseover", setGridColor);

        grid.appendChild(gridElement);
    }
}
function setGridColor(e) {
    if (currentMode === 'rainbow') {
        const randomR = Math.floor(Math.random() * 256);
        const randomG = Math.floor(Math.random() * 256);
        const randomB = Math.floor(Math.random() * 256);
        e.target.style.backgroundColor = `rgb(${randomR}, ${randomG}, ${randomB})`;
    } else if (currentMode === 'color') {
        e.target.style.backgroundColor = currentColor;
    }
}

// button settings
function setMode(newMode) {
    currentMode = newMode;
    activateButton(currentMode);
}
function activateButton(newMode) {
    colorBtn.classList.remove('active');
    rainbowBtn.classList.remove('active');

    if (newMode === 'rainbow') {
        rainbowBtn.classList.add('active');
    } else if (newMode === 'color') {
        colorBtn.classList.add('active');
    }
}

// on start
window.onload = () => {
    createGrid(DEFAULT_SIZE);
    activateButton(DEFAULT_MODE);
}