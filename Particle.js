const w0 = -0.5;
function Particle3(x,y,z){
	this.p = new THREE.Vector3(x,y,z);
	this.v = new THREE.Vector3();
	this.r = 1.2;
	this.c = 0xFF4400;
	this.segments = 20;
	this.rings = 20;
	this.geometry = new THREE.SphereGeometry(this.r,this.segments,this.rings);
	this.material = new THREE.MeshLambertMaterial({color:this.c});
	this.sphere = new THREE.Mesh(this.geometry, this.material);
	this.sphere.position.copy(this.p);
	this.weight = 0;
	this.pressure = 0;
	this.pressureForce = 0.10;
	this.viscousForce = 0.25;
	this.repelForce = 1.6;
	this.cohesiveForce = 0.01;
	this.f = null;
	this.k = this.r/Math.PI;
	this.age = 0;
	this.lifeSpan = null;
}
Particle3.prototype.cc = function(anyNum) {
	return Math.max(0,(anyNum+w0)*this.pressureForce);
};
Particle3.prototype.cal = function() {
	this.pressure = this.cc(this.weight);
};
Particle3.prototype.update = function(){
	if(this.f) this.f();
	this.age++;
	this.geometry = new THREE.SphereGeometry(this.r,this.segments,this.rings);
	this.material = new THREE.MeshLambertMaterial({color:this.c});
	this.sphere.material = this.material;
	this.sphere.geometry = this.geometry;
	this.p.addVectors(this.p,this.v);
	this.sphere.position.copy(this.p);
};
Particle3.prototype.applyForce = function(f,m) {
	m = m || 1;
	this.v.addVectors(this.v,f.divideScalar(this.k/m));
};
Particle3.prototype.solveBlock = function(b) {
	/*
		collision with the vertices
	*//*
	var vertices = [];
	vertices[0] = dist3(this.p.x,this.p.y,this.p.z,b.p.x-b.d.x/2,b.p.y-b.d.y/2,b.p.z-b.d.z/2);
	vertices[1] = dist3(this.p.x,this.p.y,this.p.z,b.p.x+b.d.x/2,b.p.y-b.d.y/2,b.p.z-b.d.z/2);
	vertices[2] = dist3(this.p.x,this.p.y,this.p.z,b.p.x-b.d.x/2,b.p.y+b.d.y/2,b.p.z-b.d.z/2);
	vertices[3] = dist3(this.p.x,this.p.y,this.p.z,b.p.x-b.d.x/2,b.p.y-b.d.y/2,b.p.z+b.d.z/2);
	vertices[4] = dist3(this.p.x,this.p.y,this.p.z,b.p.x+b.d.x/2,b.p.y+b.d.y/2,b.p.z-b.d.z/2);
	vertices[5] = dist3(this.p.x,this.p.y,this.p.z,b.p.x-b.d.x/2,b.p.y+b.d.y/2,b.p.z+b.d.z/2);
	vertices[6] = dist3(this.p.x,this.p.y,this.p.z,b.p.x+b.d.x/2,b.p.y-b.d.y/2,b.p.z+b.d.z/2);
	vertices[7] = dist3(this.p.x,this.p.y,this.p.z,b.p.x+b.d.x/2,b.p.y+b.d.y/2,b.p.z+b.d.z/2);
	for (var i = vertices.length - 1; i >= 0; i--) {
		var v = vertices[i];
		if(v>this.r) continue;
		switch(i){
			case 0:
				var l = 1-v/this.r;
				var d = new THREE.Vector3();
				d.subVectors(this.p,new THREE.Vector3(b.p.x-b.d.x/2,b.p.y-b.d.y/2,b.p.z-b.d.z/2));
				var n = d.normalize();
				this.applyForce(n,this.cc(l)*l);
				break;
			case 1:
				break;
			case 2:
				break;
			case 3:
				break;
			case 4:
				break;
			case 5:
				break;
			case 6:
				break;
			case 7:
				break;
			default: console.log("error from Particle.js");
		}
	}*/
	var yin = this.p.y+this.r>b.p.y-b.d.y/2 && this.p.y-this.r<b.p.y+b.d.y/2;
    var xin = this.p.x+this.r>b.p.x-b.d.x/2 && this.p.x-this.r<b.p.x+b.d.x/2;
    var zin = this.p.z+this.r>b.p.z-b.d.z/2 && this.p.z-this.r<b.p.z+b.d.z/2;
    /* 
    	imagine a cube
    	this will be testing all the possibilities of touching 6 faces
    */
    var l;
    // from behind (axis z)
    if(yin && xin && (b.p.z-this.p.z)<b.d.z/2+this.r && (b.p.z-this.p.z)>b.d.z/2){
    	l = b.d.z/2+this.r-(b.p.z-this.p.z);
    	this.v.z-=this.cc(l)*l*this.repelForce*5;
    }

    // from front (axis z)
	if(yin && xin && (this.p.z-b.p.z)<b.d.z/2+this.r && (this.p.z-b.p.z)>b.d.z/2){
    	l = b.d.z/2+this.r-(this.p.z-b.p.z);
    	this.v.z+=this.cc(l)*l*this.repelForce*5; 
    }

    // from top (axis y)
    if(zin && xin && (this.p.y-b.p.y)<b.d.y/2+this.r && (this.p.y-b.p.y)>b.d.y/2){
		l = b.d.y/2+this.r-(this.p.y-b.p.y);
		this.v.y+=this.cc(l)*l*this.repelForce*5;
    }

    // from bottom (axis y)
    if(zin && xin && (b.p.y-this.p.y)<b.d.y/2+this.r && (b.p.y-this.p.y)>b.d.y/2){
    	l = b.d.y/2+this.r-(b.p.y-this.p.y);
		this.v.y-=this.cc(l)*l*this.repelForce*5;

    }
    // from right (axis x)
    if(zin && yin && (this.p.x-b.p.x)<b.d.x/2+this.r && (this.p.x-b.p.x)>b.d.x/2){
    	l = b.d.x/2+this.r-(this.p.x-b.p.x);
    	this.v.x+=this.cc(l)*l*this.repelForce*5;
    }

     // from left (axis x)
    if(zin && yin && (b.p.x-this.p.x)<b.d.x/2+this.r && (b.p.x-this.p.x)>b.d.x/2){
    	l = b.d.x/2+this.r-(b.p.x-this.p.x);
    	this.v.x-=this.cc(l)*l*this.repelForce*5;
    }
};
function Particle3System(scene){
	this.ps = [];
	this.scene = scene;
	this.f = null;
	this.maxRadius = null;
	this.all = [];
	this.gravity = 0;
	this.damp = 0.995;
}
Particle3System.prototype.addParticle = function(p) {
	this.scene.add(p.sphere);
	this.ps.push(p);
};
Particle3System.prototype.getMaxRadius = function() {
	if(this.ps.length<1){
		this.maxRadius = null;
		return;
	}
	else if(this.ps.length<2){
		this.maxRadius = this.ps[0].r;
	}
	var R = this.ps[0].r;
	for (var i = this.ps.length - 1; i >= 1; i--) {
		var p = this.ps[i];
		if(p.r>R){
			R = p.r;
		}
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
		var o = {obj:p,id:i};
		var x = Math.floor(p.p.x/D)-minP.x, 
			y = Math.floor(p.p.y/D)-minP.y, 
			z = Math.floor(p.p.z/D)-minP.z;
		if(!this.all[y]) this.all[y] = [];
		if(!this.all[y][x]) this.all[y][x] = [];
		if(!this.all[y][x][z]) this.all[y][x][z] = [];
		this.all[y][x][z].push(o);
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
			if(!this.all[py]) continue;
			for(var px=x-1;px<=x+1;px++){
				if(!this.all[py][px]) continue;
				for(var pz=z-1;pz<=z+1;pz++){
					if(!this.all[py][px][pz]) continue;
					for (var j = this.all[py][px][pz].length - 1; j >= 0; j--) {
						/*
							starting from here
						*/
						var q = this.all[py][px][pz][j];
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
			if(!this.all[py]) continue;
			for(var px=x-1;px<=x+1;px++){
				if(!this.all[py][px]) continue;
				for(var pz=z-1;pz<=z+1;pz++){
					if(!this.all[py][px][pz]) continue;
					for (var j = this.all[py][px][pz].length - 1; j >= 0; j--) {
						/*
							starting from here
						*/
						var q = this.all[py][px][pz][j];
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
							var d = new THREE.Vector3();
							d.subVectors(p2.p,p.p);
							var n = d.normalize();
							p.applyForce(n,-f);

							var d = new THREE.Vector3();
							d.subVectors(p2.p,p.p);
							var n = d.normalize();
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

							var d = new THREE.Vector3();
							d.subVectors(p2.p,p.p);
							var m = d.length();
							var n = d.normalize();

							var l2 = (m-l)*(p.cohesiveForce+p2.cohesiveForce)*0.5;
							p.applyForce(n,l2);
							var d = new THREE.Vector3();
							d.subVectors(p2.p,p.p);
							var n = d.normalize();
							p2.applyForce(n,-l2);
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
		p.v.multiplyScalar(this.damp);
		p.update();
		if(p.lifeSpan && p.age>p.lifeSpan){
			this.scene.remove(this.ps[i].sphere);
			this.ps.splice(i,1);
		}
	}
	this.getMaxRadius();
	this.solve();
};