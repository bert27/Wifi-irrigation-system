export interface Bottle {
  id: number;
  title: string;
  liquid: string;
  pwm: number;
  timeCalibration: number;
}

export interface Cocktail {
  id: string;
  name: string;
  description?: string;
  recipe?: {
    liquid: string;
    quantity: number; // in ml
  }[];
}

export type TabType = 'drinks' | 'config' | 'manual';
