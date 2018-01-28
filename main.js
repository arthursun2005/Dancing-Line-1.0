const ww = window.innerWidth, hh = window.innerHeight;
var container =
   document.querySelector('#container');
var renderer = new THREE.WebGLRenderer();
renderer.setSize(ww,hh);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
var camera = new THREE.PerspectiveCamera(75,ww/hh,1,1e10);
var scene = new THREE.Scene();
camera.position.set(0,900,0);
scene.add(camera);

var dead = false, win = false;
const g = -0.015;
var line = new Line(1,0.35);
scene.add(line.cube);

const StartTime = Date.now();

container.appendChild(renderer.domElement);
var blocks = [];
function addBlock(x,y,z,dx,dy,dz,f){
  var b = new Block(x,y,z,dx,dy,dz);
  if(f) f(b);
  scene.add(b.cube);
  blocks.push(b);
}
function joinBlock(direction,length,depth,width,changeInY,changeInD,f){
  if(direction == -1){
    var b1 = blocks[blocks.length-1];
    var d1 = b1.direction;
    if(d1 == 0){
      var b2 = new Block(b1.p.x-b1.d.x/2-length/2-changeInD,b1.p.y+changeInY+b1.d.y/2-depth/2,b1.p.z-b1.d.z/2+width/2,length,depth,width);
      b2.direction = 3;
    }else if(d1 == 1){
      var b2 = new Block(b1.p.x+b1.d.x/2-width/2,b1.p.y+changeInY+b1.d.y/2-depth/2,b1.p.z-b1.d.z/2-length/2-changeInD,width,depth,length);
      b2.direction = 0;
    }else if(d1 == 2){
      var b2 = new Block(b1.p.x+b1.d.x/2+length/2+changeInD,b1.p.y+changeInY+b1.d.y/2-depth/2,b1.p.z+b1.d.z/2-width/2,length,depth,width);
      b2.direction = 1;
    }else if(d1 == 3){
      var b2 = new Block(b1.p.x-b1.d.x/2+width/2,b1.p.y+changeInY+b1.d.y/2-depth/2,b1.p.z+b1.d.z/2+length/2+changeInD,width,depth,length);
      b2.direction = 2;
    }
  }else if(direction == 1){
    var b1 = blocks[blocks.length-1];
    var d1 = b1.direction;
    if(d1 == 0){
      var b2 = new Block(b1.p.x+b1.d.x/2+length/2+changeInD,b1.p.y+changeInY+b1.d.y/2-depth/2,b1.p.z-b1.d.z/2+width/2,length,depth,width);
      b2.direction = 1;
    }else if(d1 == 1){
      var b2 = new Block(b1.p.x+b1.d.x/2-width/2,b1.p.y+changeInY+b1.d.y/2-depth/2,b1.p.z+b1.d.z/2+length/2+changeInD,width,depth,length);
      b2.direction = 2;
    }else if(d1 == 2){
      var b2 = new Block(b1.p.x-b1.d.x/2-length/2-changeInD,b1.p.y+changeInY+b1.d.y/2-depth/2,b1.p.z+b1.d.z/2-width/2,length,depth,width);
      b2.direction = 3;
    }else if(d1 == 3){
      var b2 = new Block(b1.p.x-b1.d.x/2+width/2,b1.p.y+changeInY+b1.d.y/2-depth/2,b1.p.z-b1.d.z/2-length/2-changeInD,width,depth,length);
      b2.direction = 0;
    }
  }else if(direction == 0){
    var b1 = blocks[blocks.length-1];
    var d1 = b1.direction;
    if(d1 == 0){
      var b2 = new Block(b1.p.x,b1.p.y+changeInY+b1.d.y/2-depth/2,b1.p.z-b1.d.z/2-length/2-changeInD,width,depth,length);
      b2.direction = 0;
    }else if(d1 == 1){
      var b2 = new Block(b1.p.x+b1.d.x/2+length/2+changeInD,b1.p.y+changeInY+b1.d.y/2-depth/2,b1.p.z,length,depth,width);
      b2.direction = 1;
    }else if(d1 == 2){
      var b2 = new Block(b1.p.x,b1.p.y+changeInY+b1.d.y/2-depth/2,b1.p.z+b1.d.z/2+length/2+changeInD,width,depth,length);
      b2.direction = 2;
    }else if(d1 == 3){
      var b2 = new Block(b1.p.x-b1.d.x/2-width/2-changeInD,b1.p.y+changeInY+b1.d.y/2-depth/2,b1.p.z,length,depth,width);
      b2.direction = 3;
    }
  }else{
    console.log("ERROR, 'direction' out of range. Please enter -1, 0 or 1");
    return;
  }
  if(f) f(b2);
  b2.cube.castShadow = true;
  b2.cube.receiveShadow = true;
  scene.add(b2.cube);
  blocks.push(b2);
}
function turnO(space,length,height,f){
  var b1 = blocks[blocks.length-1];
  var d1 = b1.direction;
  if(d1 == 0 || d1 == 2){
    var b2 = new Block(b1.p.x+b1.d.x/2+length/2,b1.p.y+height/2,b1.p.z,length,height,b1.d.x-2*space);
    var b3 = new Block(b1.p.x-b1.d.x/2-length/2,b1.p.y+height/2,b1.p.z,length,height,b1.d.x-2*space);
  }else{
    var b2 = new Block(b1.p.x,b1.p.y+height/2,b1.p.z-b1.d.z/2-length/2,b1.d.x-2*space,height,length);
    var b3 = new Block(b1.p.x,b1.p.y+height/2,b1.p.z+b1.d.z/2+length/2,b1.d.x-2*space,height,length);
  }
  b2.kill = true;
  b3.kill = true;

  if(f) f(b2);
  scene.add(b2.cube);
  blocks.push(b2);

  if(f) f(b3);
  scene.add(b3.cube);
  blocks.push(b3);
}
/////// Blocks /////

// joinBlock parameters: direction,length,depth,width,changeInY,changeInD,f
// turnO parameters: space,length,height,f
var l1 = 17, w1 = 4, d1 = 20;
function f1(p){
  p.materal = new THREE.MeshLambertMaterial({color:this.c});
}
addBlock(0,-22,-2,w1,d1,l1*4);
joinBlock(-1,l1,d1,w1,0,0,f1);
joinBlock(1,l1,d1,w1,0,0,f1);
joinBlock(-1,l1,d1,w1,0,0,f1);
joinBlock(1,l1,d1,w1,0,0,f1);
joinBlock(-1,l1,d1,w1,0,0,f1);
joinBlock(1,l1,d1,w1,0,0,f1);
joinBlock(-1,l1,d1,w1,0,0,f1);
joinBlock(1,l1,d1,w1,0,0,f1);
joinBlock(-1,l1,d1,w1,0,0,f1);
joinBlock(1,l1,d1,w1,0,0,f1);
joinBlock(-1,l1,d1,w1,0,0,f1);
joinBlock(1,l1,d1,w1,0,0,f1);
//////////////////////
window.onmousedown = turn;
window.ontouchstart = turn;
function turn(){
  if(!line.inAir){
    var d = line.direction;
    if(d == 0){line.direction = 3;
    }else if(d == 3){line.direction = 0;}
  }
}
function autoCam(){
  camera.rotation.x = -Math.PI/4;
  camera.rotation.z = Math.PI/4;
  camera.position.x+=(line.p.x+0.5-camera.position.x)*0.03;
  camera.position.z+=(line.p.z+8-camera.position.z)*0.03;
  camera.position.y = line.p.y+20;
}
var directionalLight = new THREE.DirectionalLight(0xFFFFFF,1,100);
directionalLight.position.set(-1,1,1);
directionalLight.castShadow = true;
scene.add(directionalLight);

var directionalLight = new THREE.DirectionalLight(0xFFFFFF,1);
directionalLight.position.set(1,1,-1);
directionalLight.castShadow = true;
scene.add(directionalLight);
var dtime;
function animate() {
  line.update();
  dtime = Date.now()-StartTime;
  autoCam();
  if(!line.inAir){
    var geometry = new THREE.BoxGeometry(1,1,1);
    var material = new THREE.MeshLambertMaterial({color:line.c});
    var cube = new THREE.Mesh(geometry,material);
    cube.scale.set(line.d.x,line.d.y,line.d.z);
    cube.position.set(line.p.x,line.p.y,line.p.z);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
  }
  var hitP = 0;
  for (var i=0;i<blocks.length;i++) {
    var b = blocks[i];
    var l = line;
    var yin = l.p.y+l.d.y/2>b.p.y-b.d.y/2 && l.p.y-l.d.y/2<b.p.y+b.d.y/2;
    var xin = l.p.x+l.d.x/2>b.p.x-b.d.x/2 && l.p.x-l.d.x/2<b.p.x+b.d.x/2;
    var zin = l.p.z+l.d.z/2>b.p.z-b.d.z/2 && l.p.z-l.d.z/2<b.p.z+b.d.z/2;
    if(xin && yin && zin){
      b.hit = true;
      hitP++;
      if(b.kill || l.p.y<b.p.y+b.d.y/2){
        dead = true;
      }else{
        line.v.y = 0;
        line.p.y = b.p.y+b.d.y/2+l.d.y/2;
      }
    }else{
      b.hit = false;
    }
    b.update();
  }
  if(hitP<=0){
    line.inAir = true;
  }else{
    line.inAir = false;
  }
  line.v.y+=g;
  requestAnimationFrame(animate);
  renderer.render(scene,camera);
}
animate();