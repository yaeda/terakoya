import { parse } from "csv-parse/browser/esm/sync";

type QAData = {
  id: string;
  question: string;

  answers: string[];
};

const csv2json = (csv: string) => {
  // const records = parse(csv, {
  //   columns: ["id", "question", "answers", "answers"],
  //   group_columns_by_name: true,
  // }) as QAData[];

  const records = parse(csv);

  const structured = records.map((record: string[]) => {
    return {
      id: record[0],
      question: record[1],
      answers: [...record.slice(2)],
    };
  }) as QAData[];

  return structured.filter((item) => !!item.question);
};

const regex = /https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9\-_]+)/;

export const extractSheetId = (url: string) => {
  const result = url.match(regex);
  return result !== null && result.length === 2 ? result[1] : null;
};

export const fetchSpreadsheet = async (url: string) => {
  const sheetId = extractSheetId(url);
  const tabName = "";
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${tabName}`;

  console.log("!!! fetch !!!");
  const res = await fetch(csvUrl);
  const csv = await res.text();
  return csv2json(csv);
};
