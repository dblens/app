import React from "react";
import RankList, { RankListProps } from "@/app/components/atoms/RankList";
import { calculateTotalBytes, niceBytes } from "@/utils";
import { DiskUsageStateType } from "./types";
import ReactTooltip from "react-tooltip";

const TotalTableSize = ({
  data,
  chartType,
  setChartType,
}: {
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
      <h1 className="text-md font-thin" data-tip data-for="hd-total-size">
        Total Table Size
      </h1>

      <ReactTooltip id="hd-total-size" type="info">
        <span>
          The total size of a table (pg_total_relation_size) can be more the
          table size (pg_table_size) plus the index size; <br></br>
          it also includes TOAST data and other internal storage components.
        </span>
      </ReactTooltip>
      <h2 className="text-5xl py-2">{niceBytes(totalSize)}</h2>
      <RankList list={list} />
    </div>
  );
};

export default TotalTableSize;
