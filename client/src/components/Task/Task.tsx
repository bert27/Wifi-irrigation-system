import "./style.sass";

interface IDay {
  name: string;
  state: boolean;
}

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

export const Task = ({
  taskData = {
    days: [],
    hour: 17,
    minutes: 30,
  },
  index = 0,
  eliminateTask = () => {},
}: IPropsTask) => {
  return (
    <div
      className="cardTask_plant"
      key={index}
      data-testid={"task"}
      onClick={() => eliminateTask(index)}
    >
      <div className="title_cardtask">
        A las {taskData?.hour}:{taskData?.minutes}
      </div>
      <div className="daysTask_plant">
        {taskData?.days.map((taskdatac, index) => (
          <div key={index}>
            {taskdatac?.state && (
              <div className="day_task">{taskdatac?.name}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
