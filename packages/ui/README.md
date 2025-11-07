# @sunup/ui

Shared UI components package for Sunup web and mobile applications.

## Structure

- `src/components/` - Reusable React components (shadcn/ui components)
- `src/lib/` - Utility functions (cn, etc.)
- `src/styles/` - Shared styles and CSS

## Usage

```typescript
// Import utility functions
import { cn } from '@sunup/ui/lib/utils';

// Import components (when added)
import { Button } from '@sunup/ui/components/button';
```

## Adding Components

shadcn/ui components should be added to `src/components/` directory and can be shared across web and mobile apps.
