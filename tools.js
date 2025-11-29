// Flood Fill Algorithm
function floodFill(startPixel, originalColor, newColor) {
    //alert(originalColor + " " + newColor);
    if (originalColor === newColor) return;

    const stack = [startPixel];
    const originalRGB = window.getComputedStyle(startPixel).backgroundColor;

    while (stack.length) {
        const pixel = stack.pop();
        const currentColor = window.getComputedStyle(pixel).backgroundColor;

        if (currentColor !== originalRGB) continue;

        pixel.style.backgroundColor = newColor;

        const pixelIndex = Array.prototype.indexOf.call(canvas.children, pixel);
        const neighbors = [
            pixelIndex % cols > 0 ? canvas.children[pixelIndex - 1] : null,   
            pixelIndex % cols < cols - 1 ? canvas.children[pixelIndex + 1] : null,
            pixelIndex >= cols ? canvas.children[pixelIndex - cols] : null,   
            pixelIndex < (rows - 1) * cols ? canvas.children[pixelIndex + cols] : null 
        ];

        neighbors.forEach(neighbor => {
            if (neighbor) stack.push(neighbor);
        });
    }
}

function drawPixel(pixel, color) {
    pixel.style.backgroundColor = color;

    // Draw a circular shape around the current pixel based on pen size
    if (penSize > 1) {
        const pixelIndex = Array.prototype.indexOf.call(canvas.children, pixel);
        const neighbors = getCircularNeighbors(pixelIndex, penSize);

        neighbors.forEach(neighbor => {
            if (neighbor) {
                neighbor.style.backgroundColor = color;
            }
        });
    }
}

function erasePixel(pixel) {
    pixel.style.backgroundColor = '#ffffff';

    if (penSize > 1) {
        const pixelIndex = Array.prototype.indexOf.call(canvas.children, pixel);
        const neighbors = getCircularNeighbors(pixelIndex, penSize);

        neighbors.forEach(neighbor => {
            if (neighbor) {
                neighbor.style.backgroundColor = '#ffffff';
            }
        });
    }
}