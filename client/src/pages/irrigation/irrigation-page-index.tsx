import React, { useEffect } from "react";
import { Alert, Grid, Typography } from "@mui/material";
import { useIrrigationPage } from "./hooks/use-irrigation-page";
import { SimulationAlert } from "@/components/simulation-alert/simulation-alert";
import { StatusCard } from "./components/status-card";
import { ScheduleCard } from "./components/schedule-card";
import { ConfigCard } from "./components/config-card";
import { ModalConfig } from "./modal-config";
import { IrrigationSkeleton } from "./components/irrigation-skeleton";
import "./irrigation.css";

import { useTranslation } from "react-i18next";

export const Irrigation: React.FC = () => {
  const { t } = useTranslation();
  const {
    loading,
    stateWaterPump,
    setStateWaterPump,
    clock,
    temperature,
    errorCreateTask,
    errorGet,
    listTasks,
    days,
    dataForNewTask,
    isOpenModalConfig,
    setIsOpenModalConfig,
    saveDays,
    saveTimeSelect,
    createTask,
    eliminateTask,
    isMock
  } = useIrrigationPage();

  useEffect(() => {
    document.title = "RobotCore - Irrigation";
  }, []);

  if (loading) return <IrrigationSkeleton />;

  return (
    <div className="pageIrrigation">
      <SimulationAlert isMock={isMock} />
      {errorGet && <Alert severity="error" sx={{ mb: 2 }}>{t('irrigation.errors.getError')}</Alert>}

      <Typography className="title_irrigation">{t('irrigation.title')}</Typography>

      <Grid container spacing={4} sx={{ width: '100%', maxWidth: '1200px' }}>

        <Grid size={{ xs: 12, md: 6 }}>
          <StatusCard
            temperature={temperature}
            clock={clock}
            stateWaterPump={stateWaterPump}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ConfigCard
            days={days}
            saveDays={saveDays}
            dataForNewTask={dataForNewTask}
            saveTimeSelect={saveTimeSelect}
            setIsOpenModalConfig={setIsOpenModalConfig}
            createTask={createTask}
            errorCreateTask={errorCreateTask}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <ScheduleCard
            listTasks={listTasks}
            eliminateTask={eliminateTask}
          />
        </Grid>

      </Grid>

      <ModalConfig
        isOpenModalConfig={isOpenModalConfig}
        setIsOpenModalConfig={setIsOpenModalConfig}
        stateWaterPump={stateWaterPump}
        setstateWaterPump={setStateWaterPump}
      />
    </div>
  );
};
