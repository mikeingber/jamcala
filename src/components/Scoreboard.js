import React from 'react';
import styled from 'styled-components'

const Scoreboard = ({ me, opponent }) => {
  return (
    <Container>
      {[me, opponent].map((player, i) => (
        <div key={player.id}>
          {i ? 'Opponent' : 'You'} - {player.score || 0}
          <ul>
            {(player.foundWords || []).map((word, i) => <li key={i}>{word}</li>)}
          </ul>
        </div>
      ))}
    </Container>
  )
}

const Container = styled.div`
  padding: 20px;
  border-left: 1px solid black;
  display: flex;
  width: 240px;
  
  gap: 0 16px;

  > div {
    flex: 1;
    text-align: center
  }

  ul {
    list-style: none;
    margin: 0;
    margin-top: 20px;
    padding: 0;
    font-weight: 700;
  }
`

export default Scoreboard
