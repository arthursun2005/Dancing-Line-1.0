const ww = window.innerWidth, hh = window.innerHeight;
var container =
   document.querySelector('#container');
var renderer = new THREE.WebGLRenderer();
renderer.setSize(ww,hh);
var camera = new THREE.PerspectiveCamera(75,ww/hh,1,1e10);
var scene = new THREE.Scene();
camera.position.set(0,900,0);
scene.add(camera);

var dead = false, win = false;
const g = -0.15;
var line = new Line(30,4);
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
var l1 = 780, w1 = 180;
addBlock(0,-200,-200,70,100,1000);
joinBlock(-1,l1,15,w1,0,0);
joinBlock(1,l1,15,w1,0,0);
joinBlock(-1,l1,15,w1,0,0);
joinBlock(1,l1,15,w1,0,0);
joinBlock(-1,l1,15,w1,0,0);
joinBlock(-1,l1,15,w1,0,0);
joinBlock(1,l1,15,w1,0,0);
joinBlock(-1,l1,15,w1,0,0);
joinBlock(1,l1,15,w1,0,0);
joinBlock(-1,l1,15,w1,0,0);
joinBlock(1,l1,15,w1,0,0);
joinBlock(1,l1,15,w1,0,0);
//////////////////////
window.onmousedown = turn;
window.ontouchstart = turn;
function turn(){
  if(!line.inAir){
    var d = line.direction;
    if(d == 0) line.direction = 3;
    else if(d == 3) line.direction = 0;
  }
}
function autoCam(){
  camera.rotation.x = -Math.PI/4;
  camera.rotation.z = Math.PI/4;
  camera.position.x+=(line.p.x+100-camera.position.x)*0.05;
  camera.position.z+=(line.p.z+100-camera.position.z)*0.05;
  camera.position.y = line.p.y+300;
}
function lights(n){
  for(var i=0;i<n;i++){
    var pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.set(Math.random()*1000,4000,Math.random()*1000);
    scene.add(pointLight);
  }
}
lights(3);
var dtime;
function dist3(p1,p2){
  return Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2)+Math.pow(p2.z-p1.z,2))
}
function animate() {
  dtime = Date.now()-StartTime;
  autoCam();
  if(!line.inAir){
    var geometry = new THREE.BoxGeometry(1,1,1);
    var material = new THREE.MeshLambertMaterial({color:line.c});
    var cube = new THREE.Mesh(geometry,material);
    cube.scale.set(line.d.x,line.d.y,line.d.z);
    cube.position.set(line.p.x,line.p.y,line.p.z);
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
      if(b.kill){
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
  if(hitP<=0) line.inAir = true;
  else line.inAir = false;;
  line.update();
  line.v.y+=g;
  requestAnimationFrame(animate);
  renderer.render(scene,camera);
}
animate();