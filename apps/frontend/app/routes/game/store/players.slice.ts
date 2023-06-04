import type { HandCard, Placement, Tool } from "@packages/domain";
import type { RootState } from ".";
import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

type Player = {
  id: string;
  connectionState: "connected" | "disconnected";
  hands: HandCard[];
  brokenTools: Tool[];
  revealedGoal: Placement[];
};

const adapter = createEntityAdapter<Player>({
  selectId: (player) => player.id,
});

const slice = createSlice({
  name: "players",
  initialState: adapter.getInitialState(),
  reducers: {
    add: adapter.addOne,
    update: adapter.updateOne,
  },
});
export default slice;

// actions
export const { add, update } = slice.actions;

// selectors
const selectors = adapter.getSelectors<RootState>((state) => state.players);
export const selectPlayers = selectors.selectAll;
export const selectPlayerById = (id: string) => (state: RootState) =>
  selectors.selectById(state, id);
