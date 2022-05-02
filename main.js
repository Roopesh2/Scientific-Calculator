var ctx = document.createElement("canvas").getContext("2d");
ctx.font = "30px sans-serif";
var ans = 0;
var dispstr = "|";
var editindex = 0;
var disp = document.getElementById("disp");
var ansdisp = document.getElementById("disp2");
const {
	sin,
	tan,
	cos,
	sinh,
	cosh,
	tanh,
	E:e,
	sqrt,
	cbrt,
	PI:pi,
	log,
	abs,
	min
}=Math;
var cachefact = [
	1,
	1,
	2,
	6,
	24,
	120,
	720,
	5040,
	40320,
	362880,
	3628800,
	39916800,
	479001600

]
var cursor = "<span id='c'></span>";
var cursorTag = document.getElementById("c");
var powTag = "<sup></sup>"
//var h = document.documentElement.getBoundingClientRect().height;
var body = document.body,
	html = document.documentElement;
var height = html.clientHeight
var btns = document.getElementsByTagName("button");
var bh = (height-120)/5;
for(var i = 0;i < btns.length-1;i++){
	btns[i].style.height = bh+"px";
}
function dist(x,y){
	return abs(x-y);
}
function mini(c){
	var a = c;
	var nx = Infinity,k = 0;
	for (var i = 0; i < a.length; i++) {
		if(nx > a[i]){
			nx = a[i];
			k = i;
		}
	}
	return [nx,k];
}
function autoscroll(){
	var a = disp.innerText.substr(0,editindex);
	var len = ctx.measureText(a).width;
	disp.width = (len+30)+"px"
	disp.scrollLeft = len+30;
}

