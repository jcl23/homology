var _Cell_instances, _Cell_setFromVertices;
export class Cell {
    constructor(id, index, name) {
        _Cell_instances.add(this);
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "index", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dimension", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "attachingMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cob", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "vertices_", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.id = id;
        this.index = index;
        this.name = name ?? "c" + this.id;
        this.attachingMap = [];
        this.cob = [];
        this.dimension = -1;
        // this.#vertices = [];
    }
    get positionKey() {
        return this.vertices_.map(v => v.positionKey).join("|");
    }
    get vertices() {
        const isSorted = this.vertices_.every((v, i, arr) => i === 0 || v.id > arr[i - 1].id);
        if (!isSorted)
            console.warn("Unsorted vertices");
        return [...this.vertices_];
        // shpould update attaching map to be like this
    }
    get vertexSummary() {
        return [...this.vertices].map(v => v.id).join(", ");
    }
    get boundarySummary() {
        return this.attachingMap.map(c => c.id).toSorted().join(", ");
    }
    get key() {
        return this.dimension + " " + this.id;
    }
    get vertexDescription() {
        return this.vertices.map(v => v.index).join(",");
    }
    copy() {
        return new Cell(this.id, this.index, this.name);
    }
    isVertex() {
        return this.dimension === 0;
    }
    isEdge() {
        return this.dimension === 1;
    }
    isFace() {
        return this.dimension === 2;
    }
    isBall() {
        return this.dimension === 3;
    }
    shift(dx, dy, dz) {
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
_Cell_instances = new WeakSet(), _Cell_setFromVertices = function _Cell_setFromVertices(complex, vertices) {
    this.vertices_ = vertices;
    this.vertices_.sort((a, b) => a.id - b.id);
    // in order for the cell added to be added to the vertices attaching map
    this.vertices_.forEach(v => v.cob.push(this));
    this.dimension = vertices.length - 1;
    this.attachingMap = [...vertices];
};
export class Vertex extends Cell {
    constructor(point, id, index, name) {
        super(id, index, name);
        // id: number;
        // index: number;
        Object.defineProperty(this, "dimension", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        // name: string;
        Object.defineProperty(this, "point", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cob", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.point = point;
        this.attachingMap = [];
        this.cob = [];
        this.vertices_ = [this];
    }
    get positionKey() {
        return this.point.map(p => p.toFixed(2)).join(",");
    }
    copy() {
        return new Vertex([...this.point], this.id, this.index, this.name);
    }
}
export class Edge extends Cell {
    constructor(v1, v2, id, index, name) {
        super(id, index, name ?? "e" + id);
        Object.defineProperty(this, "dimension", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "attachingMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cob", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.attachingMap = [v1, v2];
        this.cob = [];
        this.vertices_ = [v1, v2];
        this.vertices_.sort((a, b) => a.id - b.id);
    }
    copy() {
        const [v1, v2] = this.attachingMap;
        return new Edge(v1, v2, this.id, this.index);
    }
}
export class Face extends Cell {
    constructor(edges, id, index, name) {
        super(id, index, name ?? "f" + id);
        Object.defineProperty(this, "dimension", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 2
        });
        Object.defineProperty(this, "attachingMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cob", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.attachingMap = [...edges];
        this.cob = [];
        this.vertices_ = [...new Set(edges.flatMap(e => e.vertices))];
        this.vertices_.sort((a, b) => a.id - b.id);
    }
    copy() {
        return new Face(this.attachingMap, this.id, this.index);
    }
}
export class Ball extends Cell {
    // cob: AbstractCell[];
    constructor(faces, id, index, name) {
        super(id, index, name);
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "index", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dimension", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 3
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "attachingMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.id = id ?? 0;
        this.index = index ?? 0;
        this.name = "b" + this.id;
        this.attachingMap = [...faces];
        this.vertices_ = [...new Set(faces.flatMap(f => f.vertices))];
        this.vertices_.sort((a, b) => a.id - b.id);
    }
    copy() {
        return new Ball(this.attachingMap, this.id, this.index);
    }
}
