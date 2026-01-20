import { Cocktail } from "../models/drinks-model";

/**
 * Note: Memory for cocktails now resides on the ESP32.
 * This file serves as a fallback or template.
 */
export const availableCocktails: Cocktail[] = [
    {
        id: "1",
        name: "Cocacola",
        description: "Refresco clásico",
        recipe: [{ liquid: "Cocacola", quantity: 200 }]
    },
    {
        id: "2",
        name: "Sex on the beach",
        description: "Cóctel afrutado",
        recipe: [
            { liquid: "Vodka", quantity: 50 },
            { liquid: "Zumo de Naranja", quantity: 150 }
        ]
    },
    {
        id: "3",
        name: "Zumo de naranja",
        description: "Cítrico fresco",
        recipe: [{ liquid: "Zumo de Naranja", quantity: 200 }]
    },
    {
        id: "4",
        name: "Vodka con cocacola",
        description: "Combinado clásico",
        recipe: [
            { liquid: "Vodka", quantity: 50 },
            { liquid: "Cocacola", quantity: 150 }
        ]
    },
    {
        id: "5",
        name: "Granadina",
        description: "Sirope dulce",
        recipe: [{ liquid: "Granadina", quantity: 50 }]
    },
    {
        id: "6",
        name: "Vodka",
        description: "Bebida espirituosa",
        recipe: [{ liquid: "Vodka", quantity: 50 }]
    }
];
