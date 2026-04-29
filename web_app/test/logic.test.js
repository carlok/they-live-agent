import { describe, it, expect, beforeEach } from 'vitest';
import { generateFieldsData, processAction, gameState } from '../js/logic.js';

describe('Game Logic', () => {
    beforeEach(() => {
        gameState.score = 100;
        gameState.status = 'PLAYING';
    });

    it('should generate fields and deterministically calculate alien status', () => {
        const highRollRng = () => 0.99; // Will pick D or high mods
        const result = generateFieldsData(highRollRng);
        
        expect(result.selectedFields.length).toBeGreaterThanOrEqual(3);
        expect(typeof result.baseConf).toBe('number');
        expect(result.isAlien).toBe(result.baseConf >= 50);
    });

    it('should award 10 points for neutralizing an alien', () => {
        gameState.currentTargetIsAlien = true;
        const res = processAction('NEUTRALIZE');
        expect(res.scoreChange).toBe(10);
        expect(res.newScore).toBe(110);
        expect(res.status).toBe('PLAYING');
    });

    it('should penalize 15 points for neutralizing a human', () => {
        gameState.currentTargetIsAlien = false;
        const res = processAction('NEUTRALIZE');
        expect(res.scoreChange).toBe(-15);
        expect(res.newScore).toBe(85);
    });

    it('should cap score at 200 and set status to WON', () => {
        gameState.score = 195;
        gameState.currentTargetIsAlien = true;
        const res = processAction('NEUTRALIZE');
        expect(res.newScore).toBe(200);
        expect(res.status).toBe('WON');
    });

    it('should cap score at 0 and set status to LOST', () => {
        gameState.score = 5;
        gameState.currentTargetIsAlien = false;
        const res = processAction('NEUTRALIZE');
        expect(res.newScore).toBe(0);
        expect(res.status).toBe('LOST');
    });
});
