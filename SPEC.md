# Anemia Detection Web Application - Specification

## 1. Project Overview
- **Project Name**: AnemiaCheck - AI-Powered Anemia Detection System
- **Type**: Web Application (ML-powered diagnostic tool)
- **Core Functionality**: Predicts anemia presence based on blood test parameters using machine learning
- **Target Users**: Healthcare providers, patients, medical professionals

## 2. Technology Stack
- **Backend**: Python with Flask
- **Machine Learning**: Scikit-learn (Random Forest Classifier)
- **Dataset**: Kaggle Anemia Dataset (simulated with realistic medical parameters)
- **Frontend**: HTML5, CSS3, JavaScript
- **Animations**: CSS Animations, Particle.js, AOS (Animate On Scroll)

## 3. UI/UX Specification

### Layout Structure
- **Header**: Fixed navigation with logo and nav links
- **Hero Section**: Full-screen animated landing with title and CTA
- **About Section**: Information about anemia and the detection system
- **Detection Section**: Interactive form for inputting blood test values
- **Results Section**: Animated display of prediction results
- **Footer**: Contact info and credits

### Visual Design
- **Color Palette**:
  - Primary: `#E63946` (Crimson Red - representing blood/health)
  - Secondary: `#1D3557` (Deep Navy)
  - Accent: `#F1FAEE` (Off-white)
  - Highlight: `#A8DADC` (Light Cyan)
  - Background: `#0D1B2A` (Dark Blue-Black)
  
- **Typography**:
  - Headings: 'Orbitron', sans-serif (futuristic medical feel)
  - Body: 'Exo 2', sans-serif (clean, modern)
  
- **Visual Effects**:
  - Floating blood cell particles in background
  - Gradient overlays with transparency
  - Glowing borders and buttons
  - Smooth scroll animations
  - Card hover effects with 3D transforms

### Components
1. **Navigation Bar**: Transparent, glassmorphism effect on scroll
2. **Hero Section**: Animated title with typewriter effect, pulsing CTA button
3. **Input Cards**: Glassmorphism cards with glowing borders
4. **Result Cards**: Animated reveal with health indicator rings
5. **Progress Indicators**: Circular progress for prediction confidence

## 4. Functionality Specification

### Core Features
1. **User Input Form**:
   - Hemoglobin (g/dL)
   - MCH (Mean Corpuscular Hemoglobin)
   - MCHC (Mean Corpuscular Hemoglobin Concentration)
   - MCV (Mean Corpuscular Volume)
   - Red Blood Cell Count
   - Gender (Male/Female)
   - Age

2. **ML Model**:
   - Random Forest Classifier
   - Trained on synthetic anemia dataset
   - Returns: Anemia Present/Absent + Confidence Score

3. **Results Display**:
   - Animated probability meter
   - Health recommendation
   - Risk level indicator (Low/Medium/High)

### User Interactions
- Form validation with real-time feedback
- Animated submission button with loading state
- Smooth transition to results section
- Option to retake test

## 5. File Structure
```
anshanemia/
├── app.py                 # Flask backend
├── requirements.txt       # Python dependencies
├── anemia_model.pkl      # Trained ML model
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Main stylesheet
│   └── js/
│       └── main.js       # Frontend JavaScript
└── data/
    └── anemia_data.csv   # Dataset
```

## 6. Acceptance Criteria
- [ ] Webpage loads with animated hero section
- [ ] All form inputs accept valid ranges
- [ ] Submit button triggers loading animation
- [ ] Results display with animated probability ring
- [ ] Mobile responsive design works on all screen sizes
- [ ] Background animations run smoothly
- [ ] ML model returns accurate predictions
- [ ] No console errors on page load
