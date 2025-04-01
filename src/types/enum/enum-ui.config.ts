import { LucideIcon } from "lucide-react";

export type EnumConfig = {
  name: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  hoverBorderColor?: string;
  hoverBgColor: string;
  hoverTextColor?: string;
  importantBgColor?: string;
  importantHoverBgColor?: string;
  importantTextColor?: string;
  importantHoverTextColor?: string;
  icon: LucideIcon;
};

export type TypedEnumConfig<T> = {
  value: T;
  name: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  hoverBorderColor?: string;
  hoverBgColor: string;
  hoverTextColor?: string;
  importantBgColor?: string;
  importantHoverBgColor?: string;
  importantTextColor?: string;
  importantHoverTextColor?: string;
  icon: LucideIcon;
};

export type EnumOptions<T> = {
  label: string;
  value: T;
};
