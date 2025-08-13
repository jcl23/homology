import { CWComplex } from "../CWComplex";


// export type AbstractCell = {(AbstractVertex | AbstractEdge | AbstractFace | AbstractBall) & { dimension: (number)};
export type AbstractCell = {
    id: number;
    index: number;
    name: string;
    attachingMap: AbstractCell[];
    vertices: AbstractVertex[];
    vertexSummary: string;
    boundarySummary: string;
    cob: AbstractCell[];
    copy: () => AbstractCell;
    key: string;
    isVertex: () => boolean;
    isEdge: () => boolean;
    isFace: () => boolean;
    isBall: () => boolean;
    positionKey: string;
    shift: (dx: number, dy: number, dz: number) => void;
    dimension: number;
}
export type AbstractVertex = AbstractCell & { point: [number, number, number];  };
export type AbstractEdge =   AbstractCell;//AbstractCell & { attachingMap: AbstractVertex[]; cob:  AbstractFace[] };
export type AbstractFace =   AbstractCell;//AbstractCell & { attachingMap: AbstractEdge[]; cob: AbstractBall[] };
export type AbstractBall =   AbstractCell;//AbstractCell & { attachingMap: AbstractFace[]; cob: AbstractCell[] };

type classes = [Vertex, Edge, Face, Ball];

export class Cell implements AbstractCell {
    id: number;
    index: number;
    name: string;
    dimension: number;
    attachingMap: AbstractCell[];
    cob: AbstractCell[] = [];
    vertices_: AbstractVertex[] = [];

    constructor(id: number, index: number, name?: string) {
        this.id = id;
        this.index = index;
        this.name = name ?? "c_" + this.id;
        this.attachingMap = [];
        this.cob = [];
        this.dimension = -1;
        // this.#vertices = [];
    }

    get positionKey(): string {
        return this.vertices_.map(v => v.positionKey).join("|");
    }

    #setFromVertices(complex: CWComplex, vertices: AbstractVertex[]) {
        this.vertices_ = vertices;
        this.vertices_.sort((a, b) => a.id - b.id);
        // in order for the cell added to be added to the vertices attaching map
        this.vertices_.forEach(v => v.cob.push(this));
        this.dimension = vertices.length - 1;
        this.attachingMap = [...vertices];

    }

    get vertices() {
        const isSorted = this.vertices_.every((v, i, arr) => i === 0 || v.id > arr[i - 1].id);
        if (!isSorted) console.warn("Unsorted vertices")
        return [...this.vertices_];
        // shpould update attaching map to be like this
    }

    get vertexSummary() {
        return [...this.vertices].map(v => v.id).join(", ");
    }
    get boundarySummary() {
        return this.attachingMap.map(c => c.id).toSorted().join(", ");
    }
    get key(): string {
        return this.dimension + " " + this.id;
    }

    get vertexDescription(): string {
        return this.vertices.map(v => v.index).join(",");
    }

    copy(): Cell {
        return new Cell(this.id, this.index, this.name);
    }

    isVertex(): this is Vertex {
        return this.dimension === 0;
    }

    isEdge(): this is Edge {
        return this.dimension === 1;
    }

    isFace(): this is Face {
        return this.dimension === 2;
    }

    isBall(): this is Ball {
        return this.dimension === 3;
    }

    shift(dx: number, dy: number, dz: number) {
        console.notify("Shifting...");
        if (this.isVertex()) {
            const point = this.vertices_[0].point;
            point[0] += dx;
            point[1] += dy;
            point[2] += dz;

            this.vertices_[0].point = point;
            
        }
            // } else {

            
            
        //     this.vertices_.forEach(v => {
        //         v.point[0] += dx;
        //         v.point[1] += dy;
        //         v.point[2] += dz;
        //     });
        // }
           
    }
}



export class Vertex extends Cell implements AbstractVertex {
    // id: number;
    // index: number;
    // name: string;
    point: [number, number, number];

    

    constructor(point: [number, number, number], id: number, index: number, name?: string) {
        super(id, index, name);
        this.point = point;
        this.attachingMap = [];
        this.cob = [];
        this.vertices_ = [this];
        this.dimension = 0;
    }

    get positionKey(): string {
        return this.point.map(p => p.toFixed(2)).join(",");
    }

    copy(): Vertex {
        return new Vertex([...this.point], this.id, this.index, this.name);
    }
}

export class Edge extends Cell implements AbstractEdge {


    constructor(v1: AbstractVertex, v2: AbstractVertex, id: number, index: number, name?: string) {
        super(id, index, name ?? "e_" + id);
        this.attachingMap = [v1, v2];
        this.cob = [];
        this.vertices_ = [v1, v2];
        this.vertices_.sort((a, b) => a.id - b.id);
        this.dimension = 1;

    }

    copy(): Edge {
        const [v1, v2] = this.attachingMap as [AbstractVertex, AbstractVertex];
        return new Edge(v1, v2, this.id, this.index);
    }
}

export class Face extends Cell implements AbstractFace {




    constructor(edges: AbstractEdge[], id: number, index: number, name?: string) {
        super(id, index, name ?? "f_" + id);
        this.attachingMap = [...edges];
        this.cob = [];
        this.vertices_ = [...new Set(edges.flatMap(e => e.vertices))];
        this.vertices_.sort((a, b) => a.id - b.id);
        this.dimension = 2;
    }

    copy(): Face {
        return new Face(this.attachingMap, this.id, this.index);
    }
}

export class Ball extends Cell implements AbstractBall {

    // cob: AbstractCell[];

    constructor(faces: AbstractFace[], id: number, index: number, name?: string) {
        super(id, index, name);
        this.id = id ?? 0;
        this.index = index ?? 0;
        this.name = "B_" + this.id;
        this.attachingMap = [...faces];
        this.vertices_  = [...new Set(faces.flatMap(f => f.vertices))];
        this.vertices_.sort((a, b) => a.id - b.id);
        this.dimension = 3;
    }

    copy(): Ball {
        return new Ball(this.attachingMap, this.id, this.index);
    }
}


