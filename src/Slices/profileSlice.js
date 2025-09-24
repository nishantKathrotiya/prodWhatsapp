import { createSlice } from "@reduxjs/toolkit";

// Helper to get cookie value by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  token: getCookie("token"),
  loading: false,
  status: "DISCONNECTED",
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,

  reducers: {
    setUser(state, value) {
      state.user = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
    setStatus2(state, value) {
      state.status = value.payload;
    },
  },
});

export const { setUser, setLoading, setToken, setStatus2 } =
  profileSlice.actions;
export default profileSlice.reducer;
