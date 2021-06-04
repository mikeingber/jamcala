import React, { useMemo, useState } from 'react'
import './App.css';
import useWebsocket, { ReadyState } from 'react-use-websocket'
import shortid from 'shortid';
import Game from './components/Game';

const connectionState = {
  [ReadyState.CONNECTING]: 'Connecting...',
  [ReadyState.OPEN]: 'Connected',
  [ReadyState.CLOSING]: 'Closing...',
  [ReadyState.CLOSED]: 'Closed',
  [ReadyState.UNINSTANTIATED]: 'Not Ready',
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

  const {
    sendJsonMessage: send,
    lastJsonMessage: state,
    readyState,
  } = useWebsocket(`ws://127.0.0.1:3001/join/${id}`)
  const [debug, setDebug] = useState(false)

  const isPlayerOne = state?.playerOne?.id === id
  const partnerID = isPlayerOne ? state?.playerTwo?.id : state?.playerOne?.id

  return (
    <div>
      <Game
        state={state}
        isMyTurn={state?.activePlayerId === id}
        isPlayerOne={isPlayerOne}
        send={send}
      />

      <label>
        <input type="checkbox" checked={debug} onChange={(e) => setDebug(e.target.checked)} />
        Debug
      </label>
      {debug && (<div className="debug">
        <p>Status: {connectionState[readyState]}, Room: {state?.roomId}</p>
        <p>Player ID: {id} ({isPlayerOne ? 'P1' : 'P2'})</p>
        <p>Partner ID: {partnerID}</p>
        <p>State:</p>
        <pre style={{ backgroundColor: '#efefef', padding: '10px', height: '100px', overflow: 'auto' }}>
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>)}
    </div>
  );
}

export default App;
