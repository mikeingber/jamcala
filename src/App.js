import React, { useMemo, useState } from 'react'
import './App.css';
import useWebsocket, { ReadyState } from 'react-use-websocket'
import shortid from 'shortid';
import Game from './components/Game';
import Rules from './components/Rules'
import styled from 'styled-components';

const connectionState = {
  [ReadyState.CONNECTING]: 'Connecting...',
  [ReadyState.OPEN]: 'Connected',
  [ReadyState.CLOSING]: 'Closing...',
  [ReadyState.CLOSED]: 'Closed',
  [ReadyState.UNINSTANTIATED]: 'Not Ready',
}

const server = process.env.NODE_ENV === 'production' ? 'wss://chipmancala.herokuapp.com' : 'ws://localhost:3001'

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
    sendJsonMessage,
    lastJsonMessage: state,
    readyState,
  } = useWebsocket(`${server}/join/${id}`)
  // const [debug, setDebug] = useState(false)
  const [modalActive, setModalVisibility] = useState(false)

  const send = (action, payload) => {
    return sendJsonMessage({ action, payload: { ...payload, moveId: state.moveId } })
  }

  const isPlayerOne = state?.playerOne?.id === id
  const partnerID = isPlayerOne ? state?.playerTwo?.id : state?.playerOne?.id

  return (
    <div>
      <Header>
        <img src="/logo.svg" style={{ width: '100px', padding: '0 20px' }} />
        <h1>Chipmancala</h1>
      </Header>
      <StatusBar>
        <span><b>Status:</b> {connectionState[readyState]}</span>
        <span><b>Room:</b> {state?.roomId}</span>
        <span>{isPlayerOne ? 'You are Player 1' : 'You are Player 2'}</span>
        <span onClick={() => setModalVisibility(!modalActive)}>?</span>
      </StatusBar>

      <Rules show={modalActive} toggle={setModalVisibility} />

      <Game
        state={state}
        isMyTurn={state?.activePlayerId === id}
        isPlayerOne={isPlayerOne}
        send={send}
      />

      {/*<label>
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
      </div>)}*/}
    </div>
  );
}

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: -20px;
  margin-bottom: -30px;

  h1 {
    font-size: 3em;
    margin-top: 70px;
    font-family: 'NYTFranklin';
  }  
`
const StatusBar = styled.div`
  display: flex;
  align-items: flex-start;
  background-color: #eee;
  padding-left: 40px;

  span {
    padding: 8px;
    margin-right: 15px;

    :last-child {
      border: 5px solid #88f;
      color: #88f;
      font-weight: 800;
      border-radius: 32px;
      width: 16px;
      text-align: center;
      font-size: 18px;
      line-height: 15px;
      cursor: pointer;
    }
  }
`

export default App;
