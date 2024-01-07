import * as icons from "@mui/icons-material";
import { type SvgIconProps } from "@mui/material";
import * as R from "ramda";
import random from "random";
import { memo } from "react";

const colors = [
  "action",
  "primary",
  "secondary",
  "error",
  "info",
  "success",
  "warning",
] as const;

const twoToneIcons = R.values(
  R.pick(R.filter(R.includes("TwoTone"), R.keys(icons)), icons)
);

const themedTwoToneIcons = twoToneIcons.map((Icon) => {
  const color = colors[random.int(0, colors.length - 1)];

  return memo((props: SvgIconProps) => <Icon color={color} {...props} />);
});

// const packs

export default themedTwoToneIcons;
