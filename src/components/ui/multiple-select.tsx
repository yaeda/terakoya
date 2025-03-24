import { useCallback, useEffect, useId, useRef, useState } from "react"

import { IconChevronLgDown } from "justd-icons"
import { useFilter } from "react-aria"
import type {
  ComboBoxProps as ComboBoxPrimitiveProps,
  Key,
  ValidationResult,
} from "react-aria-components"
import { ComboBox } from "react-aria-components"
import type { ListData } from "react-stately"
import { useListData } from "react-stately"
import { twMerge } from "tailwind-merge"
import { Button } from "./button"
import type { FieldProps } from "./field"
import { Description, FieldError, Input, Label } from "./field"
import { ListBox } from "./list-box"
import { PopoverContent } from "./popover"
import type { RestrictedIntent, TagGroupProps } from "./tag-group"
import { Tag, TagGroup, TagList } from "./tag-group"
import { VisuallyHidden } from "./visually-hidden"

interface SelectedKey {
  id: Key
  name: string
}

interface MultipleSelectProps<T extends object>
  extends FieldProps,
    Omit<
      ComboBoxPrimitiveProps<T>,
      | "children"
      | "validate"
      | "allowsEmptyCollection"
      | "inputValue"
      | "selectedKey"
      | "className"
      | "value"
      | "onSelectionChange"
      | "onInputChange"
    >,
    Pick<TagGroupProps, "shape"> {
  intent?: RestrictedIntent
  items: Array<T>
  selectedItems: ListData<T>
  className?: string
  onItemInserted?: (key: Key) => void
  onItemCleared?: (key: Key) => void
  renderEmptyState?: (inputValue: string) => React.ReactNode
  tag: (item: T) => React.ReactNode
  children: React.ReactNode | ((item: T) => React.ReactNode)
  errorMessage?: string | ((validation: ValidationResult) => string)
}

