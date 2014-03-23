function getRandomNumber (min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomVector (min, max) {
    var x = getRandomNumber(min,max);
    var y = getRandomNumber(min,max);
    var z = getRandomNumber(min,max);
    return new THREE.Vector3(x,y,z);
}

function getRandomXYVector (min, max) {
    var x = getRandomNumber(min,max);
    var y = getRandomNumber(min,max);
    var z = 0;
    return new THREE.Vector3(x,y,z);
}
function distanceFromCenter(thing){
    var dist = Math.pow(thing.position.x, 2) + Math.pow(thing.position.y,2) + Math.pow(thing.position.z,2);
    return Math.sqrt(dist);
}


function createPlane(width, length){
        // create the sphere's material
        var planeMaterial =
            new THREE.MeshPhongMaterial({
                color: 0xc9b0b0,
                wireframe: true
        });
        var p = new THREE.PlaneGeometry(width,length);
        var plane = new THREE.Mesh(p, planeMaterial);
        plane.overdraw = true;
        return plane;
}

function createSphere(radius, segments,  rings) {
    var geom = new THREE.SphereGeometry(radius, segments, rings);

    // create a new mesh with
    // sphere geometry - we will cover
    var sphere = new THREE.Mesh(geom, new THREE.MeshNormalMaterial());
    return sphere;
}


function createSun(radius, segments,  rings) {
    var geom = new THREE.SphereGeometry(radius, segments, rings);
        var planeMaterial =
            new THREE.MeshPhongMaterial({
                color: 0xffbd3f,
                wireframe: false,
                emissive: 0xe4bf5b
     });
        
    // create a new mesh with
    // sphere geometry - we will cover
    var sphere = new THREE.Mesh(geom, planeMaterial);
    return sphere;
}

function Viewport(width, height) {
    // set some camera attributes
    var VIEW_ANGLE = 45,
        ASPECT = width / height,
        NEAR = 0.1,
        FAR = 10000;

    // get the DOM element to attach to
    // - assume we've got jQuery to hand
    var container = document.getElementById('container');

                // create a WebGL renderer, camera
    // and a scene
    this.renderer = new THREE.WebGLRenderer();
    this.camera = new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
    );

    this.scene = new THREE.Scene();
                // add the camera to the scene
    this.scene.add(this.camera);

                // the camera starts at 0,0,0
    // so pull it back
    this.camera.position.z = 300;
    this.camera.position.y = -500;
    this.camera.lookAt( new THREE.Vector3(0,0,0));

    // start the renderer
    this.renderer.setSize(width, height);

    // attach the render-supplied DOM element
    container.appendChild(this.renderer.domElement);
    this.renderer.setClearColor('#082a57');
    this.render = function () {
        this.renderer.render(this.scene, this.camera);
    };

}
function setupSuns(){
    var radius = 5, segments = 30, rings = 30;
    var sunMaterial =
            new THREE.MeshPhongMaterial({
                color: 0xffbd3f,
                wireframe: false,
                emissive: 0xe4bf5b
     });

    var masses = [];
    
    var sun1 = new Planet(radius, radius, undefined , undefined , sunMaterial, 30, 30);
    sun1.position.x = 100;
    sun1.position.y = 100;
    
    masses[0] = sun1;
    
    var sun2 = new Planet(radius, radius, undefined , undefined , sunMaterial, 30, 30);
    sun2.segments = segments;
    sun2.rings = rings;
    sun2.material = sunMaterial;
    sun2.position.x = -100;
    sun2.position.y = -100;
    masses[1] = sun2;
    
    return masses;
    
}
//needs a viewport
function setupPlanets(v){
    var radius = 5, segments = 10, rings = 10, distance = 0;
    var numPlanets = 900;
    
    var s = [];
    var oldpositions = [];
    
    for (var i = 0; i < numPlanets; i++) {
        //get a new planet with radius = mass
        radius = getRandomNumber(3, 10);
        var p = new Planet(radius, radius);
        p.position= getRandomVector(-140, 140);
        p.oldposition = (new THREE.Vector3()).addVectors(p.position,            getRandomVector(-0.1,0.1));
        
        s[i] = p;
        
    }
    
    return s;

}

function main() {
    
    var v = new Viewport(800, 600);
    
    var planets = setupPlanets();
    var index;
    for (index = 0; index < planets.length; ++index) {
        v.scene.add(planets[index]);
    }
    
    var suns = setupSuns();
    for (index = 0; index < suns.length; ++index) {
        v.scene.add(suns[index]);
    }

    v.scene.add(createPlane(450, 450));

    // create a point light
    var pointLight = new THREE.PointLight( 0xFFFFFF );

    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    var pointLight2 = new THREE.PointLight( 0xB0FBFB );

    // set its position
    pointLight2.position.x = -50;
    pointLight2.position.y = 40;
    pointLight2.position.z = -100;

    // add to the scene
    v.scene.add(pointLight);
    v.scene.add(pointLight2);
    controls = new THREE.TrackballControls(v.camera, v.renderer.domElement);
    
    
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild( stats.domElement );
    
    var Props = function (){
        this.reset = function(){
                var index;
                for (index = 0; index < planets.length; ++index) {
                    planets[index].dead = false;
                    planets[index].position = getRandomVector(-140,140);
                    planets[index].oldposition = planets[index].position;
                    v.scene.add(planets[index]);
                }
    
        };  
    };
   
    var guiProps = new Props();
    var gui = new dat.GUI();
    gui.add(guiProps, 'reset');
    var f1 = gui.addFolder('Sun 1');
    var controller = f1.add(suns[0], 'radius', 0.1, 50);
    controller.onChange(function(value) {
      // Fires when a controller loses focus.
        var sphere = suns[0];
        sphere.mass = value;
        sphere.scale.x = value/5;
        sphere.scale.y = value/5;
        sphere.scale.z = value/5;
    });
    var f2 = gui.addFolder('Sun 2');
    controller = f2.add(suns[1], 'radius', 0.1, 50);
    controller.onChange(function(value) {
      // Fires when a controller loses focus.
        var sphere = suns[1];
        sphere.mass = value;
        sphere.scale.x = value/5;
        sphere.scale.y = value/5;
        sphere.scale.z = value/5;
    });
    
    
    update();

    // animation loop
    function update() {
        stats.begin();
        requestAnimationFrame(update);
        //parent.rotation.z += 0.01;
        for (var i = planets.length - 1; i >= 0; i--) {
            var planet = planets[i];
            if(planet.dead){
                continue;
            }
            
            for(var k = suns.length - 1; k >= 0; k-- ){
                planet.addGForce(suns[k]);
            }

            planet.applyForce();
            planet.resetForce();
            if(planet.dead){
                v.scene.remove(planet);
            }
              //  delta.sub(this.oldposition);
    //this.oldposition = this.position;
    //return the new postiion for planet
            //minus alte posititon
            //dv = (new THREE.Vector3()).subVectors(dv, oldpositions[i]);
            //plus 2 mal aktuelle
           //dv = (new THREE.Vector3()).addVectors(dv, s[i].position.multiplyScalar(2));
            
            
           // s[i].position.add(s[i].velocity);
            
       }
        
        
        // draw
        v.render();

        controls.update(); 
        stats.end();
    }
}

function Planet(mass, radius, position, oldposition, material, segments, rings) {
    
    
    this.radius = radius;
    this.dead = false;
    
    if(segments === undefined){
        this.segments = 10;
    } else {
        this.segments = segments;   
    }
    
    if(rings === undefined){
        this.rings = 10;
    } else {
        this.rings = rings;   
    }
    
    this.geometry = new THREE.SphereGeometry(radius, segments, rings);
    
    if (material ===undefined){
        this.material = new THREE.MeshNormalMaterial();
    } else {
        this.material = material;   
    }
    
    THREE.Mesh.call(this, this.geometry, this.material);
    if (oldposition===undefined){ // parameter was omitted in call
        this.oldposition = this.position;
    } else {
        this.oldposition = oldposition;
    }
    
    this.mass = mass;
    this.force = new THREE.Vector3();
    
}

Planet.prototype = Object.create(THREE.Mesh.prototype);

Planet.prototype.addGForce = function (sun, death){

    var G = 1;
    var stepsize = 1;
    var currentPos = (new THREE.Vector3()).copy(this.position);
    var delta = (new THREE.Vector3()).subVectors(sun.position, this.position);
        if (delta.length() < (sun.radius + this.radius ) ){
            this.dead = true;
        }

    delta.divideScalar(Math.pow(delta.length(), 3) + stepsize);   

    //masse berücksichtigen
    this.force.add(delta.multiplyScalar(G * sun.mass * this.mass));
    
};

Planet.prototype.applyForce = function (){
    var f = (new THREE.Vector3()).copy(this.force);
    var pos = (new THREE.Vector3()).copy(this.position);
    f.sub(this.oldposition);
    f.add(pos.multiplyScalar(2));
    this.oldposition = (new THREE.Vector3()).copy(this.position);
    this.position = f;
};
Planet.prototype.resetForce = function (){
    this.force = new THREE.Vector3();
};

