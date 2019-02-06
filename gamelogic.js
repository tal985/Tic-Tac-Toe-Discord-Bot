//Modified from code by Jatin Thakur on codebytes.in

class Point
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    toString()
    {
        return "(" + this.x + ", " + this.y + ")";
    }
}

class Board
{
    //Initialize variables.
    constructor(isX)
    {
        this.isX = isX;
        this.computersMove;
        this.board = new Array(3);
        for(var i = 0; i < 3; i++)
            this.board[i] = new Array(3).fill(0);
    }

    //Check if game is over.
    isGameOver()
    {
        if(this.getAvailStates().length == 0 || this.hasAIWon() || this.hasPlayerWon())
            return true;
        return false;
    }

    //Check to see if AI has won
    hasAIWon()
    {
        //Check for diagonal
        if(this.board[0][0] == this.board[1][1] && this.board[0][0] == this.board[2][2] && this.board[0][0] == 1)
            return true;
        if(this.board[0][2] == this.board[1][1] && this.board[0][2] == this.board[2][0] && this.board[0][2] == 1)
            return true;   
        
        //Check for horizontal and vertical
        for(var i = 0; i < 3; ++i)
        {
            if(this.board[i][0] == this.board[i][1] && this.board[i][0] == this.board[i][2] && this.board[i][0] == 1)
                return true;
            if(this.board[0][i] == this.board[1][i] && this.board[0][i] == this.board[2][i] && this.board[0][i] == 1)
                return true;
        }
        return false;
    }

    //Check to see if player has won
    hasPlayerWon()
    {
        //Check for diagonal
        if(this.board[0][0] == this.board[1][1] && this.board[0][0] == this.board[2][2] && this.board[0][0] == 2)
            return true;
        if(this.board[0][2] == this.board[1][1] && this.board[0][2] == this.board[2][0] && this.board[0][2] == 2)
            return true;   
        
        //Check for horizontal and vertical
        for(var i = 0; i < 3; ++i)
        {
            if(this.board[i][0] == this.board[i][1] && this.board[i][0] == this.board[i][2] && this.board[i][0] == 2)
                return true;
            if(this.board[0][i] == this.board[1][i] && this.board[0][i] == this.board[2][i] && this.board[0][i] == 2)
                return true;
        }
        return false;
    }

    //Return list of available points.
    getAvailStates()
    {
        var availPoints = [];

        for(var i = 0; i < 3; i++)
            for(var j = 0; j < 3; j++)
                if(this.board[i][j] == 0)
                    availPoints.push(new Point(i, j));

        return availPoints;
    }

    //SP: player = 1 for computer, 2 for the human
    placeMove(point, player)
    {
        this.board[point.x][point.y] = player;
    }

    //Display current state of the board.
    displayBoard()
    {
        var msg = "\n";
        for(var i = 0; i < 3; i++)
        {
            for(var j = 0; j < 3; j++)
            {
                var temp = this.board[i][j].toString();
                if(temp == "0")
                    msg += "[ ] ";
                else if(temp == "1")
                {
                    if(this.isX)
                        msg += "[O] ";
                    else
                        msg += "[X] ";
                }
                else
                    if(this.isX)
                        msg += "[X] ";
                    else
                        msg += "[O] ";
            }
            msg += "\n";
        }
        return msg;
    }

    minimax(depth, turn)
    {
        if(this.hasAIWon())
            return +1;
        if(this.hasPlayerWon())
            return -1;

        var availPoints = this.getAvailStates();
        if(availPoints.length == 0)
            return 0;

        var min = Number.MAX_SAFE_INTEGER;
        var max = Number.MIN_SAFE_INTEGER;
        

        for(var i = 0, len = availPoints.length; i < len; ++i)
        {
            var point = availPoints[i];
            if(turn == 1)
            {
                this.placeMove(point, 1);
                var currentScore = this.minimax(depth + 1, 2);
                max = Math.max(currentScore, max);

                if(currentScore >= 0)
                    if(depth == 0)
                        this.computersMove = point;
                if(currentScore == 1)
                {
                    this.board[point.x][point.y] = 0; 
                    break;
                }
                if(i == availPoints.length - 1 && max < 0)
                {
                    if(depth == 0)
                        this.computersMove = point;
                }
            }
            else if(turn == 2)
            {
                this.placeMove(point, 2);
                var currentScore = this.minimax(depth + 1, 1);
                min = Math.min(currentScore, min);
                if(min == -1)
                {
                    this.board[point.x][point.y] = 0;
                    break;
                }
            }
            this.board[point.x][point.y] = 0;
        }
        return turn == 1?max:min;
    }
}

class SinglePlayerLogic
{
    constructor(isX)
    {
        this.b = new Board(isX);
    }
    //AI's first move
    AIStart()
    {
        var p = new Point(Math.round(Math.random()) * 2, Math.round(Math.random()) * 2);
        this.b.placeMove(p, 1);
    }

    //Player move
    run(x, y)
    {
        if(!this.b.isGameOver())
        {
            var availPoints = this.b.getAvailStates();
            var playerMove = new Point(x, y);

            if(this.isIn(playerMove, availPoints))
                this.b.placeMove(playerMove, 2);
            else
                return "ERROR: Spot unavailable! Please enter a valid spot.";
            

            if(this.b.isGameOver())
                return "Game Over!";
            
            this.b.minimax(0, 1);
            this.b.placeMove(this.b.computersMove, 1);
        }
    }

    //Check if point is in the available spots array
    isIn(point, pointArray)
    {
        for(var i = 0, len = pointArray.length; i < len; i++)
            if(pointArray[i].toString() == point.toString())
                return true;
        return false;
    }
}

module.exports = 
{
    Board:Board,
    Point:Point,
    SinglePlayerLogic:SinglePlayerLogic
}


