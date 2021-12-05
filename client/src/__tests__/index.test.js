import { getByTestId, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { Plant } from "../Plant";
import axios from "axios";
import Slider from "rc-slider";
jest.mock("axios");

test("renders texts ok", () => {
  const { getByText } = render(<Plant />);
  expect(getByText("Planta")).toBeInTheDocument();
  expect(getByText("Sin conexión")).toBeInTheDocument();
  expect(getByText("Tareas Programadas:")).toBeInTheDocument();
  expect(getByText("Añade este riego")).toBeInTheDocument();
});
test("mock Axios Get List Tasks", async () => {
  const returnList =
    "Miercoles-17-30/Miercoles-17-30/Jueves-17-30/Miercoles-17-30/Jueves-17-30/Miercoles-17-21/Jueves-17-21/Lunes-10-34/Martes-10-34/--/--/--/--/--/--/--/--/--/--/--/";
  axios.get.mockReturnValueOnce(returnList);

  const { getByText } = await render(<Plant />);
  const resultAxios = getByText("Mi");
  expect(resultAxios).toBeInTheDocument();
});
test("Create Task and not selected Day", async () => {
  const { container, getByText } = render(<Plant />);
  userEvent.click(container.querySelector(".button_plant"));
  expect(getByText("Selecciona un día o varios")).toBeInTheDocument();
});

test("Create Task by defect and delete task", async () => {
  const { container, getByText, getByTestId, getAllByTestId } = render(
    <Plant />
  );
  userEvent.click(container.querySelector(".checkBox_plant_child"));
  //fireEvent.click(container.querySelector(".checkBox_plant_child"));
  expect(getByText("No tienes ninguna tarea todavía")).toBeInTheDocument();
  //select day in checkbox
  userEvent.click(container.querySelector(".button_plant"));
  //check create task by defect
  expect(getByText("A las 17:30")).toBeInTheDocument();
  expect(getByTestId("listsTasks")).toBeInTheDocument();
  expect(getByTestId("task")).toBeInTheDocument();
  const listItems = getAllByTestId("task");
  expect(listItems).toHaveLength(1);
  //delete task
  userEvent.click(container.querySelector(".cardTask_plant"));
  expect(getByText("No tienes ninguna tarea todavía")).toBeInTheDocument();
});

test("Slider change Hour", async () => {
  const { container, getByTestId, getByDisplayValue, debug, getByText } =
    render(<Plant />);
  //Check visibility hour display
  expect(getByTestId("hour")).toBeInTheDocument();
  expect(getByTestId("minute")).toBeInTheDocument();

  const firstSlider = container.getElementsByClassName("rc-slider-track")[0];
  //Total sliders view
  expect(container.getElementsByClassName("rc-slider-track").length).toBe(2);
  //debug();
  //Check position slider in hour
  expect(getByText("17")).toBeInTheDocument();
  expect(firstSlider).toHaveStyle({
    right: "auto",
    width: "73.91304347826086%",
  });
});
