export interface PumpConfig {
  id: number;
  title: string;
  liquid: string;
  pwm: number;
  timeCalibration: number;
}

export interface Drink {
  id: string;
  name: string;
}

export type TabType = 'drinks' | 'config' | 'manual';
