let segmenter = null;

export async function loadVisionModel() {
    const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
    const segmenterConfig = {
      runtime: 'tfjs', 
      modelType: 'general'
    };
    segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
}

export async function detectPersons(video, canvas, ctx) {
    if (!segmenter) return [];

    const people = await segmenter.segmentPeople(video);
    
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
    
    if (people && people.length > 0) {
        const foregroundColor = {r: 0, g: 255, b: 0, a: 100}; 
        const backgroundColor = {r: 0, g: 0, b: 0, a: 0}; 
        
        const mask = await bodySegmentation.toBinaryMask(people, foregroundColor, backgroundColor);
        
        const offCanvas = document.createElement('canvas');
        offCanvas.width = video.videoWidth;
        offCanvas.height = video.videoHeight;
        offCanvas.getContext('2d').putImageData(mask, 0, 0);
        
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(offCanvas, offsetX, offsetY, drawWidth, drawHeight);
        ctx.globalCompositeOperation = 'source-over';
        
        return people;
    }
    return [];
}
