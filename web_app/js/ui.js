import { playSound, triggerVibrate } from './audio.js';

export const UI = {
    introScreen: document.getElementById('intro-screen'),
    scoreBoard: document.getElementById('score-board'),
    scoreEl: document.getElementById('agent-score'),
    hud: document.getElementById('hud'),
    contactIdEl: document.getElementById('contact-id'),
    threatBarEl: document.getElementById('threat-bar'),
    threatPctEl: document.getElementById('threat-pct'),
    hudFieldsEl: document.getElementById('hud-fields'),
    clusterInfoEl: document.getElementById('cluster-info'),
    loading: document.getElementById('loading'),
    menuScreen: document.getElementById('game-menu'),
    gameOverScreen: document.getElementById('game-over'),
    gameOverMsg: document.getElementById('game-over-msg')
};

export function renderHUD(fieldsData, contactCount, numNearby) {
    UI.contactIdEl.innerText = contactCount;
    
    if (numNearby === 0) UI.clusterInfoEl.innerText = "NONE";
    else if (numNearby === 1) UI.clusterInfoEl.innerText = "▲ +1 DYAD";
    else if (numNearby <= 3) UI.clusterInfoEl.innerText = `▲ +${numNearby} CELL`;
    else UI.clusterInfoEl.innerText = `▲ +${numNearby} NEST`;

    const baseConf = fieldsData.baseConf;
    
    const numBlocks = Math.round((baseConf / 100) * 8);
    let barStr = "";
    for(let i=0; i<8; i++) {
        barStr += i < numBlocks ? "█" : "░";
    }
    UI.threatBarEl.innerText = barStr;
    UI.threatPctEl.innerText = `${baseConf}%`;
    
    if (baseConf >= 50) {
        UI.threatPctEl.className = "critical";
        UI.threatBarEl.className = "critical";
    } else {
        UI.threatPctEl.className = "";
        UI.threatPctEl.style.color = "var(--hud-text)";
        UI.threatBarEl.style.color = "var(--hud-text)";
    }
    
    UI.hudFieldsEl.innerHTML = '';
    fieldsData.selectedFields.forEach((f, idx) => {
        setTimeout(() => {
            const row = document.createElement('div');
            row.className = 'field-row';
            row.innerHTML = `<span class="field-label">${f.label}</span><span class="field-value">${f.value}</span>`;
            UI.hudFieldsEl.appendChild(row);
        }, idx * 150);
    });
}

export function showActionFeedback(message, scoreChange, resultColor) {
    UI.hudFieldsEl.innerHTML = `<div style="text-align:center; padding: 20px; color:${resultColor}; text-shadow: 0 0 5px ${resultColor};">
        ${message}<br/><br/>
        SCORE ${scoreChange > 0 ? '+' : ''}${scoreChange}
    </div>`;
}

export function updateScore(score) {
    UI.scoreEl.innerText = score;
}

export function showGameOver(status) {
    UI.hud.classList.add('hidden');
    UI.scoreBoard.classList.add('hidden');
    UI.gameOverScreen.classList.remove('hidden');
    
    if (status === 'WON') {
        UI.gameOverMsg.innerHTML = "MISSION ACCOMPLISHED.<br/>PROMOTION IMMINENT.";
        UI.gameOverMsg.style.color = "var(--hud-text)";
    } else {
        UI.gameOverMsg.innerHTML = "AGENT COMPROMISED.<br/>CONNECTION TERMINATED.";
        UI.gameOverMsg.style.color = "var(--hud-text-critical)";
    }
    playSound('over');
    triggerVibrate([500, 200, 500]);
}

export function toggleMenu() {
    if (UI.menuScreen.classList.contains('hidden')) {
        UI.menuScreen.classList.remove('hidden');
    } else {
        UI.menuScreen.classList.add('hidden');
    }
}
