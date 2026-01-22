export interface IBottle {
  id: number;
  title: string;
  liquid: string;
  pwm: number;
  timeCalibration: number;
}

export interface ICocktail {
  id: string;
  name: string;
  description?: string;
  recipe?: {
    liquid: string;
    quantity: number; // in ml
  }[];
}

// Hardware cocktail format (what the ESP32 returns)
export interface IHardwareCocktail {
  name: string;
  ingredients: Array<{
    name: string;
    quantity: number;
  }>;
}

export type TabType = 'drinks' | 'config' | 'manual';
