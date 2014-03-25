
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
    
    this.velocity = new THREE.Vector3();
    this.mass = mass;
    this.force = new THREE.Vector3();
    
}

Planet.prototype = Object.create(THREE.Mesh.prototype);

Planet.prototype.addGForce = function (sun){

    var G = 1000;
    var stepsize = 10;
    var delta = (new THREE.Vector3()).subVectors(sun.position, this.position);
    var length = delta.length();
    delta.divideScalar(Math.pow(length, 3) + stepsize);   

    //masse berücksichtigen
    this.force.add(delta.multiplyScalar(G * sun.mass));
    
};

Planet.prototype.collision = function (sun){
     var delta = (new THREE.Vector3()).subVectors(sun.position, this.position);
     if (delta.length() < (sun.radius + 1) ){
        this.dead = true;
        //create new bigger planet.
        //what about the radius
        var nR = Math.pow(Math.pow(sun.radius, 3) + Math.pow(this.radius,3), 1/3);
        
        sun.scale.x = nR / sun.geometry.radius;
        sun.scale.y = nR / sun.geometry.radius;
        sun.scale.z = nR / sun.geometry.radius;
        
        sun.radius = nR;
        var nV = (new THREE.Vector3()).copy(this.velocity).multiplyScalar(this.mass);
        var sV = (new THREE.Vector3()).copy(sun.velocity).multiplyScalar(sun.mass);
        nV = nV.add(sV);
        nV.divideScalar(this.mass + sun.mass);
        
        sun.mass = this.mass + sun.mass;
        
        sun.velocity = nV;
    }
}

Planet.prototype.applyForce = function (deltaT){
    var f = (new THREE.Vector3()).copy(this.force);
    //var v = (new THREE.Vector3()).copy(this.velocity);
    f.multiplyScalar( Math.pow(deltaT,2) );
    //changes the original v but we dont need t anymore anyways
    f.add(this.velocity.multiplyScalar(deltaT));
    
    f.add(this.position);
    
    this.velocity = ((new THREE.Vector3()).subVectors(f, this.position)).divideScalar(deltaT);
    
};
Planet.prototype.animate = function (deltaT){
     var v = (new THREE.Vector3()).copy(this.velocity);
     this.position.add( v.multiplyScalar(deltaT));
};

Planet.prototype.resetForce = function (){
    this.force = new THREE.Vector3();
};