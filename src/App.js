import React, {useEffect, useState, useCallback} from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './Board';

const bordSize = 8;
const playerOne = 1;
const playerTwo = 2;
const players = {
  [playerOne]: {
    name: "Player One",
    class: "player-one"
  },
  [playerTwo]: {
    name: "Player Two",
    class: "player-two"
  }
}
function App() {
  const [board,setBoard] = useState(null);
  const [turn, setTurn] = useState(playerOne);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [winner, setWinner] = useState(null);
  const selectSquare = (row, column)=> {
    let selected = selectedSquare;
    if (canSelectSquare(row, column)) {
      setSquare(row, column);
    } else if (selected != null) {
      handleMove(row, column);
    }
  };
  const handleMove = (row, col)=> {
    console.log("handling move...");
    let start = board.board[selectedSquare.row][selectedSquare.column];
    if (!board.canMoveChecker(start, row, col)) {
      console.log("illegal move");
      return;
    }

    let isJump = board.isJumpMove(start, row, col);
    let becameKing = false;
    board.moveChecker(start, row, col);
    if ((!board.isKing(start) && board.getPlayer(start) === playerOne && row === 0) || (board.getPlayer(start) === playerTwo && row === ((board.board.length)-1))) {
      console.log("making King....");
      becameKing = true;
      board.makeKing(start);
    }

    if (!becameKing && isJump && board.canKeepJumping(start)) {
      setBoard(board);
      setSelectedSquare({row: row, column: col});
    } else {
      setBoard(board);
      setTurn(nextPlayer());
      setSelectedSquare(null);
    }
  };
  const canSelectSquare = (row, column)=> {
    let square = board.board[row][column];
    if (!square) {
      return false;
    }
    let player = board.checkers[square].player;
    return player === turn;
  };
  const setSquare = (row, column)=> {
    setSelectedSquare({row: row, column: column});
  };
  const nextPlayer = useCallback(()=> {
    return turn===playerOne? playerTwo: playerOne
  });
  const restart =() => {
    setBoard(new Board(bordSize, playerOne, playerTwo));
    setTurn(playerOne);
    setSelectedSquare(null);
    setWinner(null);
  };
  useEffect(() => {
    setBoard(new Board(bordSize, playerOne, playerTwo));
  }, [])
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>React Checkers</h2>
      </div>
      {winner &&
        <Winner player={winner} restart={restart()} />
      }
        <h3>Current turn: {players[turn].name}<span className={ players[turn].class }></span></h3>

      <button className="restart-btn" onClick={restart}>Restart the Game</button>

      <GameBoard board={board} 
      selectedSquare={selectedSquare}
      selectSquare={selectSquare} />
    </div>
  );
}
const Winner=(props)=> {
  let player = players[props.player].name;
  return (
    <div id="winner">
      <div>
        <p>{player} has won the game!</p>
        <button onClick={props.restart}>Play again?</button>
      </div>
    </div>
  );
}
const GameBoard =(props)=>  {
  console.log(props.board+"GAMEBOARD");
  let selectedRow = props.selectedSquare ? props.selectedSquare.row : null;
  let  rows = props.board ? props.board.board.map((row, i) => {
    return <Row key={i}
                row={row}
                selectedSquare={i === selectedRow ? props.selectedSquare : null}
                rowNum={i}
                checkers={props.board.checkers}
                selectSquare={props.selectSquare} />;
    }): null;
  
    return (
      <div className="board">
        {rows}
      </div>
    )
}
const Row = (props) =>  {
  let selectedCol = props.selectedSquare ? props.selectedSquare.column : null;
  let squares =props.row ?  props.row.map((square, i) => {
    return <Square key={i} 
            val={square != null ? props.checkers[square] : null} 
            row={props.rowNum} 
            column={i} 
            selected={i === selectedCol}
            selectSquare={props.selectSquare} />
  }): null;
    return (
      <div className="row">
        {squares}
      </div>
    )
};
const Square = (props)=> {
    let color = (props.row + props.column) % 2 === 0 ? "red" : "black";
    let selection = props.selected ? " selected" : "";
    let classes = "square " + color + selection;
    return (
      <div className={classes} onClick={() => props.selectSquare(props.row, props.column)}>
        {props.val != null &&
          <Piece checker={props.val} />
        }
      </div>
    )
}
const Piece =(props)=> {
  console.log(props.checker, 'helllllll');
  let classes = "";
  if (props.checker) {
    classes += players[props.checker.player].class;
    if (props.checker.isKing) {
      classes += " king";
    }
  }
  return (
    <div className={classes}></div>
  )
}

export default App;
