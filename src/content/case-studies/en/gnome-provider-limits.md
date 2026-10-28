---
lang: en
title: gnome-provider-limits
description: Engineering decisions, boundaries and documented behavior.
status: published
topics:
  - TypeScript
  - Developer tooling
order: 3
---

## Problem and contribution

Coding assistants expose different usage windows and reset rules. Moving between provider dashboards interrupts the development workflow. gnome-provider-limits brings those readings into GNOME Shell's top bar and an expandable panel.

## Implemented architecture

The project separates provider readers, shared helpers, formatting and interface components. Each reader follows a common base, while provider-specific endpoints and local state stay in their own modules. Preferences control enabled providers, displayed fields and ordering.

The current README documents OAuth or usage API readers with fallbacks to local files, SQLite or a CLI, depending on the provider. This is broader than the original portfolio description: it is not a network-free extension.

## Trade-offs

- **Freshness and resource use:** adaptive polling is documented at 10 seconds during activity and 120 seconds after readings stabilize. These are configured intervals, not measured performance claims.
- **Integration and fragility:** provider endpoints can offer fresher data, while local fallbacks reduce dependence on one source. First-party CLI endpoints can change; a missing percentage must remain unavailable rather than become a fabricated value.
- **Configuration and credentials:** the README describes reading existing credentials on refresh and saving paths or settings rather than credential values. This account summarizes that design, without claiming an independent security audit.

## Result and limits

The published extension supports multiple providers, a compact indicator, detailed readings and translations. There are no user-count or productivity claims here. For compatibility, installation and current provider coverage, consult the versioned source below.

## Source

[Versioned project README](https://github.com/FranciscoKnebel/gnome-provider-limits/blob/599020784aac19f3741fad30a5e30fd209034867/README.md). Reviewed October 28, 2026.
