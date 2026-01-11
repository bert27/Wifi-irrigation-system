export interface SliderProps {
  value: number;
  onChange: (value: number | number[]) => void;
  enabled: boolean;
  WarningMessage?: () => void;
  max?: number;
  min?: number;
  size?: string;
  step?: number;
}
