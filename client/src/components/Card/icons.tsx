import type { HTMLAttributes } from "react";
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

type IconProps = HTMLAttributes<HTMLDivElement>;

type IconEntry = {
  id: number;
  Icon: React.ComponentType<IconProps>;
};

const mapFileIconsPack = (tokenPack: IconsPack): IconEntry[] =>
  R.range(0, tokenPack.amount).map((i) => {
    const src = `/icon-packs/${tokenPack.name}/icon-${i}.${tokenPack.type}`;

    return {
      id: i,
      Icon: (props: IconProps) => (
        <div {...props}>
          <img src={src} className="w-full h-full" alt="" />
        </div>
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
  name: PackName;
  amount: number;
  seed: number;
}): IconEntry[] => {
  const rng = seedrandom(seed.toString());

  if (amount > iconPacks[name].amount) {
    throw new Error(
      `Requested icons pack [${name}] has only ${iconPacks[name].amount} icons, while the game requires at least ${amount}`
    );
  }
  const allIcons = mapFileIconsPack(iconPacks[name]);

  const shuffled = shuffleWithSeed(allIcons, rng);
  const selected = shuffled.slice(0, amount);

  return selected;
};
