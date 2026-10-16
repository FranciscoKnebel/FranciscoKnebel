---
lang: en
title: nginx-reverseproxy
description: Multidomain nginx reverse proxy setup using Node.js apps. Supports independent domain routing, app isolation, and HTTPS via Let's Encrypt.
tags: [Node.js, Nginx, DevOps, JavaScript]
repo: https://github.com/FranciscoKnebel/nginx-reverseproxy
order: 1
---

## Context

Running several small Node.js applications on a single server usually means port collisions, duplicated TLS setup and risky deploys. I wanted each app to live behind its own domain without interfering with the others.

## Approach

- One nginx reverse proxy routes each domain to a local Node.js application.
- Apps run isolated, each with its own process and configuration.
- HTTPS certificates are issued and renewed automatically with Let's Encrypt.
- Adding a domain is a matter of dropping a config file and pointing DNS to the server.

## Result

This setup has been my default for side projects. Deploys are independent per app, certificates renew on their own, and a broken app does not take the others down.
