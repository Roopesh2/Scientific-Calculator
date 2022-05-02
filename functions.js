var input = document.getElementById("disp"), // input
	output = document.getElementById("disp2"),// answer view
	// math functions
	sin  = Math.sin,
	tan  = Math.tan,
	cos  = Math.cos,
	sinh = Math.sinh,
	cosh = Math.cosh,
	tanh = Math.tanh,
	e    = Math.E,
	sqrt = Math.sqrt,
	cbrt = Math.cbrt,
	pi   = Math.PI,
	log  = Math.log,
	abs  = Math.abs,
	min  = Math.min,

	// Previous output
	Ans = 0,
	touchDownDelay,
	// cached factorial values
	cachefact = [
		1, // 0
		1, // 1
		2, // 2
		6, // 3
		24, // 4
		120, // 5
		720, // 6
		5040, // 7
		40320, // 8
		362880, // 9
		3628800, // 10
		39916800, // 11
		479001600 // 12
	],
	index = 0, // position of cursor
	cursor = '<span id="c"></span>',
	touchDownStart = 0, //record when touching or clicking started
	touchDownFunction = function() {};

// insert a string at a given position in an string
function insert(value, text, i) {
	return text.substr(0, i) + value + text.substr(i);
}

function addToInput(value) {
	value += "";
	input.innerHTML = insert(value + cursor, input.innerText, index);
	index += value.length;
}
function addOperator(value) {
	var text = input.innerText;
	var pre = text[index - 1] || "";
	if (!text.length) {
		if (!/[!%^×)÷]/.test(value)) {
			input.innerHTML = insert(value + cursor, input.innerText, index);
			index++;
		}
	} else if (pre != value) {
		if (pre.match(/[×\-+÷]/)) {
			if (pre.match(/[×÷]/) && value.match(/[×÷+]/) || pre.match(/[+\-]/) && value.match(/[×÷]/) || pre == "+" && value == "-") {
				input.innerHTML = text.substr(0, index - 1) + value + cursor + text.substr(index);
			}else if (!(pre == "-" && value == "+")) {
				input.innerHTML = insert(value + cursor, text, index++);
			}
		} else {
			input.innerHTML = insert(value + cursor, text, index++);
		}
	}
}

function backspace() {
	var text = input.innerText;
	if (index) // only executes when index != 0
		input.innerHTML = text.substr(0, index - 1) + cursor + text.substr(index--);
}

// clears input
function clearInput() {
	input.innerHTML = cursor;
}


// moves cursor to right
function moveToRight() {
	var text = input.innerText;
	if (index < text.length)
		input.innerHTML = insert(cursor, text, ++index);
}

// moves cursor to left
function moveToLeft() {
	if (index)
		input.innerHTML = insert(cursor, input.innerText, --index);
}

// moves cursor to end of input
function moveToEnd() {
	index = input.innerText.length;
	input.innerHTML = insert(cursor, input.innerText, index);
}

// moves cursor to Beginning of input
function moveToBeginning() {
	index = 0;
	input.innerHTML = insert(cursor, input.innerText, index);
}

function insertParen() {
	input.innerHTML = insert("(" + cursor + ")", input.innerText, ++index);
}

function startCount(f, delay) {
	touchDownStart = window.performance.now();
	touchDownFunction = f;
	touchDownDelay = delay || 300;
}
function endCount() {
	var touchDownTime = window.performance.now() - touchDownStart;
	if (touchDownTime >= touchDownDelay) {
		touchDownFunction();
	}

}
