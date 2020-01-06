class Mesh {
    constructor(name, verticesCount, facesCount) {
        this.vertices = new Array(verticesCount);
        this.faces = new Array(facesCount);
        this.rotation = BABYLON.Vector3.Zero();
        this.position = BABYLON.Vector3.Zero();
    }
}