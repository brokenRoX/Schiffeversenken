const port = 3000

const cors = require("cors")
const express = require("express")
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const bodyParser = require("body-parser");
const { json } = require("express");
//Sessions explained here https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/ 
//req.body explained here https://stackabuse.com/get-http-post-body-in-express-js/
//and https://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4
const app = express()
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "keydbfisdhfuhsndsdnunurr",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

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
const otherState = [
    [state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water],
    [state.water, state.ship, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water],
    [state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water],
    [state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water],
    [state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water],
    [state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water],
    [state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water],
    [state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water],
    [state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water],
    [state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water, state.water],
]
app.get("/attack", (req, res, next) => res.json(message))

function hideShips(otherState) {
    const hiddenState = JSON.parse(JSON.stringify(otherState)) //copies otherState into the new const hiddenState
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            if (hiddenState[y][x] === state.water || hiddenState[y][x] === state.ship) {
                hiddenState[y][x] = state.unknown
            }
        }
    }
    return hiddenState
}

app.post("/startgame", (req, res, next) => {
    const ourState = req.body
    req.session["ourState"] = ourState
    req.session["otherState"] = otherState
    res.json({ourState: ourState, otherState: hideShips(otherState), myTurn: true, serverMessages: []})
})

app.listen(port, () => {
    console.log("Server running on port " + port);
});


