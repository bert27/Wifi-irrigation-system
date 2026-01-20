import { useEffect } from "react";

interface UseKeyboardNavigationProps {
    activeTab: string;
    onSend: (direction: string) => void;
}

export const useKeyboardNavigation = ({ activeTab, onSend }: UseKeyboardNavigationProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Allow global control or restrict by tab? Currently mimicking existing logic
            if (activeTab !== 'drinks' && activeTab !== 'manual') return;

            switch (e.key) {
                case "ArrowUp":
                    e.preventDefault();
                    onSend("up");
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    onSend("down");
                    break;
                case "Enter":
                case " ": // Spacebar
                    e.preventDefault();
                    onSend("accept");
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    onSend("back");
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    onSend("next");
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onSend, activeTab]);
};
