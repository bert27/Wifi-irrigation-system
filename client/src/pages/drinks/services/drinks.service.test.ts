import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { drinksService } from './drinks.service';
import { directionWebDrinks } from '@/config/api.config';

vi.mock('axios');
const mockedAxios = axios as any;

describe('drinksService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock window.location to avoid JSDOM navigation error
        vi.stubGlobal('location', { reload: vi.fn() });
    });

    describe('getCocktails', () => {
        it('should fetch cocktails from the correct endpoint', async () => {
            const mockData = [{ name: 'Margarita', ingredients: [] }];
            mockedAxios.get.mockResolvedValueOnce({ status: 200, data: mockData });

            const result = await drinksService.getCocktails();

            expect(mockedAxios.get).toHaveBeenCalledWith(`${directionWebDrinks}/drinks/cocktails`);
            expect(result).toEqual(mockData);
        });

        it('should throw an error if the response status is 400 or higher', async () => {
            mockedAxios.get.mockResolvedValueOnce({ status: 404, statusText: 'Not Found' });

            await expect(drinksService.getCocktails()).rejects.toThrow('Not Found');
        });
    });

    describe('saveCocktail', () => {
        it('should post cocktail data to the correct endpoint', async () => {
            const name = 'New Drink';
            const ingredients = [{ name: 'Water', quantity: 100 }];
            mockedAxios.post.mockResolvedValueOnce({ status: 200, data: { success: true } });

            const result = await drinksService.saveCocktail(name, ingredients);

            expect(mockedAxios.post).toHaveBeenCalledWith(
                `${directionWebDrinks}/drinks/save-cocktail`,
                { name, ingredients }
            );
            expect(result).toEqual({ success: true });
        });
    });

    describe('sendControlCommand', () => {
        it('should send a navigation command correctly', async () => {
            mockedAxios.get.mockResolvedValueOnce({ status: 200, data: 'OK' });

            await drinksService.sendControlCommand('next');

            expect(mockedAxios.get).toHaveBeenCalledWith(
                `${directionWebDrinks}/drinks/navigation`,
                { params: { direction: 'next' } }
            );
        });
    });
});
