let model = null;

export async function loadVisionModel() {
    model = await cocoSsd.load();
}

export async function detectPersons(video, canvas, ctx) {
    if (!model) return [];

    const predictions = await model.detect(video);
    const persons = predictions.filter(p => p.class === 'person');
    
    const videoRatio = video.videoWidth / video.videoHeight;
    const windowRatio = window.innerWidth / window.innerHeight;
    
    let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
    if (windowRatio > videoRatio) {
        drawWidth = window.innerWidth;
        drawHeight = window.innerWidth / videoRatio;
        offsetY = (window.innerHeight - drawHeight) / 2;
    } else {
        drawHeight = window.innerHeight;
        drawWidth = window.innerHeight * videoRatio;
        offsetX = (window.innerWidth - drawWidth) / 2;
    }
    
    const scaleX = drawWidth / video.videoWidth;
    const scaleY = drawHeight / video.videoHeight;

    persons.forEach(person => {
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
    });

    return persons;
}
