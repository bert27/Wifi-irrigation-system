import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Plant } from "../Plant";
import axios from "axios";
jest.mock("axios");

test("renders texts ok", () => {
  const { getByText } = render(<Plant />);
  expect(getByText("Planta")).toBeInTheDocument();
  expect(getByText("Sin conexión")).toBeInTheDocument();
  expect(getByText("Tareas Programadas:")).toBeInTheDocument();
  expect(getByText("Añade este riego")).toBeInTheDocument();
});
test("mock Axios", async () => {
  const returnList =
    "Miercoles-17-30/Miercoles-17-30/Jueves-17-30/Miercoles-17-30/Jueves-17-30/Miercoles-17-21/Jueves-17-21/Lunes-10-34/Martes-10-34/--/--/--/--/--/--/--/--/--/--/--/";
  axios.get.mockReturnValueOnce(returnList);

  const { getByText } = await render(<Plant />);
  const resultAxios = getByText("Mi");
  expect(resultAxios).toBeInTheDocument();
});
test("test create Task", async () => {
  const { container, getByText } = render(<Plant />);

  fireEvent.click(container.querySelector(".button_plant"));
  expect(getByText("Selecciona un día o varios")).toBeInTheDocument();
});
