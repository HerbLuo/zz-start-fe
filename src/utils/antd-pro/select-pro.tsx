import { Select, SelectProps } from "antd";
import { useEffect, useMemo } from "react";
import { memo } from "react";

type ValueType = string | number | undefined | null;
type OptionType = {
  label: string; 
  value: any;
};

interface Props extends SelectProps<ValueType> {
  autoWidth?: boolean;
  selectFirst?: boolean;
  options: OptionType[];
}

export const SelectPro = memo(function SelectPro(props: Props) {
  const { 
    autoWidth, 
    selectFirst, 
    options, 
    value, 
    onChange, 
    style, 
    ...others 
  } = props;

  const firstOption = props.options?.[0];
  useEffect(() => {
    if (!selectFirst) {
      return;
    }
    if (value !== null && value !== undefined) {
      return;
    }
    if (!onChange) {
      return;
    }
    if (!firstOption) {
      return;
    }
    onChange(firstOption.value, firstOption);
  }, [selectFirst, firstOption, onChange, value]);

  const minWidth = useMemo(() => {
    if (!autoWidth) {
      return undefined;
    }
    if (!options?.length) {
      return undefined;
    }
    // const width = Math.max(...options.map(opt => viewLength2(opt.label))) * 9 + 40;
    // if (width > 1000) {
    //   return 1000;
    // }
    // return width;
  }, [autoWidth, options]);

  const finalStyle = useMemo(() => {
    if (!minWidth) {
      return style;
    }
    return {
      minWidth,
      ...style,
    }
  }, [style, minWidth]);

  return (
    <Select
      style={finalStyle}
      options={options}
      value={value}
      onChange={onChange}
      {...others}
    />
  );
});