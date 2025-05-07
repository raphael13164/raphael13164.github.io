#version 300 es
precision highp float;

layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_normal;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform vec3 light.position;
uniform vec3 light.ambient;
uniform vec3 light.diffuse;
uniform vec3 material.diffuse;
uniform vec3 u_viewPos;

out vec4 v_color;

void main() {
    vec4 worldPos = u_model * vec4(a_position, 1.0);
    vec3 fragPos = vec3(worldPos);
    vec3 norm = normalize(mat3(transpose(inverse(u_model))) * a_normal);
    vec3 lightDir = normalize(light.position - fragPos);
    vec3 viewDir = normalize(u_viewPos - fragPos);
    vec3 reflectDir = reflect(-lightDir, norm);

    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = light.diffuse * diff * material.diffuse;

    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 16.0);
    vec3 specular = vec3(0.5) * spec;

    vec3 ambient = light.ambient * material.diffuse;
    vec3 result = ambient + diffuse + specular;

    v_color = vec4(result, 1.0);
    gl_Position = u_projection * u_view * worldPos;
}
