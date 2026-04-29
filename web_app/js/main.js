import { loadVisionModel, detectPersons, drawTarget } from './vision.js';
import { generateFieldsData, processAction, gameState } from './logic.js';
import { UI, renderHUD, showActionFeedback, updateScore, showGameOver, toggleMenu } from './ui.js';
import { playSound, triggerVibrate } from './audio.js';

const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let contactCount = 0;
let currentTarget = null; 
let currentTargetBox = null;
let scanCooldown = false;

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
    return new Promise(resolve => { video.onloadedmetadata = () => resolve(video); });
}

function resizeCanvas() {
    const container = document.getElementById('camera-container');
    if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}
window.addEventListener('resize', resizeCanvas);

async function detectFrame() {
    if (gameState.status !== 'PLAYING') return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const persons = await detectPersons(video);
    
    if (persons.length > 0 && !scanCooldown) {
        if (!currentTarget) {
            const idx = Math.floor(Math.random() * persons.length);
            const bestPerson = persons[idx];
            currentTargetBox = bestPerson.bbox;
            
            contactCount++;
            const fieldsData = generateFieldsData();
            renderHUD(fieldsData, contactCount, persons.length - 1);
            playSound('lock');
            triggerVibrate([50, 50, 50]);
            UI.hud.classList.remove('hidden');
            currentTarget = true;
            
            drawTarget(bestPerson, video, canvas, ctx);
        } else {
            let bestPerson = null;
            let minDistance = Infinity;
            const [cx1, cy1] = [currentTargetBox[0] + currentTargetBox[2]/2, currentTargetBox[1] + currentTargetBox[3]/2];
            
            for (const p of persons) {
                const [cx2, cy2] = [p.bbox[0] + p.bbox[2]/2, p.bbox[1] + p.bbox[3]/2];
                const dist = Math.hypot(cx1 - cx2, cy1 - cy2);
                if (dist < minDistance) {
                    minDistance = dist;
                    bestPerson = p;
                }
            }
            
            if (bestPerson) {
                currentTargetBox = bestPerson.bbox;
                drawTarget(bestPerson, video, canvas, ctx);
            }
        }
    } else if (persons.length === 0) {
        currentTarget = null;
        currentTargetBox = null;
        if (!UI.hud.classList.contains('hidden') && !scanCooldown) {
            UI.hud.classList.add('hidden');
        }
    }

    requestAnimationFrame(detectFrame);
}

document.getElementById('btn-neutralize').addEventListener('click', () => handleAction('NEUTRALIZE'));
document.getElementById('btn-skip').addEventListener('click', () => handleAction('SKIP'));
document.getElementById('btn-menu').addEventListener('click', toggleMenu);
document.getElementById('btn-close-menu').addEventListener('click', toggleMenu);

function handleAction(type) {
    if (scanCooldown) return;
    scanCooldown = true;
    
    const { message, scoreChange, newScore, status } = processAction(type);
    
    const resultColor = scoreChange > 0 ? "var(--hud-text)" : "var(--hud-text-critical)";
    if (scoreChange > 0) {
        playSound('good'); triggerVibrate([100, 50, 100]);
    } else {
        playSound('bad'); triggerVibrate([300]);
    }

    updateScore(newScore);
    showActionFeedback(message, scoreChange, resultColor);
    
    setTimeout(() => {
        if (status !== 'PLAYING') {
            showGameOver(status);
            return;
        }
        UI.hud.classList.add('hidden');
        currentTarget = null;
        setTimeout(() => { scanCooldown = false; }, 2000);
    }, 1500);
}

// Intro
const storyText = "THE SIGNAL HAS BEEN COMPROMISED.\n\nTHEY WALK AMONG US.\n\nYOUR DEVICE HAS BEEN UPLINKED TO THE RESISTANCE NETWORK.\n\nDO NOT TRUST YOUR EYES.\n\nTRUST THE DATA.\n\n[ INITIATING SCANNER... ]";
let typeIdx = 0;
let typingInterval = null;

function startIntro() {
    updateScore(gameState.score);
    typingInterval = setInterval(() => {
        if (typeIdx < storyText.length) {
            const char = storyText.charAt(typeIdx);
            document.getElementById('typewriter-text').innerText += char;
            if (char !== ' ' && char !== '\n') playSound('type');
            typeIdx++;
        } else {
            clearInterval(typingInterval);
            setTimeout(endIntro, 1500);
        }
    }, 60);
}

function endIntro() {
    clearInterval(typingInterval);
    UI.introScreen.classList.add('hidden');
    UI.scoreBoard.classList.remove('hidden');
    playSound('type'); // init audio context
}
document.getElementById('btn-skip-intro').addEventListener('click', endIntro);

async function init() {
    UI.scoreBoard.classList.add('hidden');
    startIntro();
    try {
        await setupCamera();
        video.play();
        resizeCanvas();
        await loadVisionModel();
        UI.loading.style.display = 'none';
        detectFrame();
    } catch (e) {
        console.error(e);
        UI.loading.innerHTML = `<div class="glitch" style="color:red;" data-text="FATAL ERROR">FATAL ERROR</div><div class="subtext">CAMERA UPLINK FAILED.<br/>PLEASE ALLOW PERMISSIONS.</div>`;
    }
}

init();
