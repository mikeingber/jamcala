import React, { useMemo, useState } from 'react'
import './App.css';
import useWebsocket, { ReadyState } from 'react-use-websocket'
import shortid from 'shortid';

const connectionState = {
  [ReadyState.CONNECTING]: 'Connecting...',
  [ReadyState.OPEN]: 'Connected',
  [ReadyState.CLOSING]: 'Closing...',
  [ReadyState.CLOSED]: 'Closed',
  [ReadyState.UNINSTANTIATED]: 'Not Ready',
}

// 14 pits for now, assume there are always 14 pits. future adapt to different nums of pits
// player 1, player 2
// player1's home pit is 0
// player1's row is 1-6
// player2's home is 7
// player2's row is 8-13

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
  pits: [
    [1,2,3,4],
    [5,6,7,8],
    [9,10,11],
    [12],
    [13,14,15,16,17,18],
    [19,20,21,22],
    [23,24],
    [101,102,103,104],
    [105,106,107,108],
    [109,110,111],
    [112],
    [113,114,115,116,117,118],
    [119,120,121,122],
    [123,124]
  ]
}

function App() {
  const id = useMemo(() => {
    let id = localStorage.getItem('userID')
    if (!id) {
      id = shortid.generate()
      localStorage.setItem('userID', id)
    }

    return id
  }, [])

  const { sendJsonMessage: send, lastJsonMessage: state, readyState } = useWebsocket(`ws://127.0.0.1:3001/join/${id}`)
  const [debug, setDebug] = useState(true)

  const isPlayerOne = state?.playerOne?.id === id
  const partnerID = isPlayerOne ? state?.playerTwo?.id : state?.playerOne?.id

  const renderPit = (index) => (
    <ul key={index} onClick={() => /*setBoard(manc(board, index))*/{}}>
      {state?.board.pits[index].map(stoneId => (
        <li key={stoneId}>{stoneId}</li>
      ))}
    </ul>
  )

  return (
    <div>
      {/*<div className="pits">
        <div className="home">
          {renderPit(0)}
        </div>
        <div className="rows">
          <div className="top">
            {[1,2,3,4,5,6].map(renderPit)}
          </div>
          <div className="bottom">
            {[8,9,10,11,12,13].reverse().map(renderPit)}
          </div>
        </div>
        <div className="home">
          {renderPit(7)}
        </div>
      </div>*/}

      <button onClick={() => send({action: 'pick-up', payload: { pit: 2 }})}>Test</button>

      <label>
        <input type="checkbox" onChange={(e) => setDebug(e.target.checked)} />
        Debug
      </label>
      {debug && (<div className="debug">
        <p>Status: {connectionState[readyState]}, Room: {state?.roomId}</p>
        <p>Player ID: {id} ({isPlayerOne ? 'P1' : 'P2'})</p>
        <p>Partner ID: {partnerID}</p>
        <p>State:</p>
        <pre style={{ backgroundColor: '#efefef', padding: '10px' }}>
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>)}
    </div>
  );
}

export default App;
