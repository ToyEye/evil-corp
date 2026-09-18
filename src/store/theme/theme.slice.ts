import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { readStoredThemeMode, type ThemeMode } from "../../theme/applyTheme";

type ThemeState = {
  mode: ThemeMode;
};

const initialState: ThemeState = {
  mode: readStoredThemeMode(),
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
  },
  selectors: {
    selectThemeMode: (state) => state.mode,
  },
});

export const { setThemeMode } = themeSlice.actions;
export const { selectThemeMode } = themeSlice.selectors;
export default themeSlice.reducer;
