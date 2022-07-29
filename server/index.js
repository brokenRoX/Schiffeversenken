const port = 3000

const express = require("express")
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const bodyParser = require("body-parser");
const { json } = require("express");
//Sessions explained here https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/ 
//req.body explained here https://stackabuse.com/get-http-post-body-in-express-js/
//and https://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4
const app = express()
app.use(cookieParser())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use(express.static(__dirname + "/../client"))

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

function checkEndGame(board) {
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            if (board[y][x] === state.ship) {
                return false
            }
        }
    }
    return true
}

function validateBoardDiagonal(board) {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (board[y][x] === state.ship && board[y + 1] [x + 1] === state.ship) {
                return false
            }
        }
    }
    for (let y = 0; y < 9; y++) {
        for (let x = 1; x < 10; x++) {
            if (board[y][x] === state.ship && board[y + 1] [x - 1] === state.ship) {
                return false
            }
        }
    }
    return true
}

function validateOnlyWaterAndShips(board) {
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            if (board[y][x] !== state.ship && board[y][x] !== state.water) {
                return false
            }
        }
    }
    return true
}

function validateShips(board) {
    const ships = [];
    for (let y = 0; y < 10; y++) {
        rowLoop:
        for (let x = 0; x < 10; x++) {
            if (board[y][x] === state.ship) {
                // Go through all existing ships and find out if there is an adjacent ship field.
                for (let ship of ships) {
                    for (let field of ship) {
                        if (field.x === x - 1 && field.y === y ||
                            field.x === x + 1 && field.y === y ||
                            field.x === x && field.y === y - 1 ||
                            field.x === x && field.y === y + 1) {
                                ship.push({x: x, y: y})
                                continue rowLoop
                        }
                    }
                }
                // No existing ship is adjacent.  Create one.
                ships.push([{x: x, y: y}])
            }
        }
    }
    if (ships.length != 1 + 2 + 3 + 4) return false
    // Find ships by their lengths:
    let shipsByLength = [0, 0, 0, 0, 0, 0]
    for (let ship of ships) {
        if (ship.length <= 5) {
            shipsByLength[ship.length]++
        } else {
            return false
        }
    }
    if (shipsByLength[2] !== 4) return false
    if (shipsByLength[3] !== 3) return false
    if (shipsByLength[4] !== 2) return false
    if (shipsByLength[5] !== 1) return false

    return true
}

function validateBoard(board) {
    return validateOnlyWaterAndShips(board) && validateBoardDiagonal(board) && validateShips(board)
}

// Returns a random number between 0 (inclusive) and to (exclusive)
function randomNumber(top) {
    return Math.floor(Math.random() * top);
}


function placeShip(board, size) {
    placeShipLoop:
    for(let tries = 0; tries < 100; tries++) {
        // Get a random direction.  0 is horizontal, 1 is vertical.
        const vertical = !!randomNumber(2) // → !! converts the number to a boolean.  One ! would also convert it, but invert the meaning.  The second ! corrects this.
        let x
        let y
        let sizeX = 1
        let sizeY = 1
        if (!vertical) {
            x = randomNumber(10 - size)
            y = randomNumber(10)
            sizeX = size
        } else {
            x = randomNumber(10)
            y = randomNumber(10 - size)
            sizeY = size
        }
        
        // Check if all fields and surrounding fields are water
        for (let yTest = 0; yTest < sizeY; yTest++) {
            for (let xTest = 0; xTest < sizeX; xTest++) {
                // There are in total 9 fields we want to check:
                // x - 1/y - 1; x/y - 1; x + 1/y - 1
                // x - 1/y    ; x/y    ; x + 1/y
                // x - 1/y + 1; x/y + 1; x + 1/y + 1
                for (let xOffset = -1; xOffset <= 1; xOffset++) {
                    for (let yOffset = -1; yOffset <= 1; yOffset++) {
                        const currentX = xTest + x + xOffset
                        const currentY = yTest + y + yOffset
                        
                        if (currentX >=0 && currentX < 10 && currentY >= 0 && currentY < 10) {
                            // Only check if the x / y coordinate is valid.
                            if (board[currentY][currentX] !== state.water) {
                                // Try everything again:
                                continue placeShipLoop
                            }
                        }
                    }
                }
            }
        }
        
        // All checks were successful \o/
        // Place the ship for real now:
        for (let yRunner = y; yRunner < y + sizeY; yRunner++) {
            for (let xRunner = x; xRunner < x + sizeX; xRunner++) {
                board[yRunner][xRunner] = state.ship
            }
        }
        return true
    }
    return false
}

