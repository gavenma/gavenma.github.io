---
title: "SkillRubric: Co-Evolving Actor Guidance and Evaluator Rubrics for Multimodal Agents"
collection: publications
excerpt: 'Bingqing Jiang, Guoxi Zhang, Jasper Wang, Auric Wang, Bingning Wang, Tianyi Lin, Zichao Yu, Yujin Han, Ziye Ma, Difan Zou'
date: 2026-09-28
venue: 'Preprint. Accepted at the EvoRobust@NeurIPS 2026 workshop.'
paperurl: 'https://arxiv.org/abs/2609.34557'
abstract: >-
  Recent work incorporates reusable skills distilled from past interactions into multimodal agent training, providing procedural guidance for long-horizon planning and tool use. However, policy optimization in these methods remains driven primarily by sparse outcome rewards, providing little supervision for intermediate decisions. Rubric-based rewards address this limitation through explicit intermediate criteria, but reliable rubrics are difficult to construct at scale and often disconnected from the procedure followed by the actor. We observe that a well-structured skill naturally specifies both how to act and what successful execution should achieve. Based on this insight, we introduce SkillRubric, which represents each skill through aligned actor-facing guidance and an evaluator-facing rubric. A multimodal verifier evaluates skill-defined goals using screenshots and tool outputs, assigning completion and progress rewards to the responsible turns. We further introduce an alternating co-evolution scheme that validates guidance revisions through paired rollouts under a frozen policy and rubric revisions offline under fixed guidance. Experiments across diverse multimodal agent benchmarks demonstrate consistent performance gains, while controlled paired rollouts further show that evolved skills provide more effective guidance for planning and tool use than their preceding versions.
---
