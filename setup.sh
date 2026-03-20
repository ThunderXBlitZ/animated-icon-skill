#!/bin/bash

set -e

echo "📦 Setting up animated-icon-skill..."
echo ""

# Run download script
echo "Downloading icons from useanimations.com..."
node scripts/download.js

echo ""

# Run catalog generator
echo "Generating catalog..."
node scripts/generate-catalog.js

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next, copy this folder to ~/.claude/skills/:"
echo "  cp -r . ~/.claude/skills/animated-icon-skill"
