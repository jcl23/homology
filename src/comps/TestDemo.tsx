import React, { useState } from "react"

type ListProps = {
    cards: CardData[];
}

type CardData = {
    content: string;
}
type CardProps = CardData & {
    index: number;
}

const Card = function(props: CardProps) {
    const { content, index } = props;

    return (
        <div>
            <h5>{index}</h5>
            {content}
        </div>
    )
}
const List = function(props: ListProps) {

    const { cards } = props;

    return (
        <div>
            {
                cards.map((c, i) => (
                    <Card content={c.content} index={i} />
                ))
            }
        </div>
    ) 
}

const cardData = Array(50).fill(0).map(_ => ({
    content: "" +  Math.random()
}));

const TestDemo = function() {

    const PAGE_SIZE = 10;
    const [page, setPage] = useState(0);
    const incPage = () => {
        const maxPage = ~~(cardData.length / PAGE_SIZE) - 1;
        setPage(Math.min(maxPage, page + 1));
    }
    const decPage = () => {
        setPage(Math.max(page - 1, 0));
    }
    return (
        <div>
            <div className={"control"}>
                <button onClick={incPage}>Inc</button>
                {page}
                <button onClick={decPage}>Dec</button>
            </div>
            <List cards={cardData.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)} />
        </div>
    )
}

export default TestDemo;