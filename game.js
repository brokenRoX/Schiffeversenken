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
    ourState: [],
    otherState: [],
    drawboard: function(boardDivId) {
        const board = document.getElementById(boardDivId)
        for (let y = 0; y < this.boardsize[1]; y++) {
            for (let x = 0; x < this.boardsize[0]; x++) {
                const field = document.createElement("div")
                field.classList.add("field")
                field.id = boardDivId + "_" + x + "_" + y

                field.addEventListener("click", function() { 
                    game.onClick(boardDivId, x, y)
                })
                board.appendChild(field)
            }
        }
    },
    onClick: function(boardId, x, y) {
        const isOurs = boardId === this.boardIds[0]
        if (isOurs) return
        
        console.log("clicked " + (isOurs) + x + y)
    },
    updateUiBoard: function(boardId, boardState) {
        for (let y = 0; y < this.boardsize[1]; y++) {
            for (let x = 0; x < this.boardsize[0]; x++) {
                const fieldId = boardId + "_" + x + "_" + y
                const currentField = document.getElementById(fieldId)
                currentField.classList.remove(state.water, state.ship, state.hit, state.miss)
                currentField.classList.add(boardState[y][x])
            }
        }
    },
    updateUi: function() {
        this.updateUiBoard(this.boardIds[0], this.ourState)
        this.updateUiBoard(this.boardIds[1], this.otherState)
    }
}

function initialize(myShipsDivId, otherShipsDivId) {
    game.boardIds.push(myShipsDivId)
    game.boardIds.push(otherShipsDivId)
    game.drawboard(myShipsDivId)
    game.drawboard(otherShipsDivId)

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

