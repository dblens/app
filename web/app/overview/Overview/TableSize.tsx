import React, { ReactText } from "react";
import RankList, { RankListProps } from "@/app/components/atoms/RankList";
import { DiskUsageStateType } from "./types";
import { calculateTotalBytes, niceBytes } from "@/utils";

const TableSize = ({
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
      onMouseEnter={() => chartType !== "TABLE" && setChartType("TABLE")}
    >
      <h1 className="text-md font-thin">
        Table Size {percentage !== undefined && ` (${percentage}%)`}
      </h1>
      <h2 className="text-5xl py-2">{niceBytes(totalSize)}</h2>
      <RankList list={list} />
    </div>
  );
};

export default TableSize;
