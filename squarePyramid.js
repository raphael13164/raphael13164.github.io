export class SquarePyramid {
    constructor(gl) {
        this.gl = gl;
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        const vertices = new Float32Array([
            // bottom face (square)
            -0.5, 0.0, -0.5,  1, 0, 0, 1,
             0.5, 0.0, -0.5,  0, 1, 0, 1,
             0.5, 0.0,  0.5,  0, 0, 1, 1,
            -0.5, 0.0,  0.5,  1, 1, 0, 1,
             0.0, 1.0,  0.0,  1, 0, 1, 0  // apex
        ]);

        const indices = new Uint16Array([
            0, 1, 2,  0, 2, 3,   // bottom face
            0, 1, 4,
            1, 2, 4,
            2, 3, 4,
            3, 0, 4
        ]);

        const stride = 7 * Float32Array.BYTES_PER_ELEMENT;

        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        this.ebo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(0);

        gl.vertexAttribPointer(2, 4, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(2);

        gl.bindVertexArray(null);
    }

    draw(shader) {
        const gl = this.gl;
        shader.use();
        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, 18, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }
}
