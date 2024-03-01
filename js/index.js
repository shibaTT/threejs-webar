const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("canvas") });
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const scene = new THREE.Scene();
const arCtx = THREEx.ArToolkitContext({
    cameraParametersUrl: "../data/camera.dat",
    detectionMode: "mono",
});
const arSource = THREEx.ArToolkitSource({
    sourceType: "webcam",
});
const arMarker = new THREEx.ArMarkerControls(arCtx, camera, {
    type: "pattern",
    patternUrl: "../data/pattern-hiro.patt",
});

renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

arCtx.init(() => {
    camera.projectionMatrix.copy(arCtx.getProjectionMatrix());
});
arSource.init(() => {
    document.body.appendChild(arSource.domElement);
    arSource.onResizeElement();
    arSource.copyElementSizeTo(renderer.domElement);
    if (arCtx.arController) {
        arSource.copyElementSizeTo(arCtx.arController.canvas);
    }
});

scene.add(arSource.domElement);

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

cube.position.set(0, 0.5, 0);

scene.add(cube);

renderer.setAnimationLoop(() => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
});

renderer.setPixelRatio(window.devicePixelRatio);