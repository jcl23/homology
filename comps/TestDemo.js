import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const Card = function (props) {
    const { content, index } = props;
    return (_jsxs("div", { children: [_jsx("h5", { children: index }), content] }));
};
const List = function (props) {
    const { cards } = props;
    return (_jsx("div", { children: cards.map((c, i) => (_jsx(Card, { content: c.content, index: i }))) }));
};
const cardData = Array(50).fill(0).map(_ => ({
    content: "" + Math.random()
}));
const TestDemo = function () {
    const PAGE_SIZE = 10;
    const [page, setPage] = useState(0);
    const incPage = () => {
        const maxPage = ~~(cardData.length / PAGE_SIZE) - 1;
        setPage(Math.min(maxPage, page + 1));
    };
    const decPage = () => {
        setPage(Math.max(page - 1, 0));
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "control", children: [_jsx("button", { onClick: incPage, children: "Inc" }), page, _jsx("button", { onClick: decPage, children: "Dec" })] }), _jsx(List, { cards: cardData.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE) })] }));
};
export default TestDemo;
