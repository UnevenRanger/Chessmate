//Reference for the Users Actions in the GUI
var UserMove = {}
UserMove.to = keySquares.noSquare;
UserMove.from = keySquares.noSquare;

//JQuery for detecting clicks on the page by ...

//...Piece
$(document).on('click', '.Piece', function (e) {
    if (UserMove.from == keySquares.noSquare) {
        UserMove.from = ClickSquare(e.pageX, e.pageY);
    }
    else {
        UserMove.to = ClickSquare(e.pageX, e.pageY);
    }

    MakeUserMove();
});

//...Square
$(document).on('click', '.ChessSquare', function (e) {
    if (UserMove.from != keySquares.noSquare) {
        UserMove.to = ClickSquare(e.pageX, e.pageY);
        MakeUserMove();
    }
});

//Process the Users Move
function MakeUserMove()
{
    //If the User has clicked on a From and To Square
    if (UserMove.from != keySquares.noSquare && UserMove.to != keySquares.noSquare)
    {
        console.log("User Move: " + PrintSquare(UserMove.from) + ", " + PrintSquare(UserMove.to));

        //Check the Move is even possible
        var parsed = ParseMove(UserMove.from, UserMove.to);

        //If a legal move
        if (parsed != noMove)
        {
            console.log("Move Legal: True");

            //Make the Move
            MakeMove(parsed);

            //Print Debugging Board to the Console
            PrintBoard();

            //Move the Piece Chosen
            MoveGUIPiece(parsed);

            //Generate Possible Moves for the next player
            GenerateMoves();

            //Print Debugging List of Possible Moves to the Console
            PrintMoveList();
        }
        else
        {
            console.log("Move Legal: Not True");
        }

        //Deselect

        UserMove.from = keySquares.noSquare;
        UserMove.to = keySquares.noSquare;
    }
}

//Allow User to Click Squares on the Chessboard
function ClickSquare(pageX, pageY)
{
    var position = $('#chessboard').position();

    var workedX = Math.floor(position.left);
    var workedY = Math.floor(position.top);

    var pageX = Math.floor(pageX);
    var pageY = Math.floor(pageY);

    var file = Math.floor((pageX - workedX) / 60);
    var rank = 7 - Math.floor((pageY - workedY) / 60);

    var square = fileRanktoSquare(file, rank);

    console.log("Clicked on: " + file + ", " + rank);
    SelectSquare(square);

    return square;
}

//Select Clicked Square
function SelectSquare(square) {
    $('.ChessSquare').each(function () {
        PieceIsOnSquare(square, $(this).position().top, $(this).position().left);
    });
}


function PieceIsOnSquare(square, top, left) {
    if ((ranksBoard[square] == 7 - Math.round(top / 60)) && filesBoard[square] == Math.round(left / 60)) {
        return Bool.true;
    }
    else {
        return Bool.false;
    }
}

function RemoveGUIPiece(square) {
    $('.Piece').each(function () {
        if (PieceIsOnSquare(square, $(this).position().top, $(this).position().left)) {
            $(this).remove();
        }
    });
}

function AddGUIPiece(square, piece) {
    console.log("called");
    var file = filesBoard[square];
    var rank = ranksBoard[square];

    var rankName = 'rank' + (rank + 1);
    var fileName = 'file' + (file + 1);


    pieceFileName = "images/" + sideChar[PieceColour[piece]] + pieceChar[piece].toUpperCase() + ".png";
    imageString = "<img src=\"" + pieceFileName + "\" class=\"Piece " + rankName + " " + fileName + "\"/>";
    $("#chessboard").append(imageString);
}



