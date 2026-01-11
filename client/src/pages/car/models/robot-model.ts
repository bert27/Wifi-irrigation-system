export interface RobotStatus {
  ledState?: boolean;
  jostickDirection?: string;
  giroscope?: string;
  giroscopeValues?: number[];
  buttonState?: string;
}

export type ResponseWebSocketInterface = RobotStatus;

export interface ColorData {
  color: string;
}

export interface OutputData {
  name: string;
  colorLabel: string;
  pin: number;
  state: number;
}
