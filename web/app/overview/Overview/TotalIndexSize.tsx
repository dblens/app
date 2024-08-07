import React, { ReactText } from "react";
import RankList, { RankListProps } from "@/app/components/atoms/RankList";
import { calculateTotalBytes, niceBytes } from "@/utils";
// eslint-disable-next-line import/no-cycle
import { DiskUsageStateType } from "./types";

const TotalIndexSize = ({
  percentage,
  data,
  chartType,
  setChartType,
}: {
  percentage?: ReactText;
  data: DiskUsageStateType["totalTableData"];
  chartType: string;
  setChartType: (v: string) => void;
}) => {

  const totalSize = calculateTotalBytes(data?.rows?.map?.(({ size }) => size));

  const list =
    data?.rows?.map(({ name, size }) => ({
      field: name,
      value: size,
    })) ?? [];
  return (
    <div
      className="flex-1 rounded-xl bg-gray-800 overflow-auto p-2 m-2 "
      onMouseEnter={() => chartType !== "INDEX" && setChartType("INDEX")}
    >
      <h1 className="text-md font-thin">
        Total Index Size
        {percentage !== undefined && ` (${percentage}%)`}
      </h1>
      <h2 className="text-5xl py-2">{niceBytes(totalSize)}</h2>
      <RankList list={list} />
    </div>
  );
};

export default TotalIndexSize;
