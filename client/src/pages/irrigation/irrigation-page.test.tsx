import { vi, test, expect } from 'vitest';
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Irrigation } from "./irrigation-page-index";

// Mock axios just in case interaction escapes
vi.mock("axios");

vi.mock("./components/chart-temperature", () => ({
  ChartTemperature: () => <div>MockChart</div>
}));

vi.mock("@/pages/irrigation/components/clock/clock", () => ({
  Clock: () => <div>MockClock</div>
}));

// Mock the hook to verify UI interactions without real backend
vi.mock("./hooks/use-irrigation-page", () => {
  const React = require('react');
  return {
    useIrrigationPage: () => {
      const [listTasks, setListTasks] = React.useState([]);
      const [errorCreateTask, setErrorCreateTask] = React.useState(null);
      const [days, setDays] = React.useState([
        { name: "L", state: false },
        { name: "Ma", state: false },
        { name: "Mi", state: false },
        { name: "J", state: false },
        { name: "V", state: false },
        { name: "S", state: false },
        { name: "D", state: false },
      ]);
      const dataForNewTask = { days: [], hour: "17", minutes: "30" };

      const saveDays = (index: number) => {
        const newDays = [...days];
        newDays[index] = { ...newDays[index], state: !newDays[index].state };
        setDays(newDays);
      };

      const createTask = () => {
        const selected = days.filter((d: any) => d.state);
        if (selected.length === 0) {
          setErrorCreateTask("irrigation.errors.noDaySelected");
          return;
        }
        setListTasks([...listTasks, { ...dataForNewTask, days: selected }]);
        setErrorCreateTask(null);
      };

      const eliminateTask = (index: number) => {
        setListTasks(listTasks.filter((_: any, i: number) => i !== index));
      };

      return {
        loading: false,
        stateWaterPump: false,
        setStateWaterPump: vi.fn(),
        clock: "12:00",
        temperature: 25,
        errorCreateTask,
        errorGet: null,
        listTasks,
        days,
        dataForNewTask,
        isOpenModalConfig: false,
        setIsOpenModalConfig: vi.fn(),
        saveDays,
        saveTimeSelect: vi.fn(),
        createTask,
        eliminateTask
      };
    }
  };
});

test("renders texts ok", () => {
  const { getByText } = render(<Irrigation />);
  // "Riego" -> irrigation.title
  expect(getByText("irrigation.title")).toBeInTheDocument();
  // "Sin conexión" (error) not present in mock, check other static texts
  expect(getByText("irrigation.status.title")).toBeInTheDocument();
  expect(getByText("irrigation.schedule.title")).toBeInTheDocument();
  expect(getByText("irrigation.config.saveButton")).toBeInTheDocument();
});

test("renders list from hook", () => {
  render(<Irrigation />);
  expect(screen.getByText("irrigation.schedule.noTasks")).toBeInTheDocument();
});

test("Create Task and not selected Day", async () => {
  const user = userEvent.setup();
  const { getByText } = render(<Irrigation />);

  // Click save button
  const saveBtn = getByText("irrigation.config.saveButton");
  await user.click(saveBtn);

  expect(getByText("irrigation.errors.noDaySelected")).toBeInTheDocument();
});

test("Create Task by defect and delete task", async () => {
  const user = userEvent.setup();
  const { container, getByText, getByTestId } = render(<Irrigation />);

  // Checkbox interactions
  const checkboxes = container.getElementsByClassName("days_irrigation_child");
  expect(checkboxes.length).toBe(7);

  // Select first day (L)
  await user.click(checkboxes[0]);

  // Click Save
  await user.click(getByText("irrigation.config.saveButton"));

  // Check Task Created
  // Expect "A las 17:30" -> translates to "irrigation.task.at 17:30"
  expect(getByText(/irrigation.task.at 17:30/)).toBeInTheDocument();
  expect(getByTestId("listsTasks")).toBeInTheDocument();
  expect(getByTestId("task")).toBeInTheDocument();

  // Delete Task
  const deleteBtn = container.querySelector(".delete-task-btn");
  expect(deleteBtn).toBeInTheDocument();
  if (deleteBtn) await user.click(deleteBtn);

  // Expect list empty
  await waitFor(() => {
    expect(getByText("irrigation.schedule.noTasks")).toBeInTheDocument();
  });
});

