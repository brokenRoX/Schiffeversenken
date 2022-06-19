const game = {
    "boardsize": [10, 10],
    "drawboard": function(boardDivId) {
        const board = document.getElementById(boardDivId)
        for (let y = 0; y < this.boardsize[1]; y++) {
            for (let x = 0; x < this.boardsize[0]; x++) {
                const field = document.createElement("div")
                field.classList.add("field")
                field.id = boardDivId + "_" + x + "_" + y
                board.appendChild(field)
                

            }
        }
    }

}