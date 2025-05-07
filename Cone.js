export class Cone {
    constructor(gl, radius = 0.5, height = 1.0, segments = 32) {
        this.gl = gl;
        this.vertexCount = segments * 6;

        const { vertices, normals } = this.createCone(radius, height, segments);

        this.vao = gl.createVertexArray();
        this.vbo = gl.createBuffer();
        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

        const interleaved = [];
        for (let i = 0; i < vertices.length; i++) {
            interleaved.push(...vertices[i], ...normals[i]);
        }

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(interleaved), gl.STATIC_DRAW);

        const stride = 6 * Float32Array.BYTES_PER_ELEMENT;
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(1);

        gl.bindVertexArray(null);
    }

    createCone(radius, height, segments) {
        const vertices = [];
        const normals = [];

        const angleStep = (2 * Math.PI) / segments;
        const tip = [0, height - 0.5, 0];
        const baseY = -0.5;

        // Side triangles
        for (let i = 0; i < segments; i++) {
            const angle1 = i * angleStep;
            const angle2 = ((i + 1) % segments) * angleStep;
            const x1 = radius * Math.cos(angle1);
            const z1 = radius * Math.sin(angle1);
            const x2 = radius * Math.cos(angle2);
            const z2 = radius * Math.sin(angle2);

            const p1 = [x1, baseY, z1];
            const p2 = [x2, baseY, z2];

            vertices.push(tip, p1, p2);

            const u = [p1[0] - tip[0], p1[1] - tip[1], p1[2] - tip[2]];
            const v = [p2[0] - tip[0], p2[1] - tip[1], p2[2] - tip[2]];
            const normal = this.normalize(this.cross(u, v));
            normals.push(normal, normal, normal);
        }

        // Bottom circle
        for (let i = 0; i < segments; i++) {
            const angle1 = i * angleStep;
            const angle2 = ((i + 1) % segments) * angleStep;
            const x1 = radius * Math.cos(angle1);
            const z1 = radius * Math.sin(angle1);
            const x2 = radius * Math.cos(angle2);
            const z2 = radius * Math.sin(angle2);

            const center = [0, baseY, 0];
            const p1 = [x2, baseY, z2];
            const p2 = [x1, baseY, z1];

            vertices.push(center, p1, p2);
            const normal = [0, -1, 0];
            normals.push(normal, normal, normal);
        }

        return { vertices, normals };
    }

    normalize(v) {
        const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        return len > 0 ? [v[0] / len, v[1] / len, v[2] / len] : [0, 0, 0];
    }

    cross(a, b) {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];
    }

    draw(shader) {
        const gl = this.gl;
        gl.bindVertexArray(this.vao);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
        gl.bindVertexArray(null);
    }
}
