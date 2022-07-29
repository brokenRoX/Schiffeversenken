const state = {
    water: "water",
    ship: "ship",
    hit: "hit",
    miss: "miss",
    unknown: "unknown"
}

const game = {
    gameStarted: false,
    boardsize: {x: 10, y: 10},
    boardIds: [],
    startbuttonId: undefined,
    ourState: [],
    otherState: [],
    myTurn: true,
    messageDiv: undefined,
    drawboard: function(boardDivId) {
        const board = document.getElementById(boardDivId)
        for (let y = 0; y < this.boardsize.y; y++) {
            for (let x = 0; x < this.boardsize.x; x++) {
                const field = document.createElement("div")
                field.classList.add("field")
                field.id = boardDivId + "_" + x + "_" + y

                field.addEventListener("click", async function() { 
                    await game.onClick(boardDivId, x, y)
                })
                board.appendChild(field)
            }
        }
    },
    initializeStartButton: function(startgameId) {
        this.startbuttonId = startgameId
        document.getElementById(startgameId).addEventListener("click", async function() {
            await game.startgame()
        })
    },
    initializeMessage: function(messageDivId) {
        this.messageDiv = document.getElementById(messageDivId)
    },
    startgame: async function() {
        //todo: check if ships are placed correctly
        const response = await fetch(
            "/startgame",
            {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.ourState),
                credentials: "include" // https://stackoverflow.com/questions/34558264/fetch-api-with-cookie
            })
        const message = await response.json()
        this.serverUpdate(message)
        this.gameStarted = true
    },
    onClick: async function(boardId, x, y) {
        const isOurs = boardId === this.boardIds[0]
        if (isOurs) {
            if (this.gameStarted) return
            this.toggleShip(x, y)
            return
        }
    
        if (!this.myTurn || !this.gameStarted) return

        this.myTurn = false //makes sure, that the player can't click another field until the server message allows the player to make another move.
        await this.attack(x, y)
        console.log("clicked " + (isOurs) + x + y)
    },
    toggleShip: function(x, y) {
        if (this.ourState[y][x] === state.water) this.ourState[y][x] = state.ship
        else this.ourState[y][x] = state.water
        this.updateUi()
    },
    updateUiBoard: function(boardId, boardState) {
        for (let y = 0; y < this.boardsize.y; y++) {
            for (let x = 0; x < this.boardsize.x; x++) {
                const fieldId = boardId + "_" + x + "_" + y
                const currentField = document.getElementById(fieldId)
                Object.values(state).forEach(currentState => currentField.classList.remove(currentState))
                // same as currentField.classList.remove(state.water, state.ship, state.hit, state.miss, state.unknown)
                currentField.classList.add(boardState[y][x])
            }
        }
    },
    updateUi: function() {
        this.updateUiBoard(this.boardIds[0], this.ourState)
        this.updateUiBoard(this.boardIds[1], this.otherState)
    },
    attack: async function(x, y) {
        const response = await fetch(
            "/attack",
            {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({x: x, y: y}),
                credentials: "include" // https://stackoverflow.com/questions/34558264/fetch-api-with-cookie
            })
        const message = await response.json()
        this.serverUpdate(message)
    },
    serverUpdate: function(message) {
        this.ourState = message.ourState
        this.otherState = message.otherState
        this.myTurn = message.myTurn
        let displayMessage = ""
        for (let m of message.serverMessages) {
            displayMessage += m + "<br/>"
        }
        this.messageDiv.innerHTML = displayMessage
        this.updateUi()
    }
}

function initialize(myShipsDivId, otherShipsDivId, startgameId, messagesDivId) {
    game.boardIds.push(myShipsDivId)
    game.boardIds.push(otherShipsDivId)
    game.drawboard(myShipsDivId)
    game.drawboard(otherShipsDivId)
    game.initializeStartButton(startgameId)
    game.initializeMessage(messagesDivId)

    for (let y = 0; y < game.boardsize.y; y++) {
        let ourRow = []
        let otherRow = []
        for (let x = 0; x < game.boardsize.x; x++) {
            ourRow.push(state.water)
            otherRow.push(state.unknown)
        }
        game.ourState.push(ourRow)
        game.otherState.push(otherRow)
    }
    for (let i = 0; i < 5; i++) game.ourState[0][i] = state.ship
    for (let i = 0; i < 4; i++) game.ourState[0][i + 6] = state.ship
    for (let i = 0; i < 4; i++) game.ourState[2][i] = state.ship
    for (let i = 0; i < 3; i++) game.ourState[2][i + 5] = state.ship
    for (let i = 0; i < 3; i++) game.ourState[4][i] = state.ship
    for (let i = 0; i < 3; i++) game.ourState[4][i + 4] = state.ship
    for (let i = 0; i < 2; i++) game.ourState[4][i + 8] = state.ship
    for (let i = 0; i < 2; i++) game.ourState[6][i] = state.ship
    for (let i = 0; i < 2; i++) game.ourState[6][i + 3] = state.ship
    for (let i = 0; i < 2; i++) game.ourState[6][i + 6] = state.ship
    
    game.updateUi()

}