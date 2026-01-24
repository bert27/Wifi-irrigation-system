import { ICocktail } from "../models/drinks-model";


export const MOCK_COCKTAILS: ICocktail[] = [
    {
        id: "1",
        name: "Cocacola",
        description: "Classic soft drink",
        recipe: [{ liquid: "Cocacola", quantity: 200 }]
    },
    {
        id: "2",
        name: "Sex on the beach",
        description: "Fruity cocktail",
        recipe: [
            { liquid: "Vodka", quantity: 50 },
            { liquid: "Orange Juice", quantity: 150 }
        ]
    },
    {
        id: "3",
        name: "Sex on the Beach",
        description: "Fruity cocktail",
        recipe: [
            { liquid: "Vodka", quantity: 50 },
            { liquid: "Orange Juice", quantity: 100 },
            { liquid: "Grenadine", quantity: 20 }
        ]
    },
    {
        id: "4",
        name: "Tequila Sunrise",
        description: "Fruity cocktail",
        recipe: [
            { liquid: "Tequila", quantity: 50 },
            { liquid: "Orange Juice", quantity: 150 },
            { liquid: "Grenadine", quantity: 30 }
        ]
    },
    {
        id: "5",
        name: "Grenadine",
        description: "Sweet syrup",
        recipe: [{ liquid: "Grenadine", quantity: 50 }]
    },
    {
        id: "6",
        name: "Vodka",
        description: "Spirit",
        recipe: [{ liquid: "Vodka", quantity: 50 }]
    }
];
