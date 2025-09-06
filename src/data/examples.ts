
import { Preset, Tetra, KleinBottle, RP2, Sphere, KleinBottle2, TriangleParachute, H216, LensSpace } from "./presets";

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
        name: "Sphere (Glued Square)", 
        description: "description 7", 
        image: "", 
        setter: Sphere 
    },
    { 
        name: "Klein Bottle (Glued Square)", 
        description: "A Klein bottle as a quotient of a square. ", 
        image: "", 
        setter: KleinBottle 
    },
    { 
        name: "Klein Bottle (Glued Tetra)", 
        description: "description 8", 
        image: "", 
        setter: KleinBottle2 
    },
    { 
        name: "Projective Plane", 
        description: "The real projective plane as a quotient of a square.", 
        image: "", 
        setter: RP2 
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
    },
    {
        name: "Lens Space",
        description: "Hatcher 2.1.8",
        image: "",
        setter: LensSpace
    }
]