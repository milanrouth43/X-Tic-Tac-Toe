document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const statusText = document.getElementById("status");
    const resetBtn = document.getElementById("resetBtn");
    
    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];

    function handleCellClick(e) {
        const cell = e.target;
        const index = cell.getAttribute("data-index");

        if (board[index] !== "" || !gameActive) return;

        board[index] = currentPlayer;
        cell.innerText = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase()); 

        checkWinner();
    }

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
            
            statusText.style.color = currentPlayer === "X" ? "#ff6b6b" : "#48dbfb";
            gameActive = false;
            return;
        }

        if (!board.includes("")) {
            statusText.innerText = "It's a Draw!";
            statusText.style.color = "#000";
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.innerText = `Player ${currentPlayer}'s Turn`;
    }

    function resetGame() {
        board = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        gameActive = true;
        
        statusText.innerText = "Player X's Turn";
        statusText.style.color = "#000"; 

        cells.forEach(cell => {
            cell.innerText = "";
            cell.classList.remove("x", "o");
        });
    }

    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    resetBtn.addEventListener("click", resetGame);
});
