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
import { PumpConfig } from "../models/drinks-model";
import { useTranslation } from "react-i18next";

interface PumpSettingsModalProps {
    open: boolean;
    onClose: () => void;
    pump: PumpConfig | null;
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
                sx: { minWidth: 320 }
            }}
        >
            <DialogTitle className="tech-text" sx={{ color: "var(--accent)" }}>
                {t('drinks.config.title')}: {pump.title}
            </DialogTitle>
            <DialogContent sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                    <Typography className="tech-text" sx={{ fontSize: "0.8rem", color: "var(--text-muted)", mb: 1 }}>
                        {t('drinks.config.pwm')}: {pwm}
                    </Typography>
                    <Slider
                        value={pwm}
                        onChange={(_e, v) => setPwm(v as number)}
                        min={0}
                        max={255}
                        sx={{
                            "& .MuiSlider-thumb": { background: "var(--primary)" },
                            "& .MuiSlider-track": { background: "linear-gradient(90deg, var(--primary), var(--accent))" }
                        }}
                    />
                </Box>
                <Box>
                    <Typography className="tech-text" sx={{ fontSize: "0.8rem", color: "var(--text-muted)", mb: 1 }}>
                        {t('drinks.config.time')}: {time}s
                    </Typography>
                    <Slider
                        value={time}
                        onChange={(_e, v) => setTime(v as number)}
                        min={0}
                        max={20}
                        sx={{
                            "& .MuiSlider-thumb": { background: "var(--accent)" },
                            "& .MuiSlider-track": { background: "var(--accent)" }
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} sx={{ color: "var(--text-muted)" }}>
                    {t('common.cancel')}
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    sx={{
                        background: "linear-gradient(90deg, var(--primary), var(--accent))",
                        fontWeight: 700
                    }}
                >
                    {t('common.save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
