---
lang: pt
title: gnome-provider-limits
description: Extensão do GNOME Shell que exibe limites de sessão e semanais para CLIs de IA (Codex, Claude, OpenCode) na barra superior. Lê arquivos locais de status diretamente, sem precisar rodar comandos CLI ou abrir dashboards no navegador.
tags: [TypeScript, GNOME, AI, Extension]
url: https://gnome-provider-limits.franciscoknebel.com/
repo: https://github.com/FranciscoKnebel/gnome-provider-limits
order: 4
---

## Contexto

Trabalhando com várias CLIs de IA, saber quanto de cota ainda resta significa rodar comandos ou abrir dashboards para cada provedor. Eu queria essa informação visível de relance.

## Abordagem

- Extensão do GNOME Shell escrita em TypeScript, na barra superior.
- Lê os arquivos locais de status que as próprias CLIs já escrevem, sem rodar comandos nem chamar APIs externas.
- Mostra limites de sessão e semanais por provedor (Codex, Claude, OpenCode).

## Resultado

A extensão está publicada no GitHub e tem site de documentação próprio. Resolve um incômodo diário sem adicionar serviços em background nem chamadas de rede.
