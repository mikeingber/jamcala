const express = require('express')
const createInitialState = require('./state')
const expressWs = require('@small-tech/express-ws')(express())
const dictionary = require('./dictionary')

const app = expressWs.app

app.get('/up', function (req, res) {
    res.send('all good!')
})

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

            return i
        }
    }

    // No friends. :( Let's start our own room
    const i = rooms.push({ one: ws, two: null, state: null })
    rooms[i - 1].state = createInitialState(i, ws.id)

    return i - 1
}

/*
msg: {
    action: '...',
    payload: {},
}
*/
function updateState(msg, roomID) {
    if (!msg || !msg.action) {
        console.log(`malformed client message: ${msg}`)
        return rooms[roomID].state
    }

    switch (msg.action) {
        case 'pick-up':
            // pickup(msg.payload, roomID)...
            break
        case 'drop':
            // drop(msg.payload, roomID) ...
            break
        case 'make-word':
            makeWord(msg.payload.word, roomID);
            break
        case '...':
            break
        default:
            console.log(`Unknown action ${msg.action}`)
    }

    return rooms[roomID].state
}

function makeWord(word, roomID) {
   console.log('word: ' + word + ' is valid: ' + dictionary.isValidWord(word));
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

if (require.main == module) {
    app.listen(process.env.PORT, () => {
        console.log(`Listening on 127.0.0.1:${process.env.PORT}`)
    })
}

module.exports = app
