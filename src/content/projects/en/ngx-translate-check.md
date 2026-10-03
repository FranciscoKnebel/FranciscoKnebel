---
lang: en
title: ngx-translate-check
description: CLI tool to test Angular projects using ngx-translate, detecting missing and unused i18n strings across translation files.
tags: [TypeScript, Angular, i18n, CLI, Node.js]
repo: https://github.com/FranciscoKnebel/ngx-translate-check
order: 3
---

## Context

On large Angular applications with ngx-translate, translation files drift quickly: keys are removed from the code but stay in the JSON, and new keys ship without a translation. Reviewing that by hand does not scale.

## Approach

- A CLI that scans the project and compares the keys used in templates and code with the keys present in each translation file.
- Reports missing keys, unused keys and files out of sync.
- Runs in CI, so translation drift fails the build instead of reaching production.

## Result

The tool became part of the workflow on projects I worked on and is published as an open-source package on npm.
