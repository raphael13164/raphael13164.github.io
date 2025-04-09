// 08_Transformation.js (태양계 애니메이션 수정본)
import { resizeAspectRatio, Axes} from 'util.js';
import { Shader, readShaderFile } from 'shader.js';

const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');

let shader;
let vao;
let lastTime = 0;

let sunAngle = 0;
let earthAngle = 0;
let earthSelfAngle = 0;
let moonAngle = 0;
let moonSelfAngle = 0;

let axes = new Axes(gl, 1); // x, y axes 그려주는 object (see util.js)

function initWebGL() {
    if (!gl) {
        console.error('WebGL 2 not supported');
        return false;
    }

    canvas.width = 700;
    canvas.height = 700;

    resizeAspectRatio(gl, canvas);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.1, 0.2, 0.3, 1.0);

    return true;
}

function setupBuffers() {
    const vertices = new Float32Array([
        -0.5,  0.5,
        -0.5, -0.5,
         0.5, -0.5,
         0.5,  0.5
    ]);

    const indices = new Uint16Array([
        0, 1, 2,
        0, 2, 3
    ]);

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    shader.setAttribPointer("a_position", 2, gl.FLOAT, false, 0, 0);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);


    gl.bindVertexArray(null);
}

function drawObject(modelMatrix, color) {
    shader.use();
    shader.setMat4("u_model", modelMatrix);
    shader.setVec4("u_color", color);
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

function animate(currentTime) {
    if (!lastTime) lastTime = currentTime;
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    sunAngle += deltaTime * 45;
    earthAngle += deltaTime * 30;
    earthSelfAngle += deltaTime * 180;
    moonAngle += deltaTime * 360;
    moonSelfAngle += deltaTime * 360;

    render();
    requestAnimationFrame(animate);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    axes.draw(mat4.create(), mat4.create()); // 두 개의 identity matrix를 parameter로 전달

    // SUN
    let sunMatrix = mat4.create();
    mat4.rotateZ(sunMatrix, sunMatrix, glMatrix.toRadian(sunAngle));
    mat4.scale(sunMatrix, sunMatrix, [0.2, 0.2, 1]);
    drawObject(sunMatrix, [1.0, 0.0, 0.0, 1.0]);

    // EARTH
    let earthOrbit = mat4.create();
    mat4.rotateZ(earthOrbit, earthOrbit, glMatrix.toRadian(earthAngle));
    mat4.translate(earthOrbit, earthOrbit, [0.7, 0, 0]);

    let earthMatrix = mat4.clone(earthOrbit);
    mat4.rotateZ(earthMatrix, earthMatrix, glMatrix.toRadian(earthSelfAngle));
    mat4.scale(earthMatrix, earthMatrix, [0.1, 0.1, 1]);
    drawObject(earthMatrix, [0.0, 1.0, 1.0, 1.0]);

    // MOON
    let moonOrbit = mat4.clone(earthOrbit);
    mat4.rotateZ(moonOrbit, moonOrbit, glMatrix.toRadian(moonAngle));
    mat4.translate(moonOrbit, moonOrbit, [0.2, 0, 0]);

    let moonMatrix = mat4.clone(moonOrbit);
    mat4.rotateZ(moonMatrix, moonMatrix, glMatrix.toRadian(moonSelfAngle));
    mat4.scale(moonMatrix, moonMatrix, [0.05, 0.05, 1]);
    drawObject(moonMatrix, [1.0, 1.0, 0.0, 1.0]);

    
}

async function initShader() {
    const vert = await readShaderFile('shVert.glsl');
    const frag = await readShaderFile('shFrag.glsl');
    shader = new Shader(gl, vert, frag);
}

async function main() {
    if (!initWebGL()) return;
    await initShader();
    setupBuffers();
    requestAnimationFrame(animate);
}

main();
