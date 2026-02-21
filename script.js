document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const statusText = document.getElementById("status");
    const resetBtn = document.getElementById("resetBtn");
    
    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;

    // All possible winning combinations (rows, columns, diagonals)
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Handles a user clicking a cell
    function handleCellClick(e) {
        const cell = e.target;
        const index = cell.getAttribute("data-index");

        // Stop if the cell is full or game is over
        if (board[index] !== "" || !gameActive) return;

        // Update board array and UI
        board[index] = currentPlayer;
        cell.innerText = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase()); // Adds the 'x' or 'o' class for neon colors

        checkWinner();
    }

    // Checks if the current move won the game
    function checkWinner() {
        let roundWon = false;

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusText.innerText = `Player ${currentPlayer} Wins! 🎉`;
            statusText.style.color = currentPlayer === "X" ? "#ff2a6d" : "#05d9e8";
            statusText.style.textShadow = `0 0 10px ${currentPlayer === "X" ? "rgba(255,42,109,0.8)" : "rgba(5,217,232,0.8)"}`;
            gameActive = false;
            return;
        }

        // Check for a draw
        if (!board.includes("")) {
            statusText.innerText = "It's a Draw!";
            statusText.style.color = "#fff";
            statusText.style.textShadow = "none";
            gameActive = false;
            return;
        }

        // Switch turns
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.innerText = `Player ${currentPlayer}'s Turn`;
    }

    // Resets the game to start over
    function resetGame() {
        board = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        gameActive = true;
        
        statusText.innerText = "Player X's Turn";
        statusText.style.color = "#fff";
        statusText.style.textShadow = "none";

        cells.forEach(cell => {
            cell.innerText = "";
            cell.classList.remove("x", "o");
        });
    }

    // Add event listeners
    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    resetBtn.addEventListener("click", resetGame);
});