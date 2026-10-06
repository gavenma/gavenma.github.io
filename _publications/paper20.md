---
title: "A Fine-Grained Analysis of the LoRA Fine-Tuning Landscape with Implications for Data Selection"
collection: publications
excerpt: 'Bowen Zhang, Changrui Fang, Xinsong Ma, Jiaye Teng, Ziye Ma'
date: 2026-10-05
venue: 'Preprint.'
paperurl: 'https://arxiv.org/abs/2610.06542'
abstract: >-
  Low-Rank Adaptation (LoRA) has become a standard approach for parameter-efficient fine-tuning, yet a fundamental practical question remains unresolved: how should the adapter rank be chosen? An overly small rank may lead to a poorly conditioned optimization landscape, whereas an unnecessarily large rank sacrifices the efficiency that motivates LoRA in the first place. Existing theoretical analyses provide only limited guidance on this trade-off, and their guarantees are typically established under restrictive theoretical settings. We address this gap by developing a substantially sharper landscape theory for LoRA, building on modern results from nonconvex low-rank matrix sensing. Our central insight is that the appropriate adapter rank should depend on the quality of the data-induced optimization geometry, rather than on the model alone. To formalize this connection, we introduce LoRA-RIP, a data-dependent restricted-isometry metric that characterizes the conditioning of the cross-entropy (CE) objective along LoRA-relevant low-rank directions. We prove that sufficient rank over-parameterization, with the required rank explicitly determined by the LoRA-RIP constant, eliminates spurious local minima, thereby extending existing RIP-based guarantees beyond the classical 1/3 regime. This characterization further enables principled data selection under a fixed rank budget. Experiments across language and vision tasks support these theoretical predictions, showing that rank and data quality are two coupled resources that should be jointly considered for more efficient and reliable LoRA fine-tuning.
---
