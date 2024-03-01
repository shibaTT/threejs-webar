const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("canvas") });
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const scene = new THREE.Scene();
const markerRoot = new THREE.Group();
const arToolkitContext = THREEx.ArToolkitContext({
    cameraParametersUrl: "../data/camera.dat",
    detectionMode: "mono",
});
const arToolkitSource = THREEx.ArToolkitSource({
    sourceType: "webcam",
});
const arMarkerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
    type: "pattern",
    patternUrl: "../data/pattern-hiro.patt",
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
    console.log("今から配下に追加します");
    document.querySelector("main").appendChild(arToolkitSource.domElement);
    arToolkitSource.onResizeElement();
    arToolkitSource.copyElementSizeTo(renderer.domElement);
    if (arToolkitContext.arController) {
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
    }
});

scene.add(markerRoot);

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

cube.position.set(0, 0.5, 0);

markerRoot.add(cube);

renderer.setAnimationLoop(() => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
});
