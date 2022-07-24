import { TableRowSelection } from "antd/lib/table/interface";
import React, { useRef, useState } from "react";

export function useTableSelection<KEY extends React.Key = number, RECORD = unknown>(
  disabled?: (record: RECORD) => boolean
) {
  const selectionRef = useRef<KEY[]>();
  const [s, setS] = useState(false);
  const rowSelection: TableRowSelection<RECORD> = {
    selectedRowKeys: selectionRef.current,
    onChange: (selectedRowKeys) => {
      setS(!s);
      selectionRef.current = selectedRowKeys as KEY[];
    },
    columnWidth: 40,
    getCheckboxProps: disabled ? (record) => ({
      disabled: disabled(record),
    }) : undefined,
    preserveSelectedRowKeys: true,
  };
  const selectedRef: React.MutableRefObject<KEY[] | undefined> = {
    set current(cur) {
      setS(!s);
      selectionRef.current = cur;
    },
    get current() {
      return selectionRef.current;
    }
  };
  return { rowSelection, selectedRef };
}
