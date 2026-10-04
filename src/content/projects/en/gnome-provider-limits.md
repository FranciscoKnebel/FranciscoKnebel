---
lang: en
title: gnome-provider-limits
description: GNOME Shell extension that displays session and weekly rate limits for AI coding CLIs (Codex, Claude, OpenCode) in the top bar. Reads local status files directly, with no need to run CLI commands or open browser dashboards.
tags: [TypeScript, GNOME, AI, Extension]
url: https://gnome-provider-limits.franciscoknebel.com/
repo: https://github.com/FranciscoKnebel/gnome-provider-limits
order: 4
---

## Context

When you work with several AI coding CLIs, checking how much quota is left means running commands or opening dashboards for each provider. I wanted that information visible at a glance.

## Approach

- A GNOME Shell extension written in TypeScript that lives in the top bar.
- Reads the local status files that the CLIs already write, without running commands or calling external APIs.
- Shows session and weekly limits per provider (Codex, Claude, OpenCode).

## Result

The extension is published on GitHub and has its own documentation site. It solves a daily annoyance without adding background services or network calls.
