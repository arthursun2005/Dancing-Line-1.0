function dist2(x1,y1,x2,y2){
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}
function dist3(x1,y1,z1,x2,y2,z2){
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2)+Math.pow(z2-z1,2));
}
function random(a, b){
	return a+Math.random()*(b-a);
}
function mag2(x, y){
	return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
}
function mag3(x, y, z){
	return Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2));
}
// 3D point
function Point3(x,y,z){
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
}
// methods
Point3.prototype.add = function(p) {
	this.x+=p.x;
	this.y+=p.y;
	this.z+=p.z;
};
Point3.prototype.sub = function(p) {
	this.x-=p.x;
	this.y-=p.y;
	this.z-=p.z;
};
Point3.prototype.mult = function(p) {
	this.x*=p;
	this.y*=p;
	this.z*=p;
};
Point3.prototype.div = function(p) {
	this.x/=p;
	this.y/=p;
	this.z/=p;
};
Point3.prototype.floor = function(p) {
	this.x = Math.floor(this.x);
	this.y = Math.floor(this.y);
	this.z = Math.floor(this.z);
};
Point3.prototype.round = function(p) {
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
	this.z = Math.round(this.z);
};
Point3.prototype.ceil = function(p) {
	this.x = Math.ceil(this.x);
	this.y = Math.ceil(this.y);
	this.z = Math.ceil(this.z);
};
Point3.prototype.get = function(){
	return new Point(this.x,this.y,this.z);
};
Point3.prototype.normalize = function() {
	var n = Point3.mag(this);
	this.x/=n;
	this.y/=n;
	this.z/=n;
};
// other
Point3.mag = function(p){
	return mag3(p.x,p.y,p.z);
};
Point3.copy = function(a,b){
	b.x = a.x;
	b.y = a.y;
	b.z = a.z;
};
Point3.normalize = function(p){
	var n = Point3.mag(p);
	return new Point(p.x/n,p.y/n,p.z/n);
};
// 2D
function Point2(x,y){
	this.x = x || 0;
	this.y = y || 0;
}
// methods
Point2.prototype.add = function(p) {
	this.x+=p.x;
	this.y+=p.y;
};
Point2.prototype.sub = function(p) {
	this.x-=p.x;
	this.y-=p.y;
};
Point2.prototype.mult = function(p) {
	this.x*=p;
	this.y*=p;
};
Point2.prototype.div = function(p) {
	this.x/=p;
	this.y/=p;
};
Point2.prototype.floor = function(p) {
	this.x = Math.floor(this.x);
	this.y = Math.floor(this.y);
};
Point2.prototype.round = function(p) {
	this.x = Math.round(this.x);
	this.y = Math.round(this.y);
};
Point2.prototype.ceil = function(p) {
	this.x = Math.ceil(this.x);
	this.y = Math.ceil(this.y);
};
Point2.prototype.get = function(){
	return new Point(this.x,this.y);
};
Point2.prototype.normalize = function() {
	var n = Point2.mag(this);
	this.x/=n;
	this.y/=n;
};
// other
Point2.mag = function(p){
	return mag2(p.x,p.y);
};
Point2.normalize = function(p){
	var n = Point2.mag(p);
	return new Point(p.x/n,p.y/n);
};
Point3.copy = function(a,b){
	b.x = a.x;
	b.y = a.y;
};
Point2.heading = function(p){
	return Math.atan2(p.y,p.x);
};