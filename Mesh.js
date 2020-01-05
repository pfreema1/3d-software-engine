class Mesh {
    constructor(name, verticesCount) {
        this.vertices = new Array(verticesCount);
        this.rotation = BABYLON.Vector3.Zero();
        this.position = BABYLON.Vector3.Zero();
    }
}