import * as icons from "@mui/icons-material";
import { Box, type SvgIconProps } from "@mui/material";
import * as R from "ramda";
import seedrandom from "seedrandom";

type PackName = "yana" | "dogs";
type IconsPack = {
  name: PackName;
  amount: number;
  type: "svg" | "png";
};

const iconPacks: Record<IconsPack["name"], IconsPack> = {
  yana: {
    name: "yana",
    amount: 57,
    type: "png",
  },
  dogs: {
    name: "dogs",
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

type IconEntry = {
  id: number;
  Icon: React.ComponentType<SvgIconProps>;
};

const twoToneIcons = R.values(
  R.pick(R.filter(R.includes("TwoTone"), R.keys(icons)), icons)
);

const createThemedTwoToneIcons = (rng: () => number): IconEntry[] =>
  twoToneIcons.map((Icon, i) => {
    const color = colors[Math.floor(rng() * colors.length)];

    return {
      id: i,
      Icon: (props: SvgIconProps) => <Icon color={color} {...props} />,
    };
  });

const mapFileIconsPack = (tokenPack: IconsPack): IconEntry[] =>
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

// Fisher-Yates shuffle with seeded RNG
const shuffleWithSeed = <T,>(array: T[], rng: () => number): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const getIconsPack = ({
  name,
  amount,
  seed,
}: {
  name: PackName | "material";
  amount: number;
  seed: number;
}): IconEntry[] => {
  const rng = seedrandom(seed.toString());

  let allIcons: IconEntry[];
  switch (name) {
    case "material":
      allIcons = createThemedTwoToneIcons(rng);
      break;
    default: {
      if (amount > iconPacks[name].amount) {
        throw new Error(
          `Requested icons pack [${name}] has only ${iconPacks[name].amount} icons, while the game requires at least ${amount}`
        );
      }
      allIcons = mapFileIconsPack(iconPacks[name]);
      break;
    }
  }

  const shuffled = shuffleWithSeed(allIcons, rng);
  const selected = shuffled.slice(0, amount);

  return selected;
};
