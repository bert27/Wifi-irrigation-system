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
}

export type TabType = 'drinks' | 'config' | 'manual';
