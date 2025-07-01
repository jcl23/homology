import { steps, compileBranchedSteps } from "./steps";
import { describe, expect, it } from 'vitest';

describe('compileBranchedSteps', () => {
    it('should compile branched steps correctly', () => {
        compileBranchedSteps(steps);
    });
});