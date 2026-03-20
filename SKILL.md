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

## Code Examples

Use the animation's `name` field from the catalog. Replace `{name}` below:

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
