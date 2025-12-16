export default function createBoardDisplay(gameBoardObj, container) {
    for (let i = 0; i <= gameBoardObj.x; i++) {
        for (let j = 0; j <= gameBoardObj.y; j++) {
            // First cell is empty
            if (i === 0 && j !== 0) {
                let div = document.createElement("div");
                div.classList.add("gameboard-title");
                const p = document.createElement("p");
                p.textContent = j;
                div.appendChild(p);
                container.appendChild(div);
                //x coord titles
            } else if (j === 0 && i !== 0) {
                let div = document.createElement("div");
                div.classList.add("gameboard-title");
                const p = document.createElement("p");
                p.textContent = i;
                div.appendChild(p);
                container.appendChild(div);
                //y coord titles
            } else if (j === 0 && i === 0) {
                let div = document.createElement("div");
                div.classList.add("empty-div");
                container.appendChild(div);
                // game squares
            } else if (i !== 0 && j !== 0) {
                let div = document.createElement("div");
                div.classList.add("gameboard-div");
                container.appendChild(div);
            }
        }
    }
}