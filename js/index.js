const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("canvas"),
    antialias: true,
    alpha: true,
});
const camera = new THREE.PerspectiveCamera();
const scene = new THREE.Scene();
const markerGroup = new THREE.Group();
const arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: "./data/camera.dat",
    detectionMode: "mono",
});
const arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam",
});
const arMarkerControl = new THREEx.ArMarkerControls(arToolkitContext, markerGroup, {
    type: "pattern",
    patternUrl: "./data/hiro.patt",
});

renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

arToolkitContext.init(() => {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});
arToolkitSource.init(() => {
    document.querySelector("main").appendChild(arToolkitSource.domElement);
    arToolkitSource.onResizeElement();
    arToolkitSource.copyElementSizeTo(renderer.domElement);
    if (arToolkitContext.arController) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
    }
});

scene.add(markerGroup);

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

cube.position.set(0, 0.5, 0);

markerGroup.add(cube);

renderer.setAnimationLoop(() => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    if (arToolkitSource.ready) {
        arToolkitContext.update(arToolkitSource.domElement);
    }

    renderer.render(scene, camera);
});
