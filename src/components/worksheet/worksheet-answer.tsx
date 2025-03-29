import { answerTypeAtom } from "@/atoms/options";
import { NUMBER_SIGN_LIST } from "@/libs/constants";
import { useQuerySelectedAnswers } from "@/libs/q-a-data-queries";
import { useAtom } from "jotai";
import { QRCodeSVG } from "qrcode.react";
import type { FC } from "react";
import { tv } from "tailwind-variants";
import { Popover } from "../ui";

const answerStyle = tv({
  slots: {
    area: "mt-4 border-t-2 border-dotted border-black px-4 pt-4 pb-0",
    list: "flex flex-row flex-wrap gap-1",
  },
  variants: {
    type: {
      front: {
        area: "p-4",
      },
      back: {
        area: "mt-20 p-0 pt-4",
        list: "rotate-180",
      },
    },
  },
});

type AnswerProps = {
  backSide?: boolean;
};

export const Answer: FC<AnswerProps> = ({ backSide }) => {
  const [answerType] = useAtom(answerTypeAtom);
  const type = [...answerType].pop() as
    | "none"
    | "front"
    | "back"
    | "code"
    | undefined;

  switch (type) {
    default:
    case "none":
      return null;
    case "front":
      return <AnswerList type={type} backSide={backSide} />;
    case "back":
      return <AnswerList type={type} backSide={backSide} />;
    case "code":
      return backSide ? <AnswerQR /> : null;
  }
};

export const AnswerList: FC<AnswerProps & { type: "front" | "back" }> = ({
  backSide,
  type,
}) => {
  const { area, list } = answerStyle({ type });
  const answers = useQuerySelectedAnswers();

  const overwrite = !backSide && type === "back" ? "text-transparent" : "";

  return (
    <div className={area()}>
      <ol className={list({ class: overwrite })}>
        {answers.map((answer, index) => {
          return (
            <li key={`answer-${index}`}>
              {NUMBER_SIGN_LIST[index]}
              {answer.join("/")}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export const AnswerQR = () => {
  const answers = useQuerySelectedAnswers();

  const answerList = answers.map((answer, index) => {
    return `${NUMBER_SIGN_LIST[index]}${answer.join("/")}`;
  });

  const answerText = answerList ? answerList.join("\n") : "no data";

  return (
    <Popover>
      <Popover.Trigger aria-label="Open Popover">
        <QRCodeSVG value={answerText} size={128} />
      </Popover.Trigger>
      <Popover.Content className="sm:max-w-72 print:hidden" placement="left">
        <Popover.Header>
          <Popover.Description>
            <ol>
              {answerList?.map((answer, index) => {
                return <li key={`answer-${index}`}>{answer}</li>;
              })}
            </ol>
          </Popover.Description>
        </Popover.Header>
      </Popover.Content>
    </Popover>
  );
};
