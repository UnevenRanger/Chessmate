var pawnTable = [
    0, 0, 0, 0, 0, 0, 0, 0,
    10, 10, 0, -10, -10, 0, 10, 10,
    5, 0, 0, 5, 5, 0, 0, 5,
    0, 0, 10, 20, 20, 10, 0, 0,
    5, 5, 5, 10, 10, 5, 5, 5,
    10, 10, 10, 20, 20, 10, 10, 10,
    20, 20, 20, 30, 30, 20, 20, 20,
    0, 0, 0, 0, 0, 0, 0, 0
];


var knightTable = [
    0, -10, 0, 0, 0, 0, -10, 0,
    0, 0, 0, 5, 5, 0, 0, 0,
    0, 0, 10, 10, 10, 10, 0, 0,
    0, 0, 10, 20, 20, 10, 5, 0,
    5, 10, 15, 20, 20, 15, 10, 5,
    5, 10, 10, 20, 20, 10, 10, 5,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
];

var bishopTable = [
    0, 0, -10, 0, 0, -10, 0, 0,
    0, 0, 0, 10, 10, 0, 0, 0,
    0, 0, 10, 15, 15, 10, 0, 0,
    0, 10, 15, 20, 20, 15, 10, 0,
    0, 10, 15, 20, 20, 15, 10, 0,
    0, 0, 10, 15, 15, 10, 0, 0,
    0, 0, 0, 10, 10, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
];

var rookTable = [
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    25, 25, 25, 25, 25, 25, 25, 25,
    0, 0, 5, 10, 10, 5, 0, 0
];

var bishopPair = 40;


function EvaluatePosition()
{
    var score = GameBoard.material[colours.white] - GameBoard.material[colours.black]

    var piece;
    var pieceNum;
    var square;

    piece = pieces.whitePawn;
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; pieceNum++)
    {
        square = GameBoard.pieceList[GetPieceIndex(piece, pieceNum)];
        score += pawnTable[GetSquare64(square)];
    }

    piece = pieces.blackPawn;
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; pieceNum++)
    {
        square = GameBoard.pieceList[GetPieceIndex(piece, pieceNum)];
        console.log()
        score -= pawnTable[GetMirror64(GetSquare64((square)))];
    }

    piece = pieces.whiteKnight;
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; pieceNum++)
    {
        square = GameBoard.pieceList[GetPieceIndex(piece, pieceNum)];
        score += knightTable[GetSquare64(square)];
    }

    piece = pieces.blackKnight;
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; pieceNum++)
    {
        square = GameBoard.pieceList[GetPieceIndex(piece, pieceNum)];
        score -= knightTable[GetMirror64(GetSquare64((square)))];
    }

    piece = pieces.whiteBishops;
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; pieceNum++) {
        square = GameBoard.pieceList[GetPieceIndex(piece, pieceNum)];
        score += bishopTable[GetSquare64(square)];
    }

    piece = pieces.blackBishop;
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; pieceNum++) {
        square = GameBoard.pieceList[GetPieceIndex(piece, pieceNum)];
        score -= bishopTable[GetMirror64(GetSquare64((square)))];
    }

    piece = pieces.whiteRook;
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; pieceNum++) {
        square = GameBoard.pieceList[GetPieceIndex(piece, pieceNum)];
        score += rookTable[GetSquare64(square)];
    }

    piece = pieces.blackRook;
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; pieceNum++) {
        square = GameBoard.pieceList[GetPieceIndex(piece, pieceNum)];
        score -= rookTable[GetMirror64(GetSquare64((square)))];
    }

    piece = pieces.whiteQueen;
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; pieceNum++) {
        square = GameBoard.pieceList[GetPieceIndex(piece, pieceNum)];
        score += rookTable[GetSquare64(square)];
    }

    piece = pieces.blackQueen;
    for (pieceNum = 0; pieceNum < GameBoard.pieceNum[piece]; pieceNum++) {
        square = GameBoard.pieceList[GetPieceIndex(piece, pieceNum)];
        score -= rookTable[GetMirror64(GetSquare64((square)))];
    }

    if (GameBoard.pieceNum[pieces.whiteBishops] >= 2)
    {
        score += bishopPair;
    }

    if (GameBoard.pieceNum[pieces.blackBishops] >= 2)
    {
        score += bishopPair;
    }

    if (GameBoard.side == colours.black)
    {
        return score;
    }
    else
    {
        return -score;
    }
}