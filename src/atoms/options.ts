import { DEFAULT_DATA_SOURCE_URL } from "@/libs/constants";
import { atomWithStorage } from "jotai/utils";
import type { Key } from "react-aria-components";

const serialize = <T>(value: T | undefined): string => {
  return JSON.stringify(value);
};

const deserialize = <T>(serialized: string): T => {
  return JSON.parse(serialized);
};

const localStorageWithJsonObject = {
  getItem: <T>(key: string, initialValue: T): T => {
    const item = localStorage.getItem(key);
    return item ? deserialize<T>(item) : initialValue;
  },
  setItem: <T>(key: string, newValue: T): void => {
    localStorage.setItem(key, serialize<T>(newValue));
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};

export const dataSourceUrlAtom = atomWithStorage<string>(
  "terakoya:data-source-url",
  DEFAULT_DATA_SOURCE_URL,
  undefined,
  { getOnInit: true },
);

export const selectedCategoriesAtom = atomWithStorage<string[] | undefined>(
  "terakoya:selected-categories",
  undefined,
  localStorageWithJsonObject,
  { getOnInit: true },
);

export const lastResultStatusAtom = atomWithStorage<string[]>(
  "terakoya:last-result-status",
  ["zero", "less", "none", "one", "all"],
  localStorageWithJsonObject,
  { getOnInit: true },
);

export const selectedIndexAtom = atomWithStorage<number[]>(
  "terakoya:selected-index",
  [],
  localStorageWithJsonObject,
  { getOnInit: false },
);

export const titleAtom = atomWithStorage<string>(
  "terakoya:title",
  "漢字テスト",
  undefined,
  { getOnInit: true },
);

export const answerTypeAtom = atomWithStorage<Key[]>(
  "terakoya:answer-type",
  ["none"],
  localStorageWithJsonObject,
  { getOnInit: false },
);

export const readWriteAtom = atomWithStorage<Key>(
  "terakoya:read-write",
  "write",
  undefined,
  { getOnInit: false },
);

export const dateBoxVisibilityAtom = atomWithStorage<boolean>(
  "terakoya:date-box-visibility",
  true,
  undefined,
  { getOnInit: false },
);

export const nameBoxVisibilityAtom = atomWithStorage<boolean>(
  "terakoya:name-box-visibility",
  true,
  undefined,
  { getOnInit: false },
);

export const scoreBoxVisibilityAtom = atomWithStorage<boolean>(
  "terakoya:score-box-visibility",
  true,
  undefined,
  { getOnInit: false },
);
