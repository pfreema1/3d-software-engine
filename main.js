let canvas, device, mesh, camera, softEngine;
let meshes = [];

document.addEventListener('DOMContentLoaded', init, false);

function init() {
    canvas = document.getElementById('frontBuffer');
    softEngine = new SoftEngine();
    mesh = new softEngine.Mesh("Cube", 8, 12);
    meshes.push(mesh);
    camera = new softEngine.Camera();
    device = new softEngine.Device(canvas);

    mesh.vertices[0] = new BABYLON.Vector3(-1, 1, 1);
    mesh.vertices[1] = new BABYLON.Vector3(1, 1, 1);
    mesh.vertices[2] = new BABYLON.Vector3(-1, -1, 1);
    mesh.vertices[3] = new BABYLON.Vector3(1, -1, 1);
    mesh.vertices[4] = new BABYLON.Vector3(-1, 1, -1);
    mesh.vertices[5] = new BABYLON.Vector3(1, 1, -1);
    mesh.vertices[6] = new BABYLON.Vector3(1, -1, -1);
    mesh.vertices[7] = new BABYLON.Vector3(-1, -1, -1);
    mesh.faces[0] = {
        A: 0,
        B: 1,
        C: 2
    };
    mesh.faces[1] = {
        A: 1,
        B: 2,
        C: 3
    };
    mesh.faces[2] = {
        A: 1,
        B: 3,
        C: 6
    };
    mesh.faces[3] = {
        A: 1,
        B: 5,
        C: 6
    };
    mesh.faces[4] = {
        A: 0,
        B: 1,
        C: 4
    };
    mesh.faces[5] = {
        A: 1,
        B: 4,
        C: 5
    };
    mesh.faces[6] = {
        A: 2,
        B: 3,
        C: 7
    };
    mesh.faces[7] = {
        A: 3,
        B: 6,
        C: 7
    };
    mesh.faces[8] = {
        A: 0,
        B: 2,
        C: 7
    };
    mesh.faces[9] = {
        A: 0,
        B: 4,
        C: 7
    };
    mesh.faces[10] = {
        A: 4,
        B: 5,
        C: 6
    };
    mesh.faces[11] = {
        A: 4,
        B: 6,
        C: 7
    };

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