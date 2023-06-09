const COLOUR_LISTENERS = [];
const BUTTON_LISTENERS = [];

const NAV_GRID = {};
let current_nav = [0,0];

const COLOURS = ["yellow", "blue", "red", "green"];
let current_colour = "";

BUTTON_LISTENERS.push(button => {
    let delta = {
        "ArrowUp": [-1, 0],
        "ArrowDown": [1, 0],
        "ArrowRight": [0, 1],
        "ArrowLeft": [0, -1],
    }[button];

    console.log(delta);

    if(delta) {
        let [x, y] = current_nav;
        let prop_x = x + delta[0];
        let prop_y = y + delta[1];

        focus_nav_grid(prop_x, prop_y);
    }
});

for(const parent of document.getElementsByClassName("fun-keyboard--parent")) {
    const input = document.getElementById(parent.getAttribute("for"));
    const results = document.getElementById(parent.getAttribute("results"));
    initKeyboard(parent, input, results);
}

window.__TAURI__.event.listen("button", ({payload}) => {
    BUTTON_LISTENERS.forEach(x=>x(payload.button));

    if(["Yellow", "Blue", "Red", "Green"].includes(payload.button) && current_colour != payload.button) {
        COLOUR_LISTENERS.forEach(x=>x(payload.button.toLowerCase()));
        current_colour = payload.button;
    } else {
        COLOUR_LISTENERS.forEach(x=>x(""));
        current_colour = "";
    }
});

focus_nav_grid(0, 0);

/**
 * 
 * @param {HTMLDivElement} parentElement 
 */
function initKeyboard(parentElement, input, results) {
    for(let column = 0; column < 3; column++) {
        for(let row = 0; row < 4; row++) {
            let button = makeKeyboardButton(row, column, input, results);
            parentElement.appendChild(button);
        }
    }

    COLOUR_LISTENERS.push(color => {
        if(color) parentElement.setAttribute("coloured", color);
        else parentElement.removeAttribute("coloured");
    });
}

function focus_nav_grid(x, y) {
    const oldElem = NAV_GRID[`${current_nav}`];
    let elem = NAV_GRID[`${x},${y}`];

    if(!elem) {
        let h = navGridColHeight(y);
        if(h != 0) {
            x = h - 1;
            elem = NAV_GRID[`${x},${y}`];
        }
    }

    if(!elem) return;

    oldElem.classList.remove("pointer-focused");

    elem.focus();
    elem.addEventListener("blur", function l() {
        elem.removeEventListener(blur, l);

        elem.classList.remove("pointer-focused");
    });
    elem.classList.add("pointer-focused");

    current_nav = [x, y];
}

function navGridColHeight(column) {
    for(let i = 0; ; i++) {
        //assume columns are contiguous: if one cell isn't there, stop.
        if(!(`${i},${column}` in NAV_GRID)) return i;
    }
}

function removeNavGridCol(column) {
    for(let i = 0; ; i++) {
        //assume columns are contiguous: if one cell isn't there, stop.
        if(!(`${i},${column}` in NAV_GRID)) break;

        delete NAV_GRID[`${i},${column}`];
    }
}

function updateResults(results, searchTerm) {
    results.innerHTML = "";
    removeNavGridCol(3);
    if(searchTerm == "") return;

    console.log("searchingupdate");

    const searched = MOVIES.filter(x=>x.toLowerCase().startsWith(searchTerm.toLowerCase()));

    for(const search of searched) {
        const item = document.createElement("div");
        item.classList.add("search-item");
        item.setAttribute("tabIndex", 0);
        item.textContent = search;

        NAV_GRID[`${results.childElementCount},3`] = item;
        results.appendChild(item);
    }
}

function makeKeyboardButton(row, column, input, results) {
    const child = document.createElement("div");
    child.classList.add("fun-keyboard--num-button");
    child.setAttribute("tabIndex", 0);

    child.style.gridArea = `${row + 1} / ${column + 1}`;
    NAV_GRID[`${row},${column}`] = child;

    const num = document.createElement("span");
    num.textContent = getNumText(row, column);
    num.classList.add("num");

    let inputWhenPress = num.textContent;

    COLOUR_LISTENERS.push(color => {
        if(color == "") {
            inputWhenPress = num.textContent = getNumText(row, column);
        } else {
            let bigDisplay = getOpts(row, column)[getIndexOfColour(color)] || "";
            inputWhenPress = bigDisplay;

            if (bigDisplay == " ") bigDisplay = "_";
            if(bigDisplay == "") bigDisplay = "\xa0"; //nbsp to prevent layout shift
            num.textContent = bigDisplay;
        }
    })

    BUTTON_LISTENERS.push(button => {
        if (button == "Num" + getNumText(row, column)) {
            input.textContent += inputWhenPress;
            updateResults(results, input.textContent);
        } else if(button == "NumMinus" && getNumText(row, column) == "-") {
            input.textContent = input.textContent.substring(0, input.textContent.length - 1);
            updateResults(results, input.textContent);
        }
    });

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
function getIndexOfColour(colour) {
    return COLOURS.indexOf(colour);
}

function getOptColour(index) {
    return COLOURS[index];
}

function getOpts(row, column) {
    return [
        ["", "ABC", "DEF"],
        ["GHI", "JKL", "MNO"],
        ["PQRS", "TUV", "WXYZ"],
        ["", "    ", ""],
    ][row][column];
}

function getNumText(row, column) {
    return [
        ["1", "2", "3"],
        ["4", "5", "6"],
        ["7", "8", "9"],
        ["-", "0", " "],
    ][row][column];
}