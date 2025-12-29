export function createBoardDisplay(gameBoardObj, container) {
    // Add ARIA grid role to container for semantic structure
    container.setAttribute("role", "grid");
    container.setAttribute(
        "aria-labelledby",
        container.id.replace("-div", "-label")
    );

    for (let j = 0; j <= gameBoardObj.y; j++) {
        for (let i = 0; i <= gameBoardObj.x; i++) {
            // x coord titles (row headers)
            if (i === 0 && j !== 0) {
                let div = document.createElement("div");
                div.classList.add("gameboard-title");
                div.setAttribute("role", "rowheader");
                div.setAttribute("aria-label", `Row ${j}`);
                const p = document.createElement("p");
                p.textContent = j;
                div.appendChild(p);
                container.appendChild(div);
                // y coord titles (column headers)
            } else if (j === 0 && i !== 0) {
                let div = document.createElement("div");
                div.classList.add("gameboard-title");
                div.setAttribute("role", "columnheader");
                const columnLetter = String.fromCharCode(64 + i);
                div.setAttribute("aria-label", `Column ${columnLetter}`);
                const p = document.createElement("p");
                p.textContent = i;
                div.appendChild(p);
                container.appendChild(div);
                // First cell is empty
            } else if (j === 0 && i === 0) {
                let div = document.createElement("div");
                div.classList.add("empty-div");
                div.setAttribute("role", "presentation");
                container.appendChild(div);
                // game squares (grid cells)
            } else if (i !== 0 && j !== 0) {
                let div = document.createElement("div");
                div.classList.add("gameboard-div");
                // Add data attributes
                div.setAttribute("data-x", i);
                div.setAttribute("data-y", j);
                // Add ARIA grid cell semantics
                const columnLetter = String.fromCharCode(64 + i);
                div.setAttribute("role", "gridcell");
                div.setAttribute(
                    "aria-label",
                    `Column ${columnLetter}, Row ${j}`
                );
                div.setAttribute("aria-colindex", i);
                div.setAttribute("aria-rowindex", j);
                div.setAttribute("tabindex", "0");
                container.appendChild(div);
            }
        }
    }
}

export function renderShips(gameBoardObj, container, hide = false) {
    for (let shipInfo of gameBoardObj.ships) {
        for (let coord of shipInfo.allCoords) {
            const [x, y] = coord;

            //Find cell
            const cell = container.querySelector(
                `[data-x="${x}"][data-y="${y}"]`
            );

            cell.classList.add("ship-cell");
            cell.setAttribute("ship-id", `ship-${shipInfo.ship.id}`);

            // Update ARIA label to include ship information
            const columnLetter = String.fromCharCode(64 + x);
            const baseLabel = `Column ${columnLetter}, Row ${y}`;
            if (!hide) {
                cell.setAttribute("aria-label", `${baseLabel}, Ship placed`);
                cell.classList.remove("hidden-cell");
            } else {
                cell.setAttribute("aria-label", baseLabel);
                cell.classList.add("hidden-cell");
            }
        }
    }
}

export function clearShipsDisplay(container) {
    container.querySelectorAll(".gameboard-div").forEach((div) => {
        div.classList.remove("ship-cell");
        div.classList.remove("attacked-cell");
        div.classList.remove("sunk-cell");
        div.classList.remove("cell-user-marked");
        div.removeAttribute("ship-id");
        // restore base ARIA label without ship info
        const x = div.getAttribute("data-x");
        const y = div.getAttribute("data-y");
        if (x && y) {
            const columnLetter = String.fromCharCode(64 + Number(x));
            div.setAttribute("aria-label", `Column ${columnLetter}, Row ${y}`);
        }
    });
}
