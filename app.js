const gameTileList = document.querySelectorAll(".gameTile");
const gameTiles = [...gameTileList];

function Gameboard() {
  function resetBoard() {
    const gameboard = [];
    const rows = 3;
    const columns = 3;

    for (let i = 0; i < rows; i++) {
      const rowArray = [];
      for (let i = 0; i < columns; i++) {
        rowArray.push("");
      }
      gameboard.push(rowArray);
    }
    return gameboard;
  }

  const gameboard = resetBoard();

  const getBoard = () => gameboard;

  function convertCellRef(cellRef) {
    let row = 0;
    if (cellRef === 0) {
      row = 0;
    } else {
      row = Math.floor(cellRef / 3);
    }
    const cell = cellRef % 3;

    return [row, cell];
  }

  const { updateBoardDisplay } = ViewController();

  function markCell(cellRef, token) {
    const [row, cell] = convertCellRef(cellRef);
    if (gameboard[row][cell] !== "") {
      return false;
    }
    gameboard[row][cell] = token;
    updateBoardDisplay(gameboard);
    return true;
  }

  return { getBoard, markCell };
}

//////////////////////////////////////////////////////////////////////////////////////

function GameController() {
  const { getBoard, markCell } = Gameboard();
  const { updateTurnDisplay, displayWin } = ViewController();

  let playingRound = true;

  function createPlayer(name, token) {
    let score = 0;

    function increaseScore() {
      score++;
    }

    const getName = () => name;
    const getToken = () => token;
    const getScore = () => score;

    return { getName, getToken, getScore, increaseScore };
  }

  const playerOne = createPlayer("Player One", "X");
  const playerTwo = createPlayer("Player Two", "O");

  let activePlayer = playerOne;

  const getActiveToken = () => activePlayer.getToken();

  function checkWin() {
    const board = getBoard();
    const token = activePlayer.getToken();
    let winningCells = null;

    // Horizontal Check
    for (let i = 0; i < 3; i++) {
      const horizontalCheck = [board[i][0], board[i][1], board[i][2]].filter(
        (cell) => cell === token
      );
      horizontalCheck.length === 3
        ? (winningCells = [i * 3, i * 3 + 1, i * 3 + 2])
        : null;
    }

    // Vertical Check
    for (let i = 0; i < 3; i++) {
      const verticalCheck = [board[0][i], board[1][i], board[2][i]].filter(
        (cell) => cell === token
      );
      verticalCheck.length === 3 ? (winningCells = [i, i + 3, i + 6]) : null;
    }

    // Diagonal Checks
    const rightDiagonalCells = [board[0][0], board[1][1], board[2][2]].filter(
      (cell) => cell === token
    );
    rightDiagonalCells.length === 3 ? (winningCells = [0, 4, 8]) : null;

    const leftDiagonalCells = [board[0][2], board[1][1], board[2][0]].filter(
      (cell) => cell === token
    );
    leftDiagonalCells.length === 3 ? (winningCells = [2, 4, 6]) : null;

    if (winningCells) {
      playingRound = false;
      displayWin(winningCells);
    }
  }

  function changePlayersTurn() {
    if (!playingRound) {
      return;
    }

    if (activePlayer === playerOne) {
      activePlayer = playerTwo;
    } else {
      activePlayer = playerOne;
    }
    updateTurnDisplay();
  }

  gameTiles.forEach((tile) => {
    const cellRef = gameTiles.indexOf(tile);
    tile.addEventListener("click", () => {
      const token = getActiveToken();
      if (playingRound) {
        const procceed = markCell(cellRef, token);
        checkWin();
        procceed && changePlayersTurn();
      }
    });
  });

  return;
}

/////////////////////////////////////////////////////////////////////////////////////////

function ViewController() {
  const playerOneDisplay = document.querySelector(".player-one");
  const playerTwoDisplay = document.querySelector(".player-two");

  function updateTurnDisplay() {
    playerOneDisplay.classList.toggle("currentTurn");
    playerTwoDisplay.classList.toggle("currentTurn");
  }

  function updateBoardDisplay(gameboard) {
    const linearGameboard = [...gameboard[0], ...gameboard[1], ...gameboard[2]];
    let i = 0;
    gameTiles.forEach((tile) => {
      tile.textContent = linearGameboard[i];
      tile.classList.remove("winningTile");
      i++;
    });
  }

  function displayWin(winningCells) {
    winningCells.forEach((cellRef) =>
      gameTiles[cellRef].classList.add("winningTile")
    );
  }

  return { updateTurnDisplay, updateBoardDisplay, displayWin };
}

///////////////////////////////////////////////////////////////////////////////////

GameController();
