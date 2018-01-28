const w0 = -0.5;
function Particle3(x,y,z){
	this.p = new THREE.Vector3(x,y,z);
	this.v = new THREE.Vector3();
	this.r = 1;
	this.c = 0xFF6600;
	this.segments = 20;
	this.rings = 20;
	this.geometry = new THREE.SphereGeometry(this.r,this.segments,this.rings);
	this.material = new THREE.MeshLambertMaterial({color:this.c});
	this.sphere = new THREE.Mesh(this.geometry, this.material);
	this.sphere.position.copy(this.p);
	this.weight = 0;
	this.pressure = 0;
	this.pressureForce = 0.25;
	this.viscousForce = 0.20;
	this.repelForce = 2;
	this.cohesiveForce = 0.005;
	this.f = null;
	this.k = this.r;
}
Particle3.prototype.cc = function(anyNum) {
	return Math.max(0,(anyNum+w0)*this.pressureForce);
};
Particle3.prototype.cal = function() {
	this.pressure = this.cc(this.weight);
};
Particle3.prototype.update = function(){
	if(this.f) this.f();
	this.material = new THREE.MeshLambertMaterial({color:this.c});
	this.sphere.material = this.material;
	this.p.addVectors(this.p,this.v);
	this.sphere.position.copy(this.p);
};
Particle3.prototype.applyForce = function(f,m) {
	m = m || 1;
	this.v.addVectors(this.v,f.divideScalar(this.k/m));
};
Particle3.prototype.solveBlock = function(b) {
};
function Particle3System(scene){
	this.ps = [];
	this.scene = scene;
	this.f = null;
	this.maxRadius = null;
	this.all = [];
	this.gravity = 0;
}
Particle3System.prototype.addParticle = function(p) {
	this.scene.add(p.sphere);
	this.ps.push(p);
};
Particle3System.prototype.getMaxRadius = function() {
	if(this.ps.length<1) return;
	else if(this.ps.length<2){
		this.maxRadius = this.ps[0];
	}
	var R = this.ps[0];
	for (var i = this.ps.length - 1; i >= 1; i--) {
		var p = this.ps[i];
		if(p.r>R){R = p.r;}
	}
	this.maxRadius = R;
};
Particle3System.prototype.solve = function() {
	this.all = [];
	if(this.ps.length<1) return;
	var D = this.maxRadius*2;
	var minP = new THREE.Vector3();
	minP.copy(this.ps[0].p);
	for (var i = this.ps.length - 1; i >= 1; i--) {
		var p = this.ps[i];
		if(p.p.x<minP.x){
			minP.x = p.p.x;
		}
		if(p.p.y<minP.y){
			minP.y = p.p.y;
		}
		if(p.p.z<minP.z){
			minP.z = p.p.z;
		}
	}
	minP.divideScalar(D);
	minP.floor();
	for (var i = this.ps.length - 1; i >= 0; i--) {
		var p = this.ps[i];
		var x = Math.floor(p.p.x/D)-minP.x, 
			y = Math.floor(p.p.y/D)-minP.y, 
			z = Math.floor(p.p.z/D)-minP.z;
		if(!this.all[y]) this.all[y] = [];
		if(!this.all[y][x]) this.all[y][x] = [];
		if(!this.all[y][x][z]) this.all[y][x][z] = [];
		this.all[y][x][z].push({obj:p,id:i});
	}
	/*
		Setup for the liquid sim
	*/
	for (var i = this.ps.length - 1; i >= 0; i--) {
		var p = this.ps[i];
		var x = Math.floor(p.p.x/D)-minP.x, 
			y = Math.floor(p.p.y/D)-minP.y, 
			z = Math.floor(p.p.z/D)-minP.z;
		for(var py=y-1;py<=y+1;py++){
			if(!all[py]) continue;
			for(var px=x-1;px<=x+1;px++){
				if(!all[py][px]) continue;
				for(var pz=z-1;pz<=z+1;pz++){
					if(!all[py][px][pz]) continue;
					for (var j = all[py][px][pz].length - 1; j >= 0; j--) {
						/*
							starting from here
						*/
						var q = all[py][px][pz][j];
						var p2 = q.obj;
						var d = new THREE.Vector3();
						d.subVectors(p2.p,p.p);
						var m = d.length();
						// var n = d.normalize();
						var l = p.r+p2.r;
						if(m<l){
							p.weight+=1-m/l;
							p2.weight+=1-m/l;
						}
					}
				}
			}
		}
	}
	/*
		pressure from weight
	*/
	for (var i = this.ps.length - 1; i >= 0; i--) {
		this.ps[i].cal();
	}
	/*
		repel force from pressure
		viscous force
		cohesive force
		color mixing ?
	*/
	for (var i = this.ps.length - 1; i >= 0; i--) {
		var p = this.ps[i];
		var x = Math.floor(p.p.x/D)-minP.x, 
			y = Math.floor(p.p.y/D)-minP.y, 
			z = Math.floor(p.p.z/D)-minP.z;
		for(var py=y-1;py<=y+1;py++){
			if(!all[py]) continue;
			for(var px=x-1;px<=x+1;px++){
				if(!all[py][px]) continue;
				for(var pz=z-1;pz<=z+1;pz++){
					if(!all[py][px][pz]) continue;
					for (var j = all[py][px][pz].length - 1; j >= 0; j--) {
						/*
							starting from here
						*/
						var q = all[py][px][pz][j];
						var p2 = q.obj;
						var d = new THREE.Vector3();
						d.subVectors(p2.p,p.p);
						var m = d.length();
						var n = d.normalize();
						var l = p.r+p2.r;
						if(m<l){
							/*
								repel force from pressure
							*/
							var f = (p.pressure+p2.pressure)*p2.repelForce*p.repelForce*0.5;
							p.applyForce(n,f);
							p.applyForce(n,-f);
							/*
								viscous
							*/
							// velocity difference
							var vd = new THREE.Vector3();
							vd.subVectors(p2.v,p.v);
							var r1 = new THREE.Vector3(vd.x*p2.viscousForce,vd.y*p2.viscousForce,vd.z*p2.viscousForce);
							var r2 = new THREE.Vector3(vd.x*p.viscousForce,vd.y*p.viscousForce,vd.z*p.viscousForce);
							p.applyForce(r1);
							p2.applyForce(r2);
						}
					}
				}
			}
		}
	}
};
Particle3System.prototype.solveBlocks = function(arr) {
	for (var i = arr.length - 1; i >= 0; i--) {
		for (var j = this.ps.length - 1; j >= 0; j--) {
			this.ps[j].solveBlock(arr[i]);
		}
	}
};
Particle3System.prototype.update = function() {
	if(this.f) this.f();
	for (var i = this.ps.length - 1; i >= 0; i--) {
		var p = this.ps[i];
		p.v.y+=this.gravity;
		p.update();
	}
	this.getMaxRadius();
	this.solve();
};