// const PLAYER_ONE = 1;
// const PLAYER_TWO = 2;
// const EMPTY = 0;
// const DEFAULT_BOARD: number[] = '0'.repeat(81).split('').map((x) => parseInt(x));
// const DEFAULT_WON_BOARDS: number[] = '0'.repeat(9).split('').map((x) => parseInt(x));

// class Game {
//   private board: number[];
//   private wonBoards: number[];
//   private turn: number;
//   private unlockedBoard: number;
//   private gameOver: boolean;
//   private winningPlayer: number | null;
//   private moveCount: number;

//   constructor({
//     board = DEFAULT_BOARD,
//     wonBoards = DEFAULT_WON_BOARDS,
//     turn = PLAYER_ONE,
//     unlockedBoard = -1,
//   } = {}) {
//     this.board = board;
//     this.wonBoards = wonBoards;
//     this.turn = turn;
//     this.unlockedBoard = unlockedBoard;
//     this.gameOver = false;
//     this.winningPlayer = null;
//     this.moveCount = 0;
//     // this.load()
//   }

//   getWinningPlayer(){
//     return this.winningPlayer
//   }

//   move(index){
//     if(typeof index !== "number")
//         throw new Error('Incorrect argument provided to move method.')
//     const boardIndex = Math.floor(index / 9)

//     if( this.isGameOver()){
//         throw new Error("Invalid move: game is alread over.")
//     }else if (this.wonBoards[boardIndex] != 0){
//         throw new Error("Invalid move: this board has already been won.")
//     }

//     const newBoard = this.board.slice()
//     const turn = this.turn
//     newBoard[index] = turn 

//     const newTurn = turn == PLAYER_ONE?  PLAYER_TWO : PLAYER_ONE;
//     const newWonBoards = this.getWonBoards({board: newBoard, index, turn})

//     const unlockedBoard = this.getUnlockedBoard({move:index, board: newBoard, turn: newTurn})

//     this.board = newBoard,
//     this.turn = newTurn,
//     this.unlockedBoard = unlockedBoard,
//     this.wonBoards = newWonBoards
//     this.checkIfGameOver()
//     this.moveCount++
//     return true
//   }

//   getUnlockedBoard({move, board, turn } = {}){
//     if(!board) return this.unlockedBoard
//     const newWonBoards = this.getWonBoards({board, index:move, turn})

//     const sum = (listOfNumbers) => listOfNumbers.reduce((a,b) => a+b, 0)

//     let unlockedBoard = sum(newWonBoards) !== sum(this.wonBoards) || newWonBoards[move % 9] > 0? -1: move % 9

//     let movesAvailable = false
//     for(let i = unlockedBoard * 9; i < unlockedBoard * 9 + 9; ++i){
//         if(board[i] === 0){
//             movesAvailable = true
//         }
//     }

//     if(!movesAvailable){
//         unlockedBoard = -1
//     }
//     return unlockedBoard
//   }

//   checkIfGameOver(board, turn) {
//     const wonBoards = !board ? this.wonBoards : board

//     if ((wonBoards[0] === wonBoards[1] && wonBoards[0] === wonBoards[2] && wonBoards[0] !== EMPTY) ||
//       (wonBoards[3] === wonBoards[4] && wonBoards[3] === wonBoards[5] && wonBoards[3] !== EMPTY) ||
//       (wonBoards[6] === wonBoards[7] && wonBoards[6] === wonBoards[8] && wonBoards[6] !== EMPTY) ||
//       (wonBoards[0] === wonBoards[3] && wonBoards[0] === wonBoards[6] && wonBoards[0] !== EMPTY) ||
//       (wonBoards[1] === wonBoards[4] && wonBoards[1] === wonBoards[7] && wonBoards[1] !== EMPTY) ||
//       (wonBoards[2] === wonBoards[5] && wonBoards[2] === wonBoards[8] && wonBoards[2] !== EMPTY) ||
//       (wonBoards[0] === wonBoards[4] && wonBoards[0] === wonBoards[8] && wonBoards[0] !== EMPTY) ||
//       (wonBoards[2] === wonBoards[4] && wonBoards[2] === wonBoards[6] && wonBoards[2] !== EMPTY) ||
//       !wonBoards.includes(0)
//     ) {
//       const winningPlayer = !wonBoards.includes(0) ? null : this.turn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE
//       if (!board) {
//         this.gameOver = true
//         this.winningPlayer = winningPlayer
//       } else {
//         return winningPlayer
//       }
//       return true
//     }
//   }
//   isGameOver() {
//     return this.gameOver
//   }
//   getBoard() {
//     return this.board
//   }
//   getPlayerTurn() {
//     return this.turn
//   }
//   getWonBoards({ board = null, index = null, turn = null } = {}) {
//     if (!board) {
//       return this.wonBoards
//     }
//     const boardIndex = Math.floor(index / 9) * 9
//     const newWonBoards = this.wonBoards.slice()

