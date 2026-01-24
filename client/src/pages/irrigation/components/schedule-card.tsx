import React from "react";
import { Typography } from "@mui/material";
import { Task } from "@/pages/irrigation/components/Task/Task";
import { IScheduledTask } from "@/pages/irrigation/models/irrigation-model";
import { useTranslation } from "react-i18next";
import "./../irrigation.css";

interface ScheduleCardProps {
  listTasks: IScheduledTask[];
  eliminateTask: (index: number) => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ listTasks, eliminateTask }) => {
  const { t } = useTranslation();
  return (
    <div className="cardIrrigation" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography className="subtitle_irrigation">{t('irrigation.schedule.title')}</Typography>
      <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
        {t('irrigation.schedule.activeTasks')}: {listTasks.length}
      </Typography>

      <div className="tasksList_irrigation" style={{ flex: 1 }} data-testid="listsTasks">
        {listTasks.length > 0 ? (
          listTasks.map((t, i) => (
            <Task
              taskData={{ ...t, hour: parseInt(t.hour), minutes: parseInt(t.minutes) }}
              index={i}
              key={`task-${i}`}
              eliminateTask={eliminateTask}
            />
          ))
        ) : (
          <Typography variant="body2" color="var(--text-muted)">
            {t('irrigation.schedule.noTasks')}
          </Typography>
        )}
      </div>
    </div>
  );
};

