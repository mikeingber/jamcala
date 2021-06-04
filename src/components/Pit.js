import React from 'react'
import styled from 'styled-components'

const Pit = ({ letters, id, isPlayerOne, clickable, handleClick, isDropping }) => {
  return (
    <List
      id={id}
      onClick={() => clickable && handleClick && handleClick()}
      isPlayerOne={isPlayerOne}
      clickable={clickable}
    >
      {letters?.map((letter, i) => (
        <li key={i}>{letter}</li>
      ))}
      {isDropping && <Dropping key='dropping'>_</Dropping>}
    </List>
  )
}

const List = styled.ul`
  list-style: none;
  border: 1px solid grey;
  border-radius: 10px;
  margin: 8px;
  font-size: 18px;
  padding: 0;
  text-align: center;
  flex: 1;

  background-color: ${({ isPlayerOne }) => isPlayerOne ? 'lightblue' : 'orange'};

  ${({ clickable }) => clickable ? `
    cursor: pointer;
    border-width: 3px;
  ` : ''}
`;

const Dropping = styled.li`
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
