export interface IRobotSendStatus {
  ledState?: boolean;
  motorState?: string; // "FORWARD", "BACKWARD", "STOP", "LEFT", "RIGHT"
  robotGyroscopeValues?: number[]; // [pitch, roll, yaw]
  robotGyroscope?: string; // e.g. "LEVEL", "TILTED"
}

export interface IRemoteControlReceiveStatus {
  joystickDirection?: string; // "Arriba", "Abajo", "Izquierda", "Derecha", "CENTER"
  buttonState?: string; // "on" | "off"
  remoteGyroscopeValues?: number[]; // [x, y, z] from remote
  remoteGyroscope?: string; // e.g. "LEVEL"
}

export interface IDashboardState {
  robot: IRobotSendStatus;
  remote: IRemoteControlReceiveStatus;
}

export interface IColorData {
  color: string;
}

export interface IOutputData {
  name: string;
  colorLabel: string;
  pin: number;
  state: number;
}
