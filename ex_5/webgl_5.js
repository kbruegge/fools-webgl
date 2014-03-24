//needs a viewport
function setupPlanets(v){
    var radius = 5, segments = 2, rings = 2, distance = 0;
    var numPlanets =200 ;
    
    var s = [];
//    var p = new Planet(2, 2);
//    p.position = getRandomXYVector(-20, 20);
//    s[0] = p;
//    
//    var p = new Planet(30, 30);
//    p.position = getRandomXZVector(100, 100);
//    p.velocity = getRandomXZVector(-10,-11);
//    s[1] = p;
    
    for (var i = 0; i < numPlanets; i++) {
        //get a new planet with radius = mass
        radius = getRandomNumber(3, 20);
        var p = new Planet(radius, radius);
        p.position= getRandomVector(-1050, 1060);
        p.velocity = getRandomVector(-10,10);
        s[i] = p;
        
    }
    
    return s;

}

var sunMaterial =
        new THREE.MeshPhongMaterial({
            color: 0xffbd3f,
            wireframe: false,
            emissive: 0xe4bf5b
 });

function main() {
    
    var v = new Viewport(800, 600);
    
    var planets = setupPlanets();
    var index;
    for (index = 0; index < planets.length; ++index) {
        v.scene.add(planets[index]);
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
    
    var container = document.getElementById('container');
    
    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left

    container.appendChild( stats.domElement );
    
    var Props = function (){
        this.reset = function(){
                for (index = 0; index < planets.length; ++index) {
                    v.scene.remove(planets[index]);
                }
                planets = setupPlanets();
                for (index = 0; index < planets.length; ++index) {
                    v.scene.add(planets[index]);
                }
    
        };  
    };
   
    var guiProps = new Props();
    var gui = new dat.GUI();
    
    gui.add(guiProps, 'reset');
    
    var clock = new THREE.Clock();
    
    update();

    // animation loop
    function update() {
        stats.begin();
        requestAnimationFrame(update);
        var deltaT = clock.getDelta();
        //parent.rotation.z += 0.01;
        for (var i = planets.length - 1; i >= 0; i--) {
            var planet = planets[i];
            if(planet.dead){
                continue;
            }
            for (var l = planets.length - 1; l >= 0; l--) {
                var p = planets[l];
                if (p.dead) continue;
                if (l === i ) continue;
                planet.addGForce(p);
                planet.collision(p);
                if(p.radius > 40){
                    p.material = sunMaterial;   
                }
            }

            planet.applyForce(deltaT);
            planet.resetForce();
            if(planet.dead){
                v.scene.remove(planet);
            }
            planet.animate(deltaT);
       }
        
        v.render();
        controls.update(); 
        stats.end();
    }
}



