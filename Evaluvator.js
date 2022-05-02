function solve() {
	var text = input.innerText;
	text = text.replace(/×/g,"*")
				.replace(/÷/g,"/")
				.replace(/(pi)/g,"π");
	var corrected = "";
	var nextBrace = false;
	for (var i = 0; i < text.length; i++) {
		var ch = text[i];
		var next = text[i + 1] || "";
		if (nextBrace) {
			i--;
			nextBrace = false;
		}
		if (ch == "(") {
			corrected = insert("()", corrected, i);
		} else if (ch != ")") {
			corrected = insert(ch, corrected, i);
		} else if (ch == ")" && next == "(") {
			nextBrace = true;
		} else {
			nextBrace = false;
		}
	}
	text = corrected;
	var allowedFunctions5 = /^(acosh|asinh|atanh|round)$/;
	var allowedFunctions4 = /^(acos|asin|atan|cbrt|ceil|cosh|log2|sign|sinh|sqrt|tanh)$/;
	var allowedFunctions3 = /^(abs|cos|exp|log|max|min|sin|tan)$/;
	for (var i = 0; i < text.length; i++) {
		var ch = text[i];
		var pre = text[i - 1] || "";
		if (ch == "(") {
			if (pre.match(/[a-z2]/)) {
				var text5 = text.substring(i - 5, i);
				var text4 = text.substring(i - 4, i);
				var text3 = text.substring(i - 3, i);
				if (text5.match(allowedFunctions5) && text[i - 6]) {
					var preCh = text[i - 6];
					if (!preCh.match(/[+%^*(\-/]/)) {
						text = insert("*", text, i - 5);
						i++;
					}
				} else if (text4.match(allowedFunctions4) && text[i - 5]) {
					var preCh = text[i - 5];
					if (!preCh.match(/[+%^*(\-/]/)) {
						text = insert("*", text, i - 4);
						i++;
					}
				} else if (text3.match(allowedFunctions3) && text[i - 4]) {
					var preCh = text[i - 4];
					if (!preCh.match(/[+%^*(\-/]/)) {
						text = insert("*", text, i - 3);
						i++;
					}
				}
			} else if (!pre.match(/[(%^*\-+/]/)) {
				text = insert("*", text, i);
				i++;
			}
		}
	}
	for (var i = 0; i < text.length; i++) {
		var ch = text[i];
		var pre = text[i - 1] || "";
		if (ch.match(/\d/)) {
			if (pre.match(/[a-zπ)]/)) {
				text = insert("*", text, i);
				i++;
			}
		} else if (ch == "π") {
			if (pre.match(/[a-z)0-9!]/)) {
				text = insert("*", text, i);
				i++;
			}
		}
	}
	var variables = [];
	for (var i = text.length - 1; i >= 0; i--) {
		var ch = text[i];
		var pre = text[i + 1] || "";
		var text5 = text.substring(i - 5, i);
		var text4 = text.substring(i - 4, i);
		var text3 = text.substring(i - 3, i);
		var notMatch;
		if (ch == "(") {
			 if (Boolean(text5.match(allowedFunctions5))) {
				 i-=5;
			 } else if (Boolean(text4.match(allowedFunctions4))) {
				 i-=4;
			 } else if (Boolean(text3.match(allowedFunctions3))) {
				 i-=3;
			 } else {
				 var char = text[i];
		 		// debugger;
		 		while (!/[!%^*()\-+/0-9]/.test(char) && i >= 0) {
		 			if (char.match(/[a-z]/)) {
		 				variables.push(char);
		 				if (!(text[i - 1] || "").match(/[%^*(\-+/]/)) {
		 					text = insert("*", text, i);
		 				}
		 				// i--;
		 			}
		 			char = text[--i];
		 		}
			 }
		}else{
			var char = text[i];
			// debugger;
			while (!/[!%^*()\-+/0-9]/.test(char) && i >= 0) {
				if (char.match(/[a-z]/)) {
					variables.push(char);
					if (!(text[i - 1] || "").match(/[%^*(\-+/]/)) {
						text = insert("*", text, i);
					}
					// i--;
				}
				char = text[--i];
			}
		}
	}

	// parser
	var stackOP = [];
	for (var i = 0; i < text.length; i++) {
		var ch = text[i];
		var fx = getFunction(text.substring(i, i + 5))
		if (isNumber(ch)) {
			var number = ch;
			while (true) {
				if (!isNumber(text[i + 1])) break;
				var c = text[++i];
				number += c;
			}
			stackOP.push({
				type:"number",
				value: number
			});
		} else if (isOperator(ch)) {
			stackOP.push({
				type:"operator",
				value: ch
			});
		} else if (ch == "(") {
			stackOP.push({
				type:"LeftParen",
				value: ch
			});
		} else if (ch == ")") {
			stackOP.push({
				type:"RightParen",
				value: ch
			});
		} else if (fx !== null) {
			stackOP.push(fx);
			i += fx.value.length - 1;
		} else {
			stackOP.push({
				type:"variable",
				value: ch
			})
		}
	}
	// alert(stackOP);
	window.stackOP = stackOP
	// output.innerText = eval(text);
}

function isNumber (n) {
	return /\d/.test(n);
}
function isOperator (o) {
	return /[%^*\-+/]/.test(o);
}
function getFunction(txt) {
	if (txt.match(/[(]/)){
		txt = txt.split("(")[0];
		var fs5 = /^(acosh|asinh|atanh|round|)$/;
		var fs4 = /^(acos|asin|atan|cbrt|ceil|cosh|log2|sign|sinh|sqrt|tanh)$/;
		var fs3 = /^(abs|cos|exp|log|max|min|sin|tan)$/;
		var text5 = txt.substr(0, 5);
		var text4 = txt.substr(0, 4);
		var text3 = txt.substr(0, 3);
		// debugger
		if (fs5.test(text5)) {
			return {
				type: "function",
				value: text5
			};
		} else if (fs4.test(text4)) {
			return {
				type: "function",
				value: text4
			};
		} else if (fs3.test(text3)) {
			return {
				type: "function",
				value: text3
			};
		} else {
			return null;
		}
	} else {
		return null;
	}
}
