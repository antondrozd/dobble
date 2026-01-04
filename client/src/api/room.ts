import { SERVER_URL } from "./constants";

export const createRoom = async (): Promise<string> => {
  const response = await fetch(`${SERVER_URL}/rooms`, {
    method: "POST",
  });
  const data = (await response.json()) as {
    roomId: string;
  };

  return data.roomId;
};
