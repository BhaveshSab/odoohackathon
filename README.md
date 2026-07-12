# Auth Switch — Sign In / Sign Up

A convertible sign-in / sign-up card built with **Vite + React + TypeScript +
Tailwind CSS** using **shadcn** structure. Switch between "Sign in" and "Sign up"
either with the tabs at the top of the card or the link at the bottom of each form.

## Getting started

```bash
npm install
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # type-check + production build
npm run preview    # preview the production build
```

## Project layout

```
src/
  components/
    ui/
      auth-switch.tsx   # the convertible auth card (default export)
      button.tsx        # shadcn primitives
      input.tsx
      label.tsx
      card.tsx
      tabs.tsx
      demo.tsx          # minimal usage example
  lib/
    utils.ts            # cn() helper
  App.tsx               # renders <AuthSwitch/> centered
  index.css             # Tailwind + shadcn CSS variables
components.json         # shadcn config (so `npx shadcn add ...` works)
tailwind.config.ts
```

## `AuthSwitch` props

| Prop           | Type                              | Default     | Description                                  |
| -------------- | --------------------------------- | ----------- | -------------------------------------------- |
| `defaultMode`  | `"signin" \| "signup"`            | `"signin"`  | Initial tab.                                 |
| `mode`         | `"signin" \| "signup"`            | —           | Controlled mode.                             |
| `onModeChange` | `(mode) => void`                  | —           | Fires when the user switches tabs.           |
| `onSubmit`     | `(data) => void \| Promise<void>` | —           | Validated form submit (`{mode,email,password,name?}`). |
| `sideImage`    | `string`                          | Unsplash URL| Decorative side-panel image.                 |
| `brand`        | `ReactNode`                       | built-in    | Replace the default logo.                    |
| `loading`      | `boolean`                         | `false`     | Disables inputs + shows spinner on submit.   |
| `error`        | `string`                          | —           | Error banner under the form.                 |

## Using the `cn` helper and aliases

Path alias `@/*` → `src/*` is configured in `tsconfig.json` and `vite.config.ts`.
Import primitives the shadcn way:

```ts
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
```
