# Birdsong Audio Baseline

## Overview
I built an audio-only bird classifier using numeric song features and logistic regression. The goal was to create a fast, interpretable baseline that could anchor multimodal experiments.

## Problem
Before combining image and audio predictions, I needed a reliable audio reference model. It had to be easy to debug, quick to retrain, and simple to export for downstream use.

## Approach
I used a straightforward classical ML pipeline: `StandardScaler` plus `LogisticRegression`. I evaluated with both headline accuracy and confusion-matrix inspection, then exported artifacts with `joblib` for direct reuse.

The tradeoff was intentional. I prioritized interpretability and speed over model complexity so this baseline could support fast iteration in later fusion work.

## Technical highlights
- Pipeline: feature scaling -> logistic regression (`max_iter=2000`) -> evaluation.
- Metrics: accuracy plus class-level confusion matrix review.
- Artifacts exported with `joblib`: model, scaler, feature columns, class labels.
- Notebook: `notebooks/pytorch_birdSongs.ipynb`.
- Media path: uses project card visual treatment in the portfolio UI.

## Results/impact
- Baseline test accuracy: `0.9781667268134248` (~`97.82%`) from notebook output.
- Exported artifacts were reused directly in the multimodal fusion notebook.
- Created a stable benchmark that reduced integration risk for later multimodal decision logic.

## What I'd do next
- Run robustness checks against noisy clips and distribution shift.
- Add per-class precision/recall reporting to complement overall accuracy.
- Compare logistic regression against lightweight tree/boosting baselines for tradeoff clarity.
