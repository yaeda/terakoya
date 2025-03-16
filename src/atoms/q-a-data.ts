import { Token } from "@/libs/text-parser";
import { parse } from "csv-parse/browser/esm/sync";
import { parse as qParse } from "../libs/text-parser";

type QAData = {
  id: string;
  question: Token[];
  answer: string;
  lastDate: Date;
  results: boolean[];
};

const csv2json = (csv: string) => {
  // const records = parse(csv, {
  //   columns: ["id", "question", "answer", "lastDate", "results"],
  //   group_columns_by_name: true,
  // }) as QAData[];

  // skip empty question
  const records = parse(csv).filter(
    (record: string) => !record[0].startsWith("#") && !!record[1],
  );

  // format
  const structured = records.map((record: string[]) => {
    return {
      id: record[0],
      question: qParse(record[1]),
      answer: record[2],
      lastData: new Date(record[3]),
      results: record[4]
        ? [...record[4]].map((result) => (result === "o" ? true : false))
        : [],
    };
  }) as QAData[];

  return structured;
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

  console.log("!!! fetch !!!");
  const res = await fetch(csvUrl);
  const csv = await res.text();
  return csv2json(csv);
};
