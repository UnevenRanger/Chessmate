$(function ()
{
    Init();
})

function Init()
{
    InitGameBoard();
    InitHashKeys();
    InitBoardVariables();
    InitSquareArrayConversion()
    SearchPosition();
    NewGame();
}

function InitGameBoard()
{
    var index = 0;
    var file = files.fileA;
    var rank = ranks.rank1;
    var square = keySquares.A1;

    //First set up a board of "offboard" tiles
    for (i = 0; i < boardSquaresNumber; i++)
    {
        filesBoard[i] = keySquares.offboard;
        ranksBoard[i] = keySquares.offboard;
    }

    //Secondly for each rank and file, set the appropriate rank and file for that square
    for (rank = ranks.rank1; rank <= ranks.rank8; rank++)
    {
        for (file = files.fileA; file <= files.fileH; file++)
        {
            square = fileRanktoSquare(file, rank);
            filesBoard[square] = file;
            ranksBoard[square] = rank;
        }
    }
}

function InitHashKeys()
{
    for (i = 0; i < 16; i++)
    {
        PieceKeys[i] = Random32();
    }

    SideKey = Random32();

    for (i = 0; i < 16; i++)
    {
        CastleKeys[i] = Random32();
    }
}

function InitBoardVariables()
{
    for (i = 0; i < maxGameMoves; i++)
    {
        GameBoard.history.push(
            {
                move: noMove,
                castlePermission: 0,
                enPassant: 0,
                fiftyMove: 0,
                positionKey: 0
            });
    }

    for (i = 0; i < pvEntries; i++)
    {
        GameBoard.pvTable.push({
            move: noMove,
            positionKey: 0
        });
    }
}

function InitSquareArrayConversion() {
    var file = files.fileA;
    var rank = ranks.rank1;
    var square = keySquares.A1;
    var square64 = 0;

    //Reset the Arrays
    for (i = 0; i < boardSquaresNumber; i++) {
        Square120ToSquare64[i] = 65;
    }
    for (i = 0; i < 64; i++) {
        Square64ToSquare120[i] = 120;
    }

    //Go through Rank by Rank, File by File, and set the Array points
    for (rank = ranks.rank1; rank <= ranks.rank8; rank++)
    {
        for (file = files.fileA; file <= files.fileH; file++)
        {
            //Get the 120 based Array Square using fileRanktoSquare()
            square = fileRanktoSquare(file, rank);

            //Set Square64ToSquare120 at index[square64] to equal 120 array based square 
            Square64ToSquare120[square64] = square;

            //Set Square120ToSquare64 at index[square] to equal square64
            Square120ToSquare64[square] = square64;

            //Square64 increases by 1
            square64++;
        }
    }
}

function InitBoardSquares()
{
    var light = 0;
    var lastLight = 0;
    var rankName;
    var fileName;
    var divString;
    var lightString;

    for (i = ranks.rank8; i >= ranks.rank1; i--)
    {
        light = lastLight ^ 1;
        lastLight ^= 1;

        rankName = "rank" + (i + 1);

        for (j = files.fileA; j <= files.fileH; j++)
        {
            fileName = "file" + (j + 1);

            if (light == 0)
            {
                lightString = "Light";
            }
            else 
            {
                lightString = "Dark";
            }

            divString = "<div class=\"ChessSquare " + rankName + " " + fileName + " " + lightString + "\"/>";
            light ^= 1;

            $("#chessboard").append(divString);
        }
    }
}

function NewGame(fenStr)
{
    ParseFEN(startFen);
    InitBoardSquares();
    SetInitialBoardPieces();
}

function ClearAllPieces()
{
    $(".Piece").remove();
}

function SetInitialBoardPieces()
{
    ClearAllPieces();

    var square;
    var square120;
    var file;
    var rank;
    var fileName;
    var rankName;
    var imageString;
    var pieceFIleName;
    var piece;

    for (square = 0; square < 64; square++)
    {
        square120 = GetSquare120(square);
        piece = GameBoard.pieces[square120];
        file = filesBoard[square120];
        rank = ranksBoard[square120];

        if (piece >= pieces.whitePawn && piece <= pieces.blackKing)
        {
            AddGUIPiece(square120, piece);
        }
    }

}