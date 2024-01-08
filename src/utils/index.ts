import * as R from "ramda";
import random from "random";

export const getRandomItemsSet = <T extends { id: number | string }>(
  amount: number,
  items: T[]
) => {
  const set: T[] = [];
  const excludeIDs: T["id"][] = [];

  if (amount > items.length) {
    throw new Error("Requested amount exceeds the number of available items");
  }

  for (let i = 0; i < amount; i++) {
    const item = R.reject(R.where({ id: R.includes(R.__, excludeIDs) }), items)[
      random.int(0, items.length - excludeIDs.length - 1)
    ];

    set.push(item);
    excludeIDs.push(item.id);
  }

  return set;
};

export const getRandomRotation = () => `${random.int(1, 360)}deg`;
