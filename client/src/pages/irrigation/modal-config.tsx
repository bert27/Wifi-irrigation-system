import React from "react";
import { Box, Button, Modal, Typography, IconButton } from "@mui/material";
import WaterIcon from "@mui/icons-material/Water";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon from "@mui/icons-material/Close";
import { irrigationService } from "@/pages/irrigation/services/irrigation.service";

interface ModalConfigProps {
  isOpenModalConfig: boolean;
  setIsOpenModalConfig: (open: boolean) => void;
  stateWaterPump: boolean;
  setstateWaterPump: (state: boolean) => void;
}

import { useTranslation } from "react-i18next";

export const ModalConfig: React.FC<ModalConfigProps> = ({
  isOpenModalConfig,
  setIsOpenModalConfig,
  stateWaterPump,
  setstateWaterPump,
}) => {
  const { t } = useTranslation();

  const changeStateWatterPump1 = async () => {
    try {
      const newState = !stateWaterPump;
      const pwmValue = newState ? 255 : 0;

      const responseStateServer = await irrigationService.getWaterPump1OnOFF({
        set: newState,
        "0": 1,
        "1": pwmValue,
        id: 1,
        pwm: pwmValue
      });

      setstateWaterPump(responseStateServer.status);
    } catch (e) {
      console.error("Error toggling pump", e);
    }
  };

  const styleModal = {
    width: "90%",
    maxWidth: "500px",
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "var(--bg-card)",
    backdropFilter: "blur(20px)",
    border: "1px solid var(--glass-border)",
    borderRadius: "24px",
    boxShadow: "var(--shadow-premium)",
    p: 4,
    color: "var(--text-main)",
  };

  return (
    <Modal
      open={isOpenModalConfig}
      onClose={() => setIsOpenModalConfig(false)}
      closeAfterTransition
    >
      <Box sx={styleModal}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" sx={{ fontFamily: 'var(--font-tech)', fontWeight: 700, color: 'var(--accent)' }}>
            {t('irrigation.manualControl.title')}
          </Typography>
          <IconButton onClick={() => setIsOpenModalConfig(false)} sx={{ color: 'var(--text-muted)' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <div className="optionsIrrigation">
          <Box
            className="glass-effect"
            sx={{
              p: 3,
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              width: '100%',
              background: 'rgba(255,255,255,0.02) !important'
            }}
          >
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
              {t('irrigation.status.pump1')}:
              <span style={{ color: stateWaterPump ? 'var(--accent)' : 'var(--secondary)' }}>
                {stateWaterPump ? t('common.on') : t('common.off')}
              </span>
            </Typography>

            <Button
              variant="contained"
              fullWidth
              onClick={changeStateWatterPump1}
              startIcon={stateWaterPump ? <WarningAmberIcon /> : <WaterIcon />}
              sx={{
                background: stateWaterPump ? 'linear-gradient(45deg, #ef4444, #f43f5e)' : 'linear-gradient(45deg, var(--primary), var(--accent))',
                borderRadius: '12px',
                py: 1.5,
                fontWeight: 700
              }}
            >
              {stateWaterPump ? t('irrigation.manualControl.stop') : t('irrigation.manualControl.start')}
            </Button>
          </Box>
        </div>
      </Box>
    </Modal>
  );
};
