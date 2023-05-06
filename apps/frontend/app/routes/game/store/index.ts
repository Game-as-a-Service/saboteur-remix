import { configureStore } from "@reduxjs/toolkit";
import boardSlice from "./board.slice";

export default configureStore({
  reducer: {
    board: boardSlice.reducer,
  },
});
