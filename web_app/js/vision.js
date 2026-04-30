let model = null;

export async function loadVisionModel() {
    model = await cocoSsd.load();
}

export async function detectPersons(video) {
    if (!model) return [];
    const predictions = await model.detect(video);
    return predictions.filter(p => p.class === 'person');
}

export function drawTarget(person, video, canvas, ctx) {
    const videoRatio = video.videoWidth / video.videoHeight;
    const windowRatio = canvas.width / canvas.height;
    
    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
    if (windowRatio > videoRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / videoRatio;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        drawHeight = canvas.height;
        drawWidth = canvas.height * videoRatio;
        offsetX = (canvas.width - drawWidth) / 2;
    }
    
    const scaleX = drawWidth / video.videoWidth;
    const scaleY = drawHeight / video.videoHeight;

    const [x, y, width, height] = person.bbox;
    
    const screenX = offsetX + (x * scaleX);
    const screenY = offsetY + (y * scaleY);
    const screenW = width * scaleX;
    const screenH = height * scaleY;

    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 3;
    
    // Draw AR Targeting Brackets
    const len = 20;
    ctx.beginPath();
    
    // Top Left
    ctx.moveTo(screenX, screenY + len);
    ctx.lineTo(screenX, screenY);
    ctx.lineTo(screenX + len, screenY);
    
    // Top Right
    ctx.moveTo(screenX + screenW - len, screenY);
    ctx.lineTo(screenX + screenW, screenY);
    ctx.lineTo(screenX + screenW, screenY + len);
    
    // Bottom Left
    ctx.moveTo(screenX, screenY + screenH - len);
    ctx.lineTo(screenX, screenY + screenH);
    ctx.lineTo(screenX + len, screenY + screenH);
    
    // Bottom Right
    ctx.moveTo(screenX + screenW - len, screenY + screenH);
    ctx.lineTo(screenX + screenW, screenY + screenH);
    ctx.lineTo(screenX + screenW, screenY + screenH - len);
    
    ctx.stroke();

    // Glitch fill
    ctx.fillStyle = 'rgba(0, 255, 204, 0.15)';
    ctx.fillRect(screenX, screenY, screenW, screenH);
    
    // Crosshair center
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(screenX + screenW/2 - 2, screenY + screenH/2 - 2, 4, 4);
}

export function drawBlast(bbox, video, canvas, ctx, isPositive, elapsed, text) {
    const videoRatio = video.videoWidth / video.videoHeight;
    const windowRatio = canvas.width / canvas.height;
    
    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
    if (windowRatio > videoRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / videoRatio;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        drawHeight = canvas.height;
        drawWidth = canvas.height * videoRatio;
        offsetX = (canvas.width - drawWidth) / 2;
    }
    
    const scaleX = drawWidth / video.videoWidth;
    const scaleY = drawHeight / video.videoHeight;

    const [x, y, width, height] = bbox;
    
    const screenX = offsetX + (x * scaleX);
    const screenY = offsetY + (y * scaleY);
    const screenW = width * scaleX;
    const screenH = height * scaleY;

    const fade = Math.max(0, 1 - (elapsed / 1500));
    const flash = (Math.floor(elapsed / 50) % 2 === 0) ? 0.8 : 0.3;
    const alpha = fade * flash;

    const color = isPositive ? `rgba(0, 255, 204, ${alpha})` : `rgba(244, 67, 54, ${alpha})`;
    const solidColor = isPositive ? `rgba(0, 255, 204, ${fade})` : `rgba(244, 67, 54, ${fade})`;

    ctx.fillStyle = color;
    ctx.fillRect(screenX, screenY, screenW, screenH);
    
    ctx.strokeStyle = solidColor;
    ctx.lineWidth = 5;
    ctx.strokeRect(screenX, screenY, screenW, screenH);

    ctx.beginPath();
    ctx.moveTo(screenX, screenY);
    ctx.lineTo(screenX + screenW, screenY + screenH);
    ctx.moveTo(screenX + screenW, screenY);
    ctx.lineTo(screenX, screenY + screenH);
    ctx.stroke();
    
    ctx.fillStyle = solidColor;
    ctx.font = 'bold 24px "Courier New"';
    ctx.textAlign = 'center';
    
    // Add text shadow for legibility
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 10;
    ctx.fillText(text, screenX + screenW/2, screenY + screenH/2);
    ctx.shadowBlur = 0;
}
