# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Universal Agent Builder (UAB) is a web-based application for creating AI agents from prompts using A2A (Agent-to-Agent Protocol), ADK (Agent Development Kit), and MCP (Model Context Protocol) frameworks. It's a single-page application with a vanilla JavaScript frontend.

## Development Commands

### Start Development Server
```bash
npm start
```
Launches live-server on port 3000 with live reload for development.

### Build Production Assets
```bash
npm run build
```
Minifies CSS and JavaScript files to the `dist/` directory.

### Individual Build Commands
```bash
npm run minify-css    # Minifies CSS using csso
npm run minify-js     # Minifies JS using terser
```

### Code Quality
```bash
npm run lint          # Lints JavaScript with ESLint
npm run format        # Formats JavaScript with Prettier
```

### Serve Production Build
```bash
npm run serve         # Serves dist/ directory on port 8080
npm run start:dist    # Serves dist/ directory with live-server
```

## Architecture

### Core Application State
The application uses a centralized state object (`appState`) that manages:
- User prompt input
- Selected AI frameworks (A2A, ADK, MCP)  
- Template selections
- Framework configurations
- Generated agent configurations
- Deployment settings

### Key Components

**Templates System**: Pre-built agent templates with framework recommendations:
- Customer Service Agent (A2A + MCP)
- Data Analysis Agent (ADK + MCP) 
- Content Creation Agent (A2A + ADK)
- Multi-Agent Coordinator (A2A + ADK + MCP)

**Framework Configuration**: Dynamic forms generated based on selected frameworks:
- A2A: Agent discovery, communication ports, security settings
- ADK: Workflow types, execution environments, resource limits
- MCP: Server implementations, tool categories, context windows

**Preview & Testing**: Real-time configuration preview with simulated agent testing interface.

### State Persistence
- Uses LocalStorage with custom serialization for Set objects
- Auto-saves state on all user interactions
- Loads previous state on application initialization

### File Structure
- `assets/css/style.css` - Design system with CSS custom properties, dark mode support
- `assets/js/app.js` - Main application logic, event handlers, state management
- `index.html` - Single page application structure
- `dist/` - Minified production assets
- `package.json` - Dependencies and build scripts

### Framework Integration Patterns
Each AI framework (A2A, ADK, MCP) has dedicated configuration sections that generate framework-specific JSON configurations. The application intelligently suggests frameworks based on prompt analysis and template selection.

## Development Notes

### CSS Architecture
Uses a comprehensive design system with:
- CSS custom properties for theming
- Light/dark mode support via `data-color-scheme` attribute
- Semantic color tokens and consistent spacing scales
- Component-based styling with BEM-like naming

### JavaScript Patterns
- Event-driven architecture with centralized event handling
- Modular functions for state management, UI updates, and configuration generation
- Error handling with custom Logger class
- File upload support with content type detection

### Testing Interface
Includes a mock agent testing interface that provides context-aware responses based on selected templates and frameworks, simulating real agent behavior patterns.