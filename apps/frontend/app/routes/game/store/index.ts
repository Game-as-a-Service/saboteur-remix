import { configureStore } from "@reduxjs/toolkit";
import boardSlice from "./board.slice";
import playersSlice from "./players.slice";

const store = configureStore({
  reducer: {
    board: boardSlice.reducer,
    players: playersSlice.reducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
