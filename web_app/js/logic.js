import { FIELDS } from './data.js';

export let gameState = {
    score: 100, // Starts at 100, ends at 0 or 200
    currentTargetIsAlien: false,
    baseConfidence: 0,
    status: 'PLAYING' // PLAYING, WON, LOST
};

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getWeightedCategory(rng = Math.random) {
    const r = rng();
    if (r < 0.40) return 'A';
    if (r < 0.70) return 'B';
    if (r < 0.90) return 'C';
    return 'D';
}

export function generateFieldsData(rng = Math.random) {
    const numFields = Math.floor(rng() * 3) + 3;
    let selectedFields = [];
    let baseConf = Math.floor(rng() * 20) + 10; // 10-30% base
    
    let usedLabels = new Set();
    
    for(let i=0; i<numFields; i++) {
        let cat = getWeightedCategory(rng);
        let pool = FIELDS[cat];
        let fieldDef = pickRandom(pool);
        
        let attempts = 0;
        while(usedLabels.has(fieldDef.label) && attempts < 10) {
            cat = getWeightedCategory(rng);
            pool = FIELDS[cat];
            fieldDef = pickRandom(pool);
            attempts++;
        }
        usedLabels.add(fieldDef.label);
        
        let value = pickRandom(fieldDef.values);
        selectedFields.push({ label: fieldDef.label, value: value });
        
        if (cat === 'B') baseConf += (Math.floor(rng() * 7) + 8);
        if (fieldDef.mod) baseConf += fieldDef.mod;
        if (fieldDef.specialMods && fieldDef.specialMods[value]) {
            baseConf += fieldDef.specialMods[value];
        }
    }
    
    baseConf = Math.max(0, Math.min(100, baseConf));
    
    // Deterministic inference: if the fields pushed confidence >= 50, they are an alien.
    // This allows the player to actually deduce it from the text clues!
    const isAlien = baseConf >= 50;

    gameState.baseConfidence = baseConf;
    gameState.currentTargetIsAlien = isAlien;
    
    return { selectedFields, baseConf, isAlien };
}

export function processAction(type) {
    let message = "";
    let scoreChange = 0;

    if (type === 'NEUTRALIZE') {
        if (gameState.currentTargetIsAlien) {
            message = "ALIEN NEUTRALIZED.<br/>GOOD WORK.";
            scoreChange = 10;
        } else {
            message = "CIVILIAN CASUALTY.<br/>PENALTY APPLIED.";
            scoreChange = -15;
        }
    } else if (type === 'SKIP') {
        if (gameState.currentTargetIsAlien) {
            message = "ALIEN MISSED.<br/>THREAT REMAINS.";
            scoreChange = -10;
        } else {
            message = "CIVILIAN SPARED.";
            scoreChange = 5;
        }
    }

    gameState.score += scoreChange;
    
    // Check end conditions
    if (gameState.score <= 0) {
        gameState.score = 0;
        gameState.status = 'LOST';
    } else if (gameState.score >= 200) {
        gameState.score = 200;
        gameState.status = 'WON';
    }
    
    return { message, scoreChange, newScore: gameState.score, status: gameState.status };
}
