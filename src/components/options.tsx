import {
  answerTypeAtom,
  dataSourceUrlAtom,
  dateBoxVisibilityAtom,
  nameBoxVisibilityAtom,
  readWriteAtom,
  scoreBoxVisibilityAtom,
  titleAtom,
} from "@/atoms/options";
import type { SwitchProps } from "@heroui/react";
import { Button, Switch, Tab, Tabs } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom, type SetStateAction, type WritableAtom } from "jotai";
import { IconArrowUpRight } from "justd-icons";
import type { FC, ReactNode } from "react";
import { Suspense, useState } from "react";
import { DataSelectionOptions } from "./options/data-selection";
import { Card, Description, Form, Label, Link, TextField } from "./ui";

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

const ANSWER_TYPE = [
  { id: "none", label: "なし", content: "答えは印刷されません。" },
  { id: "front", label: "下", content: "答えは問題の下に印刷されます。" },
  {
    id: "back",
    label: "裏",
    content: "答えは別紙に印刷されます。両面印刷がおすすめです。",
  },
  {
    id: "code",
    label: "二次元コード",
    content:
      "答えは別紙に二次元コードとして印刷されます。両面印刷がおすすめです。",
  },
];

const AnswerTypeSelector = () => {
  const [answerType, setAnswerType] = useAtom(answerTypeAtom);
  return (
    <div className="flex flex-col gap-y-1">
      <Label>表示タイプ</Label>
      <Tabs
        aria-label="options"
        variant="solid"
        items={ANSWER_TYPE}
        selectedKey={answerType[0] ?? "none"}
        onSelectionChange={(key) => {
          setAnswerType([key]);
        }}
        classNames={{
          panel: "p-0",
        }}
      >
        {ANSWER_TYPE.map((type) => {
          return (
            <Tab key={type.id} title={type.label}>
              <Description>{type.content}</Description>
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
};

const READ_WRITE_TYPE = [
  { id: "read", label: "読み" },
  { id: "write", label: "書き" },
];

const ReadWriteSelector = () => {
  const [readWrite, setReadWrite] = useAtom(readWriteAtom);
  return (
    <div className="flex flex-col gap-y-1">
      <Label>読み書き選択</Label>
      <Tabs
        aria-label="options"
        variant="solid"
        items={READ_WRITE_TYPE}
        selectedKey={readWrite}
        onSelectionChange={setReadWrite}
      >
        {READ_WRITE_TYPE.map((type) => {
          return <Tab key={type.id} title={type.label} />;
        })}
      </Tabs>
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
            <Button type="submit" aria-label="New user" variant="bordered">
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
    <Switch isSelected={value} onValueChange={setValue} size="sm">
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
        <Tabs
          aria-label="options"
          variant="underlined"
          classNames={{
            base: "sticky top-0 z-10 bg-white/90",
            tab: "px-0 w-fit",
            tabList: "px-0 gap-x-4",
            cursor: "w-full",
          }}
          fullWidth
        >
          {OPTIONS.map((option) => {
            return (
              <Tab key={`tab-${option.id}`} title={option.title}>
                <option.component />
              </Tab>
            );
          })}
        </Tabs>
      </div>
    );
  }
};
