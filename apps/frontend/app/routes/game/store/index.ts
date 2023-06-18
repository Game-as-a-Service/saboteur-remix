import type { PreloadedState } from "@reduxjs/toolkit";
import { autoBatchEnhancer } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import boardSlice from "./board.slice";
import playersSlice from "./players.slice";

const logger = createLogger({});

const rootReducer = combineReducers({
  board: boardSlice.reducer,
  players: playersSlice.reducer,
});
export const setupStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        process.env.NODE_ENV === "development" ? [logger] : []
      ),
    enhancers: (existingEnhancers) =>
      existingEnhancers.concat(autoBatchEnhancer()),
  });

export type RootState = ReturnType<typeof rootReducer>;
export type Store = ReturnType<typeof setupStore>;
export type Dispatch = Store["dispatch"];
