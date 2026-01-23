import { ICocktail } from "../models/drinks-model";


export const MOCK_COCKTAILS: ICocktail[] = [
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
            { liquid: "Zumo de naranja", quantity: 150 }
        ]
    },
    {
        id: "3",
        name: "Sex on the Beach",
        description: "Cóctel afrutado",
        recipe: [
            { liquid: "Vodka", quantity: 50 },
            { liquid: "Zumo de naranja", quantity: 100 },
            { liquid: "Granadina", quantity: 20 }
        ]
    },
    {
        id: "4",
        name: "Tequila Sunrise",
        description: "Cóctel afrutado",
        recipe: [
            { liquid: "Tequila", quantity: 50 },
            { liquid: "Zumo de naranja", quantity: 150 },
            { liquid: "Granadina", quantity: 30 }
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
