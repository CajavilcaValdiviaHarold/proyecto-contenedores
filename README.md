# Proyecto de Contenedores

Aplicación de tres servicios con Docker Compose: una API en Node.js (Express), una base de datos MySQL con volumen persistente y Nginx como proxy inverso.

**Integrantes:** (escribir aquí los nombres del grupo)

## Arquitectura

```
Cliente → Nginx (puerto 8080) → API Node (puerto 3000, interno) → MySQL (volumen datos_mysql)
```

Solo Nginx es accesible desde fuera. La API y la base de datos viven en la red interna `red_interna`.

## Requisitos

- Docker Engine con el plugin Docker Compose
- Git

## Cómo ejecutarlo

1. Clonar el repositorio y entrar a la carpeta:

```bash
git clone https://github.com/CajavilcaValdiviaHarold/proyecto-contenedores.git
cd proyecto-contenedores
```

2. Crear el archivo de variables de entorno a partir del ejemplo y cambiar las contraseñas:

```bash
cp .env.example .env
```

3. Levantar los servicios:

```bash
docker compose up -d --build
```

4. Probar la API a través de Nginx:

```bash
curl http://localhost:8080/health
curl -X POST http://localhost:8080/tareas -H "Content-Type: application/json" -d '{"titulo":"Mi primera tarea"}'
curl http://localhost:8080/tareas
```

5. Apagar los servicios (los datos se conservan en el volumen):

```bash
docker compose down
```

## Demostración del volumen persistente

Crear una tarea, ejecutar `docker compose down`, volver a levantar con `docker compose up -d` y consultar `/tareas`: la tarea sigue ahí, porque los datos viven en el volumen `datos_mysql` y no dentro del contenedor.

## Conceptos demostrados

| Concepto | Dónde se ve |
|---|---|
| Dockerfile propio | `api/Dockerfile` |
| Red personalizada | `red_interna` en `docker-compose.yml` |
| Volumen persistente | `datos_mysql` en el servicio `db` |
| Variables de entorno | Archivo `.env` (modelo en `.env.example`) |
| Healthcheck | Servicio `db`; la API espera con `service_healthy` |
| Proxy inverso | Servicio `nginx` con `nginx/nginx.conf` |
| Imagen publicada | Docker Hub: `cajavilcavaldiviaharold/api-contenedores:1.0` |

## Imagen en Docker Hub

```bash
docker pull cajavilcavaldiviaharold/api-contenedores:1.0
```