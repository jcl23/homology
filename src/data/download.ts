import { History, historyToJSON } from "../comps/history/history";
// import History from "../comps/history/History";

export const downloadHistory = (history: History) => {
  const blob = historyToJSON(history);
    const url = URL.createObjectURL(new Blob([blob], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "history.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

}