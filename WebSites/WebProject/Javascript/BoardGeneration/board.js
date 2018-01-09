var GameBoard = {};

//Array of Pieces on the GameBoard
GameBoard.pieces = new Array(boardSquaresNumber);

//White starts first in Chess
GameBoard.side = colours.white;

//Fifty Move Rule Counter (if no pawn has been taken in 50 moves, the game is legally a draw)
GameBoard.fiftyMove = 0;

//Play History Index
GameBoard.playHistory = 0;

//Play History Array
GameBoard.history = [];

//Play History Index
GameBoard.play = 0;

//Initial Pawn Move (en passant) allowing double square move
GameBoard.enPassant = 0;

//Can either side Castle?
GameBoard.castlePermission = 0;

//Array to hold the White or Black material value of the Chessboard Square
GameBoard.material = new Array(2);

//Indexed by Pieces[], the number of pieces in play by Piece type
GameBoard.pieceNum = new Array(13); 

//List of all Pieces
GameBoard.pieceList = new Array(14 * 10);

//Unique Number that represents the position on the board
GameBoard.positionKey = 0;

//List of Moves made in the game
GameBoard.moveList = new Array(maxDepth * maxPositionMoves);

//Score of Moves made in the game
GameBoard.moveScores = new Array(maxDepth * maxPositionMoves);

//Where the moveList starts
GameBoard.moveListStart = new Array(maxDepth);

//
GameBoard.pvTable = [];

//
GameBoard.pvArray = new Array(maxDepth);

GameBoard.searchHistory = new Array(14 * boardSquaresNumber);
GameBoard.searchKillers = new Array(3 * maxDepth);

function CheckBoard()
{
    var tempPieceNumber = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var tempMaterial = [0, 0];
    var square64;
    var square120;
    var targetPiece;
    var targetPieceNum;
    var colour; 
    var pieceCount;

    for (targetPiece = pieces.whitePawn; targetPiece < pieces.blackKing; targetPiece++)
    {
        for (targetPieceNum = 0; targetPieceNum < GameBoard.pieceNum[targetPiece]; targetPieceNum++)
        {
            square120 = GameBoard.pieceList[GetPieceIndex(targetPiece, targetPieceNum)];

            if (GameBoard.pieces[square120] != targetPiece)
            {
                console.log("Error in Piece Lists");
                return Bool.false;
            }
        }

        for (square64 = 0; square64 < 64; square64++)
        {
            square120 = GetSquare120(square64);
            targetPiece = GameBoard.pieces[square120];
            tempPieceNumber[targetPiece]++;
            tempMaterial[PieceColour[targetPiece]] += PieceValue[targetPiece];
        }

        for (targetPiece = pieces.whitePawn; targetPiece <= pieces.blackKing; targetPiece++)
        {
            if (tempPieceNumber[targetPiece] != GameBoard.pieceNum[targetPiece])
            {
                console.log(tempPieceNumber[targetPiece]);
                console.log("Error in Number of " + targetPiece);
                return Bool.false;
            }
        }
    }

    if (tempMaterial[colours.white] != GameBoard.material[colours.white] || tempMaterial[colours.black] != GameBoard.material[colours.black])
    {
        console.log("Error in Material Values");
        return Bool.false;
    }

    if (GameBoard.side != colours.white && GameBoard.side != colours.black)
    {
        console.log("Error with Whose Turn it is");
        return Bool.false;
    }

    if (GeneratePositionKey() != GameBoard.positionKey)
    {
        console.log("Generated: " + GeneratePositionKey() + " GameBoard.positionKey = " + GameBoard.positionKey);
        console.log("Error with Position Key");
        return Bool.false;
    }

    return Bool.true;
}

function GeneratePositionKey()
{
    var square = 0; 
    var finalKey = 0;
    var piece = pieces.empty;

    for (square = 0; square < boardSquaresNumber; square++)
    {
        piece = GameBoard.pieces[square];

        if (piece != pieces.empty && piece != keySquares.offboard)
        {
            finalKey ^= PieceKeys[(piece * 120) + square];
        }
    }

    if (GameBoard.side == colours.white)
    {
        finalKey ^= SideKey;
    }

    if (GameBoard.enPassant != keySquares.noSquare)
    {
        finalKey ^= PieceKeys[GameBoard.enPassant];
    }

    finalKey ^= CastleKeys[GameBoard.castlePermission];

    return finalKey;
}