disp.addEventListener("click",function(e){
	var x = e.clientX+disp.offsetLeft;
	var mx = 0;
	var a = disp.innerText;
	var nx = [];
	// ;
	if(x > ctx.measureText(a).width){
		editindex = a.length;
		operateAt();
	}else{
		for (var i = 0; i < a.length; i++) {
			var ct = a.substr(0,i);
			var ch = a.charAt(i);
			var cl = ctx.measureText(ct).width;
			var cl2 = ctx.measureText(ch).width;
			var d1 = abs(x-(cl+cl2/2));
			nx.push(d1)
		}
		var c = mini(nx);
		editindex = c[1];
		operateAt();
	}
})
window.addEventListener('keydown',function(e){
	var k = e.key;
	if(k.match(/(\+|\-|\*|\/|\.)/)){
		oper(k);
	}else if(k === "^"){
		powStart();
	}else if(k === "Backspace"){
		bksp();
	}else if(k.match(/(\d|\||^[a-z]{1})/)){
		show(k);
	}else if(k.match(/[\)|\(]/)){
		paren(k);
	}else if(k === "ArrowLeft"){
		shiftleft();
	}else if(k === "ArrowRight"){
		shiftright();
	}else if(k === "Home"){
		editindex=0;
		operateAt()
	}else if(k === "End"){
		editindex=disp.innerText.length;
		operateAt()
	}
});
function powStart(){
	document.getElementById("c").remove();
	var a = disp.innerHTML;
	var i = editindex;
	disp.innerHTML= a.substr(0,i)
					+"<sup>"+cursor+"</sup>"
					+a.substr(i,a.length);
	editindex+=5;
}
function operateAt(k=0,n=0,x=""){
	var a = disp.innerHTML;
	disp.innerHTML= a.substr(0,editindex+k)
					+x+cursor
					+a.substr(editindex+n,a.length);
}
function mySin(x, iterNum) {
    var mxx = -x*x;
    var sin = 1;
    var n = 0;
    var term = 1;
    for (var i = 1; i <= 2*iterNum; i++) {
        n = n + 2;
        term = term * mxx / ( n*(n+1) );
        sin = sin + term
    }
    sin = x*sin;
    console.log(sin + " = my function.");
    console.log(Math.sin(x)  + " math.sin");
}
function paren(c){
	var a = disp.innerText;
	if(c === ")" && !(a[editindex-1].match(/(\(|\+|\-|\*|\/|×|÷|\.)/))){
		operateAt(0,0,")");
		editindex++;
		solve();
	}else if(c === "("){
		disp.innerHTML= a.substr(0,editindex)
						+"("+cursor
						+a.substr(editindex,a.length);
		editindex++

		solve();
	}
}
function shiftleft(){
	if(editindex > 0){
		editindex--;
		operateAt();
	}
}
function shiftright(){
	var a = disp.innerText;
	if(editindex < a.length){
		editindex++;
		operateAt();
	}
}
function  MySin(x){ /* x must be in the range [0..3.2] */
    var  i;
    const n = 30;
    var t = x, acum = x; /* first term, x/1! */
    x *= x; /* square the argument so we get x^2 in variable x */
    for (i = 3; i < n; i += 2) {
             t = -t * x / i / (i-1); /* mutiply by -1, x^2 and divide by i and (i-1) */
             acum += t; /* and add it to the accum */
    }
    return acum;
}
var s = setInterval(500,function(){
	var a = disp.innerText
	if(a === "|" || editindex === a.length-1){
		if(a.contains("|")){
			disp.innerText+="|";
		}else{
			disp.innerText = a.substr(0,a.length-2)
		}

	}else{
		disp.innerText = a.substr(0,editindex-1)
					+"|"
					+a.substr(editindex,a.length-1)
	}
});
function show(x){
	var a = disp.innerHTML;
	disp.innerHTML= a.substr(0,editindex)
					+x
					+a.substr(editindex,a.length);
	editindex++;
	solve();
}
//solving problems
function solve(t){
	autoscroll();
	if(disp.innerText.length>0){
		// debugger;
		document.getElementById("c").remove();
		var a = disp.innerHTML
		a = a.replace(/π/g,"pi")
			.replace(/×/g,"*")
			.replace(/÷/g,"/")
			.replace(/<sup>(.+)<\/sup>/g,"^($1)")
			.replace(/³√\(/g,"cbrt(")
			.replace(/Ans/g,"ans")
			.replace(/√\(/g,"sqrt(")
			.replace(/(\d+\.?\d*)\°/g, "deg($1)")
			.replace(/(\d+\.?\d*)\!/g, "fact($1)");
		var recop = "";
		var cp = "";
		var c = "";
		var rwadded = false;
		var ei = 0;
		// debugger;
		for (var i = 0; i < a.length; i++) {
			var nw = a[i];
			var rw = a[i-1];
			if(nw === "("){
				c = c.substr(0,ei)+"()"+c.substr(ei,c.length);
				cp+=")";
				ei++;
			}else if(nw === ")"){
				if(rw === "("){
					c = c.substr(0,ei-1)+c.substr(ei+1,c.length);
				}else if(rw.match(/(\+|-|\*|\/|×|÷)/)){
					c = c.substr(0,ei-1)+c.substr(ei,c.length);
				}else if(cp!==""){
					cp = cp.substr(0,cp.length-2);
					ei++;
				}else{
				}
			}else if(nw.match(/\d/)){
				c = c.substr(0,ei)+nw+c.substr(ei,c.length);
				ei++;
			}else if(nw.match(/(\*|\/|×|÷)/)){
				if(rw.match(/(\+|\-)/)){
					c = c.substr(0,ei)+nw+c.substr(ei,c.length);
					ei++;
				}else if(rw.match(/(\*|\/|×|÷)/)){
					c = c.substr(0,ei-1)+c.substr(ei,c.length);
				}else if(rw.match(/\d/)){
					c = c.substr(0,ei)+nw+c.substr(ei,c.length);
					ei++;
				}else{
					c = c.substr(0,ei)+nw+c.substr(ei,c.length);
				}
			}else if(nw === "-"){
				if(rw === "-"){
					c = c.substr(0,ei-1)+"+"+c.substr(ei,c.length);
				}else{
					c = c.substr(0,ei)+nw+c.substr(ei,c.length);
					ei++;
				}
			}else{
				c = c.substr(0,ei)+nw+c.substr(ei,c.length);
				ei++;
			}
		}
		for (var i = 1; i < c.length; i++) {
			var nw = c[i];
			var rw = c[i-1];
			c = c.replace(/[\+|\-|\*|\/|×|÷|\(|\^]+$/g,"");
			if(rw.match(/\d/) && nw.match(/(a|c|d|e|l|r|s|t|\()/)){
				c = c.substr(0,i) + "*" + c.substr(i,c.length);
			}else if(rw === ")" && nw.match(/(\d|a|c|d|e|l|r|s|t|\()/)){
				c = c.substr(0,i) + "*" + c.substr(i,c.length);
			}else if(rw.match(/[\+|\-|\*|\/|×|÷|\^]+/)){
				if(nw === ")"){
					c = c.substr(0,i-1)+c.substr(i,c.length)
				}
			}else if(rw === "("){
				if(nw.match(/[\+|\*|\/|×|÷|\^]/)){
					c = c.substr(0,i-1)+c.substr(i+1,c.length)
				}
			}
		}
		c = c.replace(/((\+|\-|\*|\/|×|÷|\(|\^)+)?\(\)/g,"")
				.replace(/\^/g,"**")
		//"23(244)".replace(/([(\+|\-|\*|\/|×|÷|\(|\^)*]$)/g,"");
		a = c;
		console.log(a)
		try{
			a = eval(a);
			ans = a;
			ansdisp.innerText = a;
			if(t){
				disp.innerText = a;
				ansdisp.innerText = "";
			}
		}catch(error){
			if(t){
				ansdisp.innerText = error;
			}else{
				ansdisp.innerText = "";
			}
		}
	a = disp.innerHTML;
	disp.innerHTML = a.substr(0,editindex)+cursor+a.substr(editindex,a.length);
	}else{
		ansdisp.innerText = "";
	}
}
//for backspace
function bksp(){
	var a = disp.innerText;
	var i = editindex;
	if(a[i-1]!==""){
		a = disp.innerHTML;
		if(a[i-1] === ">"){
			var tg = "";
			var tt = false;
			var ttn = 0;
			var ki = i;
			for(var k = i-1;k >= 0;k--){
				tg+=a[k];
				if(tg==="<sup>"){
					a = a.substr(0,k-1)+a.substr(k+5,a.length);
					tt = true;
					ki = k;
					tg = "";
					break;
				}
			}
			for(var k = ki;ki < a.length;ki++){
				tg+=a[k];
				if(tg==="<sup>"){
					if(tg){

					}
				}
			}
		}else{
			disp.innerHTML = a.substr(0,i-1)

							+a.substr(i,a.length);
			editindex--;
		}
	}
	solve()
}
function answer(){
	var a = disp.innerText;
	operateAt(0,0,"Ans")
	editindex+=3
}
function clearDisp(){
	disp.innerHTML = cursor;
	ansdisp.innerText = "";
	editindex=0;
}
//calculating factorial
function fact(x){
	var a = 1;
	x = +x
	if(cachefact[x] !== undefined){
		return cachefact[x]
	}else{
		a = cachefact[cachefact.length-1];
		for(var i = cachefact.length-1;i <= x;i++){
			a *= i;
			cachefact.push(a);
		}
		return a;
	}
}
//converting degree to radians
function deg(x){
	return (Math.PI * num(x))/180;
}
function oper(x){
	var a = disp.innerText;
	var le = a.length-1;
	var v = a.charAt(editindex-1);
	if(a.length>1){
		if(v==="/" ||v === "*" || v==="×" || v==="-" || v==="+" || v === "÷"){
			var len = a.length-1;
			if(v.match(/(\/|\*|×|÷)/) && x === "-"){
				operateAt(0,0,"-");
				editindex++;
			}else{
				operateAt(-1,0,x)
			}
		}else{
			operateAt(0,0,x)
			editindex++;
		}
	}
	if(a===""){
		if(x === '-'){
			disp.innerHTML = "-"+cursor;
			editindex++;
		}
		else if(x === ')' || x === "°" || x === "!" || x==="×" || x==="÷"){
			disp.innerHTML = cursor;

		}
	}
	solve();

}
//3x++99-86*x/3
