import { answerTypeAtom, readWriteAtom } from "@/atoms/options";
import { NUMBER_SIGN_LIST } from "@/libs/constants";
import { hira2kata } from "@/libs/japanese";
import { useQuerySelectedQAData } from "@/libs/q-a-data-queries";
import type { Token } from "@/libs/text-parser";
import clsx from "clsx";
import { useAtom } from "jotai";
import type { CSSProperties, FC } from "react";
import type { ClassNameValue } from "tailwind-merge";
import { Answer, AnswerQR } from "./worksheet-answer";
import { MetaBox } from "./worksheet-meta";
import { Title } from "./worksheet-title";

// prettier-ignore
const ORDER_ALIGNMENT = [
  10,  9,  8,  7,  6,  5,  4,  3,  2,  1,
  20, 19, 18, 17, 16, 15, 14, 13, 12, 11
]

const BackSide = () => {
  const [answerType] = useAtom(answerTypeAtom);

  if (!answerType.includes("back")) {
    return null;
  }

  return (
    <div className="hidden aspect-210/297 w-[210mm] break-before-page flex-col justify-end overflow-hidden p-4 print:flex">
      <Answer backSide />
    </div>
  );
};

type BlankTextProps = {
  text: string;
  hint?: string;
};

const BlankText: FC<BlankTextProps> = ({ text, hint }) => {
  const [readWrite] = useAtom(readWriteAtom);
  if (readWrite === "read") {
    return <span className="border-r-2 border-black">{text}</span>;
  } else {
    return (
      <span
        className={clsx(
          "border-r-2 border-black",
          !hint && "px-1 text-transparent",
        )}
      >
        {hint ? hira2kata(hint) : text}
      </span>
    );
  }
};

type TTextProps = {
  className: ClassNameValue;
  text: Token[];
};

const TText: FC<TTextProps> = ({ className, text }) => {
  const tokens = text;
  return (
    <span className={clsx(className)}>
      {tokens.map((token) => {
        if (token.ruby) {
          return (
            <ruby key={`${token.text}`}>
              {token.text} <rp>(</rp>
              <rt>{token.ruby}</rt>
              <rp>)</rp>
            </ruby>
          );
        } else if (token.isBlank) {
          return (
            <BlankText
              key={`${token.text}`}
              text={token.text}
              hint={token.hint}
            />
          );
        } else {
          return token.text;
        }
      })}
    </span>
  );
};

const padArray = <T,>(array: T[], length: number, fillValue: T): T[] => {
  return Object.assign(new Array(length).fill(fillValue), array);
};

export const Worksheet = () => {
  const { data } = useQuerySelectedQAData();

  const questions = padArray(data, data.length > 10 ? 20 : 10, undefined);

  return (
    <>
      <div className="flex aspect-210/297 h-[297mm] max-h-[297mm] w-[210mm] flex-col overflow-hidden bg-white p-4 font-(family-name:--font-cursive) font-normal not-italic">
        {/* Q&A + Meta */}
        <div className="grid grow grid-cols-12 gap-2 overflow-hidden">
          {/* Q&A */}
          <div className="col-span-11 grid h-full gap-4 overflow-hidden">
            <ol className="row-span-1 grid grid-cols-10 grid-rows-2 gap-y-4 overflow-hidden border-black">
              {questions.map((item, index) => (
                <li
                  key={index}
                  className={clsx(
                    "order-[var(--order)] col-span-1 grid grid-cols-3 overflow-hidden border-x-2 border-l-2 border-black [writing-mode:vertical-rl] nth-[10n+1]:border-r-2",
                    questions.length === 20 ? "row-span-1" : "row-span-2",
                  )}
                  style={{ "--order": ORDER_ALIGNMENT[index] } as CSSProperties}
                >
                  <div className="col-span-2 my-auto flex items-center">
                    {item !== undefined && item.question !== undefined && (
                      <>
                        <span className="size-fit px-1">
                          {NUMBER_SIGN_LIST[index]}
                        </span>
                        <TText
                          className="line-clamp-2 p-1"
                          text={item.question}
                        />
                      </>
                    )}
                  </div>
                  <span className="col-span-1 flex justify-end border-t-2 border-black">
                    {item?.id && (
                      <span className="text-muted-fg text-center text-xs [writing-mode:horizontal-tb]">
                        ({item.id})
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          {/* Meta */}
          <div className="col-span-1 flex flex-col place-items-center justify-between border-black">
            <Title />
            <div>
              <MetaBox />
              <AnswerQR />
            </div>
          </div>
        </div>
        {/* Answer */}
        <div className="h-fit shrink-0 grow-0">
          <Answer />
        </div>
      </div>
      <BackSide />
    </>
  );
};
