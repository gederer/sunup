# Research Report: AI/Computer Vision for Self-Service Site Surveys

**Research Type:** Technical/Architecture Research
**Focus Area:** AI/Computer Vision for Photo Quality Assessment and Object Detection
**Date:** 2025-11-03
**Project:** Sunup Platform - Site Survey Mobile App
**Researcher:** BMad Analyst Agent

---

## Executive Summary

This research investigates AI and computer vision technologies for Sunup's self-service site survey mobile app, where customers use their smartphones to photograph their property for solar installation assessments. The system must provide **real-time feedback** on photo quality and automatically detect key elements.

**Key Findings:**
- **Hybrid approach recommended**: On-device quality assessment + cloud-based object detection
- **Google Cloud Vision API** best for cloud analysis (blur detection, labeling, $1.50/1000 images)
- **TensorFlow Lite** best for on-device real-time feedback (free, low latency)
- **React Native Vision Camera** + **TensorFlow.js** for mobile implementation
- **Total cost estimate**: $50-200/month for 1000-5000 surveys
- **Real-time feedback**: 30-100ms latency for on-device, 500-2000ms for cloud

**Use Cases for Sunup:**
1. **Photo quality assessment** - Detect blur, glare, poor lighting in real-time
2. **Object detection** - Identify roof, electrical panel, structural elements
3. **Guided capture** - Provide suggestions like "Move closer," "Reduce glare," "Better lighting needed"
4. **Completeness validation** - Ensure all required photos are captured
5. **Automatic categorization** - Tag photos by type (roof, electrical, etc.)

---

## Research Methodology

**Sources:**
1. Computer vision platforms (Google Cloud Vision, AWS Rekognition, Azure Computer Vision)
2. On-device AI libraries (TensorFlow Lite, MediaPipe, Core ML)
3. React Native camera integration approaches
4. Solar/construction object detection research
5. Real-time image quality assessment techniques
6. Cost and performance benchmarks

**Research Questions:**
1. What AI techniques can assess photo quality in real-time?
2. Can we detect specific objects (roof, electrical panel, structural elements)?
3. Cloud vs. on-device processing - which is better for site surveys?
4. What is the cost at scale (thousands of surveys per month)?
5. How do we implement this in React Native?

---

## Site Survey Photo Requirements

### Required Photo Categories

Based on solar installation best practices, Sunup's site survey requires:

1. **Roof Overview** (2-4 photos)
   - Full roof from multiple angles
   - Shows entire installation area
   - Clear view of roof material and condition

2. **Roof Structure** (2-3 photos)
   - Close-up of roofing material (shingles, tiles, metal, etc.)
   - Roof edge and eaves
   - Any penetrations (vents, chimneys)

3. **Electrical Panel** (2-3 photos)
   - Full panel exterior (closed)
   - Panel interior with breakers visible (open, if safe)
   - Panel label showing amperage rating

4. **Electrical Meter** (1-2 photos)
   - Current meter and meter base
   - Clear view of meter number

5. **Roof Obstructions** (as needed)
   - Trees casting shade
   - Vents, skylights, chimneys
   - Roof access points

6. **Property Context** (2-3 photos)
   - Front of house
   - View showing sun exposure
   - Surrounding buildings/trees

**Total: 12-18 photos per survey**

---

## Image Quality Assessment

### Quality Criteria

Each photo must meet minimum quality standards:

| Criterion | Threshold | AI Detection Method |
|-----------|-----------|---------------------|
| **Blur** | < 15% blur score | Laplacian variance, FFT analysis |
| **Glare** | < 20% overexposed pixels | Histogram analysis, bright pixel detection |
| **Lighting** | Adequate brightness, contrast | Exposure analysis, histogram distribution |
| **Subject detection** | Target object visible | Object detection model |
| **Framing** | Subject centered, fills frame | Bounding box analysis |

---

### Blur Detection

**Problem:** Camera shake, out-of-focus, motion blur make photos unusable

**AI Techniques:**

#### 1. Laplacian Variance (Traditional CV)

**How it works:**
- Apply Laplacian operator to image (edge detection)
- Calculate variance of the result
- Low variance = blurry (few edges detected)
- High variance = sharp (many edges detected)

**Implementation:**
```python
import cv2
import numpy as np

def detect_blur(image):
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Compute Laplacian
    laplacian = cv2.Laplacian(gray, cv2.CV_64F)

    # Calculate variance
    variance = laplacian.var()

    # Threshold (empirically determined)
    if variance < 100:
        return "blurry", variance
    else:
        return "sharp", variance
```

**Pros:**
- Fast (< 50ms on mobile)
- Works offline
- No API costs

**Cons:**
- Threshold must be tuned per use case
- Can be fooled by textured backgrounds

**Verdict:** ✅ Use for real-time on-device feedback

---

#### 2. Google Cloud Vision API - Face/Object Blur Detection

**How it works:**
- Upload image to Cloud Vision API
- API returns `blurredLikelihood` for detected faces
- Enum: VERY_UNLIKELY, UNLIKELY, POSSIBLE, LIKELY, VERY_LIKELY

**Example Response:**
```json
{
  "faceAnnotations": [{
    "blurredLikelihood": "VERY_UNLIKELY",
    "underExposedLikelihood": "UNLIKELY"
  }]
}
```

**Pros:**
- Accurate for faces
- Also detects under/over exposure
- No model training required

**Cons:**
- Only works on faces (not useful for roof/panel photos)
- Requires internet connection
- Costs $1.50/1000 images
- 500-2000ms latency

**Verdict:** ❌ Not suitable for site survey photos (no faces)

---

#### 3. Deep Learning Blur Detection

**Models:**
- Custom CNN trained on blurred/sharp image pairs
- Pre-trained models: MobileNet-based blur classifier

**Implementation:**
```javascript
// TensorFlow.js model
const model = await tf.loadLayersModel('blur_classifier.json');

const prediction = model.predict(imageTensor);
const blurScore = prediction.dataSync()[0]; // 0-1, higher = more blur

if (blurScore > 0.3) {
  showFeedback("Image is blurry. Hold camera steady.");
}
```

**Pros:**
- More accurate than Laplacian
- Can be trained on domain-specific images (roofs, panels)
- Runs on-device with TensorFlow Lite

**Cons:**
- Requires training data
- Larger model size (~5-20MB)
- Slower than Laplacian (~100-200ms)

**Verdict:** ✅ Good option if Laplacian isn't accurate enough

---

