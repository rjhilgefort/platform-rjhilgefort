# `rjhilgefort`'s Platform Monorepo

A monorepo containing multiple Next.js applications and shared packages, managed with [Turborepo](https://turbo.build/) and npm workspaces.

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4, DaisyUI
- **Language**: TypeScript 5.7
- **Build Tool**: Turborepo
- **Package Manager**: npm workspaces
- **Versioning**: Changesets

## Getting Started

### Prerequisites

- Node.js >= 18
- npm 10.8.2 (or compatible)

### Installation

Install all dependencies across the monorepo:

```bash
npm install
```

### Development

Start all apps in development mode with hot reload:

```bash
npm run dev
```

Start a specific app:

```bash
npm run dev --filter=@repo/bright-future
```

### Deployment

Deployment is handled by GitHub Actions.

- Make changes to an app and commit those changes.
- `npm run changeset` to create a changeset.
  - Note, if you make changes directly on the `main` branch, `changeset` won't be able to tell what package you've changed as it diffs against `main` to figure out what's changed. If you want that convenience, make your changes on a branch.
- `npm run version` to version the packages.
- `git push`.
- `git checkout deploy/production`
- `git merge main` (or `git merge -` if coming from main)
- `git push`

That will kick off a deployment pipeline for the app that has changed (the jobs filter based on which `app` was changed).

### Deployment Environment Variables

Portainer is used to deploy the apps (docker compose files). To setup environment variables, map them in your docker compose and then add them below the compose file in the Portainer stack UI.

Example docker compose file:

```yaml
services:
  bright-future-site:
    image: rjhilgefort/bright-future:latest
    container_name: bright-future-site
    environment:
      - SMTP_EMAIL=${SMTP_EMAIL}
      - SMTP_APP_PASSWORD=${SMTP_APP_PASSWORD}
      - SMTP_CONTACT_EMAIL_TO=${SMTP_CONTACT_EMAIL_TO}
    ports:
      - 3001:3000
    restart: unless-stopped
    network_mode: bridge
```

## Project Structure

```
platform-rjhilgefort/
├── apps/                                # Next.js applications
│   ├── ally-personal/                   # Personal portfolio site for Ally
│   ├── bergen-meadow/                   # Bergen Meadow update site
│   ├── blank/                           # Blank template app
│   ├── bright-future/                   # Bright Future preschool site
│   ├── budget-time/                     # Budget tracking PWA
│   ├── dg-rating-converter/             # Disc golf rating converter tool
│   ├── proof-n-pour/                    # Cincinnati bourbon tasting events
│   └── srh-personal/                    # Stephanie's personal/portfolio site
├── packages/                            # Shared packages
│   ├── eslint-config/                   # Shared ESLint configuration
│   ├── portainer-stack-redeploy/        # Stack redeployment utilities
│   ├── portainer-stack-redeploy-action/ # GitHub Action for deployment
│   ├── tailwind-config/                 # Shared Tailwind configuration
│   ├── typescript-config/               # Shared TypeScript configuration
│   └── ui/                              # Shared UI components
├── .changeset/                          # Changeset configuration for versioning
└── turbo.json                           # Turborepo configuration
```

### Apps

Each app is a standalone Next.js application.

### Packages

Shared packages are used across multiple apps:

- **@repo/ui**: Reusable React components with Tailwind CSS
- **@repo/eslint-config**: Shared ESLint rules
- **@repo/tailwind-config**: Shared Tailwind configuration
- **@repo/typescript-config**: Shared TypeScript settings
- **portainer-stack-redeploy**: Utilities for Portainer deployments
- **portainer-stack-redeploy-action**: GitHub Action for CI/CD

## Development Ports / Live URLs

| App                                                      | Port                   | Live URL                           |
| -------------------------------------------------------- | ---------------------- | ---------------------------------- |
| [Blank](apps/blank/README.md)                            | http://localhost:3000/ |                                    |
| [Bright Future](apps/bright-future/README.md)            | http://localhost:3001/ | https://brightfuture-preschool.com |
| [Ally Personal](apps/ally-personal/README.md)            | http://localhost:3002/ | https://ally.hilgefort.me          |
| [Bergen Meadow](apps/bergen-meadow/README.md)            | http://localhost:3003/ | https://bergenmeadowupdate.com     |
| [DG Rating Converter](apps/dg-rating-converter/README.md)| http://localhost:3004/ | https://dgratingconverter.com      |
| [Proof & Pour](apps/proof-n-pour/README.md)              | http://localhost:3005/ | https://proofnpour.com             |
| [SRH Personal](apps/srh-personal/README.md)              | http://localhost:3006/ | https://stephanie.hilgefort.me     |
| [Budget Time](apps/budget-time/README.md)                | http://localhost:3007/ | https://budgettime.hilgefort.me    |

## Available Scripts

### Root Level

```bash
npm run dev           # Start all apps in development mode
npm run build         # Build all apps and packages
npm run lint          # Lint all packages
npm run lint:fix      # Fix linting issues
npm run check-types   # Run TypeScript type checking
npm run format        # Format code with Prettier
```

### Turborepo Filtering

Run commands for specific workspaces:

```bash
# Run dev for a specific app
npm run dev --filter=@repo/bright-future

# Build only one app and its dependencies
npm run build --filter=@repo/ally-personal

# Run lint on all packages except apps
npm run lint --filter=./packages/*
```

## Working with Packages

### Adding a New Shared Package

1. Create a new directory in `packages/`
2. Add a `package.json` with name `@repo/package-name`
3. Update the package's exports in `package.json`
4. Reference it in app dependencies as `"@repo/package-name": "*"`

### Using Shared Packages

In any app's `package.json`:

```json
{
  "dependencies": {
    "@repo/ui": "*"
  }
}
```

## Versioning & Publishing

This monorepo uses [Changesets](https://github.com/changesets/changesets) for version management:

### Creating a Changeset

```bash
npm run changeset
```

Follow the prompts to describe your changes.

### Versioning Packages

```bash
npm run version
```

## Type Checking

Run TypeScript type checking across all packages:

```bash
npm run check-types
```
