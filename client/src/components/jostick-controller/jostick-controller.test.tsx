import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { JostickController } from "./jostick-controller";
import "@testing-library/jest-dom";

describe("JostickController", () => {
    const defaultMessage = {
        joystickDirection: "IDLE",
        buttonJostick: "off",
        remoteGyroscope: "LEVEL",
    };

    const mockOnDirection = vi.fn();

    it("renders all control buttons", () => {
        render(
            <JostickController
                recibedMessage={defaultMessage}
                onDirection={mockOnDirection}
            />
        );

        expect(screen.getByTestId("joystick-arriba")).toBeInTheDocument();
        expect(screen.getByTestId("joystick-abajo")).toBeInTheDocument();
        expect(screen.getByTestId("joystick-izquierda")).toBeInTheDocument();
        expect(screen.getByTestId("joystick-derecha")).toBeInTheDocument();
        expect(screen.getByTestId("joystick-center")).toBeInTheDocument();
    });

    it("calls onDirection with 'Arriba' when the top button is clicked", () => {
        render(
            <JostickController
                recibedMessage={defaultMessage}
                onDirection={mockOnDirection}
            />
        );

        fireEvent.click(screen.getByTestId("joystick-arriba"));
        expect(mockOnDirection).toHaveBeenCalledWith("Arriba");
    });

    it("calls onDirection with 'Abajo' when the bottom button is clicked", () => {
        render(
            <JostickController
                recibedMessage={defaultMessage}
                onDirection={mockOnDirection}
            />
        );

        fireEvent.click(screen.getByTestId("joystick-abajo"));
        expect(mockOnDirection).toHaveBeenCalledWith("Abajo");
    });

    it("calls onDirection with 'Izquierda' when the left button is clicked", () => {
        render(
            <JostickController
                recibedMessage={defaultMessage}
                onDirection={mockOnDirection}
            />
        );

        fireEvent.click(screen.getByTestId("joystick-izquierda"));
        expect(mockOnDirection).toHaveBeenCalledWith("Izquierda");
    });

    it("calls onDirection with 'Derecha' when the right button is clicked", () => {
        render(
            <JostickController
                recibedMessage={defaultMessage}
                onDirection={mockOnDirection}
            />
        );

        fireEvent.click(screen.getByTestId("joystick-derecha"));
        expect(mockOnDirection).toHaveBeenCalledWith("Derecha");
    });

    it("calls onDirection with 'CENTER' when the center button is clicked", () => {
        render(
            <JostickController
                recibedMessage={defaultMessage}
                onDirection={mockOnDirection}
            />
        );

        fireEvent.click(screen.getByTestId("joystick-center"));
        expect(mockOnDirection).toHaveBeenCalledWith("CENTER");
    });

    it("highlights the 'Arriba' button when joystickDirection is 'Arriba'", () => {
        const activeMessage = { ...defaultMessage, joystickDirection: "Arriba" };
        render(
            <JostickController
                recibedMessage={activeMessage}
                onDirection={mockOnDirection}
            />
        );

        expect(screen.getByTestId("joystick-arriba")).toHaveClass("active");
    });

    it("highlights the 'Izquierda' button when remoteGyroscope is 'Izquierda'", () => {
        const activeMessage = { ...defaultMessage, remoteGyroscope: "Izquierda" };
        render(
            <JostickController
                recibedMessage={activeMessage}
                onDirection={mockOnDirection}
            />
        );

        expect(screen.getByTestId("joystick-izquierda")).toHaveClass("active");
    });

    it("highlights the center button when buttonJostick is 'on'", () => {
        const activeMessage = { ...defaultMessage, buttonJostick: "on" };
        render(
            <JostickController
                recibedMessage={activeMessage}
                onDirection={mockOnDirection}
            />
        );

        expect(screen.getByTestId("joystick-center")).toHaveClass("active");
    });

    it("applies the provided id to the container", () => {
        render(
            <JostickController
                id="custom-joystick-id"
                recibedMessage={defaultMessage}
                onDirection={mockOnDirection}
            />
        );

        const container = screen.getByTestId("jostick-container");
        expect(container).toHaveAttribute("id", "custom-joystick-id");
    });
});
