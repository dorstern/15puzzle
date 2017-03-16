/* AppView.js */

function AppView(){
	//Variables
	this.start_btn;
	this.timer;
	this.timerInterval;
	this.puzzle;

	//Events
	this.onStartClicked = new Event(this);
	this.onPuzzlePieceClicked = new Event(this);
	this.onTimerStoped = new Event(this);

	return this.init();
}

AppView.prototype = {
	init: function(){
		this.start_btn = $("#start_btn");
		this.puzzle = $("#puzzle");
		this.timer = $("#timer");
		this.initEvents();
	},

	initEvents: function(){
		var _this = this;
		this.start_btn.on("click", function(){
			_this.onStartClicked.notify();
		});
		this.puzzle.on("click", ".puzzle_piece", function(){
			var index = $(this).attr('attr-data');
			_this.onPuzzlePieceClicked.notify({index : index});
		});
	},

	shufflePuzzle: function(puzzle){
		var sorted_puzzle = [];
		for (var i = 0; i < puzzle.length; i++){
			var piece = this.puzzle.find(".puzzle_piece[attr-data='"+puzzle[i].index+"']");
			sorted_puzzle.push(piece);
		}
		this.puzzle.empty();
		for (var i = 0; i < puzzle.length; i++){
			this.puzzle.append(sorted_puzzle[i]);
		}
		this.disableStartBtn();
	},

	swapPuzzlePieces: function(piece_index1, piece_index2){
		var piece1 = this.puzzle.find(".puzzle_piece[attr-data='"+piece_index1+"']");
		var piece2 = this.puzzle.find(".puzzle_piece[attr-data='"+piece_index2+"']");
	    piece1.after(piece2.clone());
	    piece2.after(piece1).remove();
	},

	showTimer: function(){
		var _this = this;
		var offset = Date.now();
		var clock = 0;
		this.timerInterval = setInterval(function(){
		   var now = Date.now();
		   var date = now - offset;
			_this.timer.text(_this.formatTime(date));
		}, 1000);
	},

	formatTime: function(time) {
		var h = m = s = ms = 0;
		var newTime = '';

		h = Math.floor( time / (60 * 60 * 1000) );
		time = time % (60 * 60 * 1000);
		m = Math.floor( time / (60 * 1000) );
		time = time % (60 * 1000);
		s = Math.floor( time / 1000 );
		ms = time % 1000;

		newTime = this.pad(h, 2) + ':' + this.pad(m, 2) + ':' + this.pad(s, 2);
		return newTime;
	},

	pad: function(num, size) {
		var s = "0000" + num;
		return s.substr(s.length - size);
	},

	stopTimer: function(){
		clearInterval(this.timerInterval);
		alert("Congratulations, you solved the puzzle");
		this.enableStartBtn();
		this.onTimerStoped.notify({time : this.timer.text()});
	},

	disableStartBtn: function(){
		this.start_btn.attr({"disabled" : "disabled"});
	},

	enableStartBtn: function(){
		this.start_btn.removeAttr("disabled");
		this.start_btn.attr("value", "Restart");
	}
}
