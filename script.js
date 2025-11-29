let currentTool = 'brush', prevTool = 'brush';
let currentColor = '#ff0000';
let isMouseDown = false;
let isRainbow = false;

const canvas = document.getElementById('canvas');
const colorPicker = document.getElementById('color-picker');
const clearBtn = document.getElementById('clear-btn');
const rows = 18, cols = 32;

const tools = {
    pen: document.getElementById('pen-tool'),
    eraser: document.getElementById('eraser-tool'),
    bucket: document.getElementById('bucket-tool'),
    colorCopy: document.getElementById('color-copy-tool')
};

const toggleGrid = document.getElementById('toggle-grid');

toggleGrid.addEventListener('change', function() {
    if (this.checked) {
        canvas.classList.remove('hide-grid'); // Show grid
    } else {
        canvas.classList.add('hide-grid'); // Hide grid
    }
});

const toggleRainbow = document.getElementById('toggle-rainow');

toggleRainbow.addEventListener('change', function() {
    if (this.checked) {
        isRainbow = true;
    } else {
        isRainbow = false;
    }
});

// Create canvas grid
function createCanvas(rows, cols) {
    for (let i = 0; i < rows * cols; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        pixel.addEventListener('mousedown', handleMouseDown);
        pixel.addEventListener('mouseenter', handleMouseEnter);
        canvas.appendChild(pixel);
    }
}

createCanvas(rows, cols);
selectTool('brush', tools.pen);

// Tool selection
tools.pen.addEventListener('click', () => selectTool('brush', tools.pen));
tools.eraser.addEventListener('click', () => selectTool('eraser', tools.eraser));
tools.bucket.addEventListener('click', () => selectTool('bucket', tools.bucket));
tools.colorCopy.addEventListener('click', () => selectTool('color-copy', tools.colorCopy));

colorPicker.addEventListener('input', (e) => currentColor = rgbToHex(e.target.value));

function selectTool(tool, button) {
    if(currentTool != tool) prevTool = currentTool;
    currentTool = tool;
    removeActiveClass(); // Remove active state from all buttons
    button.classList.add('active-tool'); // Add active class to the selected button
}

function removeActiveClass() {
    Object.values(tools).forEach(toolButton => toolButton.classList.remove('active-tool'));
}

document.addEventListener('mouseup', () => isMouseDown = false);

clearBtn.addEventListener('click', () => [...canvas.children].forEach(pixel => pixel.style.backgroundColor = '#ffffff'));

let penSize = 1; // Default pen size

// Get the pen size slider
const penSizeSlider = document.getElementById('pen-size');

// Update pen size when slider is changed
penSizeSlider.addEventListener('input', (e) => {
    penSize = e.target.value;
});

function handleMouseDown(e) {
    isMouseDown = true;
    const pixel = e.target;
    currentColor = rgbToHex(currentColor);
    if (currentTool === 'brush') {
        drawPixel(pixel, rgbToHex(currentColor));
    }
    if (currentTool === 'bucket') {
        const originalColor = rgbToHex(window.getComputedStyle(pixel).backgroundColor);
        floodFill(pixel, originalColor, rgbToHex(currentColor));
    }
    if (currentTool === 'color-copy') {
        currentColor = window.getComputedStyle(pixel).backgroundColor;
        colorPicker.value = rgbToHex(currentColor);
        selectTool(prevTool=='bucket'?prevTool:'brush', prevTool=='bucket'?tools.bucket:tools.pen);
    }
    if (currentTool === 'eraser') {
        erasePixel(pixel);
    }
}

function handleMouseEnter(e) {
    currentColor = rgbToHex(currentColor);
    if (isMouseDown && currentTool === 'brush') {
        drawPixel(e.target, currentColor);
        if(isRainbow) {
            let hsl = hexToHSL(currentColor);
            hsl['h'] += 2;
            hsl['h'] %= 360;
            currentColor = hslToHex(hsl['h'], hsl['s'], hsl['l']);
            colorPicker.value = currentColor;
        }
    }
    if (isMouseDown && currentTool === 'eraser') erasePixel(e.target);
}
