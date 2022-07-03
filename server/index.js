const port = 3000

const cors = require("cors")
const express = require("express")

const app = express()
app.use(cors())

const state = {
    water: "water",
    ship: "ship",
    hit: "hit",
    miss: "miss",
    unknown: "unknown"
}

const message = {
    ourState: [],
    otherState: [],
    myTurn: true,
    serverMessages: []
}

for (let y = 0; y < 10; y++) {
    let ourRow = []
    let otherRow = []
    for (let x = 0; x < 10; x++) {
        ourRow.push(state.miss)
        otherRow.push(state.hit)
    }
    message.ourState.push(ourRow)
    message.otherState.push(otherRow)
}

app.get("/attack", (req, res, next) => res.json(message))


app.listen(port, () => {
    console.log("Server running on port " + port);
});

