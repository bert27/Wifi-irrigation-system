import React from "react";
import { Box } from "@mui/material";
import { CocktailsGrid } from "@/pages/drinks/components/cocktails-grid";
import { Cocktail } from "@/pages/drinks/models/drinks-model";

interface DrinksTabPageProps {
    cocktails: Cocktail[];
    onSelectCocktail: (cocktail: Cocktail) => void;
    selectedIndex?: number | null;
    loading?: boolean;
}

export const DrinksTabPage: React.FC<DrinksTabPageProps> = ({
    cocktails,
    onSelectCocktail,
    selectedIndex,
    loading
}) => {
    return (
        <Box
            sx={{
                position: "relative",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -40,
                    left: -40,
                    right: -40,
                    bottom: -40,
                    backgroundImage: `url(/cocktail-machine-bg.png)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.15,
                    borderRadius: "20px",
                    zIndex: -1,
                    filter: "blur(2px)",
                },
            }}
        >
            <CocktailsGrid
                cocktails={cocktails}
                onSelectCocktail={onSelectCocktail}
                selectedIndex={selectedIndex}
                loading={loading}
            />
        </Box>
    );
};
