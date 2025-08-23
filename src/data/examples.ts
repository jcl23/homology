
import { Preset, Tetra, KleinBottle, RP2, Sphere, KleinBottle2, TriangleParachute, H216 } from "./presets";

export type Example = {
    name: string;
    description: string;
    image: string;
    setter: Preset;
}

export const examples: Example[] = [
    {
        name: "Sphere (Tetrahedron)",
        description: "A sphere by boundary of a tetrahedron",
        image: "",
        setter: Tetra
    },
    { 
        name: "Klein Bottle", 
        description: "A Klein bottle as a quotient of a square. ", 
        image: "", 
        setter: KleinBottle 
    },
    { 
        name: "RP2", 
        description: "The real projective plane as a quotient of a square.", 
        image: "", 
        setter: RP2 
    },
    { 
        name: "Sphere", 
        description: "description 7", 
        image: "", 
        setter: Sphere 
    },
    { 
        name: "Klein Bottle 2", 
        description: "description 8", 
        image: "", 
        setter: KleinBottle2 
    },
    { 
        name: "Triangle Parachute", 
        description: "Hatcher 2.1.4", 
        image: "", 
        setter: TriangleParachute 
    },
    {
        name: "Hatcher 1.2.6 (n=3)",
        description: "Hatcher 1.2.6 for n=5",
        image: "",
        setter: H216
    }
]