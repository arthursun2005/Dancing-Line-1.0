function Line(d,vt){
	this.direction = 0;
	this.p = new THREE.Vector3();
	this.v = new THREE.Vector3();
	this.d = new THREE.Vector3();
	this.inAir = true;
	this.c = 0xFFAA00;
	this.dv = vt;
	this.dead = false;
	this.geometry = new THREE.BoxGeometry(1,1,1);
	this.material = new THREE.MeshLambertMaterial({color:this.c});
	this.cube = new THREE.Mesh(this.geometry,this.material);
	this.d.set(d,d,d);
	this.cube.scale.set(this.d.x,this.d.y,this.d.z);
	this.cube.position.set(this.p.x,this.p.y,this.p.z);
	this.v.set(0,0,-vt);
}
Line.prototype.update = function() {
	this.p.addVectors(this.p,this.v);
	this.cube.position.set(this.p.x,this.p.y,this.p.z);
	this.cube.scale.set(this.d.x,this.d.y,this.d.z);
	if(this.direction == 0){
		this.v.x = 0;
		this.v.z = -this.dv;
	}else if(this.direction == 1){
		this.v.x = this.dv;
		this.v.z = 0;
	}else if(this.direction == 2){
		this.v.x = 0;
		this.v.z = this.dv;
	}else if(this.direction == 3){
		this.v.x = -this.dv;
		this.v.z = 0;
	}
};