import React from 'react'
import './App.css';

// if this were TS...
// export type Board = {
//   pits: number[][]
// }

export const manc = (board, pitIdx) => {
  const pits = board.pits.map(pit => ([...pit]))
  const pickedUp = pits[pitIdx]
  pits[pitIdx] = []
  pickedUp.forEach((stoneId, idx) => {
    pits[(pitIdx + idx + 1) % pits.length].push(stoneId)
  })
  return { pits }
}

const initialBoard = {
  pits: [[1,2,3,4],[5,6,7,8],[9,10,11],[12],[13,14,15,16,17,18],[19,20,21,22],[23,24]]
}

function App() {
  const [board, setBoard] = React.useState(initialBoard)

  return (
    <div>
      <div className="pits">
        {board.pits.map((pit, i) => (
          <ul key={i} onClick={() => setBoard(manc(board, i))}>
            {pit.map(stoneId => (
              <li key={stoneId}>{stoneId}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default App;