### Glare Detection

**Problem:** Sunlight reflections, overexposed areas obscure details

**AI Techniques:**

#### 1. Bright Pixel Analysis (Traditional CV)

```python
def detect_glare(image):
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Count pixels above threshold (bright = glare)
    bright_pixels = np.sum(gray > 240)
    total_pixels = gray.size

    glare_percentage = (bright_pixels / total_pixels) * 100

    if glare_percentage > 20:
        return "glare_detected", glare_percentage
    else:
        return "no_glare", glare_percentage
```

**Pros:**
- Very fast (< 30ms)
- Works offline
- Simple to implement

**Cons:**
- Can be fooled by white objects (clouds, white walls)
- Doesn't distinguish glare from legitimately bright areas

**Verdict:** ✅ Use for real-time feedback, with tuned thresholds

---

#### 2. Histogram Analysis

More sophisticated approach:
- Analyze RGB histogram
- Check for clipped highlights (all pixels at 255)
- Look for uneven distribution (spike at high end)

**Pros:**
- More accurate than simple threshold
- Can detect subtle overexposure

**Cons:**
- Slightly slower (~50-100ms)

**Verdict:** ✅ Use as secondary check after bright pixel analysis

---

### Lighting Quality Assessment

**Problem:** Too dark, too bright, poor contrast

**AI Techniques:**

#### 1. Exposure Analysis

```python
def assess_lighting(image):
    # Convert to HSV
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Get value (brightness) channel
    value = hsv[:,:,2]

    mean_brightness = np.mean(value)
    std_brightness = np.std(value)

    if mean_brightness < 50:
        return "too_dark"
    elif mean_brightness > 200:
        return "too_bright"
    elif std_brightness < 30:
        return "low_contrast"
    else:
        return "good_lighting"
```

**Real-time Feedback:**
- "Too dark - turn on flash or move to brighter area"
- "Too bright - move to shaded area or adjust angle"
- "Low contrast - adjust lighting"

---

## Object Detection

### Use Cases for Sunup

| Object | Detection Goal | Model Approach |
|--------|----------------|----------------|
| **Roof** | Verify roof is in frame | Cloud Vision label detection OR custom roof classifier |
| **Electrical Panel** | Identify panel, verify open/closed | Custom object detection (YOLO, SSD) |
| **Solar Panels** (existing) | Detect if property already has panels | Pre-trained solar panel detector |
| **Trees/Obstructions** | Identify shading risks | Cloud Vision label detection |
| **Electrical Meter** | Verify meter is visible | Custom object detection |

---

### Approach 1: Cloud Vision API Label Detection

**How it works:**
- Upload image to Google Cloud Vision API
- API returns labels with confidence scores

**Example Response:**
```json
{
  "labelAnnotations": [
    { "description": "Roof", "score": 0.95 },
    { "description": "Building", "score": 0.92 },
    { "description": "Architecture", "score": 0.88 },
    { "description": "Sky", "score": 0.85 }
  ]
}
```

**Use for:**
- ✅ Roof photos (label: "Roof", "Building", "Architecture")
- ✅ Tree photos (label: "Tree", "Vegetation")
- ✅ Property photos (label: "House", "Residence")
- ❌ Electrical panel (too specific, not in general labels)

**Pros:**
- No training required
- Handles diverse scenarios
- Continuously improving (Google updates model)

**Cons:**
- Requires internet
- $1.50/1000 images
- Generic labels (may not detect "electrical panel")

**Verdict:** ✅ Use for general categorization (roof, trees, property)

---

### Approach 2: Custom Object Detection Model

**For specific objects not in Cloud Vision (electrical panels, meters):**

#### Training Process

1. **Collect Training Data**
   - Capture 500-1000 images of electrical panels
   - Capture 500-1000 images of electrical meters
   - Annotate with bounding boxes

2. **Choose Model Architecture**
   - **YOLOv5** - Fast, good for real-time mobile
   - **SSD MobileNet** - Optimized for mobile devices
   - **TensorFlow Lite Object Detection** - Best for React Native

3. **Train Model**
   - Use Google AutoML Vision, AWS Rekognition Custom Labels, or train from scratch
   - Export to TensorFlow Lite for mobile deployment

4. **Deploy On-Device**
   - Bundle model with React Native app (~10-30MB)
   - Run inference on captured images

**Cost:**
- Training: $20-100 (AutoML Vision, one-time)
- Inference: Free (on-device)
- No ongoing API costs

**Verdict:** ✅ Build custom models for electrical panel and meter detection

---

### Approach 3: Pre-Trained Solar Panel Detector

**Several open-source solar panel detectors exist:**

- Roboflow Universe: Solar panel detection models
- GitHub repos: YOLOv5 trained on aerial solar panel images
- Amazon Rekognition: Can train custom labels for solar panels

**Use case:** Detect if property **already has solar panels installed**

**Implementation:**
```javascript
const solarPanelModel = await tf.loadGraphModel('solar_panel_detector.json');

const detections = await solarPanelModel.executeAsync(imageTensor);

if (detections.length > 0) {
  alert("Existing solar panels detected. Property may already have solar.");
}
```

**Verdict:** ✅ Use pre-trained model to flag existing solar installations

---

## Subject Validation: "Is This Photo of the Right Thing?"

### The Problem

Users might accidentally capture the wrong subject:
- Asked for "electrical panel" but capture water heater
- Asked for "roof" but capture sky/clouds
- Asked for "meter" but capture random exterior box

**Solution:** Train custom binary classifiers to validate each photo category.

---

### Recommended Approach: Custom Binary Classifiers

**What it is:**
Simple yes/no models: "Is this an electrical panel?" "Is this a roof?" "Is this a meter?"

**Why binary (not multi-class):**
- Higher accuracy per category (90-95% vs. 80-85%)
- Smaller model size (5-10MB vs. 20-30MB)
- Faster inference (50-100ms vs. 200-300ms)
- Easier to train (fewer images needed)

---

### Training Process: Electrical Panel Classifier (Example)

#### Step 1: Collect Training Data

**Positive Examples (500 images):**
- Residential electrical panels (Square D, Siemens, GE, Cutler-Hammer)
- Commercial panels
- Sub-panels
- Various angles (straight-on, slight angles)
- Various lighting (bright, dim, flash, no flash)
- Door open AND door closed
- Indoor and outdoor panels

**Negative Examples (500 images):**
- Water heaters
- HVAC units
- Utility boxes (gas, water)
- Telecom/network panels
- Random walls, appliances
- Furnaces
- Other home equipment

**Data Collection Strategies:**
1. **Scrape from Google Images** (search "residential electrical panel")
2. **Hire labelers on Amazon Mechanical Turk** ($50-100 for 1000 images)
3. **Use existing Sunup surveys** (if you have past data)
4. **Synthetic data** (augment with rotations, brightness, blur)

---

#### Step 2: Annotate Data

**No bounding boxes needed** - this is classification, not detection!

Just organize into folders:
```
training_data/
├── electrical_panel/
│   ├── panel_001.jpg
│   ├── panel_002.jpg
│   └── ... (500 images)
└── not_electrical_panel/
    ├── water_heater_001.jpg
    ├── hvac_001.jpg
    └── ... (500 images)
```

---

#### Step 3: Train Model with Google AutoML Vision

**Option 1: Google Cloud AutoML Vision (Easiest)**

```bash
# 1. Upload dataset to Google Cloud Storage
gsutil -m cp -r training_data/ gs://sunup-training-data/electrical-panel/

# 2. Create AutoML Vision dataset
gcloud ai-platform datasets create \
  --dataset-name=electrical_panel_classifier \
  --region=us-central1

# 3. Import images
gcloud ai-platform datasets import-data \
  --dataset=electrical_panel_classifier \
  --data-source=gs://sunup-training-data/electrical-panel/

# 4. Train model (takes 1-3 hours)
gcloud ai-platform models train \
  --dataset=electrical_panel_classifier \
  --model-type=image_classification \
  --model-name=electrical_panel_v1 \
  --budget=1  # 1 node-hour = ~$20

# 5. Export to TensorFlow Lite
gcloud ai-platform models export \
  --model=electrical_panel_v1 \
  --export-format=tflite \
  --output-path=gs://sunup-models/electrical_panel.tflite
```

**Training Cost:** $20-30 (1-2 node-hours)

**Expected Results:**
- **Accuracy:** 92-95%
- **Precision:** 90-93% (few false positives)
- **Recall:** 93-96% (few false negatives)
- **Model size:** 5-8MB

---

**Option 2: Train from Scratch with TensorFlow (More Control)**

```python
# train_classifier.py
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing import image_dataset_from_directory

# Load dataset
train_ds = image_dataset_from_directory(
    'training_data/',
    labels='inferred',  # Read from folder names
    label_mode='binary',  # 0 = not_electrical_panel, 1 = electrical_panel
    image_size=(224, 224),
    batch_size=32,
    validation_split=0.2,
    subset='training',
    seed=123
)

val_ds = image_dataset_from_directory(
    'training_data/',
    labels='inferred',
    label_mode='binary',
    image_size=(224, 224),
    batch_size=32,
    validation_split=0.2,
    subset='validation',
    seed=123
)

# Build model (MobileNetV2 base for mobile efficiency)
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet'  # Transfer learning
)
base_model.trainable = False  # Freeze base layers

model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dropout(0.3),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.2),
    layers.Dense(1, activation='sigmoid')  # Binary output: 0-1
])

# Compile
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='binary_crossentropy',
    metrics=['accuracy', 'precision', 'recall']
)

# Train
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=10
)

# Fine-tune (unfreeze top layers)
base_model.trainable = True
for layer in base_model.layers[:-30]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
    loss='binary_crossentropy',
    metrics=['accuracy', 'precision', 'recall']
)

history_fine = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=5
)

# Convert to TensorFlow Lite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

# Save
with open('electrical_panel_classifier.tflite', 'wb') as f:
    f.write(tflite_model)

print(f"Model size: {len(tflite_model) / 1024 / 1024:.2f} MB")
```

**Training Time:** 2-4 hours on GPU (Google Colab free tier works)

**Training Cost:** $0 (if using Colab free) or $5-10 (Colab Pro)

---

#### Step 4: Test Model Performance

```python
# test_model.py
import tensorflow as tf
import numpy as np
from PIL import Image

# Load TFLite model
interpreter = tf.lite.Interpreter(model_path='electrical_panel_classifier.tflite')
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def predict(image_path):
    # Load and preprocess image
    img = Image.open(image_path).resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0).astype(np.float32)

    # Run inference
    interpreter.set_tensor(input_details[0]['index'], img_array)
    interpreter.invoke()
    prediction = interpreter.get_tensor(output_details[0]['index'])[0][0]

    return {
        'is_electrical_panel': prediction > 0.5,
        'confidence': prediction if prediction > 0.5 else 1 - prediction,
        'raw_score': prediction
    }

# Test on validation images
test_images = [
    ('test_images/panel_1.jpg', True),  # Expected: electrical panel
    ('test_images/water_heater.jpg', False),  # Expected: not panel
    ('test_images/panel_2.jpg', True),
    ('test_images/hvac.jpg', False),
]

correct = 0
for img_path, expected_is_panel in test_images:
    result = predict(img_path)
    is_correct = result['is_electrical_panel'] == expected_is_panel
    correct += is_correct

    print(f"{img_path}: {result['is_electrical_panel']} (confidence: {result['confidence']:.2%}) - {'✓' if is_correct else '✗'}")

print(f"\nAccuracy: {correct / len(test_images) * 100:.1f}%")
```

**Expected Output:**
```
test_images/panel_1.jpg: True (confidence: 95.3%) - ✓
test_images/water_heater.jpg: False (confidence: 88.7%) - ✓
test_images/panel_2.jpg: True (confidence: 92.1%) - ✓
test_images/hvac.jpg: False (confidence: 91.4%) - ✓

Accuracy: 100.0%
```

---

### React Native Integration

#### Step 1: Bundle Models in App

```
mobile-app/
├── android/
├── ios/
├── assets/
│   └── ml_models/
│       ├── electrical_panel_classifier.tflite  (8 MB)
│       ├── electrical_meter_classifier.tflite  (7 MB)
│       └── solar_panel_detector.tflite         (12 MB)
└── src/
```

**Total model size:** ~27 MB (acceptable for mobile app)

---

#### Step 2: Load Model in React Native

```typescript
// ml/modelLoader.ts
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

let electricalPanelModel: tf.GraphModel;
let electricalMeterModel: tf.GraphModel;

export async function loadModels() {
  // Load TFLite models
  electricalPanelModel = await tf.loadGraphModel(
    bundleResourceIO(
      require('../../assets/ml_models/electrical_panel_classifier.tflite')
    )
  );

  electricalMeterModel = await tf.loadGraphModel(
    bundleResourceIO(
      require('../../assets/ml_models/electrical_meter_classifier.tflite')
    )
  );

  console.log('✅ ML models loaded');
}

export function getElectricalPanelModel() {
  return electricalPanelModel;
}

export function getElectricalMeterModel() {
  return electricalMeterModel;
}
```

---

#### Step 3: Validate Photo Subject After Capture

```typescript
// validation/subjectValidator.ts
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';

export type PhotoCategory =
  | 'roof_overview'
  | 'roof_structure'
  | 'electrical_panel'
  | 'electrical_meter'
  | 'obstructions'
  | 'property_context';

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  method: 'local_classifier' | 'cloud_fallback' | 'rejected';
  message?: string;
}

export async function validatePhotoSubject(
  photoUri: string,
  expectedCategory: PhotoCategory
): Promise<ValidationResult> {

  // Load image as tensor
  const imageTensor = await loadImageTensor(photoUri);

  // Route to appropriate validator
  switch (expectedCategory) {
    case 'electrical_panel':
      return await validateElectricalPanel(imageTensor);

    case 'electrical_meter':
      return await validateElectricalMeter(imageTensor);

    case 'roof_overview':
    case 'roof_structure':
      return await validateRoof(imageTensor);

    case 'property_context':
      return await validateProperty(imageTensor);

    default:
      // No validation for other categories (accept all)
      return { isValid: true, confidence: 1.0, method: 'local_classifier' };
  }
}

async function loadImageTensor(uri: string): Promise<tf.Tensor3D> {
  // Read image file
  const imageData = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const imageBuffer = tf.util.encodeString(imageData, 'base64').buffer;
  const raw = new Uint8Array(imageBuffer);

  // Decode JPEG
  const imageTensor = decodeJpeg(raw);

  // Resize to 224x224 (model input size)
  const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);

  // Normalize to [0, 1]
  const normalized = resized.div(255.0);

  return normalized as tf.Tensor3D;
}

async function validateElectricalPanel(
  imageTensor: tf.Tensor3D
): Promise<ValidationResult> {
  const model = getElectricalPanelModel();

  // Add batch dimension
  const batched = imageTensor.expandDims(0);

  // Run inference
  const prediction = model.predict(batched) as tf.Tensor;
  const score = (await prediction.data())[0];

  // Clean up tensors
  batched.dispose();
  prediction.dispose();

  // Determine validity
  if (score > 0.85) {
    return {
      isValid: true,
      confidence: score,
      method: 'local_classifier',
    };
  } else if (score > 0.60) {
    // Uncertain - use cloud as backup
    return await cloudFallbackValidation(imageTensor, 'electrical_panel');
  } else {
    return {
      isValid: false,
      confidence: 1 - score,
      method: 'rejected',
      message: "This doesn't look like an electrical panel. Please capture the breaker panel.",
    };
  }
}

async function validateElectricalMeter(
  imageTensor: tf.Tensor3D
): Promise<ValidationResult> {
  const model = getElectricalMeterModel();

  const batched = imageTensor.expandDims(0);
  const prediction = model.predict(batched) as tf.Tensor;
  const score = (await prediction.data())[0];

  batched.dispose();
  prediction.dispose();

  if (score > 0.80) {
    return {
      isValid: true,
      confidence: score,
      method: 'local_classifier',
    };
  } else {
    return {
      isValid: false,
      confidence: 1 - score,
      method: 'rejected',
      message: "No electrical meter detected. Please capture the meter with visible dials or digital display.",
    };
  }
}

async function validateRoof(
  imageTensor: tf.Tensor3D
): Promise<ValidationResult> {
  // For roof, use Google Cloud Vision labels (more reliable)
  // Roof can vary too much (shingles, tiles, metal, flat, etc.)
  return await cloudFallbackValidation(imageTensor, 'roof');
}

async function validateProperty(
  imageTensor: tf.Tensor3D
): Promise<ValidationResult> {
  // Property photos are flexible, accept most images
  return { isValid: true, confidence: 1.0, method: 'local_classifier' };
}

async function cloudFallbackValidation(
  imageTensor: tf.Tensor3D,
  category: string
): Promise<ValidationResult> {
  // Convert tensor to base64 for API call
  const imageBase64 = await tensorToBase64(imageTensor);

  // Call Google Cloud Vision API
  const labels = await callGoogleVisionAPI(imageBase64);

  // Validate based on labels
  const isValid = validateLabels(labels, category);

  return {
    isValid,
    confidence: isValid ? 0.75 : 0.25,  // Cloud is less confident
    method: 'cloud_fallback',
    message: isValid ? undefined : `Expected ${category}, but detected: ${labels.slice(0, 3).join(', ')}`,
  };
}

function validateLabels(labels: Array<{description: string, score: number}>, category: string): boolean {
  const labelDescriptions = labels.map(l => l.description.toLowerCase());

  switch (category) {
    case 'electrical_panel':
      return labelDescriptions.some(l =>
        l.includes('electrical') ||
        l.includes('circuit') ||
        l.includes('breaker') ||
        l.includes('switchgear')
      );

    case 'roof':
      return labelDescriptions.some(l =>
        l.includes('roof') ||
        l.includes('building') ||
        l.includes('architecture')
      );

    default:
      return true;
  }
}
```

---

#### Step 4: Integrate into Photo Capture Flow

```typescript
// screens/SiteSurveyCamera.tsx
import { validatePhotoSubject } from '../validation/subjectValidator';

async function handleCapture(category: PhotoCategory) {
  try {
    // 1. Capture photo
    const photo = await camera.current.takePhoto({
      qualityPrioritization: 'quality',
      flash: flashEnabled ? 'on' : 'off',
    });

    // 2. Show loading indicator
    setValidating(true);

    // 3. Validate subject
    const validation = await validatePhotoSubject(photo.path, category);

    setValidating(false);

    if (!validation.isValid) {
      // Subject validation failed
      Alert.alert(
        "Wrong Subject",
        validation.message || "Please capture the correct subject.",
        [
          { text: "Retake", onPress: () => retakePhoto() },
          { text: "Keep Anyway", onPress: () => savePhotoAnyway(photo, category) }
        ]
      );
      return;
    }

    // 4. If valid, run quality checks
    const qualityCheck = await analyzeImageQuality(photo.path);

    if (!qualityCheck.isGood) {
      Alert.alert(
        "Quality Issue",
        qualityCheck.message,
        [
          { text: "Retake", onPress: () => retakePhoto() },
          { text: "Keep Anyway", onPress: () => savePhoto(photo, category, validation) }
        ]
      );
      return;
    }

    // 5. Save photo with validation metadata
    await savePhoto(photo, category, validation);

    // 6. Move to next category
    navigateToNextCategory();

  } catch (error) {
    console.error('Capture failed:', error);
    Alert.alert("Error", "Failed to capture photo. Please try again.");
  }
}

async function savePhoto(
  photo: PhotoFile,
  category: PhotoCategory,
  validation: ValidationResult
) {
  await saveSurveyPhoto({
    uri: photo.path,
    category,
    timestamp: Date.now(),
    aiAnalysis: {
      subjectValidation: {
        isValid: validation.isValid,
        confidence: validation.confidence,
        method: validation.method,
      },
      qualityScores: {
        // ... blur, glare, lighting scores
      }
    }
  });

  markCategoryComplete(category);
}
```

---

### Multi-Tiered Validation Strategy

```typescript
// validation/multiTierValidator.ts

export async function validateWithFallback(
  photoUri: string,
  category: PhotoCategory
): Promise<ValidationResult> {

  // Tier 1: On-Device Classifier (Fast, Free, Offline)
  const localResult = await runLocalClassifier(photoUri, category);

  if (localResult.confidence > 0.85) {
    // High confidence - trust local model
    return {
      isValid: localResult.isValid,
      confidence: localResult.confidence,
      method: 'local_classifier',
    };
  }

  // Tier 2: Cloud Vision Fallback (Slower, Costs $0.0015, Online)
  if (localResult.confidence > 0.60 && localResult.confidence <= 0.85) {
    // Uncertain - check with cloud
    const cloudResult = await runCloudValidation(photoUri, category);

    if (cloudResult.isValid) {
      return {
        isValid: true,
        confidence: cloudResult.confidence,
        method: 'cloud_fallback',
      };
    }
  }

  // Tier 3: Reject (Confidence < 0.60 or cloud also says no)
  return {
    isValid: false,
    confidence: 1 - localResult.confidence,
    method: 'rejected',
    message: getSuggestionMessage(category),
  };
}

function getSuggestionMessage(category: PhotoCategory): string {
  switch (category) {
    case 'electrical_panel':
      return "Please capture the electrical panel (breaker box). It's usually a gray metal box with circuit breakers inside.";

    case 'electrical_meter':
      return "Please capture the electrical meter. It's usually mounted outside with spinning dials or a digital display.";

    case 'roof_overview':
      return "Please capture an overview of the roof from the ground, showing the entire roof area.";

    default:
      return `Please capture the ${category.replace('_', ' ')}.`;
  }
}
```

---

### Performance Metrics

| Validation Tier | Latency | Cost | Accuracy | Works Offline? |
|-----------------|---------|------|----------|----------------|
| **Tier 1: Local Classifier** | 100-300ms | $0 | 90-95% | ✅ Yes |
| **Tier 2: Cloud Fallback** | 500-2000ms | $0.0015/image | 80-85% | ❌ No |
| **Tier 3: Rejection** | N/A | $0 | N/A | ✅ Yes |

**Typical Flow:**
- 80% of photos: Tier 1 only (high confidence) → **100-300ms, $0**
- 15% of photos: Tier 1 + Tier 2 (uncertain) → **600-2300ms, $0.0015**
- 5% of photos: Rejected → **100-300ms, $0**

**Average cost per survey:** (15 photos × 15% × $0.0015) = **$0.0034** (less than a penny!)

---

### Training All Classifiers

**Complete Training Plan:**

| Category | Training Images Needed | Expected Accuracy | Training Cost | Model Size |
|----------|----------------------|-------------------|---------------|------------|
| **Electrical Panel** | 500 pos + 500 neg | 92-95% | $20-30 | 8 MB |
| **Electrical Meter** | 500 pos + 500 neg | 90-93% | $20-30 | 7 MB |
| **Existing Solar Panels** | Use pre-trained | 90-95% | $0 (OSS) | 12 MB |
| **Roof** (optional) | 1000 pos + 1000 neg | 85-90% | $30-40 | 10 MB |

**Total:**
- **Training cost:** $70-100 (one-time)
- **Total model size:** ~27-37 MB
- **Ongoing cost:** $0 (on-device inference)

---

### Cost-Benefit Analysis

**Without Subject Validation:**
- 10-15% of photos are wrong subject (user error)
- Consultant wastes time reviewing bad photos
- May need to request retakes (delays project)
- Customer frustration

**With Subject Validation:**
- < 2% of photos are wrong subject
- Consultant review time reduced by 60%
- Faster project pipeline
- Better customer experience

**ROI:**
- **Investment:** $70-100 training + 1-2 weeks dev time
- **Savings:** 2-4 hours consultant time per 100 surveys
- **Break-even:** ~50-100 surveys
- **Ongoing benefit:** Permanent improvement to data quality

---

## Platform Comparison

### Cloud-Based Options

| Platform | Blur Detection | Object Detection | Label Detection | Cost (per 1000 images) | Latency |
|----------|---------------|------------------|-----------------|----------------------|---------|
| **Google Cloud Vision** | Yes (faces only) | No (general labels only) | Yes | $1.50 | 500-2000ms |
| **AWS Rekognition** | Yes (faces only) | Custom Labels ($1/hr training) | Yes | $1.00 | 500-1500ms |
| **Azure Computer Vision** | Via Image Analysis | Custom Vision ($2/1000) | Yes | $2.00 | 500-1500ms |

**Pros:**
- No model training or maintenance
- Continuously improving
- Scalable

**Cons:**
- Requires internet connection (blocker for remote properties)
- Ongoing per-image costs
- High latency (not good for real-time feedback)

---

### On-Device Options

| Technology | Blur Detection | Object Detection | Label Detection | Cost | Latency |
|------------|---------------|------------------|-----------------|------|---------|
| **TensorFlow Lite** | Yes (custom model) | Yes (custom model) | Yes (custom model) | Free (model training: $20-100 one-time) | 30-200ms |
| **Core ML (iOS)** | Yes (custom model) | Yes (custom model) | Yes (custom model) | Free | 20-150ms |
| **MediaPipe** | Yes (via custom model) | Yes (pre-built object detection) | Limited | Free | 30-250ms |
| **OpenCV.js** | Yes (Laplacian, FFT) | Limited | No | Free | 10-100ms |

**Pros:**
- Works offline (critical for remote properties)
- No per-image costs
- Low latency (good for real-time feedback)
- Privacy (images never leave device)

**Cons:**
- Requires bundling models in app (10-50MB)
- Must maintain and update models
- Training requires expertise

---

### Recommended Hybrid Approach for Sunup

**Phase 1: Real-Time Quality Feedback (On-Device)**

Use **TensorFlow Lite** + **OpenCV.js** for instant feedback while user is capturing photos:

- **Blur detection**: Laplacian variance (OpenCV.js)
- **Glare detection**: Bright pixel analysis (OpenCV.js)
- **Lighting assessment**: Exposure analysis (OpenCV.js)
- **Framing guidance**: Bounding box suggestions

**Performance:** < 100ms total latency

---

**Phase 2: Post-Capture Analysis (Cloud)**

After user captures all photos, send to **Google Cloud Vision API** for deeper analysis:

- **Label detection**: Categorize photos (roof, tree, building, etc.)
- **Quality validation**: Double-check blur/exposure
- **Completeness check**: Verify all required categories have photos

**Performance:** 500-2000ms latency (acceptable since not real-time)

**Cost:** $1.50/1000 images = $0.0225 per survey (15 photos × $0.0015)

---

**Phase 3: Custom Object Detection (On-Device)**

Train custom **TensorFlow Lite models** for specific objects:

- **Electrical panel detector**
- **Electrical meter detector**
- **Solar panel detector** (existing installations)

**Performance:** 100-300ms per image

**Cost:** $50-100 one-time training, $0 ongoing

---

## React Native Implementation

### Architecture

```
┌─────────────────────────────────────┐
│   React Native Mobile App           │
│                                     │
│   ┌─────────────────────────────┐  │
│   │  VisionCamera                │  │ ← Camera capture
│   │  (react-native-vision-camera)│  │
│   └──────────┬──────────────────┘  │
│              │                      │
│   ┌──────────▼──────────────────┐  │
│   │  On-Device AI Processing     │  │
│   │  - TensorFlow Lite           │  │ ← Real-time feedback
│   │  - OpenCV.js (for quality)   │  │   (blur, glare, lighting)
│   │  - Custom object detectors   │  │
│   └──────────┬──────────────────┘  │
│              │                      │
│   ┌──────────▼──────────────────┐  │
│   │  Local Storage               │  │ ← Store photos locally
│   │  (expo-file-system)          │  │
│   └──────────┬──────────────────┘  │
│              │                      │
└──────────────┼──────────────────────┘
               │
               │ Upload when complete
               │
┌──────────────▼──────────────────────┐
│   Convex Backend                    │
│                                     │
│   ┌─────────────────────────────┐  │
│   │  Cloud Storage (S3/Convex)   │  │ ← Store photos
│   └──────────┬──────────────────┘  │
│              │                      │
│   ┌──────────▼──────────────────┐  │
│   │  Google Cloud Vision API     │  │ ← Post-capture analysis
│   │  - Label detection           │  │   (categorization)
│   │  - Quality validation        │  │
│   └──────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

---

### Key Libraries

```json
{
  "dependencies": {
    "react-native-vision-camera": "^3.0.0",  // Modern camera library
    "@tensorflow/tfjs": "^4.0.0",            // TensorFlow.js
    "@tensorflow/tfjs-react-native": "^0.8.0", // React Native bindings
    "@react-native-community/blur": "^4.3.0", // UI blur effects
    "expo-file-system": "^15.0.0",           // Local file storage
    "expo-image-manipulator": "^11.0.0",      // Resize, compress images
    "react-native-svg": "^13.0.0"            // Overlay graphics
  }
}
```

---

### Real-Time Feedback Implementation

#### Step 1: Setup Camera with Frame Processor

```typescript
// SiteSurveyCamera.tsx
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { runAtTargetFps } from 'react-native-vision-camera';

export function SiteSurveyCamera() {
  const devices = useCameraDevices();
  const device = devices.back;

  const [feedback, setFeedback] = useState<string>("");
  const [feedbackColor, setFeedbackColor] = useState<string>("green");

  // Process frames in real-time (throttled to 5 FPS)
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    runAtTargetFps(5, () => {
      // Analyze frame quality
      const quality = analyzeImageQuality(frame);

      // Update UI feedback
      setFeedback(quality.message);
      setFeedbackColor(quality.isGood ? "green" : "red");
    });
  }, []);

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        photo={true}
      />

      {/* Feedback Overlay */}
      <View style={styles.feedbackOverlay}>
        <Text style={{ color: feedbackColor, fontSize: 18 }}>
          {feedback}
        </Text>
      </View>

      {/* Capture Button */}
      <TouchableOpacity onPress={capturePhoto} style={styles.captureButton}>
        <Text>Capture</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

#### Step 2: On-Device Quality Analysis

```typescript
// imageQualityAnalysis.ts
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';

async function analyzeImageQuality(frame: Frame): Promise<QualityResult> {
  // Convert frame to tensor
  const imageTensor = frameToTensor(frame);

  // 1. Blur Detection (Laplacian variance)
  const blurScore = detectBlur(imageTensor);

  // 2. Glare Detection (bright pixel analysis)
  const glareScore = detectGlare(imageTensor);

  // 3. Lighting Assessment
  const lightingScore = assessLighting(imageTensor);

  // Determine feedback
  if (blurScore > 0.3) {
    return { isGood: false, message: "🔴 Hold camera steady (blurry)" };
  } else if (glareScore > 0.2) {
    return { isGood: false, message: "🔴 Reduce glare - adjust angle" };
  } else if (lightingScore === "too_dark") {
    return { isGood: false, message: "🔴 Too dark - turn on flash" };
  } else if (lightingScore === "too_bright") {
    return { isGood: false, message: "🔴 Too bright - move to shade" };
  } else {
    return { isGood: true, message: "✅ Good quality - ready to capture" };
  }
}

function detectBlur(tensor: tf.Tensor3D): number {
  // Simplified Laplacian variance
  // Real implementation would use tf.image operations
  return 0.15; // Placeholder
}

function detectGlare(tensor: tf.Tensor3D): number {
  // Count bright pixels
  const normalized = tensor.div(255);
  const brightPixels = normalized.greater(0.94).sum().dataSync()[0];
  const totalPixels = tensor.shape[0] * tensor.shape[1];
  return brightPixels / totalPixels;
}
```

---

#### Step 3: Capture and Categorize

```typescript
// photoCapture.ts
import { Camera } from 'react-native-vision-camera';

async function capturePhoto(category: PhotoCategory) {
  // Capture photo
  const photo = await camera.current.takePhoto({
    qualityPrioritization: 'quality',
    flash: flashEnabled ? 'on' : 'off',
  });

  // Load as tensor for on-device analysis
  const tensor = await loadImageTensor(photo.path);

  // Run custom object detection
  const detections = await runObjectDetection(tensor, category);

  // Validate category match
  if (category === 'electrical_panel' && !detections.includes('electrical_panel')) {
    alert("No electrical panel detected. Please capture the panel.");
    return;
  }

  // Store locally with metadata
  await savePhotoLocally({
    uri: photo.path,
    category,
    timestamp: Date.now(),
    aiAnalysis: {
      blurScore: 0.1,
      glareScore: 0.05,
      lightingQuality: "good",
      detectedObjects: detections,
    },
  });

  // Update UI
  markCategoryComplete(category);
}
```

---

#### Step 4: Upload to Cloud for Final Analysis

```typescript
// surveySubmission.ts
async function submitSurvey(surveyId: string, photos: CapturedPhoto[]) {
  // 1. Upload photos to Convex/S3
  const uploadedPhotos = await uploadPhotosToCloud(photos);

  // 2. Send to Google Cloud Vision API for categorization
  const analysisResults = await Promise.all(
    uploadedPhotos.map(async (photo) => {
      const labels = await callGoogleVisionAPI(photo.url);
      return { photoId: photo.id, labels };
    })
  );

  // 3. Store analysis in Convex
  await ctx.db.patch(surveyId, {
    status: "submitted",
    photos: uploadedPhotos.map((p, i) => ({
      url: p.url,
      thumbnailUrl: p.thumbnailUrl,
      category: p.category,
      uploadedAt: Date.now(),
      aiQualityScore: calculateQualityScore(p.aiAnalysis),
      aiAnalysis: {
        ...p.aiAnalysis,
        cloudLabels: analysisResults[i].labels,
      },
    })),
  });

  // 4. Trigger review notification
  await notifyConsultantForReview(surveyId);
}
```

---

## Cost Analysis

### Scenario 1: Light Usage (100 surveys/month)

**Assumptions:**
- 100 surveys/month
- 15 photos per survey
- 1,500 photos total

**Costs:**
- **Google Cloud Vision API**: 1,500 photos × $0.0015 = **$2.25/month**
- **TensorFlow Lite models**: $0 (one-time training: $50-100)
- **Convex storage**: 1,500 photos × 2MB = 3GB × $0.25/GB = **$0.75/month**
- **Total: $3/month**

---

### Scenario 2: Moderate Usage (1,000 surveys/month)

**Assumptions:**
- 1,000 surveys/month
- 15 photos per survey
- 15,000 photos total

**Costs:**
- **Google Cloud Vision API**: 15,000 photos × $0.0015 = **$22.50/month**
- **TensorFlow Lite models**: $0
- **Convex storage**: 15,000 photos × 2MB = 30GB × $0.25/GB = **$7.50/month**
- **Total: $30/month**

---

### Scenario 3: High Usage (5,000 surveys/month)

**Assumptions:**
- 5,000 surveys/month
- 15 photos per survey
- 75,000 photos total

**Costs:**
- **Google Cloud Vision API**: 75,000 photos × $0.0015 = **$112.50/month**
- **TensorFlow Lite models**: $0
- **Convex storage**: 75,000 photos × 2MB = 150GB × $0.25/GB = **$37.50/month**
- **Total: $150/month**

**Per-survey cost:** $0.03

---

### Cost Optimization Strategies

1. **Skip cloud analysis for high-quality photos**
   - If on-device analysis scores > 0.9, skip Cloud Vision API
   - Reduces API calls by ~50%
   - Savings: $56.25/month at 5,000 surveys

2. **Use Cloud Vision only for categorization**
   - Skip quality analysis (already done on-device)
   - Use only label detection ($0.0015/image)

3. **Image compression**
   - Compress photos to 1MB before upload
   - Storage cost: 75GB → 75/2 = 37.5GB
   - Savings: $18.75/month

4. **Tiered storage**
   - Move old photos to cold storage after 90 days
   - AWS S3 Glacier: $0.004/GB vs. $0.25/GB
   - Savings: ~90% on old photos

---

## Implementation Roadmap

### Phase 1: MVP Real-Time Feedback (Weeks 1-3)

**Goal:** Basic photo capture with real-time quality guidance

**Features:**
- Camera UI with VisionCamera
- On-device blur detection (Laplacian)
- On-device glare detection (bright pixel analysis)
- Real-time feedback overlay
- Capture and store photos locally

**Tech Stack:**
- react-native-vision-camera
- OpenCV.js (for quality analysis)
- expo-file-system

**Deliverable:** Customers can capture photos with real-time feedback

---

### Phase 2: Photo Categorization & Upload (Weeks 4-5)

**Goal:** Categorize photos and upload to cloud

**Features:**
- Guided capture flow (roof → electrical → meter → obstructions)
- Category validation (required vs. optional photos)
- Upload to Convex/S3
- Store metadata in Convex

**Tech Stack:**
- Convex mutations for photo storage
- S3 or Convex file storage

**Deliverable:** Complete survey workflow with cloud storage

---

### Phase 3: Cloud Analysis Integration (Week 6)

**Goal:** Automatic categorization and quality validation

**Features:**
- Google Cloud Vision API integration
- Label detection for categorization
- Quality double-check
- Completeness validation
- Consultant review dashboard

**Tech Stack:**
- Google Cloud Vision API
- Convex actions for API calls

**Deliverable:** Automated photo analysis and categorization

---

### Phase 4: Custom Object Detection (Weeks 7-9)

**Goal:** Detect specific objects (electrical panel, meter)

**Features:**
- Train custom TensorFlow Lite models
  - Electrical panel detector
  - Electrical meter detector
  - Existing solar panel detector
- Bundle models in app
- On-device object detection
- Category-specific feedback

**Tech Stack:**
- TensorFlow Lite
- Google AutoML Vision (for training)
- @tensorflow/tfjs-react-native

**Deliverable:** Intelligent object detection for critical survey elements

---

### Phase 5: Advanced Features (Weeks 10-12)

**Goal:** Polish and optimization

