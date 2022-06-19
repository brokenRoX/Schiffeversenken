const game = {
    "boardsize": [10, 10],
    "boardIds": [],
    "drawboard": function(boardDivId) {
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
    "onClick": function(boardId, x, y) {
        const isOurs = boardId === this.boardIds[0]
        if (isOurs) return
        
        console.log("clicked " + (isOurs) + x + y)
    }
}

function initialize(myShipsDivId, otherShipsDivId) {
    game.boardIds.push(myShipsDivId)
    game.boardIds.push(otherShipsDivId)
    game.drawboard(myShipsDivId)
    game.drawboard(otherShipsDivId)
}

