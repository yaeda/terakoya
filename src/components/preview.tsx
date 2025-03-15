import { Worksheet } from "./worksheet/worksheet";

export const Preview = () => {
  return (
    <div className="h-fit w-fit origin-top-left overflow-hidden shadow-2xl">
      <Worksheet />
    </div>
  );
};
