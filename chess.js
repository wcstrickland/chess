class Piece{
    constructor(xPos, yPos){
        this.xPos = xPos
        this.yPos = yPos
    }

    movePiece(board, xPos, yPos){
        let availableMoves = this.getAvailable(board)
        let desired = {"x": xPos, "y": yPos}
        if(contains(availableMoves, desired)){
            board[this.yPos][this.xPos] = 0
            this.xPos = xPos;
            this.yPos = yPos;
            board[this.yPos][this.xPos] = this
        }else{
            console.log("you cant do that")
        }
    }

    showMoves(board){
        let availableMoves = this.getAvailable(board)
        let tempBoard = [];
        // matrixes pass by reference so we have to make a copy manually
        for(let row of board){
            tempBoard.push(row.map(x => x))
        }
        for(let move of availableMoves){
            if(tempBoard[move.y][move.x].color!==this.color){
                tempBoard[move.y][move.x] = {"symbol": "X"}
            }
        }
        printBoard(tempBoard)
    }

    boundsCheck(rawMoves){
        return rawMoves.filter(move => move.x>-1 && move.x<8 && move.y>-1 && move.y<8)
    }

    bishopMoves(board){
        let availableMoves = [];

        // right/down
        let curX = this.xPos + 1
        let curY = this.yPos + 1
        while(curX<8 && curY<8){
            if(board[curY][curX]===0){
                availableMoves.push({"x": curX, "y": curY})
            }else if(board[curY][curX].color!==this.color){
                availableMoves.push({"x": curX, "y": curY})
                break
            }else{
                break
            }
            curX++
            curY++
        }

        // left/up
        curX = this.xPos - 1
        curY = this.yPos - 1
        while(-1<curX && -1<curY){
            if(board[curY][curX]===0){
                availableMoves.push({"x": curX, "y": curY})
            }else if(board[curY][curX].color!==this.color){
                availableMoves.push({"x": curX, "y": curY})
                break
            }else{
                break
            }
            curX--
            curY--
        }

        // right/up
        curX = this.xPos + 1
        curY = this.yPos - 1
        while(curX<8 && -1<curY){
            if(board[curY][curX]===0){
                availableMoves.push({"x": curX, "y": curY})
            }else if(board[curY][curX].color!==this.color){
                availableMoves.push({"x": curX, "y": curY})
                break
            }else{
                break
            }
            curX++
            curY--
        }

        // left/down
        curX = this.xPos - 1
        curY = this.yPos + 1
        while(-1<curX && curY<8){
            if(board[curY][curX]===0){
                availableMoves.push({"x": curX, "y": curY})
            }else if(board[curY][curX].color!==this.color){
                availableMoves.push({"x": curX, "y": curY})
                break
            }else{
                break
            }
            curX--
            curY++
        }
        return availableMoves
    }


    rookMoves(board){

        let filteredXs = []
        // left
        for(let i = this.xPos - 1;-1<i;i--){
            if(board[this.yPos][i]===0){
                filteredXs.push({"x": i, "y": this.yPos})
            }else if(board[this.yPos][i].color !== this.color){
                filteredXs.push({"x": i, "y": this.yPos})
                break
            }else{
                break
            }
        }
        // right
        for(let i = this.xPos + 1;i<8;i++){
            if(board[this.yPos][i]===0){
                filteredXs.push({"x": i, "y": this.yPos})
            }else if(board[this.yPos][i].color !== this.color){
                filteredXs.push({"x": i, "y": this.yPos})
                break
            }else{
                break
            }
        }

        let filteredYs = []
        // down
        for(let i = this.yPos - 1;-1<i;i--){
            if(board[i][this.xPos]===0){
                filteredYs.push({"x": this.xPos, "y": i})
            }else if(board[i][this.xPos].color !== this.color){
                filteredYs.push({"x": this.xPos, "y": i})
                break
            }else{
                break
            }
        }
        // up
        for(let i = this.yPos + 1;i<8;i++){
            if(board[i][this.xPos]===0){
                filteredYs.push({"x": this.xPos, "y": i})
            }else if(board[i][this.xPos].color !== this.color){
                filteredYs.push({"x": this.xPos, "y": i})
                break
            }else{
                break
            }
        }
        return [...filteredXs, ...filteredYs]
    }
}


class Pawn extends Piece{
    constructor(xPos, yPos, color){
        super(xPos, yPos)
        this.color = color
        this.symbol = this.color==="white" ? "P" : "p"
    }
    getAvailable(board){
        // capture spots
        let rawMoves = [
            {"x": this.xPos + 1, "y": this.color==="black" ? this.yPos + 1 : this.yPos -1},
            {"x": this.xPos - 1, "y": this.color==="black" ? this.yPos + 1 : this.yPos -1}
        ]
        // filter illegal
        let legalMoves = this.boundsCheck(rawMoves)
        // make sure an enemy piece is in the capture zone
        let filteredMoves = legalMoves.filter(move => getPiece(board, move.x, move.y)!==0 && getPiece(board, move.x, move.y).color!==this.color)
        // add the 1 move forward if empty. keep at end
        if(getPiece(board, this.xPos, this.color==="black" ? this.yPos + 1 : this.yPos -1)===0){
            filteredMoves.push({"x": this.xPos, "y": this.color==="black" ? this.yPos + 1 : this.yPos -1})
        }
        return filteredMoves
    }
}

class Knight extends Piece{
    constructor(xPos, yPos, color){
        super(xPos, yPos)
        this.color = color
        this.symbol = this.color==="white" ? "N" : "n"
    }
    getAvailable(board){
        let rawMoves = [
            {"x": this.xPos + 1, "y": this.yPos + 2},
            {"x": this.xPos - 1, "y": this.yPos + 2},
            {"x": this.xPos + 1, "y": this.yPos - 2},
            {"x": this.xPos - 1, "y": this.yPos - 2},
            {"x": this.xPos + 2, "y": this.yPos + 1},
            {"x": this.xPos - 2, "y": this.yPos + 1},
            {"x": this.xPos + 2, "y": this.yPos - 1},
            {"x": this.xPos - 2, "y": this.yPos - 1},
        ]
        let legalMoves = this.boundsCheck(rawMoves)
        return legalMoves.filter(move => board[move.y][move.x]===0||board[move.y][move.x].color!==this.color)
    }
}


class King extends Piece{
    constructor(xPos, yPos, color){
        super(xPos, yPos)
        this.color = color
        this.symbol = this.color==="white" ? "K" : "k"
    }

    getThreatened(board){
        let enemyPieces = [];
        for(let row of board){
            for(let square of row){
                if(square!==0 && square.color!==this.color){
                    enemyPieces.push(square)
                }
            }
        }
        let threatenedSquares = [];
        for(let enemy of enemyPieces){
            threatenedSquares.push(...enemy.getAvailable(board))
        }
        return threatenedSquares
    }

    getAvailable(board){
        //TODO prevent moving into check
        let rawMoves = [
            {"x": this.xPos + 1, "y": this.yPos + 1},
            {"x": this.xPos - 1, "y": this.yPos + 1},
            {"x": this.xPos + 1, "y": this.yPos - 1},
            {"x": this.xPos - 1, "y": this.yPos - 1},
            {"x": this.xPos + 1, "y": this.yPos + 1},
            {"x": this.xPos - 1, "y": this.yPos + 1},
            {"x": this.xPos + 1, "y": this.yPos - 1},
            {"x": this.xPos - 1, "y": this.yPos - 1},
        ]
        let filteredMoves =  rawMoves.filter(move => move.x>-1 && move.x<8 && move.y>-1 && move.y<8)
        let safeMoves = [];
        for(let move of filteredMoves){
            if(!(contains(this.getThreatened(board), move))){
                safeMoves.push(move)
            }
        }
        return safeMoves
    }
}

class Rook extends Piece{
    constructor(xPos, yPos, color){
        super(xPos, yPos)
        this.color = color
        this.symbol = this.color==="white" ? "R" : "r"
    }

    getAvailable(board){
        return this.rookMoves(board)
    }
}

class Bishop extends Piece{
    constructor(xPos, yPos, color){
        super(xPos, yPos)
        this.color = color
        this.symbol = this.color==="white" ? "B" : "b"
    }

    getAvailable(board){
        return this.bishopMoves(board)
    }
}

class Queen extends Piece{
    constructor(xPos, yPos, color){
        super(xPos, yPos)
        this.color = color
        this.symbol = this.color==="white" ? "Q" : "q"
    }

    getAvailable(board){
        return [...this.bishopMoves(board),...this.rookMoves(board)]
    }
}

function contains(arr, target){
    for(let each of arr){
        if(each.x===target.x&&each.y===target.y){
            return true
        }
    }
    return false
}



function getPiece(board, xPos, yPos){
    return board[yPos][xPos]
}

function initBoard(){
    let board = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ]
     for(let i=0;i<board[6].length;i++){
         let pawn = new Pawn(i,6, "white")
         board[6][i] = pawn
     }
     for(let i=0;i<board[1].length;i++){
         let pawn = new Pawn(i,1, "black")
         board[1][i] = pawn
     }
    board[0][0] = new Rook(0,0, "black")
    board[0][7] = new Rook(7,0, "black")
    board[7][0] = new Rook(0,7, "white")
    board[7][7] = new Rook(7,7, "white")

    board[0][1] = new Knight(1,0, "black")
    board[0][6] = new Knight(6,0, "black")
    board[7][1] = new Knight(1,7, "white")
    board[7][6] = new Knight(6,7, "white")

    board[0][2] = new Bishop(2,0, "black")
    board[0][5] = new Bishop(5,0, "black")
    board[7][2] = new Bishop(2,7, "white")
    board[7][5] = new Bishop(5,7, "white")

    board[7][3] = new Queen(3,7, "white")
    board[7][4] = new King(4,7, "white")

    board[0][3] = new King(3,0, "black")
    board[0][4] = new Queen(4,0, "black")
    return board
}

function printBoard(board){
    console.log()
    for(let i = 0; i<8; i++){
        console.log(`${i} | ${board[i][0].symbol || 0} ${board[i][1].symbol || 0} ${board[i][2].symbol || 0} ${board[i][3].symbol || 0} ${board[i][4].symbol || 0} ${board[i][5].symbol || 0} ${board[i][6].symbol || 0} ${board[i][7].symbol || 0} |`)
    }
    console.log("    0 1 2 3 4 5 6 7")
    console.log()
}

function getSpaceColor( xPos, yPos){
    if(xPos%2===0){
        return yPos%2===0 ?  "white" : "black"
    }else{
        return yPos%2===0 ?  "black" : "white"
    }
}

let board = initBoard()
printBoard(board)
let knight = getPiece(board, 6, 7)
knight.showMoves(board)
knight.movePiece(board, 5, 5)
printBoard(board)
knight.showMoves(board)









