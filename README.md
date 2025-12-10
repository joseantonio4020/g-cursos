  "titulo": "Gestor de Cursos",
    "descripcion": "Aplicación CRUD en Angular para gestionar información relacionada con gestor de cursos.",
    "requerimientos": [
      "Implementar autenticación de usuarios con Firebase Authentication.",
      "Crear una colección principal en Firestore para almacenar datos de gestor de cursos.",
      "Permitir crear, editar y eliminar registros asociados al usuario autenticado.",
      "Agregar validaciones de formularios para campos obligatorios y formatos correctos.",
      "Permitir filtrar y buscar registros por criterios relevantes (nombre, fecha o categoría).",
      "Mostrar un listado con datos ordenados y actualizados en tiempo real desde Firestore.",
      "Crear una vista de estadísticas o resumen general con totales, promedios o estados principales."
    ]
# Gestor de Cursos - Angular + Firebase

Aplicación web completa para gestionar cursos y estudiantes, desarrollada con Angular y Firebase.

## Características

- ✅ Autenticación de usuarios con Firebase Authentication
- ✅ CRUD completo de Cursos y Estudiantes
- ✅ Base de datos en tiempo real con Firestore
- ✅ Búsqueda y filtros en tiempo real
- ✅ Estadísticas y reportes
- ✅ Diseño responsivo con Bootstrap
- ✅ Formularios reactivos con validaciones
- ✅ Rutas protegidas con Guards

## Tecnologías

- Angular 18 (Standalone Components)
- Firebase (Authentication + Firestore)
- Bootstrap 5
- TypeScript
- RxJS

## Instalación

1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd gcurso
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar Firebase
- Crear proyecto en Firebase Console
- Copiar credenciales en `src/environments/environment.ts`

4. Ejecutar aplicación
```bash
ng serve
```

5. Abrir en navegador: `http://localhost:4200`

## Estructura del Proyecto
```
src/app/
├── components/       # Componentes reutilizables
├── guards/          # Protección de rutas
├── models/          # Interfaces TypeScript
├── pages/           # Componentes de páginas
├── pipes/           # Pipes personalizados
├── services/        # Servicios de negocio
└── directives/      # Directivas personalizadas
```

## Funcionalidades

### Cursos
- Crear, editar y eliminar cursos
- Ver detalle de cada curso
- Filtrar por estado, categoría
- Ordenar por nombre, fecha, precio
- Ver estudiantes inscritos

### Estudiantes
- Registrar, editar y eliminar estudiantes
- Ver detalle de cada estudiante
- Filtrar por estado
- Ordenar por nombre, apellido, fecha
- Vincular con cursos

### Estadísticas
- Total de cursos y estudiantes
- Cursos activos, finalizados, cancelados
- Estudiantes activos, inactivos, graduados
- Precio y duración promedio
- Cursos por categoría
- Cursos más populares

## Credenciales de Prueba

Usuario: test@test.com
Contraseña: test123

## Autor

Tu Nombre - 2024