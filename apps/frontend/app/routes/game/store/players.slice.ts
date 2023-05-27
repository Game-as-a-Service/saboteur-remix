import type { HandCard, Placement, Tool } from "@packages/domain";
import type { RootState } from ".";
import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import store from ".";

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

export default createSlice({
  name: "players",
  initialState: adapter.getInitialState(),
  reducers: {
    add: adapter.addOne,
    update: adapter.updateOne,
  },
});

// selectors
const selectors = adapter.getSelectors<RootState>((state) => state.players);
export const selectPlayers = () => selectors.selectAll(store.getState());
export const selectPlayerById = (id: string) =>
  selectors.selectById(store.getState(), id);
