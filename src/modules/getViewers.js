const API_URL = "http://localhost:9999/api/users";

export const getViewers = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data;
};
