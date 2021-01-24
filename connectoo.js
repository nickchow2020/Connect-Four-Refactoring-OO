class Game {
    constructor(height,width){
        this.height = height 
        this.width = width 
        this.currenPlayer = 1 
        this.board = [] 
        this.makeBoard()
        this.makeHtmlBoard()
        this.startBoard()
        this.startOver()
        this.player1
        this.player2
    }

    startBoard(){
        const player1 = document.getElementById("player1")
        const player1Color = document.getElementById("player1Color")
        const player2 = document.getElementById("player2")
        const player2Color = document.getElementById("player2Color")

        const submit = document.querySelector('input[type="submit"]')
        const game = document.getElementById("game")
        submit.addEventListener("click",(e)=>{
            e.preventDefault()

            this.player1 = new Player(player1.value,player1Color.value)
            this.player2 = new Player(player2.value,player2Color.value)

            if(player1.value && player2.value && player1Color.value && player2Color.value){
                submit.parentNode.parentNode.style.display = "none"
                game.style.display = "block"
            }else{
                alert("Please input Players Name and Token Color")
            }
            
        })
    }

    makeBoard(){
        for(let h = 0; h < this.height; h ++){
            this.board.push(Array.from({length: this.width}))
        }
    }

    makeHtmlBoard(){
        const board = document.getElementById("board")

        const top = document.createElement("tr")
        top.setAttribute("id","column-top")
        top.addEventListener("click",this.handleClick.bind(this))

        for(let w = 0; w < this.width; w ++){
            const headCell = document.createElement('td');
            headCell.setAttribute("id",w)
            top.appendChild(headCell)
        }

        board.appendChild(top)

        for(let h = 0; h < this.height; h ++){
            const boards = document.createElement("tr")
            for(let w = 0; w < this.width; w++){
                const cell = document.createElement("td")
                cell.setAttribute("id",`${h}-${w}`)
                boards.appendChild(cell)
            }
            board.appendChild(boards)
        }
    }

    findSpotForCol(wIdx){
        for(let h = this.height - 1; h >= 0; h--){
            if(!this.board[h][wIdx]){
                return h
            }
        }

        return null
    }

    placeInTable(y, x){
        const piece = document.createElement("div")
        piece.classList.add('piece')   
        this.currenPlayer === 1 ? piece.style.backgroundColor= `${this.player1.tokenColor}`: piece.style.backgroundColor = `${this.player2.tokenColor}`;
        const spot = document.getElementById(`${y}-${x}`)
        spot.appendChild(piece)
    }

    checkForWin(){
        const _win = function(cells){
            return cells.every(
                ([hIdx,wIdx]) => 
                hIdx >= 0 && 
                hIdx < this.height && 
                wIdx >= 0 && 
                wIdx < this.width && 
                this.board[hIdx][wIdx] === this.currenPlayer
            )
        }.bind(this)

        for(let h = 0; h < this.height; h ++){
            for(let w = 0; w < this.width; w ++){
                const horiz = [[h, w], [h, w + 1], [h, w + 2], [h, w + 3]];
                const vert = [[h, w], [h + 1, w], [h + 2, w], [h + 3, w]];
                const diagDR = [[h, w], [h + 1, w + 1], [h + 2, w + 2], [h + 3, w + 3]];
                const diagDL = [[h, w], [h + 1, w - 1], [h + 2, w - 2], [h + 3, w - 3]];

                if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                    return true;
                }
            }
        }
    }

    endGame(msg){
        alert(msg)
        window.location.reload()
    }

    handleClick(e){
        const wIdx = +e.target.id
        const hIdx = this.findSpotForCol(wIdx)
        
        if(hIdx === null) return 

        this.board[hIdx][wIdx] = this.currenPlayer
        this.placeInTable(hIdx,wIdx)

        if(this.checkForWin()){
            let winner;
            this.currenPlayer === 1 ? winner = this.player1.name : winner = this.player2.name
            return this.endGame(`Player ${winner} won!`)
        }

        if(this.board.every(row => row.every(cell => cell))){
            return this.endGame("Tie!")
        }

        this.currenPlayer = this.currenPlayer === 1 ? 2 : 1

        const strong = document.querySelector("strong")
        this.currenPlayer === 1 ? strong.innerText = this.player1.name : strong.innerText = this.player2.name
    }

    startOver(){
        document.getElementById("start_over").addEventListener("click",()=>{
            window.location.reload();
        })
    }
}


class Player {
    constructor(name,tokenColor){
        this.name = name
        this.tokenColor = tokenColor
    }
}

const connect4 = new Game(6,7)