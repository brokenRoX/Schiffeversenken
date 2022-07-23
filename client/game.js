const state = {
    water: "water",
    ship: "ship",
    hit: "hit",
    miss: "miss",
    unknown: "unknown"
}

const game = {
    boardsize: [10, 10],
    boardIds: [],
    startbuttonId: undefined,
    ourState: [],
    otherState: [],
    myTurn: true,
    drawboard: function(boardDivId) {
        const board = document.getElementById(boardDivId)
        for (let y = 0; y < this.boardsize[1]; y++) {
            for (let x = 0; x < this.boardsize[0]; x++) {
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
    startgame: async function() {
        //todo: check if ships are placed correctly
        const response = await fetch(
            "http://localhost:3000/startgame",
            {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(this.ourState)
            })
        const message = await response.json()
        this.serverUpdate(message)
    },
    onClick: async function(boardId, x, y) {
        const isOurs = boardId === this.boardIds[0]
        if (isOurs) return
        if (!this.myTurn) return

        this.myTurn = false //makes sure, that the player can't click another field until the server message allows the player to make another move.
        await this.attack(x, y)
        console.log("clicked " + (isOurs) + x + y)
    },
    updateUiBoard: function(boardId, boardState) {
        for (let y = 0; y < this.boardsize[1]; y++) {
            for (let x = 0; x < this.boardsize[0]; x++) {
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
        const response = await fetch("http://localhost:3000/attack") //todo: send coordinates
        const message = await response.json()
        this.serverUpdate(message)
    },
    serverUpdate: function(message) {
        this.ourState = message.ourState
        this.otherState = message.otherState
        this.myTurn = message.myTurn
        //todo: display message.serverMessages
        this.updateUi()
    }
}

function initialize(myShipsDivId, otherShipsDivId, startgameId) {
    game.boardIds.push(myShipsDivId)
    game.boardIds.push(otherShipsDivId)
    game.drawboard(myShipsDivId)
    game.drawboard(otherShipsDivId)
    game.initializeStartButton(startgameId)

    for (let y = 0; y < game.boardsize[1]; y++) {
        let ourRow = []
        let otherRow = []
        for (let x = 0; x < game.boardsize[0]; x++) {
            ourRow.push(state.water)
            otherRow.push(state.unknown)
        }
        game.ourState.push(ourRow)
        game.otherState.push(otherRow)
    }
    game.updateUi()

}