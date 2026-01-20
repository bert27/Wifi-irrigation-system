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
];
