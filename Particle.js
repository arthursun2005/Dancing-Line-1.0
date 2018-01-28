const w0 = -0.5;
function Particle3(x,y,z){
	this.p = new THREE.Vector3(x,y,z);
	this.v = new THREE.Vector3();
	this.r = 10;
	var n = Math.random();
	if(n<0.2) this.c = 0xFFFF00;
	else  if(n<0.4) this.c = 0xFFDD55;
	else if(n<0.6) this.c = 0xFFAFAA;
	else if(n<0.6) this.c = 0xFF0000;
	else this.c = 0xFFFFFF;
	this.segments = 20;
	this.rings = 20;
	this.geometry = new THREE.SphereGeometry(this.r,this.segments,this.rings);
	this.material = new THREE.MeshLambertMaterial({color:this.c});
	this.sphere = new THREE.Mesh(geometry, material);

	this.weight = 0;
	this.pressure = 0;
	this.pressureForce = 0.25;
	this.repelForce = 2;
	this.cohesiveForce = 0.005;

	this.f = null;
}
Particle3.prototype.update = function(){
	if(this.f) this.f();
	addVectors(this.p,this.v);
	this.sphere.position.set(this.p.x,this.p.y,this.p.z);
};
Particle3.prototype.applyForce = function() {
	// body...
};
function Particle3System(scene){
	this.ps = [];
	this.scene = scene;
}
Particle3System.prototype.update = function() {
	// body...
};