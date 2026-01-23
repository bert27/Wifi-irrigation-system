import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Slider
} from "@mui/material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { IBottle } from "@/pages/drinks/models/drinks-model";
import { useTranslation } from "react-i18next";

interface PumpSettingsModalProps {
    open: boolean;
    onClose: () => void;
    pump: IBottle | null;
    onSave: (id: number, data: { pwm: number; timeCalibration: number }) => void;
}

export const PumpSettingsModal: React.FC<PumpSettingsModalProps> = ({
    open,
    onClose,
    pump,
    onSave
}) => {
    const { t } = useTranslation();
    const [pwm, setPwm] = useState(0);
    const [time, setTime] = useState(0);

    useEffect(() => {
        if (pump) {
            setPwm(pump.pwm);
            setTime(pump.timeCalibration);
        }
    }, [pump, open]);

    const handleSave = () => {
        if (pump) {
            onSave(pump.id, { pwm, timeCalibration: time });
            onClose();
        }
    };

    if (!pump) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                className: "glass-effect",
                sx: {
                    minWidth: 320,
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.1)"
                }
            }}
        >
            <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
                <WaterDropIcon sx={{ color: "var(--accent)" }} />
                <Typography className="tech-text" sx={{ color: "var(--accent)", fontWeight: 700 }}>
                    {pump.title} - {pump.liquid}
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 4 }}>
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
                        onChange={(_e, v) => setPwm(v as number)}
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

                <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography className="tech-text" sx={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            {t('drinks.config.time')}
                        </Typography>
                        <Typography sx={{ color: "var(--accent)", fontWeight: 700 }}>
                            {time.toFixed(1)}s
                        </Typography>
                    </Box>
                    <Slider
                        value={time}
                        onChange={(_e, v) => setTime(v as number)}
                        min={0}
                        max={60}
                        step={0.1}
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
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: "var(--text-muted)",
                        textTransform: "none",
                        fontWeight: 600
                    }}
                >
                    {t('common.cancel')}
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    sx={{
                        background: "linear-gradient(135deg, var(--primary), var(--accent))",
                        fontWeight: 700,
                        px: 3,
                        borderRadius: "8px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                        textTransform: "none"
                    }}
                >
                    {t('common.save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
