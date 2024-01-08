import * as icons from "@mui/icons-material";
import { type SvgIconProps } from "@mui/material";
import * as R from "ramda";
import random from "random";

import { getRandomItemsSet } from "@/utils";

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

const themedTwoToneIcons = twoToneIcons.map((Icon, i) => {
  // TODO: with this approach all the icons may theoretically have the same color
  const color = colors[random.int(0, colors.length - 1)];

  return {
    id: i,
    Icon: (props: SvgIconProps) => <Icon color={color} {...props} />,
  };
});

export const getIconsPack = (amount: number) =>
  getRandomItemsSet(amount, themedTwoToneIcons);
