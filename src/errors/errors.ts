import { AbstractCell } from "../math/classes/cells";
import { CWComplex } from "../math/CWComplex";

export class TransformationError extends Error {

    constructor(message: string, complex: CWComplex, public readonly cause?: Error) {
        super(message);
        this.name = 'TransformationError';
        
        // Maintains proper stack trace for where our error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TransformationError);
        }
    }
}

export class InvalidIdentificationError extends TransformationError {

    constructor(complex: CWComplex,  cause?: Error) {
        const message = "Identified cells must have contiguous indices."
        super(message, complex, cause);
        this.name = 'InvalidIdentificationError';
    }
}