import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }) => {
    const response = await axios.post("/auth/login", payload);
    return response.data;
  },
);
