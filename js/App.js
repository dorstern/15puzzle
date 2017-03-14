/* App.js */

function App(){
	//Variables
	this.view = new AppView();
	this.puzzle = [];
	this.completed_puzzle = [];
	this.num_pieces = 16;

	var _this = this;

	//Event Handling
	this.view.onStartClicked.attach(function(){
		_this.onStartClicked();
	});

	this.view.onPuzzlePieceClicked.attach(function(sender, args){
		_this.onPuzzlePieceClicked(args.index);
	});

	this.view.onTimerStoped.attach(function(sender, args){
		_this.saveScore(args.time);
	});

	return this.init();
}

App.prototype = {
	init: function(){
		var index = 1;
		for (var i = 0; i < 4; i++){
			for (var j = 0; j < 4; j++){
				var piece = new PuzzlePiece(i,j,index);
				this.puzzle.push(piece);
				index = index + 1;
			}
		}
		this.completed_puzzle = JSON.parse(JSON.stringify(this.puzzle));
	},

	onStartClicked: function(){
		this.shuffle(this.puzzle);
		this.startTimer();
		this.view.shufflePuzzle(this.puzzle);
	},

	shuffle: function(array){
		var currentIndex = array.length, temporaryValue, randomIndex;
		while (currentIndex !== 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			this.swapPuzzlePieces(array[currentIndex], array[randomIndex]);
		}

		return array;
	},

	swapPuzzlePieces: function(puzzlePiece1, puzzlePiece2){
		temporaryIndex = puzzlePiece1.index
		puzzlePiece1.index = puzzlePiece2.index;
		puzzlePiece2.index = temporaryIndex;
	},

	startTimer: function(){
		this.view.showTimer();
	},

	onPuzzlePieceClicked: function(index){
		var piece = this.puzzle.filter(function( piece ){
			return piece.index == index;
		});
		var piece_row = piece[0].row;
		var piece_col = piece[0].col;
		var next_to_pieces = this.puzzle.filter(function( piece ){
			return (((piece.row == piece_row - 1) && (piece.col == piece_col)) || ((piece.row == piece_row + 1) && (piece.col == piece_col)) || 
				((piece.row == piece_row) && (piece.col == piece_col - 1)) || ((piece.row == piece_row) && (piece.col == piece_col + 1)));
		});
		for (var i = 0; i < next_to_pieces.length; i++){
			if (next_to_pieces[i].index == 16){
				this.swapPuzzlePieces(piece[0], next_to_pieces[i]);
				this.view.swapPuzzlePieces(piece[0].index, next_to_pieces[i].index);
				this.checkPuzzleCompleted();
				break;
			}
		}
	},

	checkPuzzleCompleted: function(){
		for (var i = 0; i < this.num_pieces; i++){
			if (this.completed_puzzle[i] != this.puzzle[i]){
				return false;
			}
		}
		this.view.stopTimer();
	},

	saveScore: function(time){
		var scores = JSON.parse(localStorage.getItem("scores"));
		if (!scores){
			scores = [time];
		} else {
			scores.push(time);
		}
		localStorage.setItem("scores", JSON.stringify(scores));
	}

}

/* Puzzle Piece */
function PuzzlePiece(row, col, index){
	this.row = row;
	this.col = col;
	this.index = index;
}


$(function(){
	var app = new App();
});