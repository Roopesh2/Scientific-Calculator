window.addEventListener('keydown', function(evt) {
	var key = evt.key.toLowerCase();
	if (key == "backspace") { // backspace
		backspace();
	} else if (key == "arrowleft") { //  move to left
		moveToLeft();
	} else if (key == "arrowright") { // move to right
		moveToRight();
	} else if (key == "enter") { // compute
		solve();
	} else if (key.match(/^[a-z0-9)]$/)) { // numbers and letters
		addToInput(key);
	} else if (key.match(/[×÷*!\-+/.^]/)) { // operators
		addOperator(key);
		if (key == "^") {
			insertParen();
		}
	} else if (key.match(/[(]/)) { // operators
		if (evt.ctrlKey) {
			insertParen();
		} else {
			addToInput("(");
		}
	}
});
