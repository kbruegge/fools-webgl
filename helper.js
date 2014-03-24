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

function getRandomXZVector (min, max) {
    var x = getRandomNumber(min,max);
    var z = getRandomNumber(min,max);
    var y = 0;
    return new THREE.Vector3(x,y,z);
}

function getRandomYZVector (min, max) {
    var y = getRandomNumber(min,max);
    var z = getRandomNumber(min,max);
    var x = 0;
    return new THREE.Vector3(x,y,z);
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

function Viewport(width, height, element) {
    // set some camera attributes
    var VIEW_ANGLE = 45,
        ASPECT = width / height,
        NEAR = 0.01,
        FAR = 50000;

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