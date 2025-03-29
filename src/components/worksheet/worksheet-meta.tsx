import {
  dateBoxVisibilityAtom,
  nameBoxVisibilityAtom,
  scoreBoxVisibilityAtom,
} from "@/atoms/options";
import { useAtom } from "jotai";
import { FC } from "react";
import { tv } from "tailwind-variants";

const boxStyle = tv({
  base: "border-x-2 border-black last-of-type:border-b-2",
  variants: {
    size: {
      normal: "h-20",
      large: "h-50",
    },
  },
});

type BoxProps = {
  title: string;
  size: "normal" | "large";
};

const Box: FC<BoxProps> = ({ title, size }) => {
  return (
    <>
      <div className="border-2 border-black p-2">{title}</div>
      <div className={boxStyle({ size })}></div>
    </>
  );
};

const DateBox = () => {
  const [dateBoxVisibility] = useAtom(dateBoxVisibilityAtom);
  if (!dateBoxVisibility) {
    return null;
  }
  return <Box title="日付" size="normal" />;
};

const NameBox = () => {
  const [nameBoxVisibility] = useAtom(nameBoxVisibilityAtom);
  if (!nameBoxVisibility) {
    return null;
  }
  return <Box title="名前" size="large" />;
};

const ScoreBox = () => {
  const [scoreBoxVisibility] = useAtom(scoreBoxVisibilityAtom);
  if (!scoreBoxVisibility) {
    return null;
  }
  return <Box title="点数" size="normal" />;
};

export const MetaBox = () => {
  return (
    <div>
      <DateBox />
      <NameBox />
      <ScoreBox />
    </div>
  );
};
