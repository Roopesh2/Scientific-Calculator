function shuntingYard (stack) {
	var output = [];
	var operator = [];
	var i = 0;
	var nullType = {value:"", type:null};
	while(i < stack.length){
		// debugger;
	    var token = stack[i++];
		var lastToken = operator[operator.length - 1] || nullType;
	    if (token.type == "number"){
	        output.push(token);
		} else if (token.type == "function") {
	        operator.push(token);
		} else if (token.type == "operator") {
	        while (
				((operator[operator.length - 1] || nullType).type == "operator") &&
				(
					(precedence(token.value) < precedence((operator[operator.length - 1] || nullType).value)) ||
					(precedence(token.value) == precedence((operator[operator.length - 1] || nullType).value) && associativity(token.value) == "left" && (operator[operator.length - 1] || nullType).value != "(")
				) && operator.length > 0)
				{
					output.push(operator.pop());
				}
	        operator.push(token)
		} else if (token.value == "(") {
	        operator.push(token);
		} else if (token.value == ")") {
	        while ((operator[operator.length - 1] || nullType).value != "(" && operator.length > 0) {
	            output.push(operator.pop());
			}
	        /* If the stack runs out without finding a left parenthesis, then there are mismatched parentheses. */
	        if ((operator[operator.length - 1] || nullType).value != "(") {
	            operator.pop();
			}
		}
	}
	/* After while loop, if operator stack not null, pop everything to output queue */
	if (operator.length != 0) {
	    while (operator.length != 0) {
	        /* If the operator token on the top of the stack is a parenthesis, then there are mismatched parentheses. */
	        output.push(operator.pop());
		}
	}
	return output;
}

function precedence (thing) {
	if (thing == "%") return 0;
	if (/[\-+]/.test(thing)) return 1;
	if (/[*/]/.test(thing)) return 2;
	if (thing == "^") return 3;
	if (thing == "function") return 4;
}
function associativity (thing) {
	if (/[*%+\-]/.test(thing)){
		return "left";
	} else {
		return "right";
	}
}
