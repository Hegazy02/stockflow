# PrimeNG v20 Theming Guide

## Current Setup

Your app is now configured with PrimeNG v20's **Aura** theme (pre-built).

## How It Works

PrimeNG v20 uses a programmatic theming system with design tokens instead of CSS imports.

### Configuration Location

**File:** `src/app/app.config.ts`

```typescript
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

providePrimeNG({
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false,
    },
  },
})
```

## Available Pre-Built Themes

You can easily switch between these pre-built themes:

### 1. Aura (Current)
```typescript
import Aura from '@primeng/themes/aura';
```
Modern, clean design with smooth animations.

### 2. Lara
```typescript
import Lara from '@primeng/themes/lara';
```
Previous default theme, professional and polished.

### 3. Material
```typescript
import Material from '@primeng/themes/material';
```
Material Design inspired theme.

### 4. Nora
```typescript
import Nora from '@primeng/themes/nora';
```
New theme introduced in v20.

## How to Switch Themes

1. Open `src/app/app.config.ts`
2. Change the import:
   ```typescript
   import Lara from '@primeng/themes/lara';  // or any other theme
   ```
3. Update the preset:
   ```typescript
   providePrimeNG({
     theme: {
       preset: Lara,  // use the imported theme
     },
   })
   ```

## Custom Color Overrides

Your custom colors are defined in `src/styles/primeng-theme.scss` and will work with any theme:

```scss
:root {
  --p-primary-500: #6366f1;  // Your custom primary color
  --p-surface-0: #ffffff;     // Background colors
  // ... more overrides
}
```

These CSS variables override the theme defaults while keeping the theme's structure and behavior.

## Dark Mode

To enable dark mode support:

```typescript
providePrimeNG({
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark-mode',  // or 'system' for auto-detection
    },
  },
})
```

Then add the `.dark-mode` class to your `<html>` or `<body>` element to activate it.
