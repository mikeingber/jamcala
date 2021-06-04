import React from 'react'
import styled from 'styled-components'
import { toast } from 'react-toastify';
import Letter from './Letter'

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

  React.useEffect(() => {
    if (state.wordNotFound) {
      toast.error('Not a valid word!')
      setWord('')
    }
  }, [state.wordNotFound])
  
  const onClickLetter = (letter) => {
    if (state.mode === 'dropping-letters') {
      send('drop', { letter })
    }

    if (state.mode === 'making-word') {
      setWord(word + letter)
    }
  }

  const submitWord = () => {
    if (word.length < 3) {
      toast.error('Word too short!')
      setWord('')
      return
    }
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

    if (!wordUsesLetters) {
      toast.error('You don\'t have all the letters to make that word!')
      setWord('')
      return
    }

    if (wordUsesLetters) {
      send('make-word', { word })
    }
  }
  
  return (
    <Container>
      <Instruction>{getInstruction(state, isMyTurn)}</Instruction>
      <Letters>
        {state.hand.letters?.map((letter, i) => (
          <Letter key={i} letter={letter} onClick={() => onClickLetter(letter)}/>
        ))}
      </Letters>
      {state.mode === 'making-word' && isMyTurn && (
        <>
          <Input
            value={word}
            onChange={e => setWord(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitWord()}
          />
          <div>
            <Button color="#aaffbb" onClick={() => submitWord()}>Submit</Button>
            <Button color="#ffaabb" onClick={() => send('pass', {})}>Pass</Button>
          </div>
        </>
      )}
    </Container>
  )
}

const Container = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px 0;
`

const Instruction = styled.div``

const Letters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 4px;
`;

const Input = styled.input`
  height: 36px;
  width: 300px;
  font-size: 36px;
  padding: 8px;
`;

const Button = styled.button`
  padding: 8px;
  border: 1px solid #333;
  background-color: ${({ color }) => color};
  margin-right: 5px;

  :hover {
    border: 1px solid #444;
  }
`

export default Hand
