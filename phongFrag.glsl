#version 300 es
precision highp float;

in vec3 v_normal;
in vec3 v_fragPos;

uniform vec3 light_position;
uniform vec3 light_ambient;
uniform vec3 light_diffuse;
uniform vec3 material_diffuse;
uniform vec3 u_viewPos;

out vec4 fragColor;

void main() {
    vec3 norm = normalize(v_normal);
    vec3 lightDir = normalize(light_position - v_fragPos);
    vec3 viewDir = normalize(u_viewPos - v_fragPos);
    vec3 reflectDir = reflect(-lightDir, norm);

    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = light_diffuse * diff * material_diffuse;

    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 16.0);
    vec3 specular = vec3(0.5) * spec;

    vec3 ambient = light_ambient * material_diffuse;
    vec3 result = ambient + diffuse + specular;
    fragColor = vec4(result, 1.0);
}