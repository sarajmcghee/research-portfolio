Title: PyTorch Bird Images Classifier
Summary: Created a reproducible image-classification baseline for 200 bird species and exported artifacts for downstream multimodal integration.
Role: ML engineer owning data preparation, training workflow, evaluation, and artifact packaging.
Tech: PyTorch, torchvision, CUB-200-2011 dataset, Apple MPS, Jupyter.
Problem: Needed a reliable image model baseline that could be integrated into a broader multimodal bird identification pipeline.
Approach: Built a deterministic train/validation split, applied lightweight augmentation, used transfer learning with controlled fine-tuning, and prioritized fast end-to-end validation before deeper optimization.
TechnicalHighlights:
- Prepared class-preserving 80/20 data splits for repeatable training runs.
- Standardized preprocessing to 224x224 inputs with minimal augmentation for comparability.
- Trained transfer-learning baseline over 3 epochs to validate the full training-to-artifact path quickly.
- Exported model weights and class mapping for reuse in fusion workflows.
Impact:
- Reached 55.19% validation accuracy at epoch 3 on a 200-class fine-grained dataset.
- De-risked multimodal integration by producing stable, reusable inference artifacts.
- Provided a concrete baseline for subsequent tuning and error analysis.
NextSteps:
- Extend training with staged unfreezing and learning-rate scheduling.
- Add per-class diagnostics to isolate confusion-heavy species.
- Calibrate probabilities for more reliable downstream fusion decisions.
