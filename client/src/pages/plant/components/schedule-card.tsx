import React from "react";
import { Typography } from "@mui/material";
import { Task } from "../../../components/Task/Task";
import { IScheduledTask } from "../models/plant-model";
import "./../plant.css";

interface ScheduleCardProps {
  listTasks: IScheduledTask[];
  eliminateTask: (index: number) => void;
}

import { useTranslation } from "react-i18next";

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ listTasks, eliminateTask }) => {
  const { t } = useTranslation();
  return (
    <div className="cardPlanta" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography className="subtitle_plant">{t('plant.schedule.title')}</Typography>
      <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
        {t('plant.schedule.activeTasks')}: {listTasks.length}
      </Typography>
      
      <div className="tasksList_plant" style={{ flex: 1 }}>
        {listTasks.length > 0 ? (
          listTasks.map((t, i) => (
            <Task
              taskData={{...t, hour: parseInt(t.hour), minutes: parseInt(t.minutes)}}
              index={i}
              key={`task-${i}`}
              eliminateTask={eliminateTask}
            />
          ))
        ) : (
          <Typography variant="body2" color="var(--text-muted)">
            {t('plant.schedule.noTasks')}
          </Typography>
        )}
      </div>
    </div>
  );
};
