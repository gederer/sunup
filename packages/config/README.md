# @sunup/config

Shared configuration files for Sunup monorepo (ESLint, TypeScript, Tailwind).

## Structure

- `eslint/` - Shared ESLint configuration
- `typescript/` - Shared TypeScript base configuration
- `tailwind/` - Shared Tailwind CSS theme configuration

## Usage

### ESLint

In your app's `eslint.config.mjs`:
```javascript
import sunupConfig from '@sunup/config/eslint';

export default sunupConfig;
```

### TypeScript

In your app's `tsconfig.json`:
```json
{
  "extends": "@sunup/config/typescript",
  "compilerOptions": {
    // App-specific overrides
  }
}
```

### Tailwind CSS

In your app's `tailwind.config.js` or PostCSS config:
```javascript
const sunupTheme = require('@sunup/config/tailwind');

module.exports = {
  ...sunupTheme,
  content: ['./app/**/*.{ts,tsx}'],
};
```

## Configuration Philosophy

- **ESLint**: Extends Next.js recommended config with custom rules
- **TypeScript**: Strict mode enabled with modern ES features
- **Tailwind**: shadcn/ui compatible theme tokens using CSS variables
