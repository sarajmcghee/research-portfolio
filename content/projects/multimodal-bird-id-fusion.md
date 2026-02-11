Title: Multimodal Bird ID (Audio + Image Fusion)
Summary: Combined independent audio and image model outputs into one recommendation flow without retraining a joint model.
Role: Integration engineer designing fusion logic, label alignment, and decision-path behavior.
Tech: Python, PyTorch artifacts, scikit-learn artifacts, Jupyter, rule-based fusion logic.
Problem: Separate modality outputs were harder to interpret and act on than a single clear recommendation.
Approach: Reused validated unimodal artifacts, mapped labels to a canonical format, and implemented deterministic top-k agreement logic to produce one inspectable recommendation path.
TechnicalHighlights:
- Integrated persisted artifacts from both image and audio pipelines.
- Built top-k extraction utilities to compare modality agreement explicitly.
- Added label normalization to reconcile naming differences across models.
- Implemented confidence- and agreement-aware fusion rules for deterministic outputs.
Impact:
- Delivered a usable single-recommendation flow from existing model outputs.
- Preserved iteration speed by avoiding full multimodal retraining.
- Improved interpretability of prediction behavior for practical use.
NextSteps:
- Evaluate fusion uplift on paired multimodal holdout data.
- Add threshold-based uncertainty routing for low-agreement cases.
- Replace rule-based fusion with a learned combiner when labeled paired data is sufficient.
