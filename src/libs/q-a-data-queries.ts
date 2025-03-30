import {
  dataSourceUrlAtom,
  readWriteAtom,
  selectedIndexAtom,
} from "@/atoms/options";
import { extractSheetId, fetchSpreadsheet } from "@/atoms/q-a-data";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";

export const useQueryQAData = () => {
  const [dataSourceUrl] = useAtom(dataSourceUrlAtom);

  const sheetId = useMemo(() => extractSheetId(dataSourceUrl), [dataSourceUrl]);

  return useSuspenseQuery({
    queryKey: ["q-a-data", sheetId],
    queryFn: async () => {
      return await fetchSpreadsheet(sheetId);
    },
    staleTime: Infinity,
  });
};

export const useQuerySelectedQAData = () => {
  const queryResult = useQueryQAData();
  const selectedIndex = useAtomValue(selectedIndexAtom);

  const selectedData = selectedIndex.map((index) => {
    return queryResult.data[index];
  });

  return { ...queryResult, data: selectedData };
};

export const useQuerySelectedAnswers = () => {
  const { data } = useQuerySelectedQAData();
  const [readWrite] = useAtom(readWriteAtom);

  if (data === undefined) {
    return [];
  }

  return data.map((record) => {
    if (record === undefined) {
      return [];
    }
    const answers = record.question.reduce<string[]>((prevAnswers, token) => {
      const blankAnswer = readWrite === "read" ? token.hint : token.text;
      return token.isBlank && blankAnswer
        ? [...prevAnswers, blankAnswer]
        : prevAnswers;
    }, []);
    return record.answer ? [record.answer, ...answers] : answers;
  });
};

export const useQueryQADataCategories = () => {
  const queryResponse = useQueryQAData();

  const categories = queryResponse.data
    ? Array.from(new Set(queryResponse.data.map((record) => record.category)))
    : [];

  return { ...queryResponse, categories };
};
