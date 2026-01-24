import React from "react";
import { Box, Typography, Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { Days } from "@/pages/irrigation/components/Days/Days";
import { Clock } from "@/pages/irrigation/components/clock/clock";
import { Day } from "@/pages/irrigation/models/day.model";
import { IScheduledTask } from "@/pages/irrigation/models/irrigation-model";
import "./../irrigation.css";

interface ConfigCardProps {
  days: Day[];
  saveDays: (index: number) => void;
  dataForNewTask: IScheduledTask;
  saveTimeSelect: (h: string, m: string) => void;
  setIsOpenModalConfig: (isOpen: boolean) => void;
  createTask: () => void;
  errorCreateTask: string | null;
}

import { useTranslation } from "react-i18next";

export const ConfigCard: React.FC<ConfigCardProps> = ({
  days,
  saveDays,
  dataForNewTask,
  saveTimeSelect,
  setIsOpenModalConfig,
  createTask,
  errorCreateTask,
}) => {
  const { t } = useTranslation();
  return (
    <Box className="cardIrrigation" sx={{ width: '100%', mt: 1, p: 2 }}>
      <Typography className="subtitle_irrigation" sx={{ mb: 1 }}>{t('irrigation.config.title')}</Typography>
      <Days saveDays={saveDays} days={days} />

      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} mt={1}>
        <Box flex={1} display="flex" alignItems="center">
          <Clock
            saveTimeSelect={saveTimeSelect}
            hour={dataForNewTask.hour}
            minutes={dataForNewTask.minutes}
          />
        </Box>

        <Box flex={1} display="flex" flexDirection="column" justifyContent="center" gap={1.5}>
          <Button
            variant="outlined"
            onClick={() => setIsOpenModalConfig(true)}
            startIcon={<SettingsIcon />}
            size="small"
            sx={{ color: 'var(--accent)', borderColor: 'var(--accent)', borderRadius: '12px', py: 0.5 }}
          >
            {t('irrigation.config.manualAdjustments')}
          </Button>

          <Button
            variant="contained"
            onClick={createTask}
            size="small"
            sx={{
              background: 'linear-gradient(90deg, var(--primary), var(--accent))',
              borderRadius: '12px',
              py: 1,
              fontWeight: 700
            }}
          >
            {t('irrigation.config.saveButton')}
          </Button>
          {errorCreateTask && <Typography color="error" variant="caption">{errorCreateTask}</Typography>}
        </Box>
      </Box>
    </Box>
  );
};
