function ProbePvTable()
{
    var i = GameBoard.positionKey % pvEntries;

    if (GameBoard.pvTable[i].positionKey == GameBoard.positionKey)
    {
        return GameBoard.pvTable[i].move;
    }

    return noMove;
}

function StoreMove(move)
{
    var i = GameBoard.positionKey % pvEntries;

    GameBoard.pvTable[i].positionKey = GameBoard.positionKey;
    GameBoard.pvTable[i].move = move;
}