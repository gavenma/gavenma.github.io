---
title: "Understanding the Weight Averaging Mechanism in LLM Training for Post-Training Quantization"
collection: publications
excerpt: 'Hanzhang Wang, Tianqi Shen, Zonglin Liu, Junze He, Difan Zou, Ziye Ma'
date: 2026-10-04
venue: 'Preprint.'
paperurl: 'https://arxiv.org/abs/2610.05329'
abstract: >-
  Large language models (LLMs) are typically pretrained in high precision but increasingly deployed with low-precision post-training quantization (PTQ). Recent studies have shown that using weight averaging during pretraining can improve PTQ performance compared with learning-rate decay, suggesting that it might provide a simple way to improve the pretraining-to-quantization transition. But the mechanism behind weight averaging remains insufficiently explained. This leads to inconsistent and fragile performance gains, thereby preventing practitioners from applying such a technique confidently. As a response, we formulate weight averaging as a trade-off between retaining training progress and improving robustness under perturbation. We further derive a continuous family of averaging kernels that unifies conventional strategies and achieves the Pareto frontier between the two competing goals. Critically, a theoretical framework for performing weight averaging under PTQ is developed. It can be shown that coarser quantization is more susceptible to perturbations, whereas finer quantization could be less affected. Thus, our results could provide unified theoretical guidance for performing weight averaging under different PTQ conditions. Experiments validate both the predicted behavior and the proposed averaging strategy. Code is available at https://github.com/MOFA-LAB/weight-averaging-for-ptq.
---
