function dist(x1,y1,x2,y2){
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}
function random(a, b){
	return a+Math.random()*(b-a);
}
function mag(x, y){
	return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
}
function Point(x, y){
	this.x = x || 0;
	this.y = y || 0;
}
Point.prototype.mult = function(a) {
	this.x*=a;
	this.y*=a;
};
Point.prototype.div = function(a) {
	this.x/=a;
	this.y/=a;
};
Point.prototype.add = function(a) {
	this.x+=a.x;
	this.y+=a.y;
};
Point.prototype.sub = function(a) {
	this.x-=a.x;
	this.y-=a.y;
};
Point.prototype.mag = function(){
	return mag(this.x,this.y);
};
Point.prototype.heading = function(){
	return Math.atan2(this.y,this.x);
};
Point.prototype.normalize = function() {
	var l = this.mag(this.x,this.y);
	this.x/=l;
	this.y/=l;
};
Point.prototype.floor = function(){
	this.x = Math.floor(this.x);
	this.y = Math.floor(this.y);
};
Point.prototype.round = function(){
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
};
Point.prototype.ceil = function(){
	this.x = Math.ceil(this.x);
	this.y = Math.ceil(this.y);
};
Point.mult = function(a,b){
	return new Point(a.x*b, a.y*b);
};
Point.div = function(a,b){
	return new Point(a.x/b, a.y/b);
};
Point.prototype.copy = function(a){
	this.x = a.x;
	this.y = a.y;
};
Point.sub = function(a,b){
	return new Point(a.x-b.x,a.y-b.y);
};
Point.normalize = function(a){
	var l = a.mag();
	var x = a.x/l;
	var y = a.y/l;
	return new Point(x,y);
};
function pointLine(p1,p2,s){
	s = s || 1;
	var d = Point.sub(p2,p1);
	var m = d.mag();
	var a = d.heading();
	var r = [];
	for(var i=0;i<=m;i+=s){
		var p = new Point(Math.cos(a)*i+p1.x,Math.sin(a)*i+p1.y);
		r.push(p);
	}
	return r;
}
function circleLine(x1,y1,x2,y2,x,y,r){
	var p = new Point(x,y);
	if(y2>y1){
		var p1 = new Point(x2,y2);
		var p2 = new Point(x1,y1);
	}else{
		var p1 = new Point(x1,y1);
		var p2 = new Point(x2,y2);
	}
	var pc = new Point((p1.x+p2.x)/2,(p1.y+p2.y)/2);
	var d1 = Point.sub(p,pc);
	var d2 = Point.sub(p2,p1);
	var a1 = d1.heading();
	var a2 = d2.heading();
	var m1 = d1.mag();
	var m2 = d2.mag();
	var t = Math.abs(a1-a2);
	if(a1>a2+Math.PI) t-=Math.PI; 
	var e1 = Point.sub(p,p2), e2 = Point.sub(p,p1);
	var ends = e1.mag()<r || e2.mag()<r;
	if(Math.sin(t)*m1<r && Math.cos(t)*m1<m2/2 || ends) return true;
	else return false;
}
function circleLineDepth(x1,y1,x2,y2,x,y,r){
	var p = new Point(x,y);
	if(y2>y1){
		var p1 = new Point(x2,y2);
		var p2 = new Point(x1,y1);
	}else{
		var p1 = new Point(x1,y1);
		var p2 = new Point(x2,y2);
	}
	var pc = new Point((p1.x+p2.x)/2,(p1.y+p2.y)/2);
	var d1 = Point.sub(p,pc);
	var d2 = Point.sub(p2,p1);
	var a1 = d1.heading();
	var a2 = d2.heading();
	var m1 = d1.mag();
	var m2 = d2.mag();
	var t = Math.abs(a1-a2);
	if(a1>a2+Math.PI) t-=Math.PI; 
	var e1 = Point.sub(p,p2), e2 = Point.sub(p,p1);
	var end1 = e1.mag()<r;
	var end2 = e2.mag()<r;
	if(Math.sin(t)*m1<r && Math.cos(t)*m1<m2/2 || ends){
		return [true,Math.sin(t)*m1,Math.cos(t)*m1,t,end1,end2];
	}
	else return false;
}