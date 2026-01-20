import { vi, test, expect } from 'vitest';
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React, { useState } from 'react';
import { Plant } from "../pages/plant/plant-page-index";

// Mock axios just in case interaction escapes
vi.mock("axios");

vi.mock("../pages/plant/components/chart-temperature", () => ({
  ChartTemperature: () => <div>MockChart</div>
}));

vi.mock("../components/clock/clock", () => ({
  Clock: () => <div>MockClock</div>
}));

// Mock the hook to verify UI interactions without real backend
vi.mock("../pages/plant/hooks/use-plant-page", () => {
  const React = require('react');
  return {
    usePlantPage: () => {
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
      const [dataForNewTask, setDataForNewTask] = React.useState({ days: [], hour: "17", minutes: "30" });

      const saveDays = (day, index) => {
        const newDays = [...days];
        newDays[index] = { ...newDays[index], state: !newDays[index].state };
        setDays(newDays);
      };

      const createTask = () => {
        const selected = days.filter(d => d.state);
        if (selected.length === 0) {
          setErrorCreateTask("plant.errors.noDaySelected");
          return;
        }
        setListTasks([...listTasks, { ...dataForNewTask, days: selected }]);
        setErrorCreateTask(null);
      };

      const eliminateTask = (index) => {
        setListTasks(listTasks.filter((_, i) => i !== index));
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
  const { getByText } = render(<Plant />);
  // "Planta" -> plant.title
  expect(getByText("plant.title")).toBeInTheDocument();
  // "Sin conexión" (error) not present in mock, check other static texts
  expect(getByText("plant.status.title")).toBeInTheDocument(); 
  expect(getByText("plant.schedule.title")).toBeInTheDocument();
  expect(getByText("plant.config.saveButton")).toBeInTheDocument();
});

test("renders list from hook", () => {
  // To test list rendering, we can rely on our functional mock.
  // Ideally we would initialize the hook with data, but since we can't easily injection props into a hook mock,
  // we will trust the "Create Task" flow test to verify list rendering.
  // Or we can assume the component renders "plant.schedule.noTasks" initially.
  render(<Plant />);
  expect(screen.getByText("plant.schedule.noTasks")).toBeInTheDocument();
});

test("Create Task and not selected Day", async () => {
  const user = userEvent.setup();
  const { getByText } = render(<Plant />);
  
  // Click save button
  const saveBtn = getByText("plant.config.saveButton");
  await user.click(saveBtn);
  
  expect(getByText("plant.errors.noDaySelected")).toBeInTheDocument();
});

test("Create Task by defect and delete task", async () => {
  const user = userEvent.setup();
  const { container, getByText, getByTestId, getAllByTestId, queryByText } = render(<Plant />);

  // Checkbox interactions
  // .checkBox_plant_child is inside a wrapper that has onClick
  const checkboxes = container.getElementsByClassName("days_plant_child");
  expect(checkboxes.length).toBe(7);
  
  // Select first day (L)
  await user.click(checkboxes[0]);
  
  // Click Save
  await user.click(getByText("plant.config.saveButton"));
  
  // Check Task Created
  // Expect "A las 17:30" -> translates to "plant.task.at 17:30"
  expect(getByText(/plant.task.at 17:30/)).toBeInTheDocument();
  expect(getByTestId("listsTasks")).toBeInTheDocument();
  expect(getByTestId("task")).toBeInTheDocument();
  
  // Delete Task
  const deleteBtn = container.querySelector(".delete-task-btn");
  expect(deleteBtn).toBeInTheDocument();
  await user.click(deleteBtn);
  
  // Expect list empty
  await waitFor(() => {
     expect(getByText("plant.schedule.noTasks")).toBeInTheDocument();
  });
});
