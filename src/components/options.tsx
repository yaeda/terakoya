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
import { FC, ReactNode, useState } from "react";
import {
  Button,
  Card,
  Description,
  Form,
  Label,
  Link,
  Switch,
  SwitchProps,
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
};

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
      <Label>答えの表示タイプ</Label>
      <ToggleGroup
        selectedKeys={answerType}
        selectionMode="single"
        onSelectionChange={setAnswerType}
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
        {[...answerType].map((key) => ANSWER_DESCRIPTION[key])}
      </Description>
    </div>
  );
};

const ReadWriteSelector = () => {
  const [readWrite, setReadWrite] = useAtom(readWriteAtom);
  return (
    <div className="flex flex-col gap-y-1">
      <Label>答えの表示タイプ</Label>
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
          queryClient.invalidateQueries({
            queryKey: ["q-a-data", dataSourceUrlLocal],
          });
        }}
      >
        <TextField
          value={dataSourceUrlLocal}
          label="問題データURL"
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

const SwitchWithAtom: FC<
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

const OtherOptions = () => {
  return (
    <div className="flex flex-col gap-y-8">
      <TitleInput />
      <AnswerTypeSelector />
      <ReadWriteSelector />
      <div className="flex flex-col gap-y-1">
        <Label>記入欄</Label>
        <div className="flex flex-row gap-x-6">
          <SwitchWithAtom booleanAtom={dateBoxVisibilityAtom}>
            日付
          </SwitchWithAtom>
          <SwitchWithAtom booleanAtom={nameBoxVisibilityAtom}>
            名前
          </SwitchWithAtom>
          <SwitchWithAtom booleanAtom={scoreBoxVisibilityAtom}>
            点数
          </SwitchWithAtom>
        </div>
      </div>
    </div>
  );
};

const OPTIONS = [
  { title: "出題設定", component: DataOptions },
  { title: "その他の設定", component: OtherOptions },
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
            <Card>
              <Card.Header>
                <Card.Title>{option.title}</Card.Title>
              </Card.Header>
              <Card.Content>
                <option.component />
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
              return <Tabs.Tab id={option.title}>{option.title}</Tabs.Tab>;
            })}
          </Tabs.List>
          {OPTIONS.map((option) => {
            return (
              <Tabs.Panel id={option.title}>
                <option.component />
              </Tabs.Panel>
            );
          })}
        </Tabs>
      </div>
    );
  }
};
