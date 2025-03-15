import { answerTypeAtom, dataSourceUrlAtom } from "@/atoms/options";
import { fetchSpreadsheet } from "@/atoms/q-a-data";
import { NUMBER_SIGN_LIST } from "@/libs/constants";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { QRCodeSVG } from "qrcode.react";
import { FC } from "react";
import { tv } from "tailwind-variants";
import { Popover } from "../ui";

const answerStyle = tv({
  slots: {
    area: "mt-4 border-t-2 border-dotted border-black px-4 pt-4 pb-0",
    list: "flex flex-row flex-wrap",
  },
  variants: {
    type: {
      default: {
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
  const type = [...answerType].pop() as "back" | "default" | undefined;

  const [dataSourceUrl] = useAtom(dataSourceUrlAtom);
  const { data } = useQuery({
    queryKey: ["q-a-data", dataSourceUrl],
    queryFn: async () => {
      return await fetchSpreadsheet(dataSourceUrl);
    },
  });

  if (!data) {
    return null;
  }

  const answers = data?.slice(0, 10).map((item) => {
    return item.answers[0];
  });

  if (answerType.has("none") || answerType.has("code") || type === undefined) {
    return null;
  }

  const overwrite =
    !backSide && answerType.has("back") ? "text-transparent" : "";

  const { area, list } = answerStyle({ type });

  return (
    <div className={area()}>
      <ol className={list({ class: overwrite })}>
        {answers.map((answer, index) => {
          return (
            <li key={`answer-${index}`}>
              {NUMBER_SIGN_LIST[index]}
              {answer}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export const AnswerQR = () => {
  const [answerType] = useAtom(answerTypeAtom);

  const [dataSourceUrl] = useAtom(dataSourceUrlAtom);
  const { data } = useQuery({
    queryKey: ["q-a-data", dataSourceUrl],
    queryFn: async () => {
      return await fetchSpreadsheet(dataSourceUrl);
    },
  });

  if (!answerType.has("code")) {
    return null;
  }

  const answers = data?.slice(0, 10).map((item, index) => {
    return `${NUMBER_SIGN_LIST[index]}${item.answers[0]}`;
  });

  const answerText = answers ? answers.join("\n") : "no data";

  return (
    <Popover>
      <Popover.Trigger aria-label="Open Popover">
        <QRCodeSVG value={answerText} size={64} className="mt-2 -mb-2 w-full" />
      </Popover.Trigger>
      <Popover.Content className="sm:max-w-72 print:hidden" placement="left">
        <Popover.Header>
          <Popover.Description>
            <ol>
              {answers?.map((answer, index) => {
                return <li key={`answer-${index}`}>{answer}</li>;
              })}
            </ol>
          </Popover.Description>
        </Popover.Header>
      </Popover.Content>
    </Popover>
  );
};
