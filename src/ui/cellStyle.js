export function changeCellClasses(attackResult, cell, playerDiv) {
    const currentLabel = cell.getAttribute("aria-label");

    if (attackResult === "hit" || attackResult === "miss") {
        cell.classList.add("attacked-cell");
        // Update ARIA label to announce result
        const resultText = attackResult === "hit" ? "Hit" : "Miss";
        cell.setAttribute("aria-label", `${currentLabel}, ${resultText}`);
    } else if (attackResult === "sunk") {
        cell.classList.add("attacked-cell");
        let allSunkShipDivs = playerDiv.querySelectorAll(
            `[ship-id="${cell.getAttribute("ship-id")}"]`
        );
        allSunkShipDivs.forEach((sunkShipCell) => {
            sunkShipCell.classList.add("sunk-cell");
            const sunkLabel = sunkShipCell.getAttribute("aria-label");
            sunkShipCell.setAttribute("aria-label", `${sunkLabel}, Ship sunk`);
        });
    }
}

export function toggleCellMarked(cell) {
    if (cell.classList.contains("cell-user-marked")) {
        cell.classList.remove("cell-user-marked");
    } else {
        cell.classList.add("cell-user-marked");
    }
}
