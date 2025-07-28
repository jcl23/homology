type Tutorial = {
    history: History;
    steps: TutorialStep[];
}

type TutorialStep = {
    content: string;
    indexInHistory: number;
}