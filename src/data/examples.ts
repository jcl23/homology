
import { Preset, Tetra, KleinBottle, RP2, Sphere, KleinBottle2 } from "./presets";

export type Example = {
    name: string;
    description: string;
    image: string;
    setter: Preset;
}

export const examples: Example[] = [
    {
        name: "Tetrahedron",
        description: "A simple tetrahedron with 4 vertices and 6 edges.",
        image: "",
        setter: Tetra
    },
    { name: "Klein Bottle", description: "description 1", image: "", setter: KleinBottle },
    { name: "RP2", description: "description 5", image: "", setter: RP2 },
    { name: "Sphere", description: "description 7", image: "", setter: Sphere },
    { name: "Klein Bottle 2", description: "description 8", image: "", setter: KleinBottle2 },
]