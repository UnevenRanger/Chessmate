function fileRanktoSquare(file, rank) {
    return ((21 + (file)) + ((rank) * 10));
}

//Generate four random numbers and join them for the Unique Position Key
function Random32() {
    return (Math.floor((Math.random() * 255) + 1) << 23) | (Math.floor((Math.random() * 255) + 1) << 16) | (Math.floor((Math.random() * 255) + 1) << 8) | Math.floor((Math.random() * 255) + 1);
}


function GetPieceIndex(piece, pieceNum) {
    //To get the Index location of a particular piece, simply take the 
    //piece[] index (using white pawn as an example, 1) times by the total possible
    //number of that type of piece (in chess, 10 for all pieces BUT pawns)
    //so that the index never overlaps between pieces (white pawn indexes from 10 - 19, white knight 20 - 29, etc.), plus the individual piece number
    return (piece * 10 + pieceNum);
}

function GetMirror64(square) {
    return mirror64[square];
}

function GetSquare64(square120) {
    return Square120ToSquare64[square120];
}

function GetSquare120(square64) {
    return Square64ToSquare120[square64];
}

function CheckSquareOffBoard(square) {
    if (filesBoard[square] == keySquares.offboard) {
        return Bool.true;
    }

    return Bool.false;
}

function HashPiece(piece, square) {
    GameBoard.positionKey ^= PieceKeys[(piece * 120) + square];
}

function HashCastlingPermission() {
    GameBoard.positionKey ^= CastleKeys[GameBoard.castlePermission];
}

function HashSide() {
    GameBoard.positionKey ^= SideKey;
}

function HashEnPassant() {
    GameBoard.positionKey ^= PieceKeys[GameBoard.enPassant];
}

function FromSquare(move) {
    return (move & 0x7f);
}

function ToSquare(move) {
    return ((move >> 7) & 0x7f);
}

function Captured(move) {
    return ((move >> 14) & 0xf);
}

function Promoted(move) {
    return ((move >> 20) & 0xf);
}