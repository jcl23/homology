export const questions: FAQ = [{
    title: "FAQ",
    content: [
    ["What is this?", "This is a web app for quickly constructing small simplicial complexes to help in studying their homology groups."],
    // ["What is homology?", <>
    //     A<a href={"https://en.wikipedia.org/wiki/Simplicial_homology"}>here</a>
    // </>],
    ["I don't have any idea what that means, what even is that?", "A space is a place you can move around in."],
    ["Why did you make this?", "Seemed like a good idea."],
    ["What is a space?", "A space is a place you can move around in."],
    ["What is a space?", "A space is a place you can move around in."],
    ["What is a space?", "A space is a place you can move around in."],
    ["What is a space?", "A space is a place you can move around in."],
    ["What is a space?", "A space is a place you can move around in."],
    ["What is a space?", "A space is a place you can move around in."],
    ["What is a space?", "A space is a place you can move around in."],
    ["What is a space?", "A space is a place you can move around in."],
]   
}];
export type AnswerContent = string | JSX.Element | JSX.Element[];
export type QAContent = [string, AnswerContent];
export type FAQSection = { title: string, content: QAContent[] };
export type FAQ = FAQSection[];