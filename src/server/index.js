const express = require('express')
const path = require('path')
const createInitialState = require('./state')
const expressWs = require('@small-tech/express-ws')(express())
const dictionary = require('./dictionary')
const letterScores = require('./letters')

const app = expressWs.app

// healthcheck
app.get('/up', function (req, res) {
    res.send('all good!')
})

// serve front-end
app.use(express.static(path.resolve(__dirname, '../../build')))

/**
{
    one: ws,
    two: ws,
    state: {...}
}
 */
const rooms = []
function joinRoom(ws) {
    // Try to join a room
    for (let i = 0; i < rooms.length; i++) {
        if (
            // If there is a person waiting
            rooms[i].one && rooms[i].one.readyState === 1 &&
            // and without a partner or their partner left
            (!rooms[i].two || rooms[i].two.readyState !== 1)
        ) {
            rooms[i].two = ws
            rooms[i].state.playerTwo = { id: ws.id }
            rooms[i].state.mode = 'start-turn'

            // TEMP, dummy data for UI:
            // rooms[i].state.mode = 'dropping-letters'
            // rooms[i].state.hand.letters = ['a', 'e', 'i', 'o']
            // rooms[i].state.hand.pitId = 'p1-pit2'

            // rooms[i].state.mode = 'making-word'
            // rooms[i].state.hand.letters = ['a', 'e', 'i', 'o']
            // END TEMP

            return i
        }
    }

    // No friends. :( Let's start our own room
    const i = rooms.push({ one: ws, two: null, state: null })
    rooms[i - 1].state = createInitialState(i, ws.id)

    return i - 1
}

const pickUp = (state, pitId) => {
    const pitIndex = state.board.pits.findIndex(pit => pit.id === pitId)
    const pit = state.board.pits[pitIndex]
    state.hand.letters = [...pit.letters]
    pit.letters = []
    if (pitId.includes('pool')) {
        state.mode = 'making-word'
    } else {
        state.mode = 'dropping-letters'
        state.hand.pitId = state.board.pits[(pitIndex + 1) % state.board.pits.length].id
    }
}

/*
msg: {
    action: '...',
    payload: {},
}
*/
function updateState(msg, roomID) {
    const state = rooms[roomID].state
    if (!msg || !msg.action) {
        console.log(`malformed client message: ${msg}`)
        return state
    }
    const { action, payload } = msg
    if (state.moveId !== payload.moveId) {
        console.log('Mismatching moveIds')
        return state
    }
    switch (action) {
        case 'pick-up': {
            // pickup(msg.payload, roomID)...
            pickUp(state, payload.pit)
            break
        }
        case 'drop': {
            // drop(msg.payload, roomID) ...
            const isP1 = state.activePlayerId === state.playerOne.id
            const letterIdx = state.hand.letters.findIndex(l => l === payload.letter)
            state.hand.letters.splice(letterIdx, 1)
            // TODO: DRY
            const pitIndex = state.board.pits.findIndex(pit => pit.id === state.hand.pitId)
            const pit = state.board.pits[pitIndex]
            pit.letters.push(payload.letter)

            if (state.hand.letters.length > 0) {
                // keep going
                // TODO: DRY
                state.hand.pitId = state.board.pits[(pitIndex + 1) % state.board.pits.length].id
                const opponentPoolId = `p${isP1 ? 2 : 1}-pool`
                if (state.hand.pitId === opponentPoolId) {
                    state.hand.pitId = state.board.pits[(pitIndex + 2) % state.board.pits.length].id
                    state.hand.hasCrossedOpponentsPool = true
                }
            } else {
                const isOwnPit = isP1 ? state.hand.pitId.includes('p1-pit') : state.hand.pitId.includes('p2-pit')
                if (isOwnPit && state.hand.hasCrossedOpponentsPool) {
                    // if on own side and has crossed opponents pool, pick up and keep going
                    pickUp(state, state.hand.pitId)
                } else {
                    // if on opponents side, end turn
                    state.hand = {}
                    state.activePlayerId = isP1 ? state.playerTwo.id : state.playerOne.id
                    state.mode = 'start-turn'
                }
            }
            break
        }
        case 'make-word': {
            const isValid = makeWord(msg.payload.word, state);
            if (!isValid) return state
            break
        }
        default:
            console.log(`Unknown action ${msg.action}`)
    }

    state.moveId++
    state.wordNotFound = false
    return state
}

const canMakeWordFromHand = (word, state) => {
    const handLetterCounts = state.hand.letters.reduce((acc, letter) => {
        acc[letter] = acc[letter] || 0
        acc[letter]++
        return acc
    }, {})
    return word.split('').every(letter => {
        if (!handLetterCounts[letter]) return false
        handLetterCounts[letter]--
        return true
    })
}

function makeWord(word, state) {
    if (!canMakeWordFromHand(word, state)) {
        console.log('You don\'t have all the letters to make that word')
        return false
    }
    
    if (!dictionary.isValidWord(word)) {
       console.log('Invalid word!', word)
       state.wordNotFound = true
       return false
    }

   // remove letters from hand
   const isP1 = state.activePlayerId === state.playerOne.id
   const pit = state.board.pits.find(pit => pit.id === `p${isP1 ? 1 : 2}-pool`)
   word.split('').forEach(letter => {
       const idx = state.hand.letters.findIndex(l => l === letter)
       state.hand.letters.splice(idx, 1)
   })
   // put remaining letters back into pit
   pit.letters = state.hand.letters
   state.hand = {}
   // add word, score to player
   const player = isP1 ? state.playerOne : state.playerTwo
   player.foundWords = player.foundWords || []
   player.foundWords.push(word)
   player.score = player.score || 0

   word.split('').forEach(letter => {
    var score = letterScores[letter]
    player.score += score
   })

   // advance turn
   state.activePlayerId = isP1 ? state.playerTwo.id : state.playerOne.id
   state.mode = 'start-turn'
   return true
}

app.ws('/join/:id', function (ws, req) {
    ws.id = req.params.id

    const roomID = joinRoom(ws)
    ws.room = roomID

    console.log(`Player ${ws.id} joined room ${roomID}`)

    // Send initial state on join
    rooms[roomID].one?.send(JSON.stringify(rooms[roomID].state))
    rooms[roomID].two?.send(JSON.stringify(rooms[roomID].state))

    // Add a hook for when we recieve a message from the clients
    const clientAction = function(msg) {
        console.log(`Got message: ${msg}`)
        // Get an action from the client, update server state and return it
        const state = updateState(JSON.parse(msg), roomID)

        expressWs.broadcast(ws, JSON.stringify(state), { skipSelf: false })
    }

    rooms[roomID].one?.on('message', clientAction)
    rooms[roomID].two?.on('message', clientAction)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Listening on 127.0.0.1:${PORT}`)
})
