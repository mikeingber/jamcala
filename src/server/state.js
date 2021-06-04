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
 *  pitId: string;
 * }
 * 
 * type GameState {
 *  roomId: string;
 *  board: Board;
 *  hand: Hand;
 *  mode: string; // before-start, start-turn, dropping-letters, making-word, end
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
 * type MakeWordActionPayload {
 *  word: string;
 * }
 * 
 */

const puzzleOne = [
  'e', 'e', 'e', 'e', 'e',
  'a', 'a', 'a', 'a',
  'i', 'i', 'i',
  'o', 'o', 'o',
  'u', 'u', 'u',
  'n', 'n', 'n',
  't', 't', 't',
  'y', 'y',
  'r', 'r',
  'h', 'h',
  'l', 'l',
  'g', 'g',
  'm', 'm',
  'c', 'c',
  'd', 'd',
  'f', 'f',
  'w',
  'j',
  'k',
  'p',
  'v',
  'b',
]

// TODO
module.exports = (roomId, playerOneId) => {
  // make a copy of the puzzle and shuffle it
  const shuffledLetters = puzzleOne.slice().sort(() => .5 - Math.random())

  return {
    roomId,
    board: {
      pits: [
        { id: 'p1-pit1', letters: shuffledLetters.splice(0, 4), },
        { id: 'p1-pit2', letters: shuffledLetters.splice(0, 4), },
        { id: 'p1-pit3', letters: shuffledLetters.splice(0, 4), },
        { id: 'p1-pit4', letters: shuffledLetters.splice(0, 4), },
        { id: 'p1-pit5', letters: shuffledLetters.splice(0, 4), },
        { id: 'p1-pit6', letters: shuffledLetters.splice(0, 4), },
        { id: 'p1-pool', letters: [], },
        { id: 'p2-pit1', letters: shuffledLetters.splice(0, 4), },
        { id: 'p2-pit2', letters: shuffledLetters.splice(0, 4), },
        { id: 'p2-pit3', letters: shuffledLetters.splice(0, 4), },
        { id: 'p2-pit4', letters: shuffledLetters.splice(0, 4), },
        { id: 'p2-pit5', letters: shuffledLetters.splice(0, 4), },
        { id: 'p2-pit6', letters: shuffledLetters.splice(0, 4), },
        { id: 'p2-pool', letters: [], },
      ]
    },
    hand: {},
    mode: 'before-start',
    activePlayerId: playerOneId,
    playerOne: {
      id: playerOneId,
      score: 0,
    },
    playerTwo: null
  }
}
