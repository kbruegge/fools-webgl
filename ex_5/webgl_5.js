//needs a viewport
function setupPlanets(xyplane, numPlanets){
    var radius = 5, segments = 2, rings = 2, distance = 0;
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
        if (xyplane === true){
            p.position= getRandomXYVector(-3050, 3060);
            p.velocity = getRandomXYVector(-10,10);
        } else {
            p.position= getRandomVector(-2050, 2060);
            p.velocity = getRandomVector(-10,10);   
        }
        s[i] = p;
        
    }
    
    return s;

}

function createParticleSystem(particleCount){
            // create the particle system
        var particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
          color: 0xAAAAAA,
          size: 1,
          transparent: true,
          opacity: 0.5
        });

    // now create the individual particles
    for (var p = 0; p < particleCount; p++) {

      // create a particle with random
      // position values, -250 -> 250
      var particle = new THREE.Vector3();

      // add it to the geometry
      particles.vertices.push(particle);
    }

    
    return new THREE.ParticleSystem(
        particles,
        pMaterial);
    
}

var sunMaterial =
        new THREE.MeshPhongMaterial({
            color: 0xffbd3f,
            wireframe: false,
            emissive: 0xe4bf5b
 });


function main() {
    

    
    var v = new Viewport(800, 600);
    var planets = setupPlanets(false, $('#numplanets').val() );
    var index;
    for (index = 0; index < planets.length; ++index) {
        v.scene.add(planets[index]);
    }
    

    v.scene.add(createPlane(450, 450));
    
    var particleCount = 10000;
    var particleSystem =  createParticleSystem(particleCount);
    var particles = particleSystem.geometry;


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

    document.body.appendChild( stats.domElement );
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
                stats.domElement.style.display =  'none';


    var G = 1000;
    $('#reset').click( function(){
        for (index = 0; index < planets.length; ++index) {
            v.scene.remove(planets[index]);
        }
        var num = $('#numplanets').val();
        planets = setupPlanets(false, num);
        for (index = 0; index < planets.length; ++index) {
            v.scene.add(planets[index]);
        }
        v.scene.add(particleSystem);
    });
    
    $('#resetxy').click( function(){
        for (index = 0; index < planets.length; ++index) {
            v.scene.remove(planets[index]);
        }
        var num = $('#numplanets').val();
        planets = setupPlanets(true, num);
        for (index = 0; index < planets.length; ++index) {
            v.scene.add(planets[index]);
        }
    });
    $('#fps').click( function() {
        if ( ! $('#fps').is(':checked') ){
            stats.domElement.style.display =  'none';
        } else {
            stats.domElement.style.display =  'block';
        }
    });
    $('#trails').click( function() {
        if ( $('#trails').is(':checked') ){
            v.scene.add(particleSystem);
        } else {
            v.scene.remove(particleSystem);
        }
    });
    $('#gconstant').change( function() {
        G = $('#gconstant').val();
    });

    var clock = new THREE.Clock();
    var counter = 1;
    var particleIndex = 1;
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
                planet.addGForce(p, G);
                planet.collision(p);
                if(p.radius > 40){
                    p.material = sunMaterial;   
                }
            }

            planet.applyForce(deltaT);
            planet.resetForce();
            if( counter % 4 === 0)
            {   
                if (particleIndex >= particleCount){
                        particleIndex = 0;
                }
                particles.vertices[particleIndex].set(planet.position.x, planet.position.y , planet.position.z);

                particleIndex++;
            }
            if(planet.dead){
                v.scene.remove(planet);
            }
            planet.animate(deltaT);
        }
         if( counter % 4 === 0 ) {
             counter = 0;
         }
        counter++;
        
        particleSystem.geometry.verticesNeedUpdate = true;
        
        v.render();
        controls.update(); 
        stats.end();
    }
}



