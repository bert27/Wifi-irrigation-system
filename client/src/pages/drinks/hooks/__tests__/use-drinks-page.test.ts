import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest';
import { useDrinksPage } from '../use-drinks-page';
import { drinksService } from '@/services/drinks.service';
import { availableCocktails } from '@/pages/drinks/data/cocktails.data';

vi.mock('@/services/drinks.service');
const mockedDrinksService = drinksService as Mocked<typeof drinksService>;

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
    useParams: () => ({ tabRouter: 'drinks' }),
    useNavigate: () => vi.fn(),
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
        const hardwareCocktails = [
            { name: 'Hardware Mojito', ingredients: [{ name: 'Mint', quantity: 10 }] }
        ];
        const expectedCocktails = [
            { id: '1', name: 'Hardware Mojito', recipe: [{ liquid: 'Mint', quantity: 10 }] }
        ];
        mockedDrinksService.getCocktails.mockResolvedValueOnce(hardwareCocktails);

        const { result } = renderHook(() => useDrinksPage());

        // Wait for fetching to complete
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.cocktails).toEqual(expectedCocktails);
    });

    it('should handle drink selection', async () => {
        const hardwareCocktails = [
            { name: 'Hardware Mojito', ingredients: [{ name: 'Mint', quantity: 10 }] }
        ];
        mockedDrinksService.getCocktails.mockResolvedValueOnce(hardwareCocktails);

        const { result } = renderHook(() => useDrinksPage());

        await waitFor(() => expect(result.current.loading).toBe(false));

        act(() => {
            result.current.selectCocktail(result.current.cocktails[0]);
        });

        expect(result.current.selectedCocktailForConfirm).toEqual(result.current.cocktails[0]);
        expect(mockedDrinksService.sendControlCommand).toHaveBeenCalledWith(`goto:1`);
    });

    it('should update cocktail and re-fetch list', async () => {
        mockedDrinksService.saveCocktail.mockResolvedValueOnce({ success: true });
        mockedDrinksService.getCocktails.mockResolvedValueOnce([]); // Initial fetch
        mockedDrinksService.getCocktails.mockResolvedValueOnce([]); // Re-fetch after save

        const { result } = renderHook(() => useDrinksPage());

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(async () => {
            await result.current.updateCocktail('Some Drink', [{ name: 'Ingredient', quantity: 50 }]);
        });

        expect(mockedDrinksService.saveCocktail).toHaveBeenCalledWith(
            'Some Drink',
            [{ name: 'Ingredient', quantity: 50 }]
        );
        expect(mockedDrinksService.getCocktails).toHaveBeenCalledTimes(2); // Initial + reload
    });
});
