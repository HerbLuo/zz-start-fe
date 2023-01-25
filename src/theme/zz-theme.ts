import { ThemeConfig } from "antd/es/config-provider/context";

export const zzTheme: ThemeConfig = {
  token: {
    borderRadius: 2,
    colorPrimary: "#007ACC",
    colorPrimaryHover: "#0062A3",
    colorPrimaryActive: "#0062A3",
    colorBgBase: "#FFFFFF",
    colorBorder: "#CCCCCC",
    
    colorText: "#000000a6",
    colorError: "#d93026",
    colorWarning: "#ffc440",
    colorSuccess: "#1e8e3e",
  },
  components: {
    Input: {
      colorTextPlaceholder: "#a8c5e2",
    },
    Button: {
      borderRadiusSM: 2,
      colorLink: "#007ACC",
      colorLinkHover: "#004c7f",
      paddingContentHorizontal: 13,
    },
    Table: {
      paddingSM: 7,
      fontSize: 16,
      colorBorderSecondary: "#C9C9C9",
      colorFillAlter: "#F2F2F2",
    },
    Checkbox: {
      borderRadius: 0,
    },
  },
};
