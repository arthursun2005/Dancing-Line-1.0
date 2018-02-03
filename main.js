const ww = window.innerWidth, hh = window.innerHeight;
var container =
   document.querySelector('#container');
var renderer = new THREE.WebGLRenderer();
renderer.setSize(ww,hh);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
var camera = new THREE.PerspectiveCamera(75,ww/hh,1,1e10);
var scene = new THREE.Scene();
scene.add(camera);

var dead = false, win = false;
const g = -0.015;
var line = new Line(1.2,0.4);
scene.add(line.cube);

const StartTime = Date.now();

container.appendChild(renderer.domElement);
var blocks = [];
function addBlock(x,y,z,dx,dy,dz,f){
  var b = new Block(x,y,z,dx,dy,dz);
  if(f) f(b);
  b.cube.castShadow = false;
  b.cube.receiveShadow = true;
  blocks.push(b);
  scene.add(b.cube);
}
function joinBlock(b,direction,length,depth,width,changeInY,changeInD,f){
  if(direction == -1){
    var b1 = b;
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
    var b1 = b;
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
    var b1 = b;
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
  blocks.push(b2);
  scene.add(b2.cube);
}
function turnO(b,space,length,height,f){
  var b1 = b;
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
  blocks.push(b2);
  scene.add(b2.cube);

  if(f) f(b3);
  blocks.push(b3);
  scene.add(b3.cube);
}
/////// Blocks /////
/*
joinBlock parameters:    b,direction,length,depth,width,changeInY,changeInD,f
turnO parameters:        b,space,length,height,f
addBlock parameters:     x,y,z,dx,dy,dz,f
*/
var l1 = 30, w1 = 5, d1 = 20;
var sy = -75;
function f1(p){p.c = 0x110706;}
function f2(p){p.c = 0x070401;p.kill = true;}
function f3(p){
  p.c = 0x080808;
  p.kill = true;
}
function f4(p){p.c = 0x00FF00;}
addBlock(0,sy-d1/2,-200,500,10,1000,f2);
for(var i=0;i<30;i++){
  var x = random(-150,150);
  var z = random(-500,100);
  var dx = random(10,120);
  var dy = random(5,35);
  var dz = random(10,120);
  addBlock(x,sy-d1/2,z,dx,dy,dz,f3);
}
var step = {
  up: function(n,l,d,w,h,z,f){
  },
  down: function(n,l,d,w,h,z,f){
    for(var i=0;i<n;i++){
      joinBlock(blocks[blocks.length-1],0,l,d,w,h,z,f);
    }
  }
}
addBlock(0,sy,-50,w1,d1,l1*3,f1);
joinBlock(blocks[blocks.length-1],-1,l1,d1,w1,0,0,f1);
joinBlock(blocks[blocks.length-1],1,l1*2,d1,w1,0,0,f1);
joinBlock(blocks[blocks.length-1],-1,l1/8,d1,w1,0,0,f1);
joinBlock(blocks[blocks.length-1],1,l1/4,d1,w1,0,0,f1);
joinBlock(blocks[blocks.length-1],-1,l1,d1,w1,0,0,f1);
joinBlock(blocks[blocks.length-1],1,l1,d1,w1,0,0,f1);
joinBlock(blocks[blocks.length-1],-1,l1/2,d1,w1,0,0,f1);
joinBlock(blocks[blocks.length-1],1,l1/8,d1,w1,0,0,f1);
joinBlock(blocks[blocks.length-1],-1,l1/4,d1,w1,0,0,f1);
joinBlock(blocks[blocks.length-1],1,l1/2,d1,w1,0,0,f1);
joinBlock(blocks[blocks.length-1],-1,l1/2,d1,w1,0,0,f1);
joinBlock(blocks[blocks.length-1],1,l1,d1,w1,0,0,f1);
joinBlock(blocks[blocks.length-1],-1,l1/16,d1,w1/2,0,0,f1);
joinBlock(blocks[blocks.length-1],1,l1/16,d1,w1/2,0,0,f1);
joinBlock(blocks[blocks.length-1],-1,l1/16,d1,w1/2,0,0,f1);
step.down(300,2,10,2,-0.2,3,f4);
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

var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add(light);

var light = new THREE.PointLight(0xffffff,3,0,2);
light.position.set(100,100,-50);
light.castShadow = true;
scene.add(light);
var dtime;

var pg = new Particle3System(scene);
pg.gravity = g;

function animate() {
  if(dead){
    //alert("you are dead");
    return;
  }
  if(win){
    //alert("you WON");
    return;
  }
  dtime = Date.now()-StartTime;
  line.update();
  autoCam();
  if(!line.inAir){
    var geometry = new THREE.BoxGeometry(1,1,1);
    var material = new THREE.MeshLambertMaterial({color:line.c});
    var cube = new THREE.Mesh(geometry,material);
    cube.scale.set(line.d.x,line.d.y,line.d.z);
    cube.position.set(line.p.x,line.p.y,line.p.z);
    cube.castShadow = true;
    cube.receiveShadow = false;
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
      if(b.kill || l.p.y+l.d.y<b.p.y+b.d.y/2){
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