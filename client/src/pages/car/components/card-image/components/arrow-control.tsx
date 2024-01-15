import { ResponseWebSocketInterface } from "../../../car-page";
import { ButtonImage } from "./button-image";
export interface ArrowControlProps {
  data: {
    name: string;
    image: string;
  };
  recibedMessage: ResponseWebSocketInterface;
  id: string;
}
export const ArrowControl = (props: ArrowControlProps) => {
  const { data, recibedMessage, id } = props;
  const { jostickDirection } = recibedMessage;

  return (
    <>
      {jostickDirection === id ? (
        <div style={{ background: "blue" }}>
          <ButtonImage data={data} />
        </div>
      ) : (
        <ButtonImage data={data} />
      )}
    </>
  );
};