function PrintPieceLists()
{
    var piece, pieceNum;

    for (piece = 1; piece <= pieces.blackKing; piece++)
    {
        for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; pieceNum++)
        {
            console.log("Piece " + pieceChar[piece] + " on " + PrintSquare(GameBoard.pieceList[GetPieceIndex(piece, pieceNum)]));
        }
    }
}

function UpdateListsMaterial()
{
    var piece, square, colour;

    for (i = 0; i < 64; i++)
    {
        square = GetSquare120(i);
        piece = GameBoard.pieces[square];

        if (piece != pieces.empty)
        {
            colour = PieceColour[piece];
            GameBoard.material[colour] += PieceValue[piece];

            GameBoard.pieceList[GetPieceIndex(piece, GameBoard.pieceNum[piece])] = square;
            GameBoard.pieceNum[piece]++;
        }
    }
}

//Reset the GameBoard
function ResetBoard()
{
    //Set all pieces as offboard
    for (i = 0; i < boardSquaresNumber; i++)
    {
        GameBoard.pieces[i] = keySquares.offboard;
    }

    //Set the Number of Pieces on the Board for each type to 0
    for (i = 0; i < 13; i++)
    {
        GameBoard.pieceNum[i] = 0;
    }

    //Set all internal squares on the board to empty
    for (i = 0; i < 64; i++) {
        GameBoard.pieces[GetSquare120(i)] = pieces.empty;
    }

    //Set all indexes in the PieceList to empty
    for (i = 0; i < 14 * 120; i++) {
        GameBoard.pieceList[i] = pieces.empty;
    }

    //Reset all Material on the board
    for (i = 0; i < 2; i++) {
        GameBoard.material[i] = 0;
    }

    //Set the Side Moving to Both (no-one taking a turn)
    GameBoard.side = colours.both;

    //Set the enPassant rule to noSquare
    GameBoard.enPassant = keySquares.noSquare;

    //Reset the Fifty Move Rule to 0
    GameBoard.fiftyMove = 0;

    //Reset the play position to 0
    GameBoard.play = 0;

    //Reset the Play History to 0
    GameBoard.playHistory = 0;

    //Reset the Castle Permissions to 0
    GameBoard.castlePermission = 0;

    //Reset the Position Key to 0
    GameBoard.positionKey = 0;

    //Reset the MoveListStart point to 0
    GameBoard.moveListStart[GameBoard.play] = 0;
}

function ParseFEN(fen)
{
    ResetBoard();

    var rank = ranks.rank8;
    var file = files.fileA;
    var piece = 0;
    var count = 0;
    var sq120 = 0;
    var fenCharacter = 0;

    while ((rank >= ranks.rank1) && fenCharacter < fen.length)
    {
        count = 1;

        switch (fen[fenCharacter])
        {
            case 'p': piece = pieces.blackPawn; break;
            case 'r': piece = pieces.blackRook; break;
            case 'n': piece = pieces.blackKnight; break;
            case 'b': piece = pieces.blackBishop; break;
            case 'k': piece = pieces.blackKing; break;
            case 'q': piece = pieces.blackQueen; break;
            case 'P': piece = pieces.whitePawn; break;
            case 'R': piece = pieces.whiteRook; break;
            case 'N': piece = pieces.whiteKnight; break;
            case 'B': piece = pieces.whiteBishops; break;
            case 'K': piece = pieces.whiteKing; break;
            case 'Q': piece = pieces.whiteQueen; break;

            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
                piece = pieces.empty;
                count = fen[fenCharacter].charCodeAt() - '0'.charCodeAt();
                break;

            case '/':
            case ' ':
                rank--;
                file = files.fileA;
                fenCharacter++;
                continue;

            //Error Catching
            default:
                console.log("F.E.N Error");
                return;
        }

        for (i = 0; i < count; i++)
        {
            square120 = fileRanktoSquare(file, rank);
            GameBoard.pieces[square120] = piece;
            file++;
        }
        fenCharacter++;
    }

    GameBoard.side = (fen[fenCharacter] == 'w') ? colours.white : colours.black;
    fenCharacter += 2;

    for (i = 0; i < 4; i++)
    {
        if (fen[fenCharacter] == ' ')
        {
            break;
        }

        switch (fen[fenCharacter])
        {
            case 'K': GameBoard.castlePermission |= castlePermissions.WKCA; break;
            case 'Q': GameBoard.castlePermission |= castlePermissions.WQCA; break;
            case 'k': GameBoard.castlePermission |= castlePermissions.BKCA; break;
            case 'q': GameBoard.castlePermission |= castlePermissions.BQCA; break;
            default:
                break;
        }

        fenCharacter++;
    }

    fenCharacter++;

    if (fen[fenCharacter] != '-')
    {
        file = fen[fenCharacter].charCodeAt() - 'a'.charCodeAt();
        rank = fen[fenCharacter + 1].charCodeAt() - '1'.charCodeAt();
        console.log('fen[fenCharacter]' + fen[fenCharacter] + " File: " + file + " Rank: " + rank);
        GameBoard.enPassant = fileRanktoSquare(file, rank);
    }

    GameBoard.positionKey = GeneratePositionKey();

    UpdateListsMaterial();
}

