interface ConsoleComponentProps {
  message: string;
}
export const ConsoleComponent = (props: ConsoleComponentProps) => {
  const { message } = props;
  return (
    <div
      style={{
        background: "black",
        color: "white",
        padding: "1em",
        marginBottom: "0.4em",
      }}
    >
      Message from ESP8266: {message}
    </div>
  );
};
