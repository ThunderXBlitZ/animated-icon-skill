# animated-icon-skill

A Claude Code skill for searching and integrating animated icons into web apps.

**[Live Demo →](https://thunderxblitz.github.io/animated-icon-skill/index.html)**

## Setup & Install

```bash
git clone <repo>
cd animated-icon-skill
bash setup.sh          # or: npm run setup
cp -r . ~/.claude/skills/animated-icon-skill
```

## Usage

Just describe what you need in any Claude Code session:

> "find me a lock animation"
> "show all media icons"
> "get the menu icon for React"

Or explicitly:
yes
```
/animated-icon-skill search lock
/animated-icon-skill list --category interface
/animated-icon-skill get lock
/animated-icon-skill snippet lock --framework vue
```

Frameworks: `react` · `vue` · `vanilla` · `nextjs`

## Contents

79 animated icons from [useanimations.com](https://useanimations.com), organised by category:

| Category | Icons |
|---|---|
| Interface | menu, menu2, menu3, menu4, settings, settings2 |
| Media | airplay, playPause, playPauseCircle, volume |
| Navigation | arrowDown, arrowUp, arrowLeftCircle, arrowRightCircle, … |
| Security | lock |
| Other | activity, bookmark, download, heart, loading, mail, … |

Each icon includes a `visibility.json` (Lottie animation).

## License

MIT © 2026
