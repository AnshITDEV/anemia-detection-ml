import os
import numpy as np
import pandas as pd
from flask import Flask, render_template, request, jsonify
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

app = Flask(__name__)

# Generate synthetic anemia dataset
def generate_anemia_data():
    np.random.seed(42)
    n_samples = 1000
    
    # Generate data for both genders
    data = []
    
    for _ in range(n_samples):
        gender = np.random.choice([0, 1])  # 0: Female, 1: Male
        
        # Anemia cases (lower hemoglobin and related values)
        if np.random.random() < 0.4:  # 40% have anemia
            if gender == 0:  # Female
                hemoglobin = np.random.uniform(7.0, 12.0)
                mch = np.random.uniform(15, 25)
                mchc = np.random.uniform(25, 33)
                mcv = np.random.uniform(50, 80)
                rbc = np.random.uniform(3.0, 4.5)
            else:  # Male
                hemoglobin = np.random.uniform(8.0, 13.0)
                mch = np.random.uniform(17, 27)
                mchc = np.random.uniform(27, 34)
                mcv = np.random.uniform(55, 85)
                rbc = np.random.uniform(3.5, 5.0)
            anemia = 1
        else:  # Normal cases
            if gender == 0:  # Female
                hemoglobin = np.random.uniform(12.0, 16.0)
                mch = np.random.uniform(27, 33)
                mchc = np.random.uniform(33, 36)
                mcv = np.random.uniform(80, 100)
                rbc = np.random.uniform(4.0, 5.5)
            else:  # Male
                hemoglobin = np.random.uniform(13.5, 17.5)
                mch = np.random.uniform(27, 33)
                mchc = np.random.uniform(33, 36)
                mcv = np.random.uniform(80, 100)
                rbc = np.random.uniform(4.5, 6.0)
            anemia = 0
        
        age = np.random.randint(18, 80)
        
        data.append({
            'Gender': gender,
            'Age': age,
            'Hemoglobin': round(hemoglobin, 2),
            'MCH': round(mch, 2),
            'MCHC': round(mchc, 2),
            'MCV': round(mcv, 2),
            'RBC': round(rbc, 2),
            'Anemia': anemia
        })
    
    return pd.DataFrame(data)

# Train and save model
def train_model():
    # Generate data
    df = generate_anemia_data()
    
    # Save data
    df.to_csv('data/anemia_data.csv', index=False)
    
    # Prepare features and target
    X = df.drop('Anemia', axis=1)
    y = df['Anemia']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
    model.fit(X_train_scaled, y_train)
    
    # Save model and scaler
    joblib.dump(model, 'anemia_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    
    # Print accuracy
    accuracy = model.score(X_test_scaled, y_test)
    print(f"Model trained with accuracy: {accuracy:.2%}")
    
    return model, scaler

# Load or train model
model_path = 'anemia_model.pkl'
scaler_path = 'scaler.pkl'

if os.path.exists(model_path) and os.path.exists(scaler_path):
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    print("Model loaded successfully!")
else:
    model, scaler = train_model()
    print("New model trained and saved!")

# Feature names
feature_names = ['Gender', 'Age', 'Hemoglobin', 'MCH', 'MCHC', 'MCV', 'RBC']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Extract features
        features = [
            float(data['gender']),
            float(data['age']),
            float(data['hemoglobin']),
            float(data['mch']),
            float(data['mchc']),
            float(data['mcv']),
            float(data['rbc'])
        ]
        
        # Create DataFrame with feature names
        X = pd.DataFrame([features], columns=feature_names)
        
        # Scale and predict
        X_scaled = scaler.transform(X)
        prediction = model.predict(X_scaled)[0]
        probability = model.predict_proba(X_scaled)[0]
        
        # Calculate confidence and risk level
        confidence = float(max(probability)) * 100
        
        if prediction == 1:
            result = "Anemia Detected"
            risk_level = "High" if confidence > 75 else "Medium"
            recommendation = "Please consult a healthcare professional for further diagnosis and treatment."
        else:
            result = "No Anemia Detected"
            risk_level = "Low"
            recommendation = "Your blood values appear normal. Maintain a healthy diet rich in iron."
        
        return jsonify({
            'success': True,
            'result': result,
            'confidence': round(confidence, 1),
            'risk_level': risk_level,
            'recommendation': recommendation,
            'probability_anemia': round(probability[1] * 100, 1),
            'probability_normal': round(probability[0] * 100, 1)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == "__main__":
    import os
app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
