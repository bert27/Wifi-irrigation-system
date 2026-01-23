import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DrinksPage } from './drinks-page';
import { useDrinksPage } from './hooks/use-drinks-page';
import { ICocktail } from '@/pages/drinks/models/drinks-model';
import "@testing-library/jest-dom";

// Mock the hook
vi.mock('./hooks/use-drinks-page');
const mockedUseDrinksPage = useDrinksPage as import('vitest').Mock;

// Mock child components to isolate DrinksPage
vi.mock('./components/layout/drinks-background', () => ({
    DrinksBackground: () => <div data-testid="drinks-background" />
}));

vi.mock('./components/layout/drinks-header', () => ({
    DrinksHeader: () => <div data-testid="drinks-header">Drinks Header</div>
}));

vi.mock('./pages/drinks-tab/drinks-tab-page', () => ({
    DrinksTabPage: ({ onSelectCocktail, cocktails }: any) => (
        <div data-testid="drinks-tab-page">
            {cocktails.map((c: ICocktail) => (
                <button key={c.id} onClick={() => onSelectCocktail(c)}>{c.name}</button>
            ))}
        </div>
    )
}));

vi.mock('./pages/cocktails-config-tab/cocktails-config-tab-page', () => ({
    CocktailsConfigTabPage: () => <div data-testid="cocktails-config-tab-page">Config Tab</div>
}));

vi.mock('./pages/pumps-config-tab/pumps-config-tab-page', () => ({
    PumpsConfigTabPage: () => <div data-testid="pumps-config-tab-page">Manual Tab</div>
}));

// Mock SimulationAlert
vi.mock('@/components/simulation-alert/simulation-alert', () => ({
    SimulationAlert: ({ isMock }: { isMock: boolean }) => isMock ? <div data-testid="simulation-alert">Simulation Mode</div> : null
}));

describe('DrinksPage Component', () => {
    const mockCocktails: ICocktail[] = [
        { id: '1', name: 'Margarita', recipe: [] },
        { id: '2', name: 'Martini', recipe: [] }
    ];

    const defaultHookValue = {
        activeTab: 'drinks',
        bottles: [],
        cocktails: mockCocktails,
        message: '',
        showMessage: false,
        setShowMessage: vi.fn(),
        handleTabChange: vi.fn(),
        selectCocktail: vi.fn(),
        updatePump: vi.fn(),
        updateCocktail: vi.fn(),
        sendPumpCommand: vi.fn(),
        sendCommand: vi.fn(),
        selectedIndex: -1,
        selectedCocktailForConfirm: null,
        confirmCocktail: vi.fn(),
        cancelCocktailSelection: vi.fn(),
        isMock: false,
        loading: false
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseDrinksPage.mockReturnValue(defaultHookValue);
    });

    it('should render basic layout elements', () => {
        render(<DrinksPage />);

        expect(screen.getByTestId('drinks-header')).toBeInTheDocument();
        expect(screen.getByTestId('drinks-background')).toBeInTheDocument();
        expect(screen.getByText('drinks.tabs.drinks')).toBeInTheDocument();
    });

    it('should show simulation alert when in mock mode', () => {
        mockedUseDrinksPage.mockReturnValue({ ...defaultHookValue, isMock: true });
        render(<DrinksPage />);

        expect(screen.getByTestId('simulation-alert')).toBeInTheDocument();
    });

    it('should render the correct tab content based on activeTab', () => {
        const { rerender } = render(<DrinksPage />);
        expect(screen.getByTestId('drinks-tab-page')).toBeInTheDocument();

        mockedUseDrinksPage.mockReturnValue({ ...defaultHookValue, activeTab: 'config' });
        rerender(<DrinksPage />);
        expect(screen.getByTestId('cocktails-config-tab-page')).toBeInTheDocument();

        mockedUseDrinksPage.mockReturnValue({ ...defaultHookValue, activeTab: 'manual' });
        rerender(<DrinksPage />);
        expect(screen.getByTestId('pumps-config-tab-page')).toBeInTheDocument();
    });

    it('should call handleTabChange when a tab is clicked', () => {
        const handleTabChange = vi.fn();
        mockedUseDrinksPage.mockReturnValue({ ...defaultHookValue, handleTabChange });

        render(<DrinksPage />);

        const configTab = screen.getByText('drinks.tabs.config');
        fireEvent.click(configTab);

        expect(handleTabChange).toHaveBeenCalledWith('config');
    });

    it('should call selectCocktail when a drink is clicked in the drinks tab', () => {
        const selectCocktail = vi.fn();
        mockedUseDrinksPage.mockReturnValue({ ...defaultHookValue, selectCocktail });

        render(<DrinksPage />);

        const margaritaBtn = screen.getByText('Margarita');
        fireEvent.click(margaritaBtn);

        expect(selectCocktail).toHaveBeenCalledWith(mockCocktails[0]);
    });

    it('should render confirmation modal when a cocktail is selected', () => {
        mockedUseDrinksPage.mockReturnValue({
            ...defaultHookValue,
            selectedCocktailForConfirm: mockCocktails[0]
        });

        render(<DrinksPage />);

        expect(screen.getByText('drinks.confirm.question')).toBeInTheDocument();
        expect(screen.getByTestId('selected-cocktail-name')).toHaveTextContent('drinks.cocktails.margarita');
    });
});
