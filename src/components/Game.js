import React from 'react'
import styled from 'styled-components'
import Hand from './Hand'
import Pit from './Pit'

const getPitsFromMyPerspective = (state, isPlayerOne) => {
  const { pits = [] } = state.board || {}
  if (isPlayerOne) {
    return pits
  }
  const pivot = Math.floor(pits.length / 2)
  // rotate the array so my pits are always along the bottom and my pool is on the right
  return [...pits.slice(pivot), ...pits.slice(0, pivot)]
}

const Game = ({ state, isMyTurn, isPlayerOne, send }) => {
  if (!state) {
    // socket hasn't given us anything yet
    return null
  }

  if (state.mode === 'before-start') {
    return (
      <Container>Waiting for another player...</Container>
    )
  }
  
  console.log("STATE", state)
  const pits = getPitsFromMyPerspective(state, isPlayerOne)

  if (!pits.length) {
    return null
  }

  const myPoolIndex = pits.length / 2 - 1
  const opponentPoolIndex = pits.length - 1
  const myPool = pits[myPoolIndex]
  const opponentPool = pits[opponentPoolIndex]
  const myPits = pits.filter((_, i) => i < myPoolIndex)
  const opponentPits = pits.filter((_, i) => i > myPoolIndex && i < opponentPoolIndex)

  const isPitClickable = (pit) => state.mode === 'start-turn' && isMyTurn && pit.letters.length > 0
  const pickUpLetters = (pit) => () => send({ action: 'pick-up', payload: { pit: pit.id } })

  return (
    <Container>
      <Board>
        <Pool>
          <Pit
            {...opponentPool}
            isPlayerOne={!isPlayerOne}
            isDropping={state.hand?.pitId === opponentPool.id}
          />
        </Pool>
        <Pits>
          <div className="row">
            {opponentPits.map(pit => <Pit key={pit.id} {...pit} isPlayerOne={!isPlayerOne} isDropping={state.hand?.pitId === pit.id} />)}
          </div>
          <div className="row">
            {myPits.reverse().map(pit => (
              <Pit
                key={pit.id}
                {...pit}
                isPlayerOne={isPlayerOne}
                clickable={isPitClickable(pit)}
                handleClick={pickUpLetters(pit)}
                isDropping={state.hand?.pitId === pit.id}
              />)
            )}
          </div>
        </Pits>
        <Pool>
          <Pit
            {...myPool}
            isPlayerOne={isPlayerOne}
            clickable={isPitClickable(myPool)}
            handleClick={pickUpLetters(myPool)}
            isDropping={state.hand?.pitId === myPool.id}
          />
        </Pool>
      </Board>
      <Hand isMyTurn={isMyTurn} state={state} send={send} />
    </Container>
  )
}

const Container = styled.div`
  width: 800px;
  height: 600px;
  border: 1px solid black;
  margin: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Board = styled.div`
  display: flex;
`;

const Pool = styled.div`
  display: flex;
  width: 120px;
`;

const Pits = styled.div`
  flex: 1;

  .row {
    display: flex;
  }
`;

export default Game