const MultipleSelect = <T extends SelectedKey>({
  children,
  items,
  selectedItems,
  onItemCleared,
  onItemInserted,
  className,
  name,
  renderEmptyState,
  errorMessage,
  ...props
}: MultipleSelectProps<T>) => {
  const tagGroupIdentifier = useId()
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(0)

  const { contains } = useFilter({ sensitivity: "base" })
  const selectedKeys = selectedItems.items.map((i) => i.id)

  const filter = useCallback(
    (item: T, filterText: string) => {
      return !selectedKeys.includes(item.id) && contains(item.name, filterText)
    },
    [contains, selectedKeys],
  )

  const accessibleList = useListData({
    initialItems: items,
    filter,
  })

  const [fieldState, setFieldState] = useState<{
    selectedKey: Key | null
    inputValue: string
  }>({
    selectedKey: null,
    inputValue: "",
  })

  const onRemove = useCallback(
    (keys: Set<Key>) => {
      const key = keys.values().next().value
      if (key) {
        selectedItems.remove(key)
        setFieldState({
          inputValue: "",
          selectedKey: null,
        })
        onItemCleared?.(key)
      }
    },
    [selectedItems, onItemCleared],
  )

  const onSelectionChange = (id: Key | null) => {
    if (!id) {
      return
    }

    const item = accessibleList.getItem(id)

    if (!item) {
      return
    }

    if (!selectedKeys.includes(id)) {
      selectedItems.append(item)
      setFieldState({
        inputValue: "",
        selectedKey: id,
      })
      onItemInserted?.(id)
    }

    accessibleList.setFilterText("")
  }

  const onInputChange = (value: string) => {
    setFieldState((prev) => ({
      inputValue: value,
      selectedKey: value === "" ? null : prev.selectedKey,
    }))

    accessibleList.setFilterText(value)
  }

  const popLast = useCallback(() => {
    if (selectedItems.items.length === 0) {
      return
    }

    const endKey = selectedItems.items[selectedItems.items.length - 1]

    if (endKey) {
      selectedItems.remove(endKey.id)
      onItemCleared?.(endKey.id)
    }

    setFieldState({
      inputValue: "",
      selectedKey: null,
    })
  }, [selectedItems, onItemCleared])

  const onKeyDownCapture = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && fieldState.inputValue === "") {
        popLast()
      }
    },
    [popLast, fieldState.inputValue],
  )

  useEffect(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.target.clientWidth)
      }
    })

    observer.observe(trigger)
    return () => {
      observer.unobserve(trigger)
    }
  }, [])

  const triggerButtonRef = useRef<HTMLButtonElement | null>(null)

  return (
    <div className={twMerge("group flex w-full min-w-80 flex-col", className)}>
      {props.label && <Label className="mb-1">{props.label}</Label>}
      <div className={props.isDisabled ? "opacity-50" : ""}>
        <div
          ref={triggerRef}
          className={twMerge(
            [
              "relative flex min-h-10 flex-row flex-wrap items-center rounded-lg border px-1 shadow-xs transition",
              "has-[input[focus=true]]:border-ring/70",
              "has-[input[data-invalid=true][focus=true]]:border-blue-500",
              "has-[input[data-invalid=true]]:border-danger",
              "has-[input[focus=true]]:ring-4 has-[input[focus=true]]:ring-ring/20",
            ],
            className,
          )}
        >
          <TagGroup
            shape={props.shape}
            intent={props.intent}
            aria-label="Selected items"
            id={tagGroupIdentifier}
            onRemove={onRemove}
          >
            <TagList
              items={selectedItems.items}
              className={twMerge(
                selectedItems.items.length !== 0 && "px-1 py-1.5",
                "[&_.jdt3lr2x]:last:-mr-1 gap-1.5 outline-hidden",
                props.shape === "square" && "[&_.jdt3lr2x]:rounded-[calc(var(--radius-lg)-4px)]",
              )}
            >
              {props.tag}
            </TagList>
          </TagGroup>
          <ComboBox
            {...props}
            allowsEmptyCollection
            aria-label="Available items"
            className="group peer flex flex-1"
            items={accessibleList.items}
            selectedKey={fieldState.selectedKey}
            inputValue={fieldState.inputValue}
            onSelectionChange={onSelectionChange}
            onInputChange={onInputChange}
          >
            <div className={twMerge("inline-flex flex-1 flex-wrap items-center px-0", className)}>
              <Input
                placeholder={props.placeholder}
                className="ml-1 flex-1 px-0.5 py-1 shadow-none ring-0"
                onBlur={() => {
                  setFieldState({
                    inputValue: "",
                    selectedKey: null,
                  })
                  accessibleList.setFilterText("")
                }}
                onKeyDownCapture={onKeyDownCapture}
              />

              <VisuallyHidden>
                <Button
                  slot="remove"
                  type="button"
                  aria-label="Remove"
                  intent="plain"
                  size="square-petite"
                  ref={triggerButtonRef}
                >
                  <IconChevronLgDown />
                </Button>
              </VisuallyHidden>
            </div>
            <PopoverContent
              respectScreen={false}
              isNonModal
              className="max-w-none"
              style={{ width: `${width}px` }}
              triggerRef={triggerRef}
              trigger="ComboBox"
            >
              <ListBox
                renderEmptyState={() =>
                  renderEmptyState ? (
                    renderEmptyState(fieldState.inputValue)
                  ) : (
                    <Description className="block p-3">
                      {fieldState.inputValue ? (
                        <>
                          No results found for:{" "}
                          <strong className="font-medium text-fg">{fieldState.inputValue}</strong>
                        </>
                      ) : (
                        "No options"
                      )}
                    </Description>
                  )
                }
                selectionMode="multiple"
              >
                {children}
              </ListBox>
            </PopoverContent>
          </ComboBox>
          <div className="relative ml-auto flex items-center justify-center px-1" aria-hidden>
            <button
              type="button"
              className="-mr-2 grid size-8 place-content-center rounded-sm text-muted-fg hover:text-fg focus:text-fg"
              onClick={() => triggerButtonRef.current?.click()}
              tabIndex={-1}
            >
              <IconChevronLgDown className="size-4 peer/[data-open]:rotate-180" />
            </button>
          </div>
        </div>
      </div>
      {props.description && <Description>{props.description}</Description>}
      {<FieldError>{errorMessage}</FieldError>}
      {name && <input hidden name={name} value={selectedKeys.join(",")} readOnly />}
    </div>
  )
}

const MultipleSelectTag = Tag
const MultipleSelectOption = ListBox.Item

MultipleSelect.Tag = MultipleSelectTag
MultipleSelect.Option = MultipleSelectOption

export type { MultipleSelectProps, SelectedKey }
export { MultipleSelect }
