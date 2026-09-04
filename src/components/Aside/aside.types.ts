import type { ComponentType } from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";

export type AsideAccess = string | readonly string[];

type AsideLinkBase = {
  id: string;
  label: string;
  icon?: ComponentType<SvgIconProps>;
  access?: AsideAccess;
};

export type AsideLeafLink = AsideLinkBase & {
  href: string;
  children?: never;
};

export type AsideGroupLink = AsideLinkBase & {
  href?: string;
  children: AsideLink[];
};

export type AsideLink = AsideLeafLink | AsideGroupLink;
