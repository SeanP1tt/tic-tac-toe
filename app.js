
/**
 * "TIC TAC TOE" game built in ReactJS
 * ------------------------
 * Eric Njanga (March 2018)
 *
 * Game that:
 * -----------
 * > Lets you play tic-tac-toe,
 * > Indicates when one player has won the game,
 * > Stores the history of moves during the game,
 * > Allows players to jump back in time to see older versions of the game board.

 * Game extra features:
 * --------------------
 * > Display the location for each move in the format (col, row) in the move history list.
 * > Bold the currently selected item in the move list.
 * > Rewrite Board to use two loops to make the squares instead of hardcoding them.
 * Add a toggle button that lets you sort the moves in either ascending or descending order.
 * When someone wins, highlight the three squares that caused the win.
 * When no one wins, display a message about the result being a draw.
*/



//Square component
//----------------
//Functional component which renders a button (Visually represented as a square):
//- Renders value (props)
//- Runs a click event handler on the button (props)
const Square = props => {
	const { value, ...other } = props;

	//Renders React element ...
	return(
		<button className={'square ' +value} onClick={()=>other.onClick()}>{value}</button>
	);
}



//Board component
//----------------
//Functional component that renders the entire board with all squares:
//- The board (3x3 grid)
//- All squares components (passing with value and click handler for each one)
//- Runs a click event handler on each individual square component
const Board = props => {
	const { cells, squares, ...other } 	= props,
		ArrRows = [0,1,2];
	let counter = 1;

	//Renders React element ...
	return(
		<div className="board"> {
			ArrRows.map((row) =>
				<div key={row.toString()} className="board-row">
					{
						cells.slice(row * 3 , counter++ * 3).map((cellID) =>
							<Square key={cellID.toString()} value={squares[cellID]} onClick={()=>other.onClick(cellID)} />
						)
					}
				</div>
			)
		}
		</div>
	);
}



//Status component
//----------------
//Functional component which computes and renders the game status:
//- Who plays next? (uses xIsNext value)
//- Who is the winner? (uses squares values and external function)
const Status = props => {
	const { squares, xIsNext } = props,
		winner = calculateWinner(squares),
		effect = winner?'bounce':'';
	let status;

	if(winner) {
		status = 'Winner is: '+ winner;
	}else{
		status = 'Next player is: '+ (xIsNext?'x':'o');
	}

	//Renders React element ...
	return(
		<div className="game-info__status">
			<div className={'status '+effect}>{status}</div>
  		</div>
	);
}



//Moves component
//----------------
//Functional component which uses the game history to compute and renders players successive move
//(players can revert to previous moves)
//- Display a list of buttons pointing to each move made
//- Highlights the button which links to the current move
//- Runs a click event handler on each button
const Moves = props => {
	const { history, stepNumber, ...other } = props;
	const moves = history.map((step,move)=>{
		const clickIndex 	= step.clickIndex;
		const 	col 		= Math.floor(clickIndex % 3),
				row 		= Math.floor(clickIndex / 3),
				//col and row where the latest click happened
				clickPosition = '(row:'+row+', col:'+col+')';
		let desc = move ? 'Go to move #'+move+' '+clickPosition : 'Go to game start';
		//Bold the currently selected item in the move list
		const btn_highlight = (stepNumber===move)?'btn-primary':'btn-secondary';
		return(
			<li key={move}>
	          	<button className={"btn "+btn_highlight+" btn-block"}
	            onClick={()=> other.onClick(move) }>{desc}</button>
	        </li>
		);
	});

	//Renders React element ...
	return(
		<div className="game-info__moves">
            <ol className="list-moves list-unstyled">
              {moves}
            </ol>
        </div>
	);
}



//Game component
//----------------
//Stateful component that contains the application's major business logic...
//- Handles the logic of clicking on the board (handleClick)
//- Handles the logic on clicking on a on move button
//- Renders the entire game
class Game extends React.Component {
	//Setup component initial state values and bind methods
	constructor(props){
		super(props); //Access parent functions
		this.state = {
			history: [{
				squares:Array(9).fill(null),
				//Help calculate the col and row where the latest click happened
				clickIndex:null
			}],
			xIsNext: true,
      		stepNumber: 0
		};
		this.handleClick = this.handleClick.bind(this);
		this.jumpTo = this.jumpTo.bind(this);
	}

	//...
	//- Updates app's history (based on the current step)
	//- Make sure no selection happens on the same square or if the game has been won already
	//- Records each move and save it in the history
	//- Switch to the next player
	handleClick(i){
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if(squares[i] || calculateWinner(squares)) {
			return;
		}
		squares[i] = this.state.xIsNext?'x':'o';
		this.setState({
			history		: history.concat([{ squares:squares, clickIndex:i }]),
      		stepNumber	: history.length,
			xIsNext		: !this.state.xIsNext
		});
	}

  	//...
  	//Changes the game current step and update player's turn accordingly
  	//(will influence the game history)
	jumpTo(step) {
	    this.setState({
	      stepNumber: step,
	      xIsNext: (step % 2) === 0
	    });
	}

	//Renders React element ...
	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const squares = current.squares.slice();

		return(
			<div className="game">
				<div className="game-board">
					<Board squares={squares} onClick={this.handleClick} cells={[0,1,2,3,4,5,6,7,8]} />
				</div>
				<div className="game-info">
					<Status squares={ squares } xIsNext={ this.state.xIsNext } />
					<Moves history={ this.state.history } stepNumber={ this.state.stepNumber } onClick={this.jumpTo} />
				</div>
			</div>
		);
	}
}


//Render the application
ReactDOM.render(
	<Game />,
	document.getElementById('root')
);



/**
 * Scan the entire "squares" array to see if any of the
 * symbols are aligned in a winning combination.
 * (In case of winning, return the symbol)
**/
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
