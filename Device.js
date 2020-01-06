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

    drawLine(point0, point1) {
        const dist = point1.subtract(point0).length();

        if (dist < 2) {
            return;
        }

        // find middle point between first and second point
        const middlePoint = point0.add((point1.subtract(point0)).scale(0.5));
        this.drawPoint(middlePoint);

        // recursively draw middle point between first -> middle point and middle -> second point
        this.drawLine(point0, middlePoint);
        this.drawLine(middlePoint, point1);
    }

    drawBline(point0, point1) {
        let x0 = point0.x >> 0;
        let y0 = point0.y >> 0;
        const x1 = point1.x >> 0;
        const y1 = point1.y >> 0;
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = (x0 < x1) ? 1 : -1;
        const sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;
        while (true) {
            this.drawPoint(new BABYLON.Vector2(x0, y0));
            if ((x0 == x1) && (y0 == y1)) break;
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
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

            for (let indexFaces = 0; indexFaces < cMesh.faces.length; indexFaces++) {
                const currentFace = cMesh.faces[indexFaces];
                const vertexA = cMesh.vertices[currentFace.A];
                const vertexB = cMesh.vertices[currentFace.B];
                const vertexC = cMesh.vertices[currentFace.C];

                const pixelA = this.project(vertexA, transformMatrix);
                const pixelB = this.project(vertexB, transformMatrix);
                const pixelC = this.project(vertexC, transformMatrix);

                this.drawBline(pixelA, pixelB);
                this.drawBline(pixelB, pixelC);
                this.drawBline(pixelC, pixelA);
            }
        }
    }

}