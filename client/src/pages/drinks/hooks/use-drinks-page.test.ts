import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest';
import { useDrinksPage } from './use-drinks-page';
import { drinksService } from '@/pages/drinks/services/drinks.service';
import { MOCK_COCKTAILS } from '@/pages/drinks/mocks/cocktails.data';
import { IHardwareCocktail, ICocktail } from '@/pages/drinks/models/drinks-model';


vi.mock('@/pages/drinks/services/drinks.service');
const mockedDrinksService = drinksService as Mocked<typeof drinksService>;

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useParams: vi.fn(() => ({ tabId: 'drinks' })),
    useNavigate: () => mockNavigate,
}));

// Mock connectivity context
vi.mock('@/context/connectivity-context', () => ({
    useConnectivity: () => ({
        setConnectionStatus: vi.fn(),
        getConnectionStatus: vi.fn(() => ({ status: 'connected' })),
    }),
}));

describe('useDrinksPage hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Setup default successful fetch to avoid unhandled promises
        mockedDrinksService.getCocktails.mockResolvedValue([]);
    });

    it('should initialize and fetch cocktails on mount', async () => {
        const mockCocktail = MOCK_COCKTAILS[0];
        const hardwareCocktails: IHardwareCocktail[] = [
            { name: mockCocktail.name, ingredients: mockCocktail.recipe!.map((r: any) => ({ name: r.liquid, quantity: r.quantity })) }
        ];

        // Expected data should match how the hook maps hardware response
        const expectedCocktails = [{
            id: mockCocktail.id,
            name: mockCocktail.name,
            recipe: mockCocktail.recipe
        }];

        mockedDrinksService.getCocktails.mockResolvedValueOnce(hardwareCocktails);

        const { result } = renderHook(() => useDrinksPage());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.cocktails).toEqual(expectedCocktails);
    });

    it('should handle tab changes', async () => {
        const { result } = renderHook(() => useDrinksPage());

        await waitFor(() => expect(result.current.loading).toBe(false));

        act(() => {
            result.current.handleTabChange('config');
        });
        expect(mockNavigate).toHaveBeenCalledWith('/drinks/cocktails-config');

        act(() => {
            result.current.handleTabChange('manual');
        });
        expect(mockNavigate).toHaveBeenCalledWith('/drinks/pumps-config');
    });

    it('should handle drink selection', async () => {
        // Use MOCK_COCKTAILS[1] but ensure hardwareCocktails mock reflects it
        const mockCocktail = MOCK_COCKTAILS[1];
        const hardwareCocktails: IHardwareCocktail[] = [
            { name: MOCK_COCKTAILS[0].name, ingredients: MOCK_COCKTAILS[0].recipe!.map((r: any) => ({ name: r.liquid, quantity: r.quantity })) },
            { name: mockCocktail.name, ingredients: mockCocktail.recipe!.map((r: any) => ({ name: r.liquid, quantity: r.quantity })) }
        ];

        mockedDrinksService.getCocktails.mockResolvedValueOnce(hardwareCocktails);

        const { result } = renderHook(() => useDrinksPage());

        await waitFor(() => expect(result.current.loading).toBe(false));

        act(() => {
            result.current.selectCocktail(result.current.cocktails[1]);
        });

        expect(result.current.selectedCocktailForConfirm).toEqual(result.current.cocktails[1]);
        expect(mockedDrinksService.sendControlCommand).toHaveBeenCalledWith(`goto:${mockCocktail.id}`);
    });

    it('should confirm cocktail and clear selection', async () => {
        const { result } = renderHook(() => useDrinksPage());
        await waitFor(() => expect(result.current.loading).toBe(false));

        const mockCocktail = MOCK_COCKTAILS[0];
        act(() => {
            result.current.selectCocktail(mockCocktail as ICocktail);
        });

        await act(async () => {
            await result.current.confirmCocktail();
        });

        expect(mockedDrinksService.sendControlCommand).toHaveBeenCalledWith('accept');
        expect(result.current.selectedCocktailForConfirm).toBeNull();
    });

    it('should cancel cocktail selection', async () => {
        const { result } = renderHook(() => useDrinksPage());
        await waitFor(() => expect(result.current.loading).toBe(false));

        const mockCocktail = MOCK_COCKTAILS[0];
        act(() => {
            result.current.selectCocktail(mockCocktail as ICocktail);
        });

        await act(async () => {
            await result.current.cancelCocktailSelection();
        });

        expect(mockedDrinksService.sendControlCommand).toHaveBeenCalledWith('back');
        expect(result.current.selectedCocktailForConfirm).toBeNull();
    });

    it('should update cocktail and re-fetch list', async () => {
        mockedDrinksService.saveCocktail.mockResolvedValueOnce({ success: true });
        mockedDrinksService.getCocktails.mockResolvedValueOnce([]); // Initial fetch
        mockedDrinksService.getCocktails.mockResolvedValueOnce([]); // Re-fetch after save

        const { result } = renderHook(() => useDrinksPage());

        await waitFor(() => expect(result.current.loading).toBe(false));

        const testIngredients = MOCK_COCKTAILS[0].recipe!.map((r: any) => ({ name: r.liquid, quantity: r.quantity }));

        await act(async () => {
            await result.current.updateCocktail(MOCK_COCKTAILS[0].name, testIngredients);
        });

        expect(mockedDrinksService.saveCocktail).toHaveBeenCalledWith(
            MOCK_COCKTAILS[0].name,
            testIngredients
        );
        expect(mockedDrinksService.getCocktails).toHaveBeenCalledTimes(2);
    });
});
