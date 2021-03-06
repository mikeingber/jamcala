import React from 'react'
import styled from 'styled-components'
import letters from '../server/letters'

const Letter = ({ letter, onClick }) => {
    const value = letters[letter]

    return (
        <Box onClick={onClick}>
            <Ltr>{letter}</Ltr>
            <Val>{value}</Val>
        </Box>
    )
}

const Box = styled.div`
    width: 50px;
    height: 50px;
    border: 1px solid black;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;

    :hover {
        background-color: #ccc;
    }
`
const Ltr = styled.span`
    font-weight: 700;
    font-size: 1.4em;
    padding-top: 5px;
    text-align: center;
`
const Val = styled.span`
    font-weight: 300;
    font-size: 0.8em;
    text-align: right;
    padding: 5px;
`

export default Letter