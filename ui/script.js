for(const parent of document.getElementsByClassName("fun-keyboard--parent")) {
    initKeyboard(parent);
}

window.__TAURI__.event.listen("button", ({payload}) => {
    console.log(payload);
});

/**
 * 
 * @param {HTMLDivElement} parentElement 
 */
function initKeyboard(parentElement) {
    for(let column = 0; column < 3; column++) {
        for(let row = 0; row < 4; row++) {
            let button = makeKeyboardButton(row, column);
            parentElement.appendChild(button);
        }
    }
}

function makeKeyboardButton(row, column) {
    const child = document.createElement("div");
    child.classList.add("fun-keyboard--num-button");

    child.style.gridArea = `${row + 1} / ${column + 1}`;

    const num = document.createElement("span");
    num.textContent = getNumText(row, column);
    num.classList.add("num");

    const opts = document.createElement("span");
    opts.classList.add("opts");
    for(const op of getOpts(row, column)) {
        const opElem = document.createElement("span");
        opElem.classList.add("op");
        opElem.classList.add(getOptColour(opts.childElementCount));
        opElem.textContent = op;
        opts.appendChild(opElem);
    }

    child.appendChild(num);
    child.appendChild(opts);

    return child;
}

function getOptColour(index) {
    return ["yellow", "blue", "red", "green"][index];
}

function getOpts(row, column) {
    return [
        ["", "ABC", "DEF"],
        ["GHI", "JKL", "MNO"],
        ["PQRS", "TUV", "WXYZ"],
        ["", "", ""],
    ][row][column];
}

function getNumText(row, column) {
    return [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
        ["-", "0", "OK"],
    ][row][column];
}