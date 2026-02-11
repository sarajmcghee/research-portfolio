# Multimodal Bird ID (Audio + Image Fusion)

## At a glance
- Goal: Turn separate audio and image bird predictions into one decision path that is easier to trust and act on.
- Approach: Fuse top-k outputs from saved unimodal models with explicit label mapping and agreement logic instead of retraining a heavy joint model.
- Outcome: Delivered a modular, reusable recommendation flow that reduced integration friction and preserved fast iteration speed.

## Overview
This project solved a product problem more than a modeling problem: two separate outputs are harder to use than one clear recommendation. I optimized for explainability and delivery speed so each modality could continue improving independently while the fusion layer stayed simple to inspect.

## What I changed
- Reused persisted artifacts from prior work (`image_model.pth`, `audio_model.joblib`, `audio_scaler.joblib`) instead of introducing a new retraining pipeline.
- Added top-k utilities for both modalities, making overlap checks explicit rather than relying on only top-1 guesses.
- Implemented canonical label mapping so audio/image class names can reconcile before fusion decisions.
- Defined a deterministic agreement-and-confidence path that returns one recommendation instead of two disconnected outputs.
- Structured the notebook as an interactive integration harness for fast testing of fusion behavior and thresholds.

## Evidence
- Artifacts in active use: `image_model.pth`, `audio_model.joblib`, `audio_scaler.joblib`.
- Upstream evidence reused by this fusion layer:
  - Image model baseline reached `55.19%` validation accuracy at epoch 3.
  - Audio baseline reported `97.82%` accuracy and includes confusion-matrix evaluation (`notebooks/pytorch_birdSongs.ipynb`).
- Integration result: one recommendation interface built from existing validated models, with no retraining required to ship fusion logic.

## Limitations + Next step
- Fusion is currently rule-based; next step is to measure agreement uplift on a paired multimodal holdout set and calibrate confidence.
- No formal uncertainty routing yet; next step is thresholding plus fallback behavior when modalities disagree strongly.
