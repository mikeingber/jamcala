import React from 'react'
import styled from 'styled-components'

// all copy TODO
const getInstruction = (state, isMyTurn) => {
  switch (state.mode) {
    case 'start-turn':
      return isMyTurn ? 'Collect letters to spread or make a word' : 'Opponent is collecting letters'
    case 'dropping-letters':
      return isMyTurn ? 'Drop a letter' : 'Opponent is dropping a letter'
    case 'making-word':
      return isMyTurn ? 'Make a word' : 'Opponent is making a word'
    default:
      return ""
  }
}

const Hand = ({ isMyTurn, state, send }) => {
  const [word, setWord] = React.useState('')

  React.useEffect(() => {
    // ensure word is cleared at beginning of turn
    setWord('')
  }, [state.mode])
  
  const onClickLetter = (letter) => {
    if (state.mode === 'dropping-letters') {
      send('drop', { letter })
    }

    if (state.mode === 'making-word') {
      setWord(word + letter)
    }
  }

  const submitWord = () => {
    if (word.length < 4) return
    const { letters = [] } = state.hand || {}

    // validate TODO test this out
    const letterCounts = letters.reduce((acc, letter) => {
      acc[letter] = acc[letter] || 0
      acc[letter]++
      return acc
    }, {})
    const wordUsesLetters = word
      .split('')
      .every(letter => {
        if (!letterCounts[letter]) return false
        letterCounts[letter]--
        return true
      })

    if (wordUsesLetters) {
      send('make-word', { word })
    }
  }
  
  return (
    <Container>
      <Instruction>{getInstruction(state, isMyTurn)}</Instruction>
      <Letters>
        {state.hand.letters?.map((letter, i) => (
          <Letter key={i} onClick={() => onClickLetter(letter)}>{letter}</Letter>
        ))}
      </Letters>
      {state.mode === 'making-word' && isMyTurn && (
        <Input
          value={word}
          onChange={e => setWord(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submitWord()}
        />
      )}
    </Container>
  )
}

const Container = styled.div`
  flex: 1;
  background-color: #ddd;
  padding: 20px;
`

const Instruction = styled.div``

const Letters = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 12px 0;
`;

const Letter = styled.div`
  font-size: 36px;
  margin: 8px;
  cursor: pointer;
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  text-align: center;
  line-height: 50px;
  border-radius: 2px;

  :hover {
    background-color: #ccc;
  }
`;

const Input = styled.input`
  height: 36px;
  width: 300px;
  font-size: 36px;
  padding: 8px;
`;

export default Hand
