# Bangalore Home Price Predictor

A machine learning-powered web application that estimates residential property prices in Bangalore based on key features like area, location, BHK, and bathrooms.

## Features

- **Price Estimation** – Predicts home prices in Lakhs/Crores using a trained regression model
- **Location Selection** – Dropdown with 240+ Bangalore localities
- **Real-time UI** – Modern single-page interface with instant AJAX responses
- **ML Pipeline** – Built on scikit-learn with data cleaning, feature engineering, and OneHotEncoding for locations

## Tech Stack

| Layer        | Technology                                      |
|-------------|-------------------------------------------------|
| Backend      | Python, FastAPI, Uvicorn                       |
| Frontend     | HTML5, CSS3, JavaScript, jQuery                |
| ML           | scikit-learn (Linear Regression), pandas, numpy |
| Infra        | Docker, Render-ready                           |

## Project Structure

```
├── main.py                     # FastAPI application entry point
├── server/
│   ├── util.py                 # Model loading & prediction helpers
│   ├── artifacts/
│   │   ├── columns.json        # Feature columns (locations)
│   │   └── banglore_home_prices_model.pickle  # Trained model
│   └── __init__.py
├── model/
│   ├── ML model.ipynb          # Jupyter notebook for training
│   ├── Bengaluru_House_Data.csv
│   ├── bhp.csv
│   ├── columns.json
│   └── banglore_home_prices_model.pickle
├── templates/
│   └── index.html              # Frontend template
├── static/
│   ├── style.css               # Styles
│   └── script.js               # Client-side logic
├── requirements.txt
├── Dockerfile
└── README.md
```

## Setup

### Prerequisites

- Python 3.10+
- pip

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/Manshi-Rathour/Real-Estate-Price-Prediction.git
cd real-estate-price-prediction
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the server:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

5. Open the app at [http://localhost:8000](http://localhost:8000)

### Docker

```bash
docker build -t bangalore-home-price .
docker run -p 8000:8000 bangalore-home-price
```

## API Endpoints

### `GET /get_location_names`

Returns the list of available Bangalore locations.

**Response:**
```json
{
  "locations": ["1st block jayanagar", "1st phase jp nagar", ...]
}
```

### `POST /predict_home_price`

Predicts the home price based on input parameters.

**Request body:**
```json
{
  "total_sqft": 1000,
  "location": "1st phase jp nagar",
  "bhk": 3,
  "bath": 2
}
```

**Response:**
```json
{
  "estimated_price": 85.73
}
```

## Model

The model uses **Linear Regression** trained on Bangalore housing data. Features include total square footage, number of bathrooms, number of BHKs, and one-hot encoded location. The training notebook is available at `model/ML model.ipynb`.

## Deployment

The app is configured for deployment on Render (or any container platform). A live demo is available at:

[https://real-estate-obz5.onrender.com/](https://real-estate-obz5.onrender.com/)
