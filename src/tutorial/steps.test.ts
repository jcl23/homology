import { testSteps, chunkSteps, printChunkedSteps, linkChunkedSteps, GeneralStep, } from "./steps";
import { describe, expect, it } from 'vitest';

describe('linkChunkedSteps', () => {
    it('Should link each step to the next available within the branch our outside', () => {
        const chunked = chunkSteps(testSteps);
        const linked = linkChunkedSteps(chunked);
        console.log(linked);
    })

    it('Should not split re-used children into multiple objects', () => {
        const test: GeneralStep[] = [
            {
                target: '',content: "Start",
                branches: [
                    [
                        { target: 'body', content: "A" },
                        { target: 'body', content: "B" },
                    ], [
                        { target: 'body', content: "C" },
                        { target: 'body', content: "D" },
                    ]
                ]
            },
            { target: 'body', content: "End" }
        ];
        const chunked = chunkSteps(test);
        const linked = linkChunkedSteps(chunked);
        const end1 = linked.next[0].next[0].next[0];
        const end2 = linked.next[1].next[0].next[0];
        expect(end1).toBeDefined();
        expect(end2).toBeDefined();
        expect(end1).toEqual(end2);
    })

    describe('chunkSteps', () => {
        it('Should chunk steps so that the end of each chunk is a branch (or the end)', () => {
            return;
            const chunked = chunkSteps(testSteps);
            printChunkedSteps(chunked);
            console.log("Chunked Steps:");
        })
    })
})

describe('chunkSteps', () => {
    it('Should chunk steps so that the end of each chunk is a branch (or the end)', () => {

        const chunked = chunkSteps(testSteps);
        printChunkedSteps(chunked);
        // console.log("Chunked Steps:");
        // console.log(chunked);
        expect(chunked.length).toEqual(3);
        // console.log("Second chunk:");
        // console.log(chunked[1]);
        expect(chunked[1].length).toEqual(3);
        // console.log("Chunk 2.3");
        expect("branches" in chunked[1][2]).toBeTruthy();
        for (let branchedChunks of chunked[1][2].branches) {
            // console.log("Branch!:");
            // console.log(branchedChunks);
           for (let chunk of branchedChunks) {
                console.log(`Chunk length: ${chunk.length}`);    
                for (let step of chunk) {
                    
                    console.log(`Step: ${step.content}`);
                }
            }
        }
        
    })
})

