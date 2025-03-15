import { dataSourceUrlAtom } from "@/atoms/options";
import { fetchSpreadsheet } from "@/atoms/q-a-data";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";

export const useQueryQAData = () => {
  const [dataSourceUrl] = useAtom(dataSourceUrlAtom);
  const { data, isLoading } = useQuery({
    queryKey: ["q-a-data", dataSourceUrl],
    queryFn: async () => {
      return await fetchSpreadsheet(dataSourceUrl);
    },
  });
};

export const useQuerySelectedQAData = () => {
  // 1. useQueryQAData
  // 2. data alignment
  // 3. filter data
  // 4. parse questions
};

export const useQuerySelectedAnsers = () => {};
