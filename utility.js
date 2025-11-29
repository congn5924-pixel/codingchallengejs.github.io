// Utility to convert RGB to Hex
function rgbToHex(rgb) {
    if(rgb[0] == '#') return rgb;
    const rgbValues = rgb.match(/\d+/g);
    return `#${rgbValues.map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}`;
}

function hexToHSL(hex) {
    // Convert HEX to RGB
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    // Find the maximum and minimum values of R, G and B
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);

    // Calculate the HSL values
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return {h, s, l}; 
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    b = Math.round((b + m) * 255).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
}

// Function to get circular neighbors around the current pixel based on pen size
function getCircularNeighbors(pixelIndex, size) {
    const r = Math.ceil(size / 2);
    const radius = size / 2;
    const neighbors = [];
    const centerRow = Math.floor(pixelIndex / cols);
    const centerCol = pixelIndex % cols;

    for (let i = -r; i <= r; i++) {
        for (let j = -r; j <= r; j++) {
            const neighborRow = centerRow + i;
            const neighborCol = centerCol + j;
            const distance = (Math.sqrt(i * i + j * j));

            // Only include neighbors within the circular radius
            if (distance <= radius) {
                if (neighborRow >= 0 && neighborRow < rows && neighborCol >= 0 && neighborCol < cols) {
                    neighbors.push(canvas.children[neighborRow * cols + neighborCol]);
                    console.log(i + ", " + j);
                }
            }
        }
    }

    return neighbors;
}
