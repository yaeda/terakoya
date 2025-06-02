import type { Token } from "@/libs/text-parser";
import { parse } from "csv-parse/browser/esm/sync";
import { parse as qParse } from "../libs/text-parser";

export type QAData = {
  index: number;
  id: string;
  question: Token[];
  answer: string;
  category: string;
  lastDate: Date;
  results: boolean[];
  lastTwoResultStatus: "zero" | "less" | "none" | "one" | "all";
};

const genResultStatus = (
  results: boolean[],
): "zero" | "less" | "none" | "one" | "all" => {
  if (results.length === 0) {
    return "zero";
  }

  if (results.length < 2) {
    return "less";
  }

  const count = results.slice(-2).filter(Boolean).length;
  switch (count) {
    case 0:
      return "none";
    case 1:
      return "one";
    case 2:
      return "all";
    default:
      return "less";
  }
};

const array2data = (array: string[], index: number): QAData => {
  const results = array[5]
    ? [...array[5]].map((result) => (result === "o" ? true : false))
    : [];

  return {
    index,
    id: array[0],
    question: qParse(array[1]),
    answer: array[2],
    category: array[3],
    lastDate: new Date(array[4]),
    results,
    lastTwoResultStatus: genResultStatus(results),
  };
};

const csv2json = (csv: string): QAData[] => {
  // const records = parse(csv, {
  //   columns: ["id", "question", "answer", "category", "lastDate", "results"],
  //   group_columns_by_name: true,
  // }) as QAData[];

  // skip empty question
  const records = parse(csv).filter(
    (record: string) => !record[0].startsWith("#") && !!record[1],
  );

  // format
  return records.map(array2data);
};

const regex = /https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9\-_]+)/;

export const extractSheetId = (url: string) => {
  const result = url.match(regex);
  return result !== null && result.length === 2 ? result[1] : null;
};

export const fetchSpreadsheet = async (sheetId: string | null) => {
  if (sheetId === null) {
    return [];
  }

  const tabName = "";
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${tabName}`;

  const res = await fetch(csvUrl);
  const csv = await res.text();
  return csv2json(csv);
};
