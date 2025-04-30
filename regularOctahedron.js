// regularOctahedron.js
// Generates the geometry data for a regular octahedron centered at the origin

export class RegularOctahedron {
    constructor(gl) {
        this.gl = gl;
        this.initBuffers();
    }

    initBuffers() {
        const sqrt2 = Math.sqrt(2) / 2;

        // Vertices of a regular octahedron centered at origin
        const positions = new Float32Array([
             1, 0, 0,
            -1, 0, 0,
             0, 1, 0,
             0,-1, 0,
             0, 0, 1,
             0, 0,-1,
        ]);

        // Each triangle face uses vertex indices from the above list
        const indices = new Uint16Array([
            0, 2, 4,
            2, 1, 4,
            1, 3, 4,
            3, 0, 4,
            2, 0, 5,
            1, 2, 5,
            3, 1, 5,
            0, 3, 5,
        ]);

        // Same texture coords for each triangle (projected)
        const texcoords = new Float32Array([
            1, 0, 0, 0, 0.5, 1,
            0, 0, 1, 0, 0.5, 1,
            0, 1, 0, 0, 1, 0,
            1, 1, 0, 1, 0.5, 0,
            1, 0, 0, 1, 1, 1,
            0, 0, 1, 1, 0, 1,
            1, 1, 0, 0, 0.5, 1,
            0.5, 1, 1, 0, 0, 0
        ]);

        const texcoordsOneTri = new Float32Array([
            1, 0,
            0, 0,
            0.5, 1,
        ]);
        
        const expandedTexcoords = new Float32Array(8 * 3 * 2); // 총 48개
        for (let i = 0; i < 8; i++) {
            expandedTexcoords.set(texcoordsOneTri, i * 6);
        }

        this.vertexCount = indices.length;

        // Create VAO
        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);

        // Position buffer
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0);

        // Texcoord buffer
        this.texcoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, expandedTexcoords, this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(1);
        this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, false, 0, 0);

        // Index buffer
        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);

        this.gl.bindVertexArray(null);
    }

    draw(shader) {
        this.gl.bindVertexArray(this.vao);
        this.gl.drawElements(this.gl.TRIANGLES, this.vertexCount, this.gl.UNSIGNED_SHORT, 0);
        this.gl.bindVertexArray(null);
    }
}