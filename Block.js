function Block(x,y,z,dx,dy,dz){
	this.p = new THREE.Vector3();
	this.v = new THREE.Vector3();
	this.d = new THREE.Vector3();
	this.direction = 0;
	this.c = 0x777722;
	this.kill = false;
	this.hit = false;
	this.f = null;
	this.p.set(x,y,z);
	this.d.set(dx,dy,dz);
	this.geometry = new THREE.BoxGeometry(1,1,1);
	this.material = new THREE.MeshLambertMaterial({color:this.c});
	this.cube = new THREE.Mesh(this.geometry,this.material);
	this.cube.scale.set(this.d.x,this.d.y,this.d.z);
	this.cube.position.set(this.p.x,this.p.y,this.p.z);
}
Block.prototype.update = function() {
	if(this.f) this.f();
	this.p.addVectors(this.p,this.v);
	this.cube.position.set(this.p.x,this.p.y,this.p.z);
	this.cube.scale.set(this.d.x,this.d.y,this.d.z);
};