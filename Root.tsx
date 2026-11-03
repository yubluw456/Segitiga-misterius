import { Composition } from "remotion";
import { SegitigaMisterius } from "./video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SegitigaMisterius"
        component={SegitigaMisterius}
        durationInFrames={1080}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
