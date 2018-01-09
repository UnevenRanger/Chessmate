function MakeMove(move)
{
    var from = FromSquare(move);
    var to = ToSquare(move);
    var side = GameBoard.side;

    GameBoard.history[GameBoard.playHistory].positionKey = GameBoard.positionKey;

    if ((move & moveEnPassant) != 0)
    {
        if (side == colours.white)
        {
            ClearPiece(to - 10);
        }
        else
        {
            ClearPiece(to + 10);
        }
    }
    else if ((move & moveCastling) != 0)
    {
        //Move the Rook to its new Square
        switch (to)
        {
            case keySquares.C1:
                MovePiece(keySquares.A1, keySquares.D1);
                break;
            case keySquares.C8:
                MovePiece(keySquares.A8, keySquares.D8);
                break;
            case keySquares.G1:
                MovePiece(keySquares.H1, keySquares.F1);
                break;
            case keySquares.G8:
                MovePiece(keySquares.H8, keySquares.F8);
                break;
            default: break;
        }
    }

    if (GameBoard.enPassant != keySquares.noSquare)
    {
        HashEnPassant();
    }

    HashCastlingPermission();

    GameBoard.history[GameBoard.playHistory].move = move;
    GameBoard.history[GameBoard.playHistory].fifyMove = GameBoard.fifyMove;
    GameBoard.history[GameBoard.playHistory].enPassant = GameBoard.enPassant;
    GameBoard.history[GameBoard.playHistory].castlePermission = GameBoard.castlePermission;

    GameBoard.castlePermission &= castlePermissions[from];
    GameBoard.castlePermission &= castlePermissions[to];
    GameBoard.enPassant = keySquares.noSquare;

    HashCastlingPermission();

    var captured = Captured(move);
    GameBoard.fifyMove++;

    if (captured != pieces.empty)
    {
        console.log(to);
        ClearPiece(to);
        GameBoard.fifyMove = 0;
    }

    GameBoard.historyPlay++;
    GameBoard.play++;

    if (PiecePawn[GameBoard.pieces[from]] == Bool.true)
    {
        GameBoard.fiftyMove = 0;
        if ((move & movePawnStart) != 0)
        {
            if (side == colours.white)
            {
                GameBoard.enPassant = from + 10;
            }
            else
            {
                GameBoard.enPassant = from - 10;
            }
            HashEnPassant();
        }
    }

    MovePiece(from, to);

    var promotedPiece = Promoted(move)
    if (promotedPiece != pieces.empty)
    {
        ClearPiece(to);
        AddPiece(to, promotedPiece);
    }

    GameBoard.side ^= 1;
    HashSide();

    if (SquareAttacked(GameBoard.pieceList[GetPieceIndex(kings[side], 0)], GameBoard.side))
    {
        TakeMove();
        return Bool.false;
    }

    return Bool.true;
}

function TakeMove()
{
    GameBoard.playHistory;
    GameBoard.play--;

    var move = GameBoard.history[GameBoard.playHistory].move;
    var from = FromSquare(move);
    var to = ToSquare(move);

    if (GameBoard.enPassant != keySquares.noSquare)
    {
        HashEnPassant();
    }

    HashCastlingPermission();

    GameBoard.castlePermission = GameBoard.history[GameBoard.playHistory].castlePermission;
    GameBoard.fiftyMove = GameBoard.history[GameBoard.playHistory].fiftyMove;
    GameBoard.enPassant = GameBoard.history[GameBoard.playHistory].enPassant;

    if (GameBoard.enPassant != keySquares.noSquare)
    {
        HashEnPassant();
    }

    HashCastlingPermission();

    GameBoard.side ^= 1;
    HashSide();

    if ((moveEnPassant & move) != 0)
    {
        if (GameBoard.side == colours.white)
        {
            AddPiece(to - 10, pieces.blackPawn);
        }
        else
        {
            AddPiece(to + 10, pieces.whitePawn);
        }
    }
    else if((moveCastling & move) != 0)
    {
        switch (to)
        {
            case keySquares.C1: MovePiece(keySquares.D1, keySquares.A1); break;
            case keySquares.C8: MovePiece(keySquares.D8, keySquares.A8); break;
            case keySquares.G1: MovePiece(keySquares.F1, keySquares.H1); break;
            case keySquares.G8: MovePiece(keySquares.F8, keySquares.H8); break;
            default: break;
        }
    }

    MovePiece(to, from);

    var captured = Captured(move);
    if (captured != pieces.empty)
    {
        AddPiece(to, captured);
    }

    
    if (Promoted(move) != pieces.empty)
    {
        ClearPiece(from);
        AddPiece(from, PieceColour[Promoted(move)] == colours.white ? pieces.whitePawn : pieces.blackPawn);
    }
}

function ClearPiece(square)
{
    console.log("Clearing Square: " + GameBoard.pieces[square]);
    var piece = GameBoard.pieces[square];
    var pieceColour = pieceColour[piece];
    var targetPieceNumber = -1;

    HashPiece(piece, square);

    GameBoard.pieces[square] = pieces.empty;
    GameBoard.material[pieceColour] -= PieceValue[piece];

    for (i = 0; i < GameBoard.pieceNum[piece]; i++)
    {
        if (GameBoard.pieceList[GetPieceIndex(piece, i)] == square)
        {
            targetPieceNumber = i;
            break;
        }
    }

    GameBoard.pieceNum[piece]--;
    GameBoard.pieces[GetPieceIndex(piece, targetPieceNumber)] = GameBoard.pieces[GetPieceIndex(piece, GameBoard.pieceNum[piece])];
}

function AddPiece(square, piece)
{
    var pieceColour = PieceColour[piece]

    HashPiece(piece, square);

    GameBoard.pieces[square] = piece;
    GameBoard.material[pieceColour] + PieceValue[piece];
    GameBoard.pieceList[GetPieceIndex(piece, GameBoard.pieceNum[piece])] = square;
    GameBoard.pieceNum[piece]++;
}

function MovePiece(from, to)
{
    var piece = GameBoard.pieces[from];

    HashPiece(piece, from);
    GameBoard.pieces[from] = pieces.empty;

    HashPiece(piece, to);
    GameBoard.pieces[to] = piece;

    for (i = 0; i < GameBoard.pieceNum[piece]; i++)
    {
        if (GameBoard.pieceList[GetPieceIndex(piece, i)] == from)
        {
            GameBoard.pieceList[GetPieceIndex(piece, i)] = to;
            break;
        }
    }
}