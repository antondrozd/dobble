import * as icons from "@mui/icons-material";
import { Box, type SvgIconProps } from "@mui/material";
import * as R from "ramda";
import random from "random";

import { getRandomItemsSet } from "@/utils";

type IconsPack = {
  name: "yana";
  amount: number;
  type: "svg" | "png";
};

const iconPacks: Record<IconsPack["name"], IconsPack> = {
  yana: {
    name: "yana",
    amount: 57,
    type: "png",
  },
};
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

const mapPngIconsPack = (tokenPack: IconsPack) =>
  Array.from(new Array(tokenPack.amount)).map((_, i) => {
    const src = `/icon-packs/${tokenPack.name}/icon-${i}.${tokenPack.type}`;

    return {
      id: i,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Icon: (props: any) => (
        <Box {...props}>
          <img src={src} width="100%" height="100%" />
        </Box>
      ),
    };
  });

export const getIconsPack = ({
  name,
  amount,
}: {
  name: IconsPack["name"] | "material";
  amount: number;
}) => {
  switch (name) {
    case "material":
      return getRandomItemsSet(amount, themedTwoToneIcons);
    default: {
      if (amount > iconPacks[name].amount) {
        throw new Error(
          `Requested icons pack [${name}] has only ${iconPacks[name].amount} icons, while the game requires at least ${amount}`
        );
      }

      return getRandomItemsSet(amount, mapPngIconsPack(iconPacks[name]));
    }
  }
};
