import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest';
import { useDrinksPage } from './use-drinks-page';
import { drinksService } from '@/pages/drinks/services/drinks.service';
import { availableCocktails } from '@/pages/drinks/data/cocktails.data';
import { IHardwareCocktail } from '@/pages/drinks/models/drinks-model';


vi.mock('@/pages/drinks/services/drinks.service');
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
        // Use first cocktail from mock data
        const mockCocktail = availableCocktails[0];
        const hardwareCocktails: IHardwareCocktail[] = [
            { name: mockCocktail.name, ingredients: mockCocktail.recipe!.map(r => ({ name: r.liquid, quantity: r.quantity })) }
        ];
        const expectedCocktails = [mockCocktail];

        mockedDrinksService.getCocktails.mockResolvedValueOnce(hardwareCocktails);

        const { result } = renderHook(() => useDrinksPage());

        // Wait for fetching to complete
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.cocktails).toEqual(expectedCocktails);
    });

    it('should handle drink selection', async () => {
        // Use second cocktail from mock data
        const mockCocktail = availableCocktails[1];
        const hardwareCocktails: IHardwareCocktail[] = [
            { name: mockCocktail.name, ingredients: mockCocktail.recipe!.map(r => ({ name: r.liquid, quantity: r.quantity })) }
        ];

        mockedDrinksService.getCocktails.mockResolvedValueOnce(hardwareCocktails);

        const { result } = renderHook(() => useDrinksPage());

        await waitFor(() => expect(result.current.loading).toBe(false));

        act(() => {
            result.current.selectCocktail(result.current.cocktails[0]);
        });

        expect(result.current.selectedCocktailForConfirm).toEqual(result.current.cocktails[0]);
        expect(mockedDrinksService.sendControlCommand).toHaveBeenCalledWith(`goto:${mockCocktail.id}`);
    });

    it('should update cocktail and re-fetch list', async () => {
        mockedDrinksService.saveCocktail.mockResolvedValueOnce({ success: true });
        mockedDrinksService.getCocktails.mockResolvedValueOnce([]); // Initial fetch
        mockedDrinksService.getCocktails.mockResolvedValueOnce([]); // Re-fetch after save

        const { result } = renderHook(() => useDrinksPage());

        await waitFor(() => expect(result.current.loading).toBe(false));

        // Use data from mock cocktails
        const testIngredients = availableCocktails[0].recipe!.map(r => ({ name: r.liquid, quantity: r.quantity }));

        await act(async () => {
            await result.current.updateCocktail(availableCocktails[0].name, testIngredients);
        });

        expect(mockedDrinksService.saveCocktail).toHaveBeenCalledWith(
            availableCocktails[0].name,
            testIngredients
        );
        expect(mockedDrinksService.getCocktails).toHaveBeenCalledTimes(2); // Initial + reload
    });
});
