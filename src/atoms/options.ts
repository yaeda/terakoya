import { atomWithStorage } from "jotai/utils";
import { Key } from "react-aria-components";

const serialize = <T>(value: Set<T>): string => {
  return JSON.stringify([...value]);
};

const deserialize = <T>(serialized: string): Set<T> => {
  return new Set(JSON.parse(serialized));
};

const localStorageForSet = {
  getItem: <T>(key: string, initialValue: Set<T>): Set<T> => {
    const item = localStorage.getItem(key);
    return item ? deserialize<T>(item) : initialValue;
  },
  setItem: <T>(key: string, newValue: Set<T>): void => {
    localStorage.setItem(key, serialize<T>(newValue));
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};

export const dataSourceUrlAtom = atomWithStorage<string>(
  "terakoya:data-source-url",
  "https://docs.google.com/spreadsheets/d/14Rf2nMpmzsyoycHDgaaQ0l9pSsGInI9v9x4L-AD5prU/edit?usp=sharing",
  undefined,
  { getOnInit: true },
);

export const titleAtom = atomWithStorage<string>(
  "terakoya:title",
  "漢字テスト",
  undefined,
  { getOnInit: true },
);

export const answerTypeAtom = atomWithStorage<Set<Key>>(
  "terakoya:answer-type",
  new Set(["none"]),
  localStorageForSet,
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