//Move Piece in the GUI
function MoveGUIPiece(move)
{
    var from = FromSquare(move);
    var to = ToSquare(move);

    var file = filesBoard[to];
    var rank = ranksBoard[to];

    var rankName = 'rank' + (rank + 1);
    var fileName = 'file' + (file + 1);

    if (move & moveEnPassant)
    {
        var epRemove;
        if (GameBoard.side == colours.black)
        {
            epRemove = to - 10;
        }
        else {
            epRemove = to + 10;
        }
        RemoveGUIPiece(epRemove);
    }
    else if (Captured(move))
    {
        RemoveGUIPiece(to);
    }

    $('.Piece').each(function ()
    {
        if (PieceIsOnSquare(from, $(this).position().top, $(this).position().left))
        {
            $(this).removeClass();
            $(this).addClass("Piece " + rankName + " " + fileName);
        }
    });

    if (move & moveCastling)
    {
        switch (to)
        {
            case keySquares.G1:
                RemoveGUIPiece(keySquares.H1);
                AddGUIPiece(keySquares.F1, pieces.whiteRook);
                break;
            case keySquares.C1:
                RemoveGUIPiece(keySquares.A1);
                AddGUIPiece(keySquares.D1, pieces.whiteRook);
                break;
            case keySquares.G8:
                RemoveGUIPiece(keySquares.H8);
                AddGUIPiece(keySquares.F8, pieces.blackRook);
                break;
            case keySquares.C8:
                RemoveGUIPiece(keySquares.A8);
                AddGUIPiece(keySquares.D8, pieces.blackRook);
                break;
        }
    }
    else if (Promoted(move))
    {
        RemoveGUIPiece(to);
        AddGUIPiece(to, Promoted(move));
    }
}

//Debugging Function to Print A Singular Move
function PrintMove(move)
{
    var moveString;

    var fromFile = filesBoard[FromSquare(move)];
    var fromRank = ranksBoard[FromSquare(move)];
    var toFile = filesBoard[ToSquare(move)];
    var toRank = ranksBoard[ToSquare(move)];
    var promoted = Promoted(move);

    moveString = fileChar[fromFile] + rankChar[fromRank] + fileChar[toFile] + rankChar[toRank];

    if (promoted != pieces.empty)
    {
        var promotionChar = 'q';

        if (PieceKnight[promoted] == Bool.true)
        {
            promotionChar = 'Knight';
        }
        else if (PieceRookQueen[promoted] == Bool.true && PieceBishopQueen[promoted] == Bool.false)
        {
            promotionChar = 'Rook';
        }
        else if (PieceRookQueen[promoted] == Bool.false && PieceBishopQueen[promoted] == Bool.true)
        {
            promotionChar = 'Bishop';
        }

        moveString += promotionChar;
    }

    return moveString;
}

//Debugging Function to Print Possible Moves
function PrintMoveList()
{
    var move
    var moveNum = 1;
    console.log('MoveList:');

    for (i = GameBoard.moveListStart[GameBoard.play]; i < GameBoard.moveListStart[GameBoard.play + 1]; i++)
    {
        move = GameBoard.moveList[i];
        console.log("Move " + moveNum + ": " + PrintMove(move));
        moveNum++;
    }
}

//Check if the Move the Player attempted to make is Legal
function ParseMove(from, to)
{
    GenerateMoves();
    PrintMoveList();
    var move = noMove;
    var promotionPiece = pieces.Empty;
    var found = Bool.false;

    for (i = GameBoard.moveListStart[GameBoard.play]; i < GameBoard.moveListStart[GameBoard.play + 1]; ++i)
    {
        move = GameBoard.moveList[i];
        if (FromSquare(move) == from && ToSquare(move) == to)
        {
            promotionPiece = Promoted(move);
            if (promotionPiece != pieces.empty)
            {
                if (promotionPiece == pieces.whiteQueen && GameBoard.side == colours.white || promotionPiece == pieces.blackQueen && GameBoard.side == colours.black)
                {
                    found = Bool.true;
                    break;
                }
            }

            found = Bool.true;
            break;
        }
    }

    
    if (found != Bool.false)
    {
        if (MakeMove(move) == Bool.false)
        {
            return noMove;
        }

        TakeMove();
        return move;
    }

    return noMove;
}