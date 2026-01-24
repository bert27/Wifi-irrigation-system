import "./task.css";
import { Day as IDay } from "@/pages/irrigation/models/day.model";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";

interface ITask {
  days: IDay[];
  hour: number;
  minutes?: number;
}

interface IPropsTask {
  taskData: ITask;
  index: number;
  eliminateTask: (index: number) => void;
}

import { useTranslation } from "react-i18next";

export const Task = ({
  taskData = {
    days: [],
    hour: 17,
    minutes: 30,
  },
  index = 0,
  eliminateTask = () => { },
}: IPropsTask) => {
  const { t } = useTranslation();
  return (
    <div
      className="cardTask_irrigation"
      key={index}
      data-testid={"task"}
    >
      <div className="delete-btn-container">
        <Tooltip title={t('irrigation.task.delete')}>
          <IconButton
            onClick={() => eliminateTask(index)}
            className="delete-task-btn"
            aria-label="delete"
            size="medium"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div className="title_cardtask">
        {t('irrigation.task.at')} {taskData?.hour}:{taskData?.minutes}
      </div>
      <div className="daysTask_irrigation">
        {taskData?.days.map((taskdatac, index) => (
          <div key={index}>
            {taskdatac?.state && (
              <div className="day_task">{t(`irrigation.days.${taskdatac?.name}`)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
