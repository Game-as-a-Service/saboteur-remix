import type { PreloadedState } from "@reduxjs/toolkit";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import boardSlice from "./board.slice";
import playersSlice from "./players.slice";

const rootReducer = combineReducers({
  board: boardSlice.reducer,
  players: playersSlice.reducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

export type RootState = ReturnType<typeof rootReducer>;
export type Store = ReturnType<typeof setupStore>;
export type Dispatch = ReturnType<typeof setupStore>["dispatch"];
