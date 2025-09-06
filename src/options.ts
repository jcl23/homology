export type EditOptions = {
  mode: "select" | "move" | "add" | "remove";
  selectionKey: "index" | "id";
  gridHeight: number;
  isMouseDown: boolean;
  dimSelected: number;
} 
export type SetEditOptions = React.Dispatch<React.SetStateAction<EditOptions>>;
export type ViewOptions = {
  nameState: boolean[];
  gridStyle: "triangular" | "square";
}
export type SetViewOptions = React.Dispatch<React.SetStateAction<ViewOptions>>;

export const defaultEditOptions: EditOptions = {
    mode: "add",
    selectionKey: "index",
    gridHeight: 0,
    isMouseDown: false,
    dimSelected: -1
};

export const defaultViewOptions: ViewOptions = {
    nameState: [true, true, true, true], gridStyle:  "square"
}