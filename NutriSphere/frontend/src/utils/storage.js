export const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
};

export const clearStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};