function createRandomBoard() {
    createBoardLoop:
    for (;;) {
        const board = []
        for (y = 0; y < 10; y++) {
            board.push(Array(10).fill(state.water))
        }

        // Place the 5 field ship:
        if (!placeShip(board, 5)) continue createBoardLoop
        // Place two 4 field ships:
        for (let i = 0; i < 2; i++) {
            if (!placeShip(board, 4)) continue createBoardLoop
        }
        // Place three 3 field ships:
        for (let i = 0; i < 3; i++) {
            if (!placeShip(board, 3)) continue createBoardLoop
        }
        // Place four 2 field ships:
        for (let i = 0; i < 4; i++) {
            if (!placeShip(board, 2)) continue createBoardLoop
        }
        return board
    }
}

app.post("/attack", (req, res, next) => {
    const ourState = req.session.ourState
    const otherState = req.session.otherState
    const coordinates = req.body

    if (coordinates.x < 0 || coordinates.x > 9 || coordinates.y < 0 || coordinates.y > 9) {
        throw "Coordinates not valid (" + x + "/" + y + ")"
    }

    const x = coordinates.x
    const y = coordinates.y
    const attackedField = otherState[y][x]
    if (attackedField != state.water && attackedField != state.ship) {
        res.json({ourState: ourState, otherState: hideShips(otherState), myTurn: true, serverMessages: ["You have already attacked this field"]})
        return
    }
    let msgs = []
    if (attackedField === state.water) {
        otherState[y][x] = state.miss
        msgs.push("You missed")
    } else if (attackedField === state.ship) {
        otherState[y][x] = state.hit
        msgs.push("You hit a ship")
    } else {
        // Shouldn't happen
        throw "You attacked a field with an unknown state."
    }

    // Now let the computer attack the player:
    let attackX = randomNumber(10)
    let attackY = randomNumber(10)
    while (ourState[attackY][attackX] !== state.ship &&
        ourState[attackY][attackX] !== state.water) {
        attackX = randomNumber(10)
        attackY = randomNumber(10)
    }
    if (ourState[attackY][attackX] === state.ship) {
        ourState[attackY][attackX] = state.hit
        msgs.push("We hit your ship at " + attackX + "/" + attackY)
    } else if (ourState[attackY][attackX] === state.water) {
        ourState[attackY][attackX] = state.miss
        msgs.push("We hit water at " + attackX + "/" + attackY)
    }

    let playerWinCheck = checkEndGame(otherState)
    let enemyWinCheck = checkEndGame(ourState)
    let allowTurns = true
    if (playerWinCheck) {
        msgs.push("You win the game!")
        allowTurns = false
    } else if (enemyWinCheck) {
        msgs.push("You lost the game!")
        allowTurns = false
    }

    // Don't know if reassigning is necessary (can't hurt)
    req.session.otherState = otherState
    req.session.ourState = ourState
    
    res.json({ourState: ourState, otherState: hideShips(otherState), myTurn: allowTurns, serverMessages: msgs})
})

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
    if (!validateBoard(ourState)) {
        throw 'Board is not valid'
    }
    req.session.ourState = ourState
    const otherState = createRandomBoard()
    req.session.otherState = otherState
    res.json({ourState: ourState, otherState: hideShips(otherState), myTurn: true, serverMessages: []})
})

app.listen(port, () => {
    console.log("Server running on port " + port);
});

