# PyTorch Bird Images Classifier

## Overview
I built a local transfer-learning pipeline for fine-grained bird classification. It takes raw CUB-200-2011 images, creates reproducible train/validation splits, fine-tunes a ResNet18-style model, and exports artifacts for downstream inference.

## Problem
Bird species in CUB-200-2011 are visually close, so class boundaries are subtle. I needed a baseline that could run locally, iterate quickly, and still produce outputs stable enough for integration into a larger bird-ID system.

## Approach
I optimized for delivery speed first, not maximum leaderboard performance. The pipeline builds class-preserving 80/20 splits, applies 224x224 transforms, freezes early backbone layers, and fine-tunes the classifier head with Adam on Apple MPS.

I limited training to 3 epochs to validate the end-to-end path before tuning schedules and unfreezing depth. That tradeoff made iteration fast while still proving the pipeline and artifact contracts.

## Technical highlights
- Dataset: CUB-200-2011 via Kaggle (`11,788` images, `200` classes).
- Deterministic 80/20 split into `splits/train` and `splits/valid`.
- Training transforms: resize to `224x224` and random horizontal flip.
- Transfer learning with reduced LR and early-layer freezing.
- Artifacts exported: `image_model.pth` and class-index mapping.
- Notebook: `notebooks/pytorch_birdimages.ipynb`.
- Media path: uses project card visual treatment in the portfolio UI.

## Results/impact
- Reached `0.5519` validation accuracy (`55.19%`) at epoch 3 (`notebooks/pytorch_birdimages.ipynb`).
- Produced reusable model artifacts that were consumed directly by the multimodal fusion project.
- Established a repeatable image pipeline with stable interfaces, so later improvements can focus on model quality instead of plumbing.

## What I'd do next
- Extend training past three epochs with schedule tuning and unfreezing strategy.
- Add class imbalance checks and per-class error analysis.
- Export an inference script/API endpoint to standardize production-style evaluation.
