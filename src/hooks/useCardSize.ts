import { throttle } from "lodash";
import { useLayoutEffect, useState } from "react";

const getCardSize = () => `${window.innerHeight * 0.3}px`;

export const useCardSize = () => {
  const [cardSize, setCardSize] = useState(getCardSize());

  useLayoutEffect(() => {
    const handleResize = throttle(() => setCardSize(getCardSize()), 200);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return cardSize;
};
