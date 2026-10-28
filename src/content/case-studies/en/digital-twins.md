---
lang: en
title: Digital Twins with cloud and edge computing
description: Research on where to place Digital Twin components when communication delay matters.
status: published
topics: [Digital Twins, Cloud & Edge, Distributed Systems, Research]
order: 2
---

## Problem

A Digital Twin that depends on timely data must account for communication delay as well as computation. My research examines cloud, fog and edge deployments in that context.

## My contribution

I co-authored [A Cloud-Fog Computing Architecture for Real-Time Digital Twins](https://arxiv.org/abs/2012.06118), with Juliano Araujo Wickboldt and Edison Pignaton de Freitas. The preprint reports an implementation-based evaluation in which distributing components in fog infrastructure reduced response times in the evaluated setting.

## Engineering perspective

I treat component placement as a design decision to test, rather than a reason to choose one deployment model for every workload. The practical question is which path the time-sensitive data follows, and which costs that path adds.

The useful lesson for a new system is to define its timing requirements, identify communication boundaries and compare deployment alternatives against those requirements. An experimental result is evidence for its tested setting, rather than a universal performance guarantee.

## Related work

The broader research is also documented in my [2024 M.Sc. dissertation](https://lume.ufrgs.br/handle/10183/276593), “Designing and implementing digital twins with cloud and edge computing: challenges and opportunities”.

See the [publication list](/publications/) for bibliographic details and citation data.
