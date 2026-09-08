---
title: "MALT: Lightweight Curvature-Aware Muon via Diagonal Preconditioning"
collection: publications
excerpt: 'Tongle Wu, Huanyu Dong, Ying Sun, Ziye Ma'
date: 2026-08-05
venue: 'Preprint.'
paperurl: 'https://arxiv.org/abs/2608.05088'
abstract: >-
  Muon has recently emerged as a promising alternative to AdamW for language model pretraining by orthogonalizing momentum matrices using Newton--Schulz iterations. Although Muon mitigates gradient anisotropy, it does not explicitly account for the curvature geometry of the loss landscape and may therefore remain sensitive to curvature anisotropy. We bridge this gap by proposing MALT (Muon Augmented by Lightweight Two-sided Preconditioning), which uses lightweight diagonal preconditioners to reduce the sensitivity of Muon to curvature anisotropy. Specifically, MALT uses two-sided diagonal preconditioners with low memory and computational overhead to approximately capture the curvature geometry of the loss landscape. It orthogonalizes the preconditioned momentum using Newton--Schulz iterations and maps the result back to define the update direction, while norm grafting controls the update magnitude. To improve the robustness of MALT to stochastic gradient noise, we further propose MALTER (MALT with Adaptive stEpsize Rescaling). Convergence guarantees are provided for MALT in the stochastic non-convex setting. Experiments on GPT-2 Small, Medium, and Large pretraining show that the proposed methods outperform Muon while maintaining nearly the same memory footprint and wall-clock time.
---
