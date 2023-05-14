import { getPictureUser } from "@/modules/getUserInfo.js";

const API_URL = "http://localhost:9999/api/users";

export const getViewers = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();

  const users = [];
  for (const person of data) {
    users.push(({
      username: person,
      picture: await getPictureUser(person),
    }));
  }

  return users;
};
