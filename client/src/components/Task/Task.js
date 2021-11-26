import React, { useEffect, useState, useCallback, useRef } from "react";
import "./style.sass";

export const Task = (props) => {
  const { taskData, index, eliminateTask } = props;
  // console.log(typeof taskData);
  // console.log(taskData);
  return (
    <div className="cardTask_plant" onClick={() => eliminateTask(index)}>
      <div className="title_cardtask">
        A las {taskData?.hour}:{taskData?.minutes}
      </div>
      <div className="daysTask_plant">
        {taskData?.days.map((taskdatac, index) => (
          <>
            {taskdatac?.state && (
              <div className="day_task">{taskdatac?.name}</div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};
