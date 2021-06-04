import React from 'react'
import styled from 'styled-components'

const Rules = ({ show, toggle }) => (
    <ModalContainer show={show} onClick={() => toggle(false)}>
        <Modal>
            <h1>How to Play</h1>
            <p>
                <b>Goal:</b> Create words to earn the highest total score before the game ends
            </p>
            <p>
                <b>Player actions</b> (can only do 1 of the following on your turn)
            </p>
            <p>
                <b>Collect letters</b>
                <ul>
                    <li>Tap a pit on your side of the board. The letters will be added to your hand.</li>
                    <li>Tap on the letter you want to discard into the next pit (or add to your pool).</li>
                    <li>If you run out of letters… </li>
                    <ul>
                        <li>On your opponent's side, then your turn ends.</li>
                        <li>On your side, then you can pick up and keep going.</li>
                        <li>In your pool, then you can make a word.</li>
                    </ul>
                    <li>You can store up to 10 letters in your pool.</li>
                </ul>
            </p>
            <p>
                <b>Create a word</b>
                <ul>
                    <li>Each letter has a different point value.</li>
                    <li>Try to form the highest scoring word. Words must be a minimum of 4 letters.</li>
                    <li>Once you use those letters, then they're discarded. Any unused letters can remain in the pool.</li>
                    <li>Any letters left over at the end of the game will be subtracted from your score.</li>
                </ul>
            </p>
            <p>
                <b>Ending the game</b>
                <ul>
                    <li>The game ends once any player's side of the board is clear.</li>
                    <li>Any letters remaining on a player's side get added to their pool.</li>
                    <li>Each player has a chance to make one more word.</li>
                    <li>Any letters left over will be subtracted from the player's score.</li>
                    <li>The player with the highest total wins.</li>
                </ul>
            </p>
        </Modal>
    </ModalContainer>
)

const ModalContainer = styled.div`
	z-index: auto;
	display: ${({show}) => (show ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
	position: fixed;
	top: 0;
	left: 0;
	height: 100vh;
	width:100vw;
	background: rgba(0,0,0,0.5);
`
const Modal = styled.div`
    position: fixed;
    background: antiquewhite;
    width: 33%;
    height: auto;
    border-radius: 10px;
    padding: 0.75rem;
    color: rgba(0,0,139, 0.7);
`

export default Rules