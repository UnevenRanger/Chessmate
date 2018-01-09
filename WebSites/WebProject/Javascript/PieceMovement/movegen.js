var moveEnPassant = 0x40000;
var movePawnStart = 0x80000;
var moveCastling = 0x1000000;
var moveCapture = 0x7C000;
var movePromotion = 0xF00000;
var noMove = 0;

//Pack the bitwise components into one integer (upto 25bits long) connected with | (OR) 
//operators that set each bit = 1 if at least one of two bits = 1
//that comprises all the information needed for a move
function Move(from, to, captured, promoted, flag)
{
    return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}

function AddCaptureMove(move)
{
    console.log("Adding Capture Log");
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.play + 1]] = move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.play + 1]] = 0;
    GameBoard.moveListStart[GameBoard.play + 1]++;
}

function AddQuietMove(move)
{
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.play + 1]] = move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.play + 1]] = 0;
    GameBoard.moveListStart[GameBoard.play + 1]++;
}

function AddEnPassantMove(move)
{
    GameBoard.moveList[GameBoard.moveListStart[GameBoard.play + 1]] = move;
    GameBoard.moveScores[GameBoard.moveListStart[GameBoard.play + 1]] = 0;
    GameBoard.moveListStart[GameBoard.play + 1]++;
}

function AddWhitePawnCaptureMove(from, top, capturedPiece)
{
    if (ranksBoard[from] == ranks.rank7)
    {
        AddCaptureMove(Move(from, to, capturedPiece, pieces.whiteQueen, 0));
        AddCaptureMove(Move(from, to, capturedPiece, pieces.whiteRook, 0));
        AddCaptureMove(Move(from, to, capturedPiece, pieces.whiteBishop, 0));
        AddCaptureMove(Move(from, to, capturedPiece, pieces.whiteKnight, 0));
    }
    else
    {
        AddCaptureMove(Move(from, to, capturedPiece, pieces.empty, 0));
    }
}

function AddWhitePawnQuietMove(from, to)
{
    if (ranksBoard[from] == ranks.rank7)
    {
        AddQuietMove(Move(from, to, pieces.empty, pieces.whiteQueen, 0));
        AddQuietMove(Move(from, to, pieces.empty, pieces.whiteRook, 0));
        AddQuietMove(Move(from, to, pieces.empty, pieces.whiteBishop, 0));
        AddQuietMove(Move(from, to, pieces.empty, pieces.whiteKnight, 0));
    }
    else
    {
        AddQuietMove(Move(from, to, pieces.empty, pieces.empty, 0));
    }
}

function AddBlackPawnCaptureMove(from, top, capturedPiece)
{
    if (ranksBoard[from] == ranks.rank2)
    {
        AddCaptureMove(Move(from, to, capturedPiece, pieces.blackQueen, 0));
        AddCaptureMove(Move(from, to, capturedPiece, pieces.blackRook, 0));
        AddCaptureMove(Move(from, to, capturedPiece, pieces.blackBishop, 0));
        AddCaptureMove(Move(from, to, capturedPiece, pieces.blackKnight, 0));
    }
    else
    {
        AddCaptureMove(Move(from, to, capturedPiece, pieces.empty, 0));
    }
}

function AddBlackPawnQuietMove(from, to)
{
    if (ranksBoard[from] == ranks.rank2)
    {
        AddQuietMove(Move(from, to, pieces.empty, pieces.blackQueen, 0));
        AddQuietMove(Move(from, to, pieces.empty, pieces.blackRook, 0));
        AddQuietMove(Move(from, to, pieces.empty, pieces.blackBishop, 0));
        AddQuietMove(Move(from, to, pieces.empty, pieces.blackKnight, 0));
    }
    else
    {
        AddQuietMove(Move(from, to, pieces.empty, pieces.empty, 0));
    }
}

//
function GenerateMoves()
{
    var piece;
    var pieceType;
    var pieceNum;
    var pieceIndex;
    var square;
    var targetSquare;
    var direction;

    //Initiate move list indexing
    GameBoard.moveListStart[GameBoard.play + 1] = GameBoard.moveListStart[GameBoard.play];

    //Generate Moves for the White Pieces
    if (GameBoard.side == colours.white)
    {
        pieceType = pieces.whitePawn;

        for (pieceNum = 0; pieceNum < GameBoard.pieceNum[pieceType]; pieceNum++)
        {
            square = GameBoard.pieceList[GetPieceIndex(pieceType, pieceNum)];
            
            //None Capturing Moves: 
            //If the square in front is empty
            if (GameBoard.pieces[square + 10] == pieces.empty)
            {
                //Add Pawn Move
                AddWhitePawnQuietMove(square, square + 10);

                //If the Pawn is on its starting rank and the square two squares ahead is empty
                if (ranksBoard[square] == ranks.rank2 && GameBoard.pieces[square + 20] == pieces.empty)
                {
                    //Add Quiet Move
                    AddQuietMove(Move(square, square + 20, pieces.empty, pieces.empty, movePawnStart));
                }
            }

            //Capturing Moves: 
            if (CheckSquareOffBoard(square + 9) == Bool.false && PieceColour[GameBoard.pieces[square + 9] == colours.black])
            {
                console.log("1");
                //Add Pawn Capture Move
                AddWhitePawnCaptureMove(square, square + 9, GameBoard.pieces[square + 9]);
            }

            if (CheckSquareOffBoard(square + 11) == Bool.false && PieceColour[GameBoard.pieces[square + 11] == colours.black])
            {
                console.log("2");
                //Add Pawn Capture Move
                AddWhitePawnCaptureMove(square, square + 9, GameBoard.pieces[square + 11]);
            }

            if (GameBoard.enPassant != keySquares.noSquare)
            {
                if (square + 9 == GameBoard.enPassant)
                {
                    //Add En Passant Move
                    AddEnPassantMove(Move(square, square + 9, pieces.empty, pieces.empty, moveEnPassant));
                }

                if (square + 11 == GameBoard.enPassant)
                {
                    //Add En Passant Move
                    AddEnPassantMove(Move(square, square + 11, pieces.empty, pieces.empty, moveEnPassant));
                }
            }
        }

        //Generate Castling Moves for White King
        if (GameBoard.castlePermission & castlePermissions.WKCA)
        {
            //Check if the Squares are Empty
            if (GameBoard.pieces[keySquares.F1] == pieces.empty && GameBoard.pieces[keySquares.G1] == pieces.empty)
            {
                //Check the Square and the Square(s) moving through are not under Attack
                if (SquareAttacked(keySquares.F1, colours.black) == Bool.false && SquareAttacked(keySquares.E1, colours.black) == Bool.false)
                {
                    //Add Quiet Move
                    AddQuietMove(Move(keySquares.E1, keySquares.G1, pieces.empty, pieces.empty, moveCastling));
                }
            }
        }

        //Generate Castling Moves for White Queen
        if (GameBoard.castlePermission & castlePermissions.WQCA)
        {
            //Check if the Squares are Empty
            if (GameBoard.pieces[keySquares.B1] == pieces.empty && GameBoard.pieces[keySquares.C1] == pieces.empty && GameBoard.pieces[keySquares.D1] == pieces.empty)
            {
                //Check the Square and the Square(s) moving through are not under Attack
                if (SquareAttacked(keySquares.E1, colours.black) == Bool.false && SquareAttacked(keySquares.D1, colours.black) == Bool.false)
                {
                    //Add Quiet Move
                    AddQuietMove(Move(keySquares.E1, keySquares.C1, pieces.empty, pieces.empty, moveCastling));
                }
            }
        }
    }
    else //Generate Moves for the Black Pieces
    {
        pieceType = pieces.blackPawn;

        for (pieceNum = 0; pieceNum < GameBoard.pieceNum[pieceType]; pieceNum++)
        {
            square = GameBoard.pieceList[GetPieceIndex(pieceType, pieceNum)];

            //None Capturing Moves: 
            //If the square in front is empty
            if (GameBoard.pieces[square - 10] == pieces.empty)
            {
                //Add Pawn Move
                AddBlackPawnQuietMove(square, square - 10);

                //If the Pawn is on its starting rank and the square two squares ahead is empty
                if (ranksBoard[square] == ranks.rank2 && GameBoard.pieces[square - 20] == pieces.empty)
                {
                    //Add Quiet Move
                    AddQuietMove(Move(square, square + 20, pieces.empty, pieces.empty, movePawnStart));
                }
            }

            //Capturing Moves: 
            if (CheckSquareOffBoard(square - 9) == Bool.false && PieceColour[GameBoard.pieces[square + 9] == colours.white])
            {
                //Add Pawn Capture Move
                AddBlackPawnCaptureMove(square, square - 9, GameBoard.pieces[square - 9]);
            }

            if (CheckSquareOffBoard(square - 11) == Bool.false && PieceColour[GameBoard.pieces[square + 11] == colours.white])
            {
                //Add Pawn Capture Move
                AddBlackPawnCaptureMove(square, square - 11, GameBoard.pieces[square - 11]);
            }

            if (GameBoard.enPassant != keySquares.noSquare)
            {
                if (square - 9 == GameBoard.enPassant)
                {
                    //Add En Passant Move
                    AddEnPassantMove(Move(square, square - 9, pieces.empty, pieces.empty, moveEnPassant));
                }

                if (square - 11 == GameBoard.enPassant)
                {
                    //Add En Passant Move
                    AddEnPassantMove(Move(square, square - 11, pieces.empty, pieces.empty, moveEnPassant));
                }
            }
        }

        //Generate Castling Moves for Black King
        if (GameBoard.castlePermission & castlePermissions.BKCA)
        {
            //Check if the Squares are Empty
            if (GameBoard.pieces[keySquares.F8] == pieces.empty && GameBoard.pieces[keySquares.G8] == pieces.empty)
            {
                //Check the Square and the Square(s) moving through are not under Attack
                if (SquareAttacked(keySquares.F8, colours.white) == Bool.false && SquareAttacked(keySquares.E8, colours.white) == Bool.false)
                {
                    //Add Quiet Move
                    AddQuietMove(Move(keysquares.E8, keySquares.G8, pieces.empty, pieces.empty, moveCastling));
                }
            }
        }

        //Generate Castling Moves for Black Queen
        if (GameBoard.castlePermission & castlePermissions.BQCA)
        {
            //Check if the Squares are Empty
            if (GameBoard.pieces[keySquares.B8] == pieces.empty && GameBoard.pieces[keySquares.C8] == pieces.empty && GameBoard.pieces[keySquares.D8] == pieces.empty)
            {
                //Check the Square and the Square(s) moving through are not under Attack
                if (SquareAttacked(keySquares.E8, colours.white) == Bool.false && SquareAttacked(keySquares.D8, colours.white) == Bool.false)
                {
                    //Add Quiet Move
                    AddQuietMove(Move(keySquares.E8, keySquares.C8, pieces.empty, pieces.empty, moveCastling));
                }
            }
        }
    }

    pieceIndex = LoopNonSlidingPieceIndex[GameBoard.side];
    piece = LoopNonSlidingPiece[pieceIndex++];

    while (piece != 0)
    {
        for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; pieceNum++)
        {
            square = GameBoard.pieceList[GetPieceIndex(piece, pieceNum)];

            for (i = 0; i < directionNumber[piece]; i++)
            {
                direction = pieceDirection[piece][i];
                targetSquare = square + direction;

                if (CheckSquareOffBoard(targetSquare) == Bool.true)
                {
                    continue;
                }
                
                if (GameBoard.pieces[targetSquare] != pieces.empty)
                {
                    if (PieceColour[GameBoard.pieces[targetSquare]] != GameBoard.side)
                    {
                        //Add Capture
                        AddCaptureMove(Move(square, targetSquare, GameBoard.pieces[targetSquare], pieces.empty, 0));
                    }
                }
                else
                {
                    //Quiet Move
                    AddQuietMove(Move(square, targetSquare, pieces.empty, pieces.empty, 0));
                }
            }
        }

        piece = LoopNonSlidingPiece[pieceIndex++];
    }

    pieceIndex = LoopSlidingPieceIndex[GameBoard.side];
    piece = LoopSlidingPiece[pieceIndex++];

    while (piece != 0)
    {
        for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; pieceNum++)
        {
            square = GameBoard.pieceList[GetPieceIndex(piece, pieceNum)];

            for (i = 0; i < directionNumber[piece]; i++)
            {
                direction = pieceDirection[piece][i];
                targetSquare = square + direction;

                while (CheckSquareOffBoard(targetSquare) == Bool.false)
                {
                    if (GameBoard.pieces[targetSquare] != pieces.empty)
                    {
                        if (PieceColour[GameBoard.pieces[targetSquare]] != GameBoard.side)
                        {
                            //Add Capture
                            AddCaptureMove(Move(square, targetSquare, GameBoard.pieces[targetSquare], pieces.empty, 0));
                        }
                        break;
                    }
                    //Add Quiet Move
                    AddQuietMove(Move(square, targetSquare, pieces.empty, pieces.empty, 0));
                    targetSquare += direction;
                }
            }
        }

        piece = LoopSlidingPiece[pieceIndex++];
    }
}

