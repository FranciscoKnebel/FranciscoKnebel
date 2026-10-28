---
lang: en
title: ngx-translate-check
description: Engineering decisions, boundaries and documented behavior.
status: published
topics:
  - TypeScript
  - Developer tooling
order: 4
---

## Problem and contribution

Translation files can diverge from each other and from application code. ngx-translate-check turns those differences into a repeatable CLI diagnostic. The README credits me with the initial implementation and Arthur Jacobs with the project idea; the repository also records other contributors.

## Processing model

The `files` command scans project and translation files and emits a JSON snapshot. Its `input` section records discovered keys, occurrence counts and file paths; `translations` records the keys defined by each translation file.

The `diff` command compares translation files. `diff-input` compares defined translations with keys found in the application. Separating collection from comparison makes one snapshot reusable across those questions and preserves the evidence behind a reported mismatch.

## Detection and limits

The README documents ngx-translate pipe syntax across line breaks and TranslateService methods such as `instant`, `get`, `stream` and `getStreamOnTranslationChange`. The default service variable is `translateService`, with an option for other names.

Static detection has limits: the project's own TODO calls out parser cases that expressions may miss. Dynamically assembled keys need review, so an empty diagnostic should not be presented as proof that every translation path is correct.

## Result

The published package produces a reusable JSON inventory and separate comparison commands. The practical artifact is an inspectable report of keys and locations, rather than an unsupported claim of complete translation coverage.

## Source

[Versioned project README](https://github.com/FranciscoKnebel/ngx-translate-check/blob/0db94b1618311c1dc9c7868c5dafd14785619834/README.md). Reviewed October 28, 2026.
