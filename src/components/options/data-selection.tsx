import { lastResultStatusAtom, selectedIndexAtom } from "@/atoms/options";
import type { QAData } from "@/atoms/q-a-data";
import type { SelectedKey } from "@/components/ui";
import {
  Button,
  Description,
  Label,
  MultipleSelect,
  Toggle,
  ToggleGroup,
} from "@/components/ui";
import { useQueryQADataCategories } from "@/libs/q-a-data-queries";
import { useAtom, useSetAtom } from "jotai";
import type { FC } from "react";
import { useListData } from "react-stately";

// Function to select random data from the candidate data
const selectRandomData = (data: QAData[]): QAData[] => {
  const candidateData = [...data];
  const selectedData = [];
  for (let i = 0; i < 20 && candidateData.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * candidateData.length);
    const data = candidateData[randomIndex];
    selectedData.push(data);
    candidateData.splice(randomIndex, 1);
  }
  return selectedData;
};

export const DataSelectionOptions: FC = () => {
  const { categories, data } = useQueryQADataCategories();
  const [lastResultStatus, setLastResultStatus] = useAtom(lastResultStatusAtom);
  const setSelectedIndex = useSetAtom(selectedIndexAtom);

  const items = categories.map((category) => ({
    id: category,
    name: category,
  }));

  const selectedItems = useListData<SelectedKey>({
    initialItems: items,
  });

  const selectedCategories = selectedItems.items.map((item) => item.id);
  const candidateData = data.filter((item) => {
    return (
      selectedCategories.includes(item.category) &&
      lastResultStatus.includes(item.lastTwoResultStatus)
    );
  });

  return (
    <div className="flex flex-col gap-y-8">
      <MultipleSelect
        className="min-w-0"
        label="カテゴリ"
        intent="secondary"
        shape="circle"
        items={items}
        tag={(item) => (
          <MultipleSelect.Tag textValue={item.id as string}>
            {item.name}
          </MultipleSelect.Tag>
        )}
        selectedItems={selectedItems}
      >
        {(item) => {
          return (
            <MultipleSelect.Option textValue={item.id as string}>
              {item.name}
            </MultipleSelect.Option>
          );
        }}
      </MultipleSelect>
      <div className="flex flex-col gap-y-1">
        <Label>直近2回の結果</Label>
        <ToggleGroup
          selectionMode="multiple"
          disallowEmptySelection
          selectedKeys={lastResultStatus}
          onSelectionChange={(keys) => {
            setLastResultStatus([...keys]);
          }}
        >
          <Toggle id="less">回数不足</Toggle>
          <Toggle id="none">正解なし</Toggle>
          <Toggle id="one">1回正解</Toggle>
          <Toggle id="all">全部正解</Toggle>
        </ToggleGroup>
      </div>
      <div className="flex flex-col gap-y-1">
        <Button
          isDisabled={!candidateData.length}
          onPress={() => {
            const selectedData = selectRandomData(candidateData);
            setSelectedIndex(selectedData.map((data) => data.index));
          }}
        >
          {candidateData.length} 件から出題
        </Button>
        <Description>押すたびにランダムに出題されます。</Description>
      </div>
    </div>
  );
};
