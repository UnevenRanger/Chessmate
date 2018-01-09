var SearchController = {};

SearchController.nodes;
SearchController.failHigh;
SearchController.failHighFirst;
SearchController.depth;
SearchController.time;
SearchController.timeStarted;
SearchController.stop;
SearchController.bestMove;
SearchController.thinking;

function SearchPosition()
{
    var bestMove = noMove;
    var bestScore = -infinite;
    var line;
    var currentDepth = 0;
    ClearForSearch();
    GenerateMoves();
    PrintMoveList();

    for (currentDepth = 1; currentDepth <= /*SearchController.depth*/ 5; currentDepth++)
    {
        bestScore = AlphaBeta(-infinite, infinite, currentDepth);

        if (SearchController.stop == Bool.true)
        {
            break;
        }

        bestMove = ProbePvTable();

        line = "Current Best Move Found: " + PrintMove(bestMove) + " with a score of " + bestScore;
        console.log(line);
    }

    SearchController.bestMove = bestMove;
    SearchController.thinking = Bool.false;
}

function AlphaBeta(alpha, beta, depth) {
    SearchController.nodes++;

    if (depth <= 0) {
        return EvaluatePosition();
    }

    //Check for Time Out every 2048 nodes
    if ((SearchController.nodes & 2047) == 0) {
        CheckTimeOut();
    }

    //CheckRepetitions() and Fifty Move Rule
    if ((CheckRepetition() || GameBoard.fiftyMove >= 100) && GameBoard.play != 0) {
        return 0;
    }

    if (GameBoard.play > maxDepth - 1) {
        return EvaluatePosition();
    }

    var inCheck = SquareAttacked(GameBoard.pieceList[GetPieceIndex(kings[GameBoard.side], 0)], GameBoard.side ^ 1);

    if (inCheck == Bool.true) {
        depth++;
    }

    var score = -infinite;

    var moveNum = 0;
    var legal = 0;
    var oldAlpha = alpha;
    var bestMove = noMove;
    var move = noMove;

    //Get PrincipleVariationMove

    //Order PrincipleVariationMove

    for (moveNum = GameBoard.moveListStart[GameBoard.play]; moveNum < GameBoard.moveListStart[GameBoard.play + 1]; moveNum++) {
        move = GameBoard.moveList[moveNum];

        if (MakeMove(move) == Bool.false) {
            continue;
        }

        legal++;

        score = -AlphaBeta(-beta, -alpha, depth - 1);
        TakeMove();

        if (SearchController.stop == Bool.true) {
            return 0;
        }

        if (score > alpha) {
            if (score >= beta) {
                if (legal == 1) {
                    SearchController.failHighFirst++;
                }

                //Update Killer Moves

                SearchController.failHigh++;

                return beta;
            }

            alpha = score;
            bestMove = move;

            //Update History Table
        }
    }

    //Mate Check
    if (legal == 0) {
        if (inCheck == Bool.true) {
            return -mate + GameBoard.play;
        }
        else {
            return 0;
        }
    }

    if (alpha != oldAlpha) {
        //Store PVMove
        StoreMove(bestMove);
    }

    return alpha;
}

function ClearPvTable()
{
    for (i = 0; i < pvEntries; i++)
    {
        GameBoard.pvTable[i].move = noMove;
        GameBoard.pvTable[i].positionKey = 0;
    }
}

function CheckTimeOut()
{
    if (($.now() - SearchController.timeStarted) > SearchController.time)
    {
        SearchController.stop == Bool.true;
    }
}

function CheckRepetition()
{
    for (i = GameBoard.playHistory - GameBoard.fiftyMove; i < GameBoard.playHistory - 1; i++)
    {
        if (GameBoard.positionKey == GameBoard.history[i].positionKey)
        {
            return Bool.true;
        }
    }

    return Bool.false;
}

function ClearForSearch()
{
    for (i = 0; i < 14 * boardSquaresNumber; i++)
    {
        GameBoard.searchHistory[i] = 0;
    }

    for (i = 0; i < 3 * maxDepth; i++)
    {
        GameBoard.searchKillers[i] = 0;
    }

    ClearPvTable();

    GameBoard.play = 0;
    SearchController.nodes = 0;
    SearchController.failHigh = 0;
    SearchController.failHighFirst = 0;
    SearchController.timeStarted = $.now();
    SearchController.stop = Bool.false;
}