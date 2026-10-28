---
lang: pt
title: Gêmeos Digitais com computação em nuvem e borda
description: Pesquisa sobre onde executar componentes de Gêmeos Digitais quando o atraso de comunicação importa.
status: published
topics: [Gêmeos Digitais, Nuvem e Borda, Sistemas Distribuídos, Pesquisa]
order: 2
---

## Problema

Um Gêmeo Digital que depende de dados no momento certo precisa considerar o atraso de comunicação, além do processamento. Minha pesquisa examina implantações em nuvem, névoa e borda nesse contexto.

## Minha contribuição

Sou coautor de [A Cloud-Fog Computing Architecture for Real-Time Digital Twins](https://arxiv.org/abs/2012.06118), com Juliano Araujo Wickboldt e Edison Pignaton de Freitas. O preprint relata uma avaliação baseada em implementação na qual distribuir componentes em infraestrutura de névoa reduziu os tempos de resposta no cenário avaliado.

## Perspectiva de engenharia

Trato a distribuição de componentes como uma decisão de projeto a ser testada, sem escolher um modelo único de implantação para toda carga de trabalho. A pergunta prática é qual caminho o dado sensível ao tempo percorre e quais custos esse caminho acrescenta.

A lição útil para um sistema novo é definir seus requisitos temporais, identificar fronteiras de comunicação e comparar alternativas de implantação com esses requisitos. Um resultado experimental oferece evidência para o cenário testado, sem garantir o mesmo desempenho em qualquer sistema.

## Trabalho relacionado

A pesquisa mais ampla também está documentada na minha [dissertação de mestrado de 2024](https://lume.ufrgs.br/handle/10183/276593), “Designing and implementing digital twins with cloud and edge computing: challenges and opportunities”.

Veja a [lista de publicações](/pt/publications/) para referências bibliográficas e dados de citações.
