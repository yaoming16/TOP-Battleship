export function createBoardDisplay(gameBoardObj, container) {
    for (let j = 0; j <= gameBoardObj.y; j++) {
        for (let i = 0; i <= gameBoardObj.x; i++) {
            // x coord titles
            if (i === 0 && j !== 0) {
                let div = document.createElement("div");
                div.classList.add("gameboard-title");
                const p = document.createElement("p");
                p.textContent = j;
                div.appendChild(p);
                container.appendChild(div);
                // y coord titles
            } else if (j === 0 && i !== 0) {
                let div = document.createElement("div");
                div.classList.add("gameboard-title");
                const p = document.createElement("p");
                p.textContent = i;
                div.appendChild(p);
                container.appendChild(div);
                // First cell is empty
            } else if (j === 0 && i === 0) {
                let div = document.createElement("div");
                div.classList.add("empty-div");
                container.appendChild(div);
                // game squares
            } else if (i !== 0 && j !== 0) {
                let div = document.createElement("div");
                div.classList.add("gameboard-div");
                // Add data attributes
                div.setAttribute("data-x", i);
                div.setAttribute("data-y", j);
                container.appendChild(div);
            }
        }
    }
}

export function renderShips(gameBoardObj, container) {
    for (let shipInfo of gameBoardObj.ships) {
        for (let coord of shipInfo.allCoords) {
            const [x, y] = coord;

            //Find cell
            const cell = container.querySelector(
                `[data-x="${x}"][data-y="${y}"]`
            );
            if (cell) cell.classList.add("ship-cell");
            cell.setAttribute("ship-id", `ship-${shipInfo.ship.id}`);
        }
    }
}
