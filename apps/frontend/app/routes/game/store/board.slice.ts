import type { Placement, Vec2 } from "@packages/domain";
import type { RootState } from ".";
import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import store from ".";

const hash = (position: Vec2) => position.join(",");
const adapter = createEntityAdapter<Placement>({
  selectId: (placement) => hash(placement.position),
});

export default createSlice({
  name: "board",
  initialState: adapter.getInitialState(),
  reducers: {
    add: adapter.addOne,
    remove: adapter.removeOne,
    upsert: adapter.upsertOne,
    reset: adapter.getInitialState,
  },
});

// selectors
const selectors = adapter.getSelectors<RootState>((state) => state.board);
export const selectBoard = () => selectors.selectAll(store.getState());
export const selectBoardByPosition = (position: Vec2) =>
  selectors.selectById(store.getState(), hash(position));