//     // Checks for wins along columns
//     for (let c = 0; c < 3; ++c) {
//       if (board[boardIndex + c] === board[boardIndex + c + 3] &&
//         board[boardIndex + c] === board[boardIndex + c + 6] &&
//         board[boardIndex + c] !== 0) {
//         newWonBoards[boardIndex / 9] = turn
//         return newWonBoards
//       }
//     }

//     // Checks for wins along rows
//     for (let r = 0; r < 3; ++r) {
//       if (board[boardIndex + (r * 3)] === board[boardIndex + (r * 3 + 1)] &&
//         board[boardIndex + (r * 3)] === board[boardIndex + (r * 3 + 2)] &&
//         board[boardIndex + (r * 3)] !== 0) {
//         newWonBoards[boardIndex / 9] = turn
//         return newWonBoards
//       }
//     }

//     // Checks for wins along diagonals
//     if ((
//       (board[boardIndex] === board[boardIndex + 4] && board[boardIndex] === board[boardIndex + 8]) ||
//       (board[boardIndex + 2] === board[boardIndex + 4] && board[boardIndex + 2] === board[boardIndex + 6])
//     ) &&
//       board[boardIndex + 4] !== 0
//     ) {
//       newWonBoards[boardIndex / 9] = turn
//       return newWonBoards
//     }

//     // Checks if board has any moves available
//     let movesAvailable = false
//     for (let i = boardIndex; i < boardIndex + 9; ++i) {
//       if (board[i] === 0) {
//         movesAvailable = true
//       }
//     }

//     if (!movesAvailable) {
//       newWonBoards[boardIndex / 9] = -1
//     }

//     return newWonBoards
//   }

//   getMoves({ board = this.board, unlockedBoard = this.unlockedBoard, turn = this.turn, wonBoards = this.wonBoards } = {}) {
//     let min = 0
//     let max = 80
//     if (unlockedBoard >= 0) {
//       min = unlockedBoard * 9
//       max = unlockedBoard * 9 + 9
//     }

//     const moves = []
//     for (let i = min; i <= max; ++i) {
//       if (board[i] === 0 && wonBoards[Math.floor(i / 9)] === 0) {
//         moves.push(i)
//       }
//     }
//     return moves
//   }

//   print() {
//     const rows = ['', '', '', '', '', '', '', '', '']
//     for (let r = 0; r < 9; ++r) {
//       for (let c = 0; c < 9; ++c) {
//         const cDest = (c < 3) ? c : (c < 6) ? (r + 1) * 9 : (r + 2) * 9

//         if (this.board[cDest] === PLAYER_ONE) rows[r] += 'x'
//         else if (this.board[cDest] === PLAYER_TWO) rows[r] += 'o'
//         else rows[r] += '-'

//         if (c === 2 || c === 5) {
//           rows[r] += '|'
//         }
//       }
//     }
//     let output = '...........' + '\n'
//     for (let i = 0; i < rows.length; ++i) {
//       output += rows[i] + '\n'
//       if ((i + 1) % 3 === 0) {
//         output += '...........' + '\n'
//       }
//     }

//     return output
//   }



//   // Example TypeScript Method:
//   public getPlayerTurn(): number {
//     return this.turn;
//   }
  
//   // Other methods...

//   // Example TypeScript Method:
//   public getMoveCount(): number {
//     return this.moveCount;
//   }
// }

// export default Game;
