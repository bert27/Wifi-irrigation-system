import React from "react";
import { Box } from "@mui/material";

export const DrinksBackground = () => {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                    "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(217, 70, 239, 0.1) 0px, transparent 50%)",
                pointerEvents: "none",
                zIndex: 0,
            }}
        />
    );
};
