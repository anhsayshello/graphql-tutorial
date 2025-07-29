export const setTokenToLS = (token: string) =>
  localStorage.setItem("token", token);
export const getTokenFromLS = () => localStorage.getItem("token");
