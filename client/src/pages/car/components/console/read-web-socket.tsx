import React, { useCallback, useEffect, useState } from "react";
import { ConsoleComponent } from "./console-component";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Typography } from "@mui/material";
import { directionWebRobot } from "@/config/api.config";

const urlEsp8266 = directionWebRobot.replace(/^http/, 'ws') + '/ws/remote';

interface Message {
  data: string;
}

export const ReadWebSocket: React.FC = () => {
  const [socketUrl, setSocketUrl] = useState<string>(urlEsp8266);
  const [messageHistory, setMessageHistory] = useState<MessageEvent[]>([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      console.log("lastMessage", lastMessage);
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl(urlEsp8266),
    []
  );

  const handleClickSendMessage = useCallback(() => sendMessage("Hello"), [sendMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  console.log("readyState", connectionStatus);

  return (
    <div className="glass-effect" style={{ padding: '1rem', borderRadius: '15px', color: 'var(--text-main)' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={handleClickChangeSocketUrl}
          style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
        >
          Reset Socket URL
        </button>
        <button
          onClick={handleClickSendMessage}
          disabled={readyState !== ReadyState.OPEN}
          style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', opacity: readyState === ReadyState.OPEN ? 1 : 0.5 }}
        >
          Send 'Hello'
        </button>
      </div>

      <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        Status: <span style={{ color: readyState === ReadyState.OPEN ? 'var(--accent)' : 'var(--secondary)' }}>{connectionStatus}</span>
      </div>

      {lastMessage && (
        <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
          Last message: {lastMessage.data}
        </div>
      )}

      <div style={{ marginTop: '1rem', maxHeight: '150px', overflowY: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '0.5rem' }}>
        <Typography variant="caption" style={{ display: 'block', color: 'var(--text-muted)' }}>Historial:</Typography>
        {messageHistory.map((message, idx) => (
          <div key={idx} style={{ fontSize: '0.75rem', fontFamily: 'var(--font-tech)' }}>
            {message ? message.data.toString() : null}
          </div>
        ))}
      </div>
      <ConsoleComponent message={{
        robot: { robotGyroscopeValues: [0, 0, 0] },
        remote: { joystickDirection: "N/A", remoteGyroscopeValues: [0, 0, 0] }
      }} />
    </div>
  );
};
