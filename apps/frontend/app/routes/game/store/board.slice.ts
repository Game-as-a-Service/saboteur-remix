import type { Placement } from "@packages/domain";
import { Vec } from "@packages/domain";
import {
  createSlice,
  createEntityAdapter,
  prepareAutoBatched,
} from "@reduxjs/toolkit";
import type { RootState } from ".";

const adapter = createEntityAdapter<Placement>({
  selectId: (placement) => Vec.id(placement.position),
});
export default createSlice({
  name: "board",
  initialState: adapter.getInitialState(),
  reducers: {
    add: {
      reducer: adapter.addOne,
      prepare: prepareAutoBatched(),
    },
    remove: {
      reducer: adapter.removeOne,
      prepare: prepareAutoBatched(),
    },
    upsert: {
      reducer: adapter.upsertOne,
      prepare: prepareAutoBatched(),
    },
    reset: {
      reducer: adapter.setAll,
      prepare: prepareAutoBatched(),
    },
  },
});

// selectors
const selectors = adapter.getSelectors<RootState>((state) => state.board);
export const selectBoard = selectors.selectAll;
export const selectBoardByPosition =
  (position: Vec.Vec2) => (state: RootState) =>
    selectors.selectById(state, Vec.id(position));