function PrintBoard()
{
    var square, file, rank, piece;

    console.log("\nGameBoard:\n");
    for (rank = ranks.rank8; rank >= ranks.rank1; rank--)
    {
        var line = (rankChar[rank] + "  ");

        for (file = files.fileA; file <= files.fileH; file++)
        {
            square = fileRanktoSquare(file, rank);
            piece = GameBoard.pieces[square];
            line += (" " + pieceChar[piece] + " ");
        }

        console.log(line);
    }

    console.log("");
    var line = "   ";
    for (file = files.fileA; file <= files.fileH; file++)
    {
        line += (' ' + fileChar[file] + ' ');
    }

    console.log(line);
    console.log("side:" + sideChar[GameBoard.side]);
    console.log("enPas:" + GameBoard.enPassant);
    line = "";

    if (GameBoard.castlePermission & castlePermissions.WKCA)
    {
        line += "K";
    }
    if (GameBoard.castlePermission & castlePermissions.WQCA)
    {
        line += "Q";
    }
    if (GameBoard.castlePermission & castlePermissions.BKCA)
    {
        line += "k";
    }
    if (GameBoard.castlePermission & castlePermissions.BQCA)
    {
        line += "q";
    }
    console.log("Castle: " + line);
    console.log("Key: " + GameBoard.positionKey.toString(16));
}

function PrintAttackedSquares()
{
    var square, file, rank, piece;

    console.log("Attacked: ");

    for (rank = ranks.rank8; rank >= ranks.rank1; rank--)
    {
        var line = ((rank + 1) + "  ");
        for (file = files.fileA; file <= files.fileH; file++)
        {
            square = fileRanktoSquare(file, rank);
            if (SquareAttacked(square, GameBoard.side) == Bool.true)
            {
                piece = "X";
            }
            else
            {
                piece = "-";
            }

            line += (" " + piece + " ");
        }
        console.log(line);
    }
    console.log("");
}

function SquareAttacked(square, side)
{
    var piece;
    var targetSquare;

    //Attack Check for Pawns
    if (side == colours.white)
    {
        if (GameBoard.pieces[square - 11] == pieces.whitePawn || GameBoard.pieces[square - 9] == pieces.whitePawn)
        {
            return Bool.true;
        }
    }
    else
    {
        if (GameBoard.pieces[square - 11] == pieces.blackPawn || GameBoard.pieces[square - 9] == pieces.blackPawn)
        {
            return Bool.true;
        }
    }

    //Attack Check for Knights
    for (i = 0; i < 8; i++)
    {
        piece = GameBoard.pieces[square + knightDirections[i]];
        if (piece != keySquares.offboard && PieceColour[piece] == side && PieceKnight[piece] == Bool.true)
        {
            return Bool.true;
        }
    }

    for (i = 0; i < 4; i++)
    {
        direction = rookDirections[i];
        targetSquare = square + direction;
        piece = GameBoard.pieces[targetSquare]

        while (piece != keySquares.offboard)
        {
            if (piece != pieces.empty)
            {
                if (PieceRookQueen[piece] == Bool.true && PieceColour[piece] == side)
                {
                    return Bool.true;
                }

                break;
            }
            targetSquare += direction;
            piece = GameBoard.pieces[targetSquare]
        }
    }

    for (i = 0; i < 4; i++) {
        direction = bishopDirections[i];
        targetSquare = square + direction;
        piece = GameBoard.pieces[targetSquare]

        while (piece != keySquares.offboard) {
            if (piece != pieces.empty) {
                if (PieceBishopQueen[piece] == Bool.true && PieceColour[piece] == side) {
                    return Bool.true;
                }

                break;
            }
            targetSquare += direction;
            piece = GameBoard.pieces[targetSquare]
        }
    }

    for (i = 0; i < 8; i++) {
        piece = GameBoard.pieces[square + kingDirections[i]];
        if (piece != keySquares.offboard && PieceColour[piece] == side && PieceKing[piece] == Bool.true) {
            return Bool.true;
        }
    }

    return Bool.false;
}