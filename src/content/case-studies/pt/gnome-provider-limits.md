---
lang: pt
title: gnome-provider-limits
description: Decisões de engenharia, limites e comportamento documentado.
status: published
topics:
  - TypeScript
  - Ferramentas para desenvolvedores
order: 3
---

## Problema e contribuição

Assistentes de programação expõem janelas de uso e regras de reinício diferentes. Alternar entre dashboards interrompe o fluxo de desenvolvimento. O gnome-provider-limits reúne essas leituras na barra superior do GNOME Shell e em um painel expansível.

## Arquitetura implementada

O projeto separa leitores por provedor, funções auxiliares, formatação e componentes de interface. Cada leitor segue uma base comum, enquanto endpoints e estado local específicos ficam em módulos próprios. As preferências controlam provedores habilitados, campos exibidos e ordenação.

O README atual documenta leitores de APIs de OAuth ou uso, com fallbacks para arquivos locais, SQLite ou CLI, conforme o provedor. Isso vai além da descrição original do portfólio: a extensão não funciona exclusivamente sem rede.

## Trade-offs

- **Atualidade e consumo de recursos:** o polling adaptativo documenta intervalos de 10 segundos durante atividade e 120 segundos quando as leituras estabilizam. São intervalos configurados, sem alegação de desempenho medido.
- **Integração e fragilidade:** endpoints podem fornecer dados mais atuais, enquanto fallbacks locais reduzem a dependência de uma única fonte. Endpoints internos de CLIs podem mudar; uma porcentagem ausente deve permanecer indisponível, em vez de ser inventada.
- **Configuração e credenciais:** o README descreve a leitura de credenciais existentes a cada atualização e a gravação de caminhos ou preferências, em vez dos valores das credenciais. Este relato resume o desenho documentado, sem equivaler a uma auditoria de segurança independente.

## Resultado e limites

A extensão publicada oferece múltiplos provedores, indicador compacto, leituras detalhadas e traduções. Não há alegações de número de usuários ou ganho de produtividade. Consulte a fonte versionada para compatibilidade, instalação e cobertura atual de provedores.

## Fonte

[README versionado do projeto](https://github.com/FranciscoKnebel/gnome-provider-limits/blob/599020784aac19f3741fad30a5e30fd209034867/README.md). Consultado em 28 de outubro de 2026.
