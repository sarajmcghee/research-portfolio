# Multimodal Bird ID (Audio + Image Fusion)

## Overview
I combined existing image and audio bird classifiers into one decision flow that cross-checks predictions before returning a recommendation. The focus was better decision clarity without retraining a heavy multimodal model.

## Problem
Single-modality outputs can be brittle in field-like conditions. Photos can be unclear, audio can be noisy, and conflicting predictions are hard to interpret. I needed a low-overhead method to combine both signals into one explainable result.

## Approach
I chose lightweight decision fusion instead of end-to-end multimodal retraining. The notebook loads a saved ResNet image model and a saved audio classifier, computes top-k candidates for each modality, and checks agreement through canonical label mapping.

This kept the system modular. Each model can improve independently while the fusion logic remains inspectable and easy to tune.

## Technical highlights
- Loads persisted artifacts: `image_model.pth`, `audio_model.joblib`, `audio_scaler.joblib`.
- Runs top-k prediction utilities for image and audio paths.
- Uses optional label canonicalization to reconcile naming differences across modalities.
- Returns one recommendation based on overlap/confidence logic rather than separate model outputs.
- Built as an interactive helper notebook for fast integration cycles.
- Notebook: `notebooks/pytorch_fusion_audio_image_Bird.ipynb`.
- Media path: uses project card visual treatment in the portfolio UI.

## Results/impact
- Shipped a single recommendation flow instead of two disconnected predictions.
- Reused existing artifacts directly, avoiding retraining and reducing integration time.
- Proxy impact: enabled rapid fusion iteration with no changes to underlying model training pipelines.

## What I'd do next
- Log calibration metrics (agreement rate, top-1 uplift, failure buckets) on a held-out multimodal test set.
- Replace heuristic agreement with a learned meta-classifier once enough paired data is available.
- Add confidence thresholds to route uncertain cases into fallback UX.
