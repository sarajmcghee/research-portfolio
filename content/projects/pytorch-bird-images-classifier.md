# PyTorch Bird Images Classifier

## At a glance
- Goal: Build a local, reproducible image-classification baseline for fine-grained bird species (`200` classes) that could plug directly into later multimodal work.
- Approach: Transfer learning on CUB-200-2011 with deterministic data splitting, lightweight augmentation, and short-cycle fine-tuning on Apple MPS.
- Outcome: Validated the full train-to-artifact path quickly and reached `55.19%` validation accuracy in 3 epochs, with reusable outputs consumed by the fusion project.

## Overview
I built this as an execution-first baseline: prove the pipeline, lock artifact contracts, and make iteration fast. Instead of chasing max accuracy immediately, I prioritized a stable system that could be improved incrementally without reworking data flow or downstream interfaces.

## What I changed
- Implemented a deterministic `80/20` class-preserving split to produce stable train/validation folders (`splits/train`, `splits/valid`).
- Standardized image preprocessing to `224x224` with targeted augmentation (random horizontal flip in training only) to keep the baseline simple and comparable.
- Used transfer learning with early-layer freezing and a reduced fine-tuning LR to shorten training time while preserving pretrained features.
- Constrained initial training to `3` epochs intentionally to validate end-to-end reliability before deeper hyperparameter work.
- Exported inference-ready artifacts (`image_model.pth` + class-index mapping) so later notebooks could consume the model without retraining.

## Evidence
- Dataset scope: CUB-200-2011 (`11,788` images, `200` classes).
- Training trend (`notebooks/pytorch_birdimages.ipynb`):
  - Epoch 1: train acc `0.6400`, val acc `0.5336`
  - Epoch 2: train acc `0.7028`, val acc `0.5333`
  - Epoch 3: train acc `0.7318`, val acc `0.5519`
- Deliverables: persisted model weights and class map used directly in multimodal fusion integration.

## Limitations + Next step
- Validation accuracy plateaued in this short run; next step is longer training with staged unfreezing/LR scheduling.
- Current reporting is mostly headline accuracy; next step is class-level error analysis and calibration to identify failure modes.
