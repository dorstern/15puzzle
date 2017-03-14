/* Scores.js */

function Scores(){
	this.scores_table;
	this.scores_msg;

	return this.init();
}

Scores.prototype = {
	init: function(){
		this.scores_table = $("#scores_table");
		this.scores_msg = $("#scores_msg");
		this.getScores();
	},

	getScores: function(){
		var scores = JSON.parse(localStorage.getItem("scores"));
		if (scores){
			this.scores_table.show();
			for (var i = 0; i < scores.length; i++){
				this.scores_table.append("<div class='scores_table_item'>"+ scores[i] +"</div>");
			}
			this.scores_msg.text("Scores:");
		} else {
			this.scores_table.hide();
			this.scores_msg.text("No Scores");
		}
	}
}

$(function(){
	var scores = new Scores();
});