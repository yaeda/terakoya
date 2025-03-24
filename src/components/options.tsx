import {
  answerTypeAtom,
  dataSourceUrlAtom,
  dateBoxVisibilityAtom,
  nameBoxVisibilityAtom,
  readWriteAtom,
  scoreBoxVisibilityAtom,
  titleAtom,
} from "@/atoms/options";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom, type SetStateAction, type WritableAtom } from "jotai";
import {
  IconArrowUpRight,
  IconCirclePlaceholderDashed,
  IconLayoutAlignBottom,
  IconQrCode,
  IconUndo,
} from "justd-icons";
import type { FC, ReactNode } from "react";
import { Suspense, useState } from "react";
import { DataSelectionOptions } from "./options/data-selection";
import type { SwitchProps } from "./ui";
import {
  Button,
  Card,
  Description,
  Form,
  Label,
  Link,
  Switch,
  Tabs,
  TextField,
  Toggle,
  ToggleGroup,
} from "./ui";

const ANSWER_DESCRIPTION = {
  none: "答えは印刷されません。",
  front: "答えは問題の下に印刷されます。",
  back: "答えは別紙に印刷されます。両面印刷がおすすめです。",
  code: "答えはQRコードとして印刷されます。",
} as const;

const TitleInput = () => {
  const [title, setTitle] = useAtom(titleAtom);
  return (
    <TextField
      label="タイトル"
      placeholder="例：漢字テスト"
      value={title}
      onChange={setTitle}
    />
  );
};

const AnswerTypeSelector = () => {
  const [answerType, setAnswerType] = useAtom(answerTypeAtom);
  return (
    <div className="flex flex-col gap-y-1">
      <Label>表示タイプ</Label>
      <ToggleGroup
        selectedKeys={answerType}
        selectionMode="single"
        onSelectionChange={(keys) => {
          setAnswerType([...keys]);
        }}
        disallowEmptySelection
      >
        <Toggle id="none">
          <IconCirclePlaceholderDashed /> なし
        </Toggle>
        <Toggle id="front">
          <IconLayoutAlignBottom /> 表
        </Toggle>
        <Toggle id="back">
          <IconUndo /> 裏
        </Toggle>
        <Toggle id="code">
          <IconQrCode /> 二次元コード
        </Toggle>
      </ToggleGroup>
      <Description>
        {[...answerType].map((key) => {
          const description =
            ANSWER_DESCRIPTION[key as keyof typeof ANSWER_DESCRIPTION];
          return description ?? "";
        })}
      </Description>
    </div>
  );
};

const ReadWriteSelector = () => {
  const [readWrite, setReadWrite] = useAtom(readWriteAtom);
  return (
    <div className="flex flex-col gap-y-1">
      <Label>読み書き選択</Label>
      <ToggleGroup
        selectedKeys={new Set([readWrite])}
        selectionMode="single"
        onSelectionChange={(keys) => {
          if (keys.size) {
            setReadWrite([...keys][0]);
          }
        }}
        disallowEmptySelection
      >
        <Toggle id="read">読み</Toggle>
        <Toggle id="write">書き</Toggle>
      </ToggleGroup>
    </div>
  );
};

const DataOptions = () => {
  const [dataSourceUrl, setDataSourceUrl] = useAtom(dataSourceUrlAtom);
  const [dataSourceUrlLocal, setDataSourceUrlLocal] = useState(dataSourceUrl);
  const queryClient = useQueryClient();

  return (
    <div className="flex flex-col gap-y-1">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          setDataSourceUrl(dataSourceUrlLocal);
          // invalidate all queries
          queryClient.invalidateQueries();
        }}
      >
        <TextField
          value={dataSourceUrlLocal}
          label="スプレッドシートのURL"
          suffix={
            <Button type="submit" aria-label="New user" intent="outline">
              読み込む
            </Button>
          }
          onChange={setDataSourceUrlLocal}
        />
      </Form>
      <Description>
        {dataSourceUrlLocal ? (
          <Link
            href={dataSourceUrlLocal}
            intent="primary"
            target="__blank"
            className="flex items-center"
          >
            スプレッドシートを開く
            <IconArrowUpRight />
          </Link>
        ) : (
          "公開スプレッドシートのURLを入力してくだい。"
        )}
      </Description>
    </div>
  );
};

const SwitchWithBooleanAtom: FC<
  SwitchProps & {
    children: ReactNode;
  } & {
    booleanAtom: WritableAtom<boolean, [SetStateAction<boolean>], void>;
  }
> = ({ children, booleanAtom }) => {
  const [value, setValue] = useAtom(booleanAtom);
  return (
    <Switch isSelected={value} onChange={setValue}>
      {children}
    </Switch>
  );
};

const AnswerOptions = () => {
  return (
    <div className="flex flex-col gap-y-8">
      <AnswerTypeSelector />
      <ReadWriteSelector />
    </div>
  );
};

const OtherOptions = () => {
  return (
    <div className="flex flex-col gap-y-8">
      <TitleInput />
      <div className="flex flex-col gap-y-1">
        <Label>記入欄</Label>
        <div className="flex flex-row gap-x-6">
          <SwitchWithBooleanAtom booleanAtom={dateBoxVisibilityAtom}>
            日付
          </SwitchWithBooleanAtom>
          <SwitchWithBooleanAtom booleanAtom={nameBoxVisibilityAtom}>
            名前
          </SwitchWithBooleanAtom>
          <SwitchWithBooleanAtom booleanAtom={scoreBoxVisibilityAtom}>
            点数
          </SwitchWithBooleanAtom>
        </div>
      </div>
    </div>
  );
};

const OPTIONS = [
  { id: "data-options", title: "問題データ", component: DataOptions },
  {
    id: "data-selection-options",
    title: "出題設定",
    component: DataSelectionOptions,
  },
  { id: "answer-options", title: "答えの設定", component: AnswerOptions },
  { id: "other-options", title: "その他の設定", component: OtherOptions },
];

type OptionsProps = {
  intent: "cards" | "tabs";
};

export const Options: FC<OptionsProps> = ({ intent } = { intent: "cards" }) => {
  if (intent === "cards") {
    return (
      <div className="flex flex-col gap-4">
        {OPTIONS.map((option) => {
          return (
            <Card key={`card-${option.id}`}>
              <Card.Header>
                <Card.Title>{option.title}</Card.Title>
              </Card.Header>
              <Card.Content>
                <Suspense fallback={<div>Loading...</div>}>
                  <option.component />
                </Suspense>
              </Card.Content>
            </Card>
          );
        })}
      </div>
    );
  }

  if (intent === "tabs") {
    return (
      <div>
        <Tabs aria-label="options">
          <Tabs.List>
            {OPTIONS.map((option) => {
              return (
                <Tabs.Tab key={`tab-${option.id}`} id={option.id}>
                  {option.title}
                </Tabs.Tab>
              );
            })}
          </Tabs.List>
          {OPTIONS.map((option) => {
            return (
              <Tabs.Panel key={`panel-${option.id}`} id={option.id}>
                <option.component />
              </Tabs.Panel>
            );
          })}
        </Tabs>
      </div>
    );
  }
};
