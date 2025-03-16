import { dataSourceUrlAtom, readWriteAtom } from "@/atoms/options";
import { extractSheetId, fetchSpreadsheet } from "@/atoms/q-a-data";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useMemo } from "react";

export const useQueryQAData = () => {
  const [dataSourceUrl] = useAtom(dataSourceUrlAtom);

  const sheetId = useMemo(() => extractSheetId(dataSourceUrl), [dataSourceUrl]);

  return useQuery({
    queryKey: ["q-a-data", sheetId],
    queryFn: async () => {
      return await fetchSpreadsheet(sheetId);
    },
    staleTime: Infinity,
  });
};

export const useQuerySelectedQAData = () => {
  const queryResult = useQueryQAData();

  // TODO: data selection

  return queryResult;
};

export const useQuerySelectedAnswers = () => {
  const { data } = useQuerySelectedQAData();
  const [readWrite] = useAtom(readWriteAtom);

  if (data === undefined) {
    return [];
  }

  return data.map((record) => {
    const answers = record.question.reduce<string[]>((prevAnswers, token) => {
      const blankAnswer = readWrite === "read" ? token.hint : token.text;
      return token.isBlank && blankAnswer
        ? [...prevAnswers, blankAnswer]
        : prevAnswers;
    }, []);
    return record.answer ? [record.answer, ...answers] : answers;
  });
};