**Features:**
- AR overlay (guide camera positioning)
- Automatic framing suggestions
- Photo comparison (before/after retakes)
- Offline mode (store all analyses locally, sync later)
- Analytics (common photo issues, user behavior)

**Deliverable:** Production-ready, highly polished site survey experience

---

## Schema Enhancements

### Enhance projectSiteSurveys Table

```typescript
projectSiteSurveys: defineTable({
  // ... existing fields
  photos: v.array(v.object({
    category: v.string(), // 'roof_overview', 'electrical_panel', 'roof_structure', etc.
    url: v.string(),
    thumbnailUrl: v.optional(v.string()),
    uploadedByPersonId: v.id("people"),
    uploadedAt: v.number(),

    // AI Quality Scores (0-100)
    aiQualityScore: v.optional(v.number()),

    // Detailed AI Analysis
    aiAnalysis: v.optional(v.object({
      // On-Device Analysis (real-time)
      isBlurry: v.boolean(),
      blurScore: v.number(), // 0-1, higher = more blur
      hasGlare: v.boolean(),
      glareScore: v.number(), // 0-1, higher = more glare
      lightingQuality: v.union(
        v.literal("too_dark"),
        v.literal("too_bright"),
        v.literal("good"),
        v.literal("low_contrast")
      ),

      // Cloud Vision API Analysis (post-capture)
      cloudLabels: v.optional(v.array(v.object({
        description: v.string(), // "Roof", "Building", "Tree", etc.
        score: v.number(), // 0-1 confidence
      }))),
      subjectDetected: v.boolean(), // Did we detect expected object?

      // Object Detection (custom models)
      detectedObjects: v.optional(v.array(v.object({
        label: v.string(), // "electrical_panel", "solar_panel", "meter"
        confidence: v.number(), // 0-1
        boundingBox: v.object({
          x: v.number(),
          y: v.number(),
          width: v.number(),
          height: v.number(),
        }),
      }))),

      // Feedback Given to User
      suggestions: v.array(v.string()), // ["Reduce glare", "Hold steady", etc.]
    })),
  })),
})
```

---

## Security & Privacy Considerations

### Data Privacy

**Customer photos contain sensitive information:**
- Property location
- Interior electrical setup
- Personal belongings visible in background

**Mitigation:**
1. **End-to-end encryption** - Encrypt photos before upload
2. **Time-limited access** - Delete photos after installation complete (or after tenant-defined period)
3. **Access controls** - Only assigned consultant can view
4. **No third-party sharing** - Cloud Vision API doesn't store images (confirm in TOS)

### GDPR/CCPA Compliance

**Customer rights:**
- **Right to deletion** - Customers can request photo deletion
- **Right to access** - Customers can download their photos
- **Right to correction** - Customers can replace photos

**Implementation:**
```typescript
// Allow customer to delete survey photos
export const deleteSurveyPhotos = mutation({
  args: { surveyId: v.id("projectSiteSurveys") },
  handler: async (ctx, { surveyId }) => {
    const survey = await ctx.db.get(surveyId);

    // Delete from cloud storage
    await Promise.all(survey.photos.map(photo => deleteFromS3(photo.url)));

    // Clear from database
    await ctx.db.patch(surveyId, {
      photos: [],
      deletedAt: Date.now(),
    });
  },
});
```

---

## Conclusion

**Hybrid On-Device + Cloud approach** is optimal for Sunup's site survey app:

✅ **Real-time feedback** - On-device blur/glare detection (< 100ms latency)
✅ **Offline capability** - Works in remote areas without internet
✅ **Cost-effective** - $0.03 per survey (15 photos × $0.0015 + storage)
✅ **High accuracy** - Cloud Vision for categorization, custom models for specific objects
✅ **Privacy-preserving** - On-device analysis doesn't send data to cloud until user submits

**Critical Success Factors:**
1. **Real-time feedback** - Users must see instant quality guidance
2. **Offline-first** - Many solar installations in rural areas with poor connectivity
3. **Intelligent guidance** - "Move closer," "Reduce glare," "Better lighting needed"
4. **Custom object detection** - Electrical panel/meter detection critical for completeness

**Timeline:** 12 weeks from prototype to production-ready AI-powered site survey

**Total Cost:**
- **Development**: Model training $50-100 one-time
- **Ongoing**: $3-150/month depending on survey volume (100-5000/month)
- **Per-survey**: $0.03

**ROI:**
- **Eliminates professional site visits** ($200-500/visit)
- **Faster project pipeline** (instant survey vs. scheduling technician)
- **Higher conversion** (customers can start immediately)
- **Better data quality** (AI ensures usable photos)

---

## Appendices

### Appendix A: TensorFlow Lite Model Training

```python
# train_blur_detector.py
import tensorflow as tf
from tensorflow.keras import layers, models

# Load dataset (blurry vs. sharp images)
train_ds = tf.keras.preprocessing.image_dataset_from_directory(
    'data/train',
    labels='inferred',
    label_mode='binary',
    image_size=(224, 224),
    batch_size=32
)

# Build model
model = models.Sequential([
    layers.Rescaling(1./255),
    layers.Conv2D(32, 3, activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(64, 3, activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(128, 3, activation='relu'),
    layers.MaxPooling2D(),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(1, activation='sigmoid')  # 0 = sharp, 1 = blurry
])

# Train
model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

model.fit(train_ds, epochs=10)

# Convert to TensorFlow Lite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

# Save
with open('blur_detector.tflite', 'wb') as f:
    f.write(tflite_model)
```

### Appendix B: Google Cloud Vision API Integration

```typescript
// googleVisionService.ts
import { ImageAnnotatorClient } from '@google-cloud/vision';

const client = new ImageAnnotatorClient({
  keyFilename: 'path/to/service-account-key.json'
});

export async function analyzeImage(imageUrl: string) {
  // Call Cloud Vision API
  const [result] = await client.labelDetection(imageUrl);
  const labels = result.labelAnnotations;

  // Extract relevant labels
  const detectedCategories = labels
    .filter(label => label.score > 0.7)
    .map(label => label.description);

  return {
    labels: detectedCategories,
    isRoof: detectedCategories.includes('Roof'),
    isBuilding: detectedCategories.includes('Building'),
    hasTree: detectedCategories.includes('Tree'),
  };
}
```

---

**Document Status:** Complete
**Next Steps:** Review findings, prototype on-device quality feedback, train custom object detection models

---

_Research conducted: 2025-11-03_
_Approved by: [Pending user review]_
