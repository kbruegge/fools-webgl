function createSphere(radius, segments,  rings) {
    // create the sphere's material
    var sphereMaterial =
            new THREE.MeshPhongMaterial({
                color: 0xFAFAFA,
                wireframe: false
            });


    var geom = new THREE.SphereGeometry(radius, segments, rings);
    // create a new mesh with
    // sphere geometry - we will cover
    var sphere = new THREE.Mesh(geom,
        sphereMaterial);
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

    // start the renderer
    this.renderer.setSize(width, height);

    // attach the render-supplied DOM element
    container.appendChild(this.renderer.domElement);

    this.render = function () {
        this.renderer.render(this.scene, this.camera);
    };

}

function main() {
    var v = new Viewport(800, 600);
    // set up the sphere vars
    var radius = 5, segments = 10, rings = 10, distance = 0;
    var parent = new THREE.Object3D(), handle = new THREE.Object3D();
    v.scene.add(parent);


    var s = [], pivots = [];

    for (var i = 0; i < 15; i++) {
        pivots[i] = new THREE.Object3D();
        v.scene.add(pivots[i]);
        s[i] = createSphere(radius, segments, rings);
        s[i].position.y = 15*i;     
        pivots[i].add(s[i]);
    };


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

    update();
    // animation loop
    function update() {
        requestAnimationFrame(update);
        //parent.rotation.z += 0.01;
        for (var i = s.length - 1; i >= 0; i--) {
            pivots[i].rotation.z += 1 / (s[i].position.y + 0.01) ;
            s[i].rotation.z += 0.04;
        };
        // draw
        v.render();

        controls.update();              
    }

}
