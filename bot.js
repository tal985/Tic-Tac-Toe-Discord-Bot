const Discord = require("discord.js");
const bot = new Discord.Client();
const prefix = require("./settings.json").prefix;
var fs = require("fs");
const token = fs.readFileSync("./token.txt", "utf8");
var gameOn = false;
var playerFirst = false;
var gamelogic = require("./gamelogic.js");
var spl;


///Initialize Discord Bot
bot.on("ready", () => 
{
    console.log("Logged in as " + bot.user.tag + ".");
});

bot.on("message", message => 
{
    if (message.content.substring(0, prefix.length).toLocaleLowerCase() == prefix)
    {
        var msg = null;
        var cmd = message.content.substring(prefix.length).split(" ")[0].toLowerCase();
               
        //Commands available only before the game starts.
        if (!gameOn)
        {
            switch (cmd)
            {
                //Randomly determines who goes first.
                case "surpriseme":
                    if(Math.random() > 0.5)
                    {
                        playerFirst = true;
                        spl = new gamelogic.SinglePlayerLogic(playerFirst);
                        msg = "Player goes first as X." + spl.b.displayBoard();
                    }   
                    else
                    {
                        spl = new gamelogic.SinglePlayerLogic(playerFirst);
                        spl.AIStart();
                        msg = "Player goes second as O." + spl.b.displayBoard();
                    }
                    gameOn = true;
                    break;
                //Player goes first as X.
                case "x":
                    spl = new gamelogic.SinglePlayerLogic(playerFirst);
                    msg = "Player goes first as X." + spl.b.displayBoard();
                    playerFirst = true;
                    gameOn = true;
                    break;
                //Player goes second as O.
                case "o":
                    spl = new gamelogic.SinglePlayerLogic(playerFirst);
                    spl.AIStart();
                    msg = "Player goes second as O." + spl.b.displayBoard();
                    gameOn = true;
                    break;
            }
        }
        //Commands available only after the game starts.
        else 
        {
            //Placement command.
            if(cmd.length == 2 && /^[0-9]*$/.test(cmd))
            {
                var row = parseInt(cmd.substring(0, 1));
                var col = parseInt(cmd.substring(1));

                if(row >= 0 && row <= 2 && col >= 0 && col <= 2)
                {
                    var temp = spl.run(row, col);
                    if(temp == undefined)
                        msg = "Placing at row " + row + ", column " + col + ".";
                    else
                        msg = temp;
                    msg += spl.b.displayBoard();
                    if(spl.b.isGameOver())
                    {
                        if(spl.b.hasAIWon())
                            msg = "AI has won!";
                        //Impossible
                        else if(spl.b.hasPlayerWon())
                            msg = "Player has won!";
                        else
                            msg = "It's a draw!";
                        msg += "\nResetting game state." + spl.b.displayBoard();
                        resetGame();
                    }
                }
                else
                    msg = "ERROR: Invalid parameters." + spl.b.displayBoard();
            }
        }

        //Always available commands.
        switch(cmd)
        {
            //Display game status.
            case "status":
                if(gameOn)
                {
                    msg = "Game in progress.\n Player is ";
                    if(playerFirst == true)
                        msg += "X." + spl.b.displayBoard();
                    else
                        msg += "O." + spl.b.displayBoard();
                }
                else
                    msg = "No game in progress.";
                break;
            //Reset variables for the game.
            case "reset":
                resetGame();
                msg = "Resetting game state.";
                break;
            //Help command
            case "help":
                msg = 
                    "**Available Commands (Case Insensitive)** \
                    \nhelp - This command. \
                    \nstatus - Displays status of game. \
                    \nreset - Resets the game state";
                
                if(!gameOn)
                {
                    msg += 
                    "\nsurpriseme - Randomizes who goes first.\
                    \nX - Set player to go first as X. \
                    \nO - Set player to go second as O."
                }
                else
                {
                    msg += 
                    "\nXY - X and Y are integers from 0-2 indicating the row and column respectively."
                }
        }

        //Send message.
        if (msg != null)
        {
            message.channel.send(msg);
            msg = null;
        }
    }
});

function resetGame()
{
    playerFirst = false;
    gameOn = false;
}

bot.login(token);