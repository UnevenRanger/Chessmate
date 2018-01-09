var pieces =
    {
        empty: 0, whitePawn: 1, whiteKnight: 2, whiteBishops: 3, whiteRook: 4, whiteQueen: 5, whiteKing: 6, blackPawn: 7, blackKnight: 8, blackBishop: 9, blackRook: 10, blackQueen: 11, blackKing: 12
    };

var boardSquaresNumber = 120;

//Using 0 point indexing to locate columns (files) and rows (ranks) in the chessboard array
var files =
    {
        fileA: 0, fileB: 1, fileC: 2, fileD: 3, fileE: 4, fileF: 5, fileG: 6, fileH: 7, fileNone: 8
    };

var ranks = 
    {
        rank1: 0, rank2: 1, rank3: 2, rank4: 3, rank5: 4, rank6: 5, rank7: 6, rank8: 7, rankNone: 8
    };

var colours =
    {
        white: 0, black: 1, both: 2
    };

var keySquares =
    {
        A1: 21, B1: 22, C1: 23, D1: 24, E1: 25, F1: 26, G1: 27, H1: 28, A8: 91, B8: 92, C8: 93, D8: 94, E8: 95, F8: 96, G8: 97, H8: 98, noSquare: 99, offboard: 100
    };

var castlePermissions =
    {
        WKCA: 1, WQCA: 2, BKCA: 4, BQCA: 8
    };

var Bool =
    {
        false: 0, true: 1
    };

//Size of Array for Move History
var maxGameMoves = 2048;

//Size of Array for Moves Possible
var maxPositionMoves = 256;

//Size of Array for how many moves in advance the AI will search for
var maxDepth = 64;

var infinite = 30000;

var mate = 29000;

pvEntries = 10000;

var filesBoard = new Array(boardSquaresNumber);
var ranksBoard = new Array(boardSquaresNumber);

var startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

var pieceChar = ".PNBRQKpnbrqk";
var sideChar = "wb-";
var rankChar = "12345678"
var fileChar = "abcdefgh";

//Indexed by the Pieces Array...

//Is the Chess Piece classed as Big, Major or Minor for scoreboard purposes
var PieceBig = [Bool.false, Bool.false, Bool.true, Bool.true, Bool.true, Bool.true, Bool.true, Bool.false, Bool.true, Bool.true, Bool.true, Bool.true, Bool.true];
var PieceMajor = [Bool.false, Bool.false, Bool.false, Bool.false, Bool.true, Bool.true, Bool.true, Bool.false, Bool.false, Bool.false, Bool.true, Bool.true, Bool.true];
var PieceMinor = [Bool.false, Bool.false, Bool.true, Bool.true, Bool.false, Bool.false, Bool.false, Bool.false, Bool.true, Bool.true, Bool.false, Bool.false, Bool.false];

//Value Points of the chess pieces
//Pawns: 100
//Knights and Bishops: 325
//Rooks: 550
//Queen: 1000
//King: 50,000
var PieceValue = [0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000];

//What is the Chess Pieces Colour Alignment
var PieceColour = [colours.both, colours.white, colours.white, colours.white, colours.white, colours.white, colours.white,
colours.black, colours.black, colours.black, colours.black, colours.black, colours.black];

//What Piece is it? 
var PiecePawn = [Bool.false, Bool.true, Bool.false, Bool.false, Bool.false, Bool.false, Bool.false, Bool.true, Bool.false, Bool.false, Bool.false, Bool.false, Bool.false];
var PieceKnight = [Bool.false, Bool.false, Bool.true, Bool.false, Bool.false, Bool.false, Bool.false, Bool.false, Bool.true, Bool.false, Bool.false, Bool.false, Bool.false];
var PieceKing = [Bool.false, Bool.false, Bool.false, Bool.false, Bool.false, Bool.false, Bool.true, Bool.false, Bool.false, Bool.false, Bool.false, Bool.false, Bool.true];
var PieceRookQueen = [Bool.false, Bool.false, Bool.false, Bool.false, Bool.true, Bool.true, Bool.false, Bool.false, Bool.false, Bool.false, Bool.true, Bool.true, Bool.false];
var PieceBishopQueen = [Bool.false, Bool.false, Bool.false, Bool.true, Bool.false, Bool.true, Bool.false, Bool.false, Bool.false, Bool.true, Bool.false, Bool.true, Bool.false];
var PieceSlides = [Bool.false, Bool.false, Bool.false, Bool.true, Bool.true, Bool.true, Bool.false, Bool.false, Bool.false, Bool.true, Bool.true, Bool.true, Bool.false];

var knightDirections = [-8, -19, -21, -12, 8, 19, 21, 12];
var rookDirections = [-1, -10, 1, 10];
var bishopDirections = [-9, -11, 11, 9];
var kingDirections = [-1, -10, 1, 10, -9, -11, 11, 9];
var directionNumber = [0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8];
var pieceDirection = [0, 0, knightDirections, bishopDirections, rookDirections, kingDirections, kingDirections, 0, knightDirections, bishopDirections, rookDirections, kingDirections, kingDirections];
var LoopNonSlidingPiece = [pieces.whiteKnight, pieces.whiteKing, 0, pieces.blackKnight, pieces.blackKing, 0];
var LoopNonSlidingPieceIndex = [0, 3];
var LoopSlidingPiece = [pieces.whiteBishops, pieces.whiteRook, pieces.whiteQueen, 0, pieces.blackBishop, pieces.blackRook, pieces.blackQueen, 0];
var LoopSlidingPieceIndex = [0, 4];

var PieceKeys = new Array(14 * 120);
var SideKey;
var CastleKeys = new Array(16);

var Square120ToSquare64 = new Array(boardSquaresNumber);
var Square64ToSquare120 = new Array(64);

var kings = [pieces.whiteKing, pieces.blackKing];
var castlePermissionArray = [
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 13, 15, 15, 15, 12, 15, 15, 14, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 7, 15, 15, 15, 3, 15, 15, 11, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
    15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
];

var mirror64 = [
    56, 57, 58, 59, 60, 61, 62, 63,
    48, 49, 50, 51, 52, 53, 54, 55,
    40, 41, 42, 43, 44, 45, 46, 47,
    32, 33, 34, 35, 36, 37, 38, 39,
    24, 25, 26, 27, 28, 29, 30, 31,
    16, 17, 18, 19, 20, 21, 22, 23,
    8, 9, 10, 11, 12, 13, 14, 15,
    0, 1, 2, 3, 4, 5, 6, 7,
];

var GameController = {};
GameController.Engineside = colours.both;
GameController.PlayerSide = colours.both;
GameController.GameOver = Bool.false;