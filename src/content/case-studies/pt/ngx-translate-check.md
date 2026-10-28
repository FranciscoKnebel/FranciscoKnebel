---
lang: pt
title: ngx-translate-check
description: Decisões de engenharia, limites e comportamento documentado.
status: published
topics:
  - TypeScript
  - Ferramentas para desenvolvedores
order: 4
---

## Problema e contribuição

Arquivos de tradução podem divergir entre si e do código da aplicação. O ngx-translate-check transforma essas diferenças em um diagnóstico repetível por CLI. O README atribui a mim a implementação inicial e a Arthur Jacobs a ideia do projeto; o repositório também registra outros contribuidores.

## Modelo de processamento

O comando `files` percorre arquivos do projeto e de tradução e emite um snapshot JSON. A seção `input` registra chaves encontradas, quantidade de ocorrências e caminhos dos arquivos; `translations` registra as chaves definidas em cada arquivo de tradução.

O comando `diff` compara arquivos de tradução. O `diff-input` compara as traduções definidas com as chaves encontradas na aplicação. Separar coleta e comparação permite reutilizar um snapshot para perguntas diferentes e preservar a evidência de cada divergência.

## Detecção e limites

O README documenta pipes de ngx-translate em múltiplas linhas e métodos de TranslateService como `instant`, `get`, `stream` e `getStreamOnTranslationChange`. A variável de serviço padrão é `translateService`, com uma opção para outros nomes.

A detecção estática tem limites: o próprio TODO do projeto registra casos que o parser pode não reconhecer. Chaves montadas dinamicamente exigem revisão, então um diagnóstico vazio não deve ser apresentado como prova de que todo caminho de tradução está correto.

## Resultado

O pacote publicado produz um inventário JSON reutilizável e comandos separados de comparação. O artefato prático é um relatório inspecionável de chaves e locais de uso, sem alegação de cobertura completa das traduções.

## Fonte

[README versionado do projeto](https://github.com/FranciscoKnebel/ngx-translate-check/blob/0db94b1618311c1dc9c7868c5dafd14785619834/README.md). Consultado em 28 de outubro de 2026.
