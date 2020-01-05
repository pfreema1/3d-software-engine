let canvas, device, mesh, camera, softEngine;
let meshes = [];

document.addEventListener('DOMContentLoaded', init, false);

function init() {
    canvas = document.getElementById('frontBuffer');
    softEngine = new SoftEngine();
    mesh = new softEngine.Mesh("Cube", 8);
    meshes.push(mesh);
    camera = new softEngine.Camera();
    device = new softEngine.Device(canvas);

    mesh.vertices[0] = new BABYLON.Vector3(-1, 1, 1);
    mesh.vertices[1] = new BABYLON.Vector3(1, 1, 1);
    mesh.vertices[2] = new BABYLON.Vector3(-1, -1, 1);
    mesh.vertices[3] = new BABYLON.Vector3(-1, -1, -1);
    mesh.vertices[4] = new BABYLON.Vector3(-1, 1, -1);
    mesh.vertices[5] = new BABYLON.Vector3(1, 1, -1);
    mesh.vertices[6] = new BABYLON.Vector3(1, -1, 1);
    mesh.vertices[7] = new BABYLON.Vector3(1, -1, -1);

    camera.position = new BABYLON.Vector3(0, 0, 10);
    camera.target = new BABYLON.Vector3(0, 0, 0);

    requestAnimationFrame(drawingLoop);
}

function drawingLoop() {
    device.clear();

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;

    // do the matrix operation
    device.render(camera, meshes);
    // flush the back buffer into the front buffer
    device.present();

    requestAnimationFrame(drawingLoop);
}