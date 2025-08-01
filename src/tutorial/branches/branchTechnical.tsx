import { pass } from "three/webgpu";
import { AbstractVertex, Vertex } from "../../math/classes/cells";
import { TutorialStepConditionProps } from "../TutorialContext";
import isInsideTriangle from "./bits/triangle";


export default  [
    {
        button: "Jump In",
        title: "Getting Started",
        target: '.canvas',
        content: 'This is the area where you can display and interact with your space.',
    },
    {
        target: '.button-add',
        pass: ({ editOptions, editorState }: TutorialStepConditionProps) => {
            return editOptions.mode === "add";
        },
        content: 'Enable the "Add" mode to begin placing some vertices. ',
    },
    {   
        target: '.canvas',
        content: 'Add three vertices to the space.',
        pass: ({ editorState }: TutorialStepConditionProps) => {
            return editorState.complex.cells[0].length == 3;
        }
    },
    {
        target: '.button-select',
        pass: ({ editOptions }: TutorialStepConditionProps) => {
            return editOptions.mode === "select";
        },
        content: 'Now, switch to "Select" mode to select the vertices you just added.',
    },
    {
        // select all the points
        target: '.canvas',
        pass: ({ editorState }: TutorialStepConditionProps) => {
            return editorState.selectedKeys.size === 3;
        },
        content: "Click (or use Ctrl+A) select the vertices you just added.",
    },
    {
        target: '.button-fill, .canvas',
        pass: ({ editorState }: TutorialStepConditionProps) => {
            // Once the triangle is made
            return editorState.complex.cells[1].length === 3;
        },
        content: "Press fill (or press F) to fill in the edges between the selected vertices.",  
    },
    {
        target: '.h-group-1,.canvas',
        box: '.h-group-1',
        content: <><>In dimension one, homology computes the number of holes in the space.</><br /><> Our space has one, corresponding to a single copy of Z.</></>,
        
    },
    {
        target: '.button-fill, .canvas',
        pass: ({ editorState }: TutorialStepConditionProps) => {
            // Once the triangle is made
            return editorState.complex.cells[2].length === 1;
        },
        content: "Press fill (or press F) to fill in a triangle (2-simplex) between the selected edges.",  
    },
    {
        target: '.h-group-1,.canvas',
        box: '.h-group-1',
        content: <><>Since the loop has been filled, there is no longer a hole.</><br /><>The 1st homology group becomes trivial.</></>,
        
    },
    {
        target: '.button-undo, .canvas',
        pass: ({ editorState }: TutorialStepConditionProps) => {
            return editorState.complex.cells[2].length === 0;
        },
        content: 'Press undo (or Ctrl + Z) to undo the most recent step, removing the face.',
    },
    {
        target: '.button-add, .canvas',
        pass: ({  editorState }: TutorialStepConditionProps) => {
            
            if (editorState.complex.cells[0].length <= 3) return false;
            
            // original triangle
            const triangleVertices = editorState.complex.cells[0].slice(0, 3);//s.map((v: Vertex) => v.point);
            
            const newPoint = editorState.complex.cells[0][3] as AbstractVertex;
            
            console.log("isInsideTriangle",newPoint.point);
            return isInsideTriangle(newPoint, triangleVertices);
        },
        content: 'Add a new vertex inside the triangle you created.',
    },
{
    target: '.button-move,.canvas',
    pass: ({ editOptions }: TutorialStepConditionProps) => {
        return editOptions.mode === "move";
    },
    content: 'Switch to "Move" mode to reposition vertices.',
},

{
    target: '.button-up, .canvas',
    pass: ({ editorState }: TutorialStepConditionProps) => {
        // Check if any vertex has been raised (z coordinate > 0)
        return editorState.complex.cells[0].some((vertex: AbstractVertex) => vertex.point[1] > 0.01);
    },
    content: 'Select the new vertex. Press the up arrow or key to raise it above the plane.',
},
{
    target: '.canvas,.ui-panel',
    box: '',
    pass: ({ editorState }: TutorialStepConditionProps) => {
        // Assuming the UI is considered "selected" when all vertices are selected
        return editorState.selectedKeys.size === 7;
    },
    content: 'Return to select mode and select all vertices. Alternatively, you can use Ctrl+A to select all.',
},
{
    target: '.canvas,.button-fill',
    box: '',
    pass: ({ editorState }: TutorialStepConditionProps) => {
        // Assuming the UI is considered "selected" when all vertices are selected
        return editorState.complex.cells[1].length === 6;
    },
    content: 'Pressing fill will add in new cells of the lowest "missing" dimension in the selection.',
},
{
    target: '.canvas, .button-fill',
    box: '.h-group-2',
    content: <><>Since there were missing edges between vertices, all pairs of points that didn't have an edge between them, got one.<br /> Press fill again to add 2-simplices.</></>,
    pass: ({ editorState }: TutorialStepConditionProps) => {
        return editorState.complex.cells[2].length === 4;
    }
}

]

