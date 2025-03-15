import { titleAtom } from "@/atoms/options";
import { useAtom } from "jotai";

export const Title = () => {
  const [title] = useAtom(titleAtom);
  return (
    <div className="px-4 text-2xl [writing-mode:vertical-rl]">{title}</div>
  );
};
