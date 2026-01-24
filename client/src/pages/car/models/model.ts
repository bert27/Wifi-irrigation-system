export interface IRobotSendStatus {
  ledState?: boolean;
  motorState?: string; // "FORWARD", "BACKWARD", "STOP", "LEFT", "RIGHT"
  robotGyroscopeValues?: number[]; // [pitch, roll, yaw]
  robotGyroscope?: string; // e.g. "LEVEL", "TILTED"
}

export interface IRemoteControlReceiveStatus {
  joystickDirection?: string; // "Arriba", "Abajo", "Izquierda", "Derecha", "CENTER"
  buttonJostick?: string; // "on" | "off"
  remoteGyroscopeValues?: number[]; // [x, y, z] from remote
  temperature?: number;
  altitude?: number;
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
  name?: string;
  nameKey?: string; // For i18n
  colorLabel: string;
  pin: number;
  state: number;
}
