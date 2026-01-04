export const generateCards = () => {
  const amountPerCard = 8;
  const cards: number[][] = [];

  const n = amountPerCard - 1;

  for (let i = 0; i <= n; i++) {
    const card = [0];

    for (let j = 1; j <= n; j++) {
      card.push(j + i * n);
    }

    cards.push(card);
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const card = [i + 1];

      for (let k = 0; k < n; k++) {
        card.push(n + 1 + n * k + ((i * k + j) % n));
      }

      cards.push(card);
    }
  }

  return cards;
};
