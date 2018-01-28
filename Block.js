function Block(x,y,z,dx,dy,dz,c){
	this.p = new THREE.Vector3(x,y,z);
	this.v = new THREE.Vector3();
	this.d = new THREE.Vector3(dx,dy,dz);
	this.direction = 0;
	this.c = c || 0x987654;
	this.kill = false;
	this.hit = false;
	this.f = null;
	this.geometry = new THREE.BoxGeometry(1,1,1);
	this.material = new THREE.MeshLambertMaterial({color:this.c});
	this.cube = new THREE.Mesh(this.geometry,this.material);
	this.cube.scale.copy(this.d);
	this.cube.position.copy(this.p);
}
Block.prototype.update = function() {
	if(this.f) this.f();
	this.material = new THREE.MeshLambertMaterial({color:this.c});
	this.cube.material = this.material;
	this.p.addVectors(this.p,this.v);
	this.cube.scale.copy(this.d);
	this.cube.position.copy(this.p);
};