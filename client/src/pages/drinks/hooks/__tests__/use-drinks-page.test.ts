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

describe('useDrinksPage hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with default cocktails', () => {
        const { result } = renderHook(() => useDrinksPage());
        expect(result.current.cocktails).toEqual(availableCocktails);
    });

    it('should fetch cocktails from hardware on mount', async () => {
        const hardwareCocktails = [
            { name: 'Hardware Mojito', ingredients: [{ name: 'Mint', quantity: 10 }] }
        ];
        mockedDrinksService.getCocktails.mockResolvedValueOnce(hardwareCocktails);

        renderHook(() => useDrinksPage());

        await waitFor(() => {
            expect(mockedDrinksService.getCocktails).toHaveBeenCalled();
        });
    });

    it('should handle drink selection', async () => {
        const { result } = renderHook(() => useDrinksPage());
        const firstCocktail = availableCocktails[0];

        act(() => {
            result.current.selectCocktail(firstCocktail);
        });

        expect(result.current.selectedCocktailForConfirm).toEqual(firstCocktail);
        expect(mockedDrinksService.sendControlCommand).toHaveBeenCalledWith(`goto:1`);
    });

    it('should update cocktail and re-fetch list', async () => {
        mockedDrinksService.saveCocktail.mockResolvedValueOnce({ success: true });
        mockedDrinksService.getCocktails.mockResolvedValueOnce([]); // Re-fetch mock

        const { result } = renderHook(() => useDrinksPage());

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
