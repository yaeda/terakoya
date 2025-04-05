import {
  lastResultStatusAtom,
  selectedCategoriesAtom,
  selectedIndexAtom,
} from "@/atoms/options";
import type { QAData } from "@/atoms/q-a-data";
import { Description, Label } from "@/components/ui";
import { useQueryQADataCategories } from "@/libs/q-a-data-queries";
import type { CheckboxProps, SharedSelection } from "@heroui/react";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Chip,
  Select,
  SelectItem,
  useCheckbox,
} from "@heroui/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { IconBullet, IconX } from "justd-icons";
import { type FC } from "react";

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

const CategorySelection = () => {
  const { categories } = useQueryQADataCategories();

  const selectionItems = categories.map((category) => ({ key: category }));

  const [selectedCategories, setSelectedCategories] = useAtom(
    selectedCategoriesAtom,
  );

  const onSelectionChange = (keys: SharedSelection) => {
    setSelectedCategories([...keys] as string[]);
  };

  return (
    <div className="flex flex-col gap-y-1">
      <Label>カテゴリ</Label>
      <Select
        classNames={{
          trigger: "min-h-12 py-2",
        }}
        isMultiline
        selectionMode="multiple"
        isDisabled={categories.length === 0}
        selectedKeys={selectedCategories || "all"}
        onSelectionChange={onSelectionChange}
        aria-label="カテゴリ"
        variant="flat"
        items={selectionItems}
        renderValue={(items) => {
          return (
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <Chip key={item.key} size="sm" variant="flat">
                  {item.key}
                </Chip>
              ))}
            </div>
          );
        }}
      >
        {(category) => {
          return <SelectItem key={category.key}>{category.key}</SelectItem>;
        }}
      </Select>
    </div>
  );
};

const CheckboxWithSymbols: FC<CheckboxProps & { symbols: string[] }> = ({
  symbols,
  ...props
}) => {
  const { isSelected } = useCheckbox(props);

  return (
    <Checkbox
      {...props}
      classNames={{
        label: "flex flex-row justify-between w-full",
        base: "w-full max-w-full",
      }}
    >
      <div className="flex w-full justify-between">
        <span>{props.children}</span>
        {symbols && (
          <div className="flex flex-row gap-x-0.5">
            {symbols.map((symbol) => {
              return (
                <Chip
                  key={symbol}
                  classNames={{
                    content: "flex flex-row",
                    base: "p-0",
                  }}
                  size="sm"
                  variant="flat"
                  color={isSelected ? "primary" : "default"}
                >
                  {[...symbol].map((s, index) => {
                    switch (s) {
                      case "o":
                        return <IconBullet key={index} />;
                      case "x":
                        return <IconX key={index} />;
                      case "-":
                        return "無";
                      default:
                        return null;
                    }
                  })}
                </Chip>
              );
            })}
          </div>
        )}
      </div>
    </Checkbox>
  );
};

const LatestResultSelection = () => {
  const [lastResultStatus, setLastResultStatus] = useAtom(lastResultStatusAtom);

  return (
    <div className="flex flex-col gap-y-1">
      <Label>直近2回の結果</Label>
      <CheckboxGroup
        value={lastResultStatus}
        onValueChange={setLastResultStatus}
        // label="直近2回の結果"
      >
        <CheckboxWithSymbols value="less" symbols={["-", "o", "x"]}>
          回数不足
        </CheckboxWithSymbols>
        <CheckboxWithSymbols value="none" symbols={["xx"]}>
          正解なし
        </CheckboxWithSymbols>
        <CheckboxWithSymbols value="one" symbols={["ox", "xo"]}>
          1回正解
        </CheckboxWithSymbols>
        <CheckboxWithSymbols value="all" symbols={["oo"]}>
          全部正解
        </CheckboxWithSymbols>
      </CheckboxGroup>
    </div>
  );
};

const DataSelectionButton = () => {
  const { categories, data } = useQueryQADataCategories();
  const selectedCategories = useAtomValue(selectedCategoriesAtom);
  const lastResultStatus = useAtomValue(lastResultStatusAtom);
  const setSelectedIndex = useSetAtom(selectedIndexAtom);

  const candidateData = data.filter((item) => {
    return (
      (!selectedCategories ||
        categories.length === 0 ||
        selectedCategories.includes(item.category)) &&
      lastResultStatus.includes(item.lastTwoResultStatus)
    );
  });

  return (
    <div className="flex flex-col gap-y-1">
      <Button
        variant="ghost"
        color="primary"
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
  );
};

export const DataSelectionOptions: FC = () => {
  return (
    <div className="flex flex-col gap-y-8">
      <CategorySelection />
      <LatestResultSelection />
      <DataSelectionButton />
    </div>
  );
};
