# Birdsong Audio Baseline

## Overview
I built an audio-only bird classifier baseline using numeric song features and logistic regression. The goal was a fast, interpretable benchmark that could be reused in multimodal experiments.

## Problem
Before fusing image and audio signals, I needed a reliable audio reference model. It had to be easy to debug, quick to retrain, and simple to serialize for downstream use.

## Approach
I used a straightforward classical ML pipeline: `StandardScaler` plus `LogisticRegression`. I evaluated with headline accuracy and confusion-matrix inspection, then exported the full artifact set with `joblib`.

The tradeoff was intentional. I prioritized interpretability and speed over model complexity so this baseline could anchor later experiments.

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
