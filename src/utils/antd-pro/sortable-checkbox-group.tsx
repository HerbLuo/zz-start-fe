import NumberOutlined from "@ant-design/icons/NumberOutlined";
import { Checkbox, Tooltip, CheckboxProps } from "antd";
import React, { useCallback } from "react";
import { 
  SortableContainer, 
  SortableElement, 
  SortableHandle, 
  SortEndHandler 
} from "react-sortable-hoc";

export interface SortableCheckboxOption {
  value: string; 
  label?: string; 
  checked?: boolean;
  sortable?: boolean;
  checkable?: boolean; 
}

interface Props {
  options: SortableCheckboxOption[];
  onChange: (options: SortableCheckboxOption[]) => void;
}

const DragHandleIconStyle: (show: boolean) => React.CSSProperties = (show) => ({
  margin: "0 8px 0 -2px", 
  color: "#666", 
  cursor: "move", 
  fontSize: 11, 
  ...(show ? {} : {opacity: 0, pointerEvents: "none"}),
});
const ulStyle: React.CSSProperties = {
  margin: 0,
  padding: 0,
};
const liStyle: React.CSSProperties = {
  zIndex: 999999, 
  backgroundColor: "white",
  listStyle: "none",
};
type HandleProps = { show: boolean };
const DragHandle = SortableHandle<HandleProps>((props: HandleProps) => (
  <Tooltip title="拖拽排序">
    <span style={DragHandleIconStyle(props.show)}>
      <NumberOutlined /> 
    </span>
  </Tooltip>
));
type ItemProps = CheckboxProps & { checkable?: boolean, showHandle: boolean };
const Item = SortableElement<ItemProps>((props: ItemProps) => (
  <li style={liStyle}>
    <DragHandle show={props.showHandle}/>
    <Checkbox {...props} disabled={!props.checkable} />
  </li>
));

const Container = SortableContainer<{items: JSX.Element[]}>(
  ({items}: { items: JSX.Element[] }) => <ul style={ulStyle}>{items}</ul>
);

const arrayMove = <T extends any[]>(arr: T, from: number, to: number): T => {
  arr = [...arr] as T;
  arr.splice(to, 0, arr.splice(from, 1)[0]);
  return arr;
}
export function SortableCheckboxGroup(props: Props) {
  const {options, onChange} = props;
  const handleSortEnd: SortEndHandler = useCallback(({oldIndex, newIndex}) => {
    onChange(arrayMove(options, oldIndex, newIndex));
  }, [options, onChange]);
  const items = options.map(({value, label, checked, sortable, checkable}, i) => (
    <Item 
      key={value} 
      index={i} 
      checked={checked} 
      disabled={!sortable}
      showHandle={!!sortable}
      checkable={checkable}
      onChange={(e) => {
        const checked = e.target.checked;
        onChange(options.map((opt, j) => i === j ? {...opt, checked} : opt));
      }}
    >{label}</Item>
  ));
  return <Container items={items} onSortEnd={handleSortEnd} useDragHandle/>
}
