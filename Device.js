/*
    The core of the 3D engine.  
*/

class Device {
    constructor(canvas) {
        this.workingCanvas = canvas;
        this.workingWidth = canvas.width;
        this.workingHeight = canvas.height;
        this.workingContext = this.workingCanvas.getContext("2d");
    }

    // clear the back buffer with a specific color
    clear() {
        // clear with black color by default
        this.workingContext.clearRect(0, 0, this.workingWidth, this.workingHeight);
        // once cleared, we're using the image data to clear out back buffer
        this.backBuffer = this.workingContext.getImageData(0, 0, this.workingWidth, this.workingHeight);
    }

    // when the back buffer is ready, put it into the front buffer
    present() {
        this.workingContext.putImageData(this.backBuffer, 0, 0);
    }

    putPixel(x, y, color) {
        this.backBufferData = this.backBuffer.data;
        // get index of 1D array based on 2D coords
        // debugger;
        const index = ((x >> 0) + (y >> 0) * this.workingWidth) * 4;

        this.backBufferData[index] = color.r * 255;
        this.backBufferData[index + 1] = color.g * 255;
        this.backBufferData[index + 2] = color.b * 255;
        this.backBufferData[index + 3] = color.a * 255;
    }

    // transform 3D coords to 2D coords
    project(coord, transMat) {
        const point = BABYLON.Vector3.TransformCoordinates(coord, transMat);
        /*
        The transformed coordinates will be based on coordinate system that starts on the center of the screen.  But drawing on screen normally starts from top left.  We then need to transform them again to have x:0 and y:0 on top left
        */
        // debugger;
        const x = point.x * this.workingWidth + this.workingWidth / 2.0 >> 0;
        const y = -point.y * this.workingHeight + this.workingHeight / 2.0 >> 0;
        return (new BABYLON.Vector2(x, y));
    }

    drawPoint(point) {
        // clip what's visibible on screen - if the point is within the window, draw it
        if (point.x >= 0 && point.y >= 0 && point.x < this.workingWidth && point.y < this.workingHeight) {
            // drawing a yellow point
            this.putPixel(point.x, point.y, new BABYLON.Color4(1, 1, 0, 1));
        }
    }

    render(camera, meshes) {
        const viewMatrix = BABYLON.Matrix.LookAtLH(camera.position, camera.target, BABYLON.Vector3.Up());
        const projectionMatrix = BABYLON.Matrix.PerspectiveFovLH(0.78, this.workingWidth / this.workingHeight, 0.01, 1.0);

        for (let index = 0; index < meshes.length; index++) {
            const cMesh = meshes[index];
            // rotate THEN translate
            // note:  we are calling it worldMatrix, but it could also be called modelMatrix
            const worldMatrix = BABYLON.Matrix.RotationYawPitchRoll(cMesh.rotation.y, cMesh.rotation.x, cMesh.rotation.z).multiply(BABYLON.Matrix.Translation(cMesh.position.x, cMesh.position.y, cMesh.position.z));

            const transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);

            for (let indexVertices = 0; indexVertices < cMesh.vertices.length; indexVertices++) {
                // first, project the 3D coordinates into the 2D space
                const projectedPoint = this.project(cMesh.vertices[indexVertices], transformMatrix);
                // then we draw on screen
                this.drawPoint(projectedPoint);
            }
        }
    }

}