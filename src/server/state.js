/**
 * type Pit {
 *  id: string;
 *  stones: string[];
 * }
 * 
 * type Board {
 *  pits: Pit[]; // index 0 corresponds to player1's pool, etc
 * }
 * 
 * type Player {
 *  id: string;
 *  score: number;
 *  foundWords: string[];
 * }
 * 
 * type Hand {
 *  stones: string[];
 *  pitLocation: number;
 * }
 * 
 * type GameState {
 *  roomId: string;
 *  board: Board;
 *  hand: Hand;
 *  mode: string; // start-turn, holding-stones, end
 *  activePlayerId: string;
 *  playerOne: Player
 *  playerTwo: Player
 * }
 * 
 * type PickUpActionPayload {
 *  pitIndex: number;
 * }
 * 
 * type DropActionPayload {
 *  letter: string; // BE will validate that this is in hand
 * }
 * 
 * type MakeWordPayload {
 *  word: string;
 * }
 * 
 */

// TODO
export const createInitialState = (roomId, playerOneId) => ({
  roomId,
  board: {},
  hand: {},
  mode: 'before-start',
  activePlayerId: playerOneId,
  playerOne: {
    id: playerOneId,
    score: 0,
  },
  playerTwo: null
})
