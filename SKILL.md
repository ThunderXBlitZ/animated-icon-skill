---
name: animated-icon-skill
description: Search, browse, and integrate animated Lottie icons from useanimations.com into web apps. Use when the user asks for animated icons, Lottie animations, wants to add animated UI icons to React/Vue/vanilla JS/Next.js, or searches for icon animations. Provides fuzzy search, category filtering, Lottie JSON files, and ready-to-use code snippets.
---

# Animated Icon Skill

79 pre-packaged animated icons from useanimations.com. Each icon is a Lottie animation (visibility.json) organized in `assets/useanimations/{name}/visibility.json` relative to this skill.

The full catalog is at `catalog.json` (relative to this skill directory).

## How to use this skill

### 1. Search animations

Read `catalog.json` (next to this SKILL.md) to load all animations. Perform fuzzy matching on the `name` and `description` fields against the user's query. Return a ranked list.

If a `--category` filter is given, restrict results to that category. Valid categories: **interface, media, navigation, security, other**.

Output format:
```
1. lock [security] — Animated lock icon
2. unlock [security] — Animated unlock icon
```

### 2. List animations

Read `catalog.json` and group animations by category. Show each category as a header with its animations listed beneath.

If `--category` is given, show only that category.

### 3. Get an animation

1. Look up the animation in `catalog.json` by exact `id` match
2. Read its `visibility.json` from `assets/useanimations/{name}/visibility.json`
3. Show the animation metadata (name, category, size, frameRate, frames)
4. Show the full Lottie JSON content
5. Show code examples for all 4 frameworks (see Code Examples section)

### 4. Get a snippet

Look up the animation in `catalog.json`, then generate a code example for the requested framework only (react, vue, vanilla, nextjs). Default to react if not specified.

## Color & Gradient Support

### Detecting the color scheme

When the user asks to "match the site's colors", "auto-detect colors", or doesn't specify a color:

1. Read the target file and look for (in order of priority):
   - CSS custom properties: `--primary`, `--brand`, `--accent`, `--color-*`, `--brand-*`
   - Tailwind config: `colors.primary`, `colors.brand`, etc. in `tailwind.config.*`
   - Common CSS class color hints: `bg-blue-500`, `text-indigo-600`, etc.
   - Meta theme color: `<meta name="theme-color" content="...">`
2. If a single brand color is found → use solid color mode
3. If two complementary or gradient-pair colors are found → use gradient mode
4. If ambiguous or not found → ask the user: "What color or gradient should I use for this icon?"

### Solid color snippet

Include the `colorizeAnim` helper inline. Replace `{name}` and `{#HEX}`:

#### React
```jsx
import Lottie from 'react-lottie';
import {name}AnimationRaw from './{name}/visibility.json';

function colorizeAnim(data, hex) {
  const r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
  const clone = JSON.parse(JSON.stringify(data));
  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if ((o.ty==='st'||o.ty==='fl') && o.c) {
      if (o.c.a===0) { o.c.k=[r,g,b,1]; }
      else if (Array.isArray(o.c.k)) { o.c.k.forEach(kf=>{ if(kf.s) kf.s=[r,g,b,1]; if(kf.e) kf.e=[r,g,b,1]; }); }
    }
    Object.values(o).forEach(v=>{ if(v&&typeof v==='object') walk(v); });
  }
  (clone.layers||[]).forEach(walk);
  return clone;
}

const {name}Animation = colorizeAnim({name}AnimationRaw, '{#HEX}');

export default function {Name}Icon() {
  return <Lottie options={{ animationData: {name}Animation }} height={32} width={32} />;
}
```

#### Vanilla JS
```javascript
import lottie from 'lottie-web';
import animRaw from './{name}/visibility.json';

function colorizeAnim(data, hex) {
  const r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
  const clone = JSON.parse(JSON.stringify(data));
  function walk(o) {
    if (!o || typeof o !== 'object') return;
    if ((o.ty==='st'||o.ty==='fl') && o.c) {
      if (o.c.a===0) { o.c.k=[r,g,b,1]; }
      else if (Array.isArray(o.c.k)) { o.c.k.forEach(kf=>{ if(kf.s) kf.s=[r,g,b,1]; if(kf.e) kf.e=[r,g,b,1]; }); }
    }
    Object.values(o).forEach(v=>{ if(v&&typeof v==='object') walk(v); });
  }
  (clone.layers||[]).forEach(walk);
  return clone;
}

lottie.loadAnimation({
  container: document.getElementById('{name}-icon'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  animationData: colorizeAnim(animRaw, '{#HEX}'),
});
```

### Gradient color snippet

Include the `applyGradientFilter` helper inline. Replace `{name}`, `{#COLOR1}`, `{#COLOR2}`, `{ANGLE}` (degrees, e.g. 135):

#### React
```jsx
import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import animData from './{name}/visibility.json';

function applyGradientFilter(container, color1, color2, angle) {
  const svg = container.querySelector('svg');
  if (!svg) { requestAnimationFrame(() => applyGradientFilter(container, color1, color2, angle)); return; }
  const id = 'grad' + Math.random().toString(36).substr(2, 5);
  // Read SVG dimensions — objectBoundingBox degenerates on thin strokes, so use userSpaceOnUse
  const vb = svg.getAttribute('viewBox');
  const [,,vw,vh] = vb ? vb.split(/\s+/).map(Number) : [0,0,32,32];
  const a = (angle - 90) * Math.PI / 180;
  const r = Math.sqrt(vw*vw + vh*vh) / 2, cx = vw/2, cy = vh/2;
  const x1 = (cx - Math.cos(a)*r).toFixed(2), y1 = (cy - Math.sin(a)*r).toFixed(2);
  const x2 = (cx + Math.cos(a)*r).toFixed(2), y2 = (cy + Math.sin(a)*r).toFixed(2);
  let defs = svg.querySelector('defs');
  if (!defs) { defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs'); svg.insertBefore(defs, svg.firstChild); }
  const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  grad.setAttribute('id', id); grad.setAttribute('x1', x1); grad.setAttribute('y1', y1);
  grad.setAttribute('x2', x2); grad.setAttribute('y2', y2); grad.setAttribute('gradientUnits', 'userSpaceOnUse');
  [color1, color2].forEach((c, i) => {
    const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop.setAttribute('offset', i === 0 ? '0%' : '100%'); stop.setAttribute('stop-color', c); grad.appendChild(stop);
  });
  defs.appendChild(grad);
  svg.querySelectorAll('*').forEach(el => {
    const stroke = el.getAttribute('stroke'); if (stroke && stroke !== 'none') el.setAttribute('stroke', `url(#${id})`);
    const fill = el.getAttribute('fill'); if (fill && fill !== 'none') el.setAttribute('fill', `url(#${id})`);
    if (el.style.stroke && el.style.stroke !== 'none') el.style.stroke = `url(#${id})`;
    if (el.style.fill && el.style.fill !== 'none') el.style.fill = `url(#${id})`;
  });
}

export default function {Name}Icon() {
  const ref = useRef(null);
  useEffect(() => {
    const anim = lottie.loadAnimation({ container: ref.current, renderer: 'svg', loop: true, autoplay: true, animationData });
    requestAnimationFrame(() => applyGradientFilter(ref.current, '{#COLOR1}', '{#COLOR2}', {ANGLE}));
    return () => anim.destroy();
  }, []);
  return <div ref={ref} style={{ width: 32, height: 32 }} />;
}
```

#### Vanilla JS
```javascript
import lottie from 'lottie-web';
import animData from './{name}/visibility.json';

// (paste applyGradientFilter function from React example above)

const container = document.getElementById('{name}-icon');
lottie.loadAnimation({ container, renderer: 'svg', loop: true, autoplay: true, animationData });
requestAnimationFrame(() => applyGradientFilter(container, '{#COLOR1}', '{#COLOR2}', {ANGLE}));
```

## Code Examples

Use the animation's `name` field from the catalog. Replace `{name}` below. If the user specified a color or gradient, use the colored snippets above instead.

### React (react-lottie)
```jsx
import Lottie from 'react-lottie';
import {name}Animation from './{name}/visibility.json';

export default function {Name}Icon() {
  return (
    <Lottie options={{ animationData: {name}Animation }} height={32} width={32} />
  );
}
```

### Vue (@lottiefiles/lottie-player)
```vue
<template>
  <lottie-player
    src="./{name}/visibility.json"
    autoplay
    loop
    style="width: 32px; height: 32px"
  />
</template>

<script setup>
import '@lottiefiles/lottie-player';
</script>
```

### Vanilla JS (lottie-web)
```javascript
import lottie from 'lottie-web';

lottie.loadAnimation({
  container: document.getElementById('{name}-animation'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: './{name}/visibility.json'
});
```

### Next.js (dynamic import)
```jsx
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('react-lottie'), { ssr: false });
import {name}Animation from './{name}/visibility.json';

export default function {Name}Icon() {
  return (
    <Lottie options={{ animationData: {name}Animation }} height={32} width={32} />
  );
}
```

## Available animations (79 total)

Refer to `catalog.json` for the full list with metadata. Key examples:

| Name | Category |
|------|----------|
| lock, unlock | security |
| menu, menu2, menu3, menu4, settings, settings2 | interface |
| playPause, playPauseCircle, skipBack, skipForward, volume | media |
| arrowDown, arrowUp, arrowDownCircle, arrowUpCircle, arrowLeftCircle, arrowRightCircle | navigation |
| mail, notification, notification2 | communication (other) |
| loading, loading2, loading3 | other |
