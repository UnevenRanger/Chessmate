function PrintSquare(square)
{
    return (fileChar[filesBoard[square]] + rankChar[ranksBoard[square]]);
}

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

        if (PieceKnight[promoted] == Bool.true) {
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