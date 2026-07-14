# Carrera Científica

Videojuego web corto (en español) para adolescentes sobre decisiones reales en la carrera científica.

## Cómo jugar

1. Abre `index.html` en tu navegador (desde la carpeta del proyecto).
2. Pulsa **Comenzar**.
3. Elige opciones en cada situación y observa el resultado del dado virtual.
4. Intenta avanzar lo suficiente para ganar el Premio Nobel.

## Qué enseña

- Elección y posible cambio de carrera universitaria.
- Doctorado, papers, precariedad y supervisión complicada.
- Migrar al Reino Unido (beneficios y dificultades).
- Conferencias internacionales, industria y descubrimientos inesperados.
- Pensamiento crítico con lenguaje cercano.

## Estructura del proyecto

```
├── index.html          # Página principal del juego
├── game.js             # Lógica de presentación (DOM)
├── styles.css          # Estilos
└── src/
    ├── game-logic.js       # Lógica pura del juego (testeable)
    └── game-logic.test.js  # Tests automáticos
```

## Tests automáticos

La lógica pura del juego (dados, impactos, requisitos del Nobel, preguntas…) está cubierta por tests automáticos con [Vitest](https://vitest.dev/).

### Requisitos

- Node.js 18 o superior

### Instalación de dependencias

```bash
npm install
```

### Ejecutar los tests

```bash
npm test
```

### Ejecutar los tests en modo interactivo (watch)

```bash
npm run test:watch
```
