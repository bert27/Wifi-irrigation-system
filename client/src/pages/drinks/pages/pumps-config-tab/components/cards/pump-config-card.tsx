import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Slider } from "@mui/material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { Bottle } from "@/pages/drinks/models/drinks-model";
import { useTranslation } from "react-i18next";

interface PumpConfigCardProps {
    bottle: Bottle;
    onUpdatePump: (id: number, data: { pwm: number; timeCalibration: number }) => void;
}

export const PumpConfigCard: React.FC<PumpConfigCardProps> = ({ bottle, onUpdatePump }) => {
    const { t } = useTranslation();
    const [pwm, setPwm] = useState(bottle.pwm);
    const [time, setTime] = useState(bottle.timeCalibration);

    useEffect(() => {
        setPwm(bottle.pwm);
        setTime(bottle.timeCalibration);
    }, [bottle]);

    const handlePwmChange = (_e: Event, value: number | number[]) => {
        const newPwm = value as number;
        setPwm(newPwm);
        onUpdatePump(bottle.id, { pwm: newPwm, timeCalibration: time });
    };

    const handleTimeChange = (_e: Event, value: number | number[]) => {
        const newTime = value as number;
        setTime(newTime);
        onUpdatePump(bottle.id, { pwm, timeCalibration: newTime });
    };

    return (
        <Paper
            className="glass-effect"
            sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
                },
            }}
        >
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <WaterDropIcon sx={{ color: "var(--accent)" }} />
                <Box>
                    <Typography className="tech-text" sx={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.9rem" }}>
                        {bottle.title}
                    </Typography>
                    <Typography sx={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                        {bottle.liquid}
                    </Typography>
                </Box>
            </Box>

            {/* PWM Slider */}
            <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography className="tech-text" sx={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {t('drinks.config.pwm')}
                    </Typography>
                    <Typography sx={{ color: "var(--primary)", fontWeight: 700 }}>
                        {pwm}
                    </Typography>
                </Box>
                <Slider
                    value={pwm}
                    onChange={handlePwmChange}
                    min={0}
                    max={255}
                    sx={{
                        height: 6,
                        "& .MuiSlider-thumb": {
                            width: 20,
                            height: 20,
                            background: "var(--primary)",
                            border: "2px solid white",
                            boxShadow: "0 0 10px var(--primary-glow)"
                        },
                        "& .MuiSlider-track": {
                            background: "linear-gradient(90deg, var(--primary), var(--accent))",
                            border: "none"
                        },
                        "& .MuiSlider-rail": {
                            opacity: 0.1,
                            background: "white"
                        }
                    }}
                />
            </Box>

            {/* Time Slider */}
            <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography className="tech-text" sx={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {t('drinks.config.time')}
                    </Typography>
                    <Typography sx={{ color: "var(--accent)", fontWeight: 700 }}>
                        {time}s
                    </Typography>
                </Box>
                <Slider
                    value={time}
                    onChange={handleTimeChange}
                    min={0}
                    max={20}
                    sx={{
                        height: 6,
                        "& .MuiSlider-thumb": {
                            width: 20,
                            height: 20,
                            background: "var(--accent)",
                            border: "2px solid white",
                            boxShadow: "0 0 10px var(--accent-glow)"
                        },
                        "& .MuiSlider-track": {
                            background: "var(--accent)",
                            border: "none"
                        },
                        "& .MuiSlider-rail": {
                            opacity: 0.1,
                            background: "white"
                        }
                    }}
                />
            </Box>
        </Paper>
    );
};
