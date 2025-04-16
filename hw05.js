import { resizeAspectRatio, setupText, updateText, Axes } from './util.js';
import { Shader, readShaderFile } from './shader.js';
import { SquarePyramid } from './squarePyramid.js'; // 꼭 Homework05 폴더 안에 있어야 함

const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');

let shader;
let startTime;
let lastFrameTime;
let isInitialized = false;

let viewMatrix = mat4.create();
let projMatrix = mat4.create();
let modelMatrix = mat4.create();

const cameraRadius = 3.0;
const cameraYSpeed = 45.0;
const cameraXZSpeed = 90.0;
const cameraYAmplitude = 5.0;

const pyramid = new SquarePyramid(gl);
const axes = new Axes(gl, 1.8);

document.addEventListener('DOMContentLoaded', () => {
    if (isInitialized) return;
    main().then(success => {
        if (!success) return;
        isInitialized = true;
    });
});

function initWebGL() {
    if (!gl) {
        console.error("WebGL 2 is not supported.");
        return false;
    }

    canvas.width = 700;
    canvas.height = 700;
    resizeAspectRatio(gl, canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(22 / 255, 41 / 255, 66 / 225, 1.0);
    return true;
}

async function initShader() {
    const vertexSource = await readShaderFile('shVert.glsl');
    const fragmentSource = await readShaderFile('shFrag.glsl');
    shader = new Shader(gl, vertexSource, fragmentSource);
}

function render() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastFrameTime) / 1000.0;
    const elapsedTime = (currentTime - startTime) / 1000.0;
    lastFrameTime = currentTime;

    // View matrix
    const camX = cameraRadius * Math.sin(glMatrix.toRadian(cameraXZSpeed * elapsedTime));
    const camZ = cameraRadius * Math.cos(glMatrix.toRadian(cameraXZSpeed * elapsedTime));
    const camY = cameraYAmplitude * Math.sin(glMatrix.toRadian(cameraYSpeed * elapsedTime)) + cameraYAmplitude;
    mat4.lookAt(viewMatrix,
        vec3.fromValues(camX, camY, camZ),
        vec3.fromValues(0, 0.5, 0),  // 사각뿔 중심
        vec3.fromValues(0, 1, 0)
    );

    // Model matrix (고정된 사각뿔)
    mat4.identity(modelMatrix);

    // Draw
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    shader.use();
    shader.setMat4('u_model', modelMatrix);
    shader.setMat4('u_view', viewMatrix);
    shader.setMat4('u_projection', projMatrix);

    pyramid.draw(shader);
    axes.draw(viewMatrix, projMatrix);

    requestAnimationFrame(render);
}

async function main() {
    if (!initWebGL()) return false;
    await initShader();

    mat4.perspective(projMatrix,
        glMatrix.toRadian(60),
        canvas.width / canvas.height,
        0.1,
        100.0
    );

    startTime = lastFrameTime = Date.now();
    requestAnimationFrame(render);
    return true;
}
