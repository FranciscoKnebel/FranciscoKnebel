---
lang: pt
title: nginx-reverseproxy
description: Configuração de reverse proxy nginx multi-domínio com apps Node.js. Suporta roteamento por domínio independente, isolamento de aplicações e HTTPS via Let's Encrypt.
tags: [Node.js, Nginx, DevOps, JavaScript]
repo: https://github.com/FranciscoKnebel/nginx-reverseproxy
order: 1
---

## Contexto

Rodar vários apps Node.js pequenos no mesmo servidor costuma significar colisão de portas, configuração de TLS duplicada e deploys arriscados. Eu queria cada app atrás do seu próprio domínio, sem interferir nos outros.

## Abordagem

- Um reverse proxy nginx roteia cada domínio para uma aplicação Node.js local.
- Os apps rodam isolados, cada um com seu processo e sua configuração.
- Certificados HTTPS são emitidos e renovados automaticamente com Let's Encrypt.
- Adicionar um domínio é só criar um arquivo de configuração e apontar o DNS para o servidor.

## Resultado

Esse setup virou meu padrão para projetos pessoais. Os deploys são independentes por app, os certificados se renovam sozinhos e um app quebrado não derruba os outros.
