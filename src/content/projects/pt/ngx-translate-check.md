---
lang: pt
title: ngx-translate-check
description: Ferramenta CLI para testar projetos Angular com ngx-translate, detectando strings i18n faltando e não utilizadas nos arquivos de tradução.
tags: [TypeScript, Angular, i18n, CLI, Node.js]
repo: https://github.com/FranciscoKnebel/ngx-translate-check
order: 3
---

## Contexto

Em aplicações Angular grandes com ngx-translate, os arquivos de tradução se desatualizam rápido: chaves saem do código e ficam no JSON, e chaves novas chegam sem tradução. Revisar isso na mão não escala.

## Abordagem

- Uma CLI que varre o projeto e compara as chaves usadas em templates e código com as chaves presentes em cada arquivo de tradução.
- Reporta chaves faltando, chaves não utilizadas e arquivos fora de sincronia.
- Roda no CI, então a divergência de tradução quebra o build em vez de chegar em produção.

## Resultado

A ferramenta entrou no fluxo dos projetos em que trabalhei e está publicada como pacote open-source no npm.
