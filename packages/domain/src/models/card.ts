/**
 * Card types and constants.
 * @packageDocumentation
 */

/**
 * `PathCard` represents the card used to build the path to the gold.
 * @readonly
 */
export enum PathCard {
  START = "start",
  GOAL_GOLD = "goal gold",
  GOAL_COAL_BOTTOM_RIGHT = "goal coal bottom right",
  GOAL_COAL_BOTTOM_LEFT = "goal coal bottom left",

  CONNECTED_TOP_BOTTOM = "connected top bottom",
  CONNECTED_TOP_BOTTOM_RIGHT = "connected top bottom right",
  CONNECTED_CROSS = "connected cross",
  CONNECTED_TOP_LEFT_RIGHT = "connected top left right",
  CONNECTED_LEFT_RIGHT = "connected left right",
  CONNECTED_BOTTOM_RIGHT = "connected bottom right",
  CONNECTED_BOTTOM_LEFT = "connected bottom left",

  DEADEND_BOTTOM = "deadend bottom",
  DEADEND_TOP_BOTTOM = "deadend top bottom",
  DEADEND_TOP_BOTTOM_RIGHT = "deadend top bottom right",
  DEADEND_CROSS = "deadend cross",
  DEADEND_TOP_LEFT_RIGHT = "deadend top left right",
  DEADEND_LEFT_RIGHT = "deadend left right",
  DEADEND_BOTTOM_RIGHT = "deadend bottom right",
  DEADEND_BOTTOM_LEFT = "deadend bottom left",
  DEADEND_LEFT = "deadend left",
}

/**
 * `ActionCard` represents the card used to perform an action.
 * @readonly
 */
export enum ActionCard {
  MAP = "map",
  ROCKFALL = "rockfall",
  BROKEN_TOOL_CART = "broken tool cart",
  BROKEN_TOOL_LAMP = "broken tool lamp",
  BROKEN_TOOL_PICKAXE = "broken tool pickaxe",
  FIX_TOOL_CART = "fix tool cart",
  FIX_TOOL_LAMP = "fix tool lamp",
  FIX_TOOL_PICKAXE = "fix tool pickaxe",
  FIX_TOOL_LAMP_CART = "fix tool lamp cart",
  FIX_TOOL_PICKAXE_LAMP = "fix tool pickaxe lamp",
  FIX_TOOL_PICKAXE_CART = "fix tool pickaxe cart",
}

/**
 * `RoleCard` represents the card used to determine the role of the player.
 * @readonly
 */
export enum RoleCard {
  GoldMiner = "gold miner",
  Saboteur = "saboteur",
}

/**
 * `GoalCard` represents the card used to determine the goal of the player.
 * @readonly
 */
export const GoalCards = Object.freeze([
  PathCard.GOAL_GOLD,
  PathCard.GOAL_COAL_BOTTOM_RIGHT,
  PathCard.GOAL_COAL_BOTTOM_LEFT,
]);

/**
 * `Deck` represents the number of cards in the deck.
 * @readonly
 */
export const Deck = Object.freeze({
  [PathCard.START]: 1,
  [PathCard.GOAL_GOLD]: 1,
  [PathCard.GOAL_COAL_BOTTOM_RIGHT]: 1,
  [PathCard.GOAL_COAL_BOTTOM_LEFT]: 1,
  [PathCard.CONNECTED_TOP_BOTTOM]: 4,
  [PathCard.CONNECTED_TOP_BOTTOM_RIGHT]: 5,
  [PathCard.CONNECTED_CROSS]: 5,
  [PathCard.CONNECTED_TOP_LEFT_RIGHT]: 5,
  [PathCard.CONNECTED_LEFT_RIGHT]: 3,
  [PathCard.CONNECTED_BOTTOM_RIGHT]: 4,
  [PathCard.CONNECTED_BOTTOM_LEFT]: 5,
  [PathCard.DEADEND_BOTTOM]: 1,
  [PathCard.DEADEND_TOP_BOTTOM]: 1,
  [PathCard.DEADEND_TOP_BOTTOM_RIGHT]: 1,
  [PathCard.DEADEND_CROSS]: 1,
  [PathCard.DEADEND_TOP_LEFT_RIGHT]: 1,
  [PathCard.DEADEND_LEFT_RIGHT]: 1,
  [PathCard.DEADEND_BOTTOM_RIGHT]: 1,
  [PathCard.DEADEND_BOTTOM_LEFT]: 1,
  [PathCard.DEADEND_LEFT]: 1,

  [ActionCard.MAP]: 6,
  [ActionCard.ROCKFALL]: 3,
  [ActionCard.BROKEN_TOOL_CART]: 3,
  [ActionCard.BROKEN_TOOL_LAMP]: 3,
  [ActionCard.BROKEN_TOOL_PICKAXE]: 3,
  [ActionCard.FIX_TOOL_CART]: 2,
  [ActionCard.FIX_TOOL_LAMP]: 2,
  [ActionCard.FIX_TOOL_PICKAXE]: 2,
  [ActionCard.FIX_TOOL_LAMP_CART]: 1,
  [ActionCard.FIX_TOOL_PICKAXE_LAMP]: 1,
  [ActionCard.FIX_TOOL_PICKAXE_CART]: 1,
});

/**
 * `Card` represents the card used in the game.
 */
export type Card = PathCard | ActionCard | RoleCard;
/**
 * `HandCard` represents the card used in the hand.
 */
export type HandCard = PathCard | ActionCard;
