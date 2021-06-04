import React from 'react'
import styled from 'styled-components'
import Letter from './Letter'

const Pit = ({ letters, id, isPlayerOne, clickable, handleClick, isDropping }) => {
  return (
    <List
      id={id}
      onClick={() => clickable && handleClick && handleClick()}
      isPlayerOne={isPlayerOne}
      clickable={clickable}
      isDropping={isDropping}
    >
      {letters?.map((letter, i) => (
        <li key={i}><Letter letter={letter} /></li>
      ))}
      {isDropping && <Dropping key='dropping'>_</Dropping>}
    </List>
  )
}

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  list-style: none;
  border: solid ${({ isDropping }) => isDropping ? '3px blue' : '1px grey'};
  border-radius: 10px;
  margin: 8px;
  font-size: 18px;
  padding: 4px 0;
  text-align: center;
  flex: 1;

  background-color: ${({ isPlayerOne }) => isPlayerOne ? 'lightblue' : 'orange'};

  ${({ clickable }) => clickable ? `
    cursor: pointer;
    border-width: 3px;
  ` : ''}
`;

const Dropping = styled.li`
  height: 50px;
  width: 50px;
  font-size: 1.4em;
  animation: blink-animation 1s steps(3, start) infinite;
  @keyframes blink-animation {
    to {
      visibility: hidden;
    }
  }
  @-webkit-keyframes blink-animation {
    to {
      visibility: hidden;
    }
  }
`;

export default Pit
