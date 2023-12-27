from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List
from server import util
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import warnings

warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")


app = FastAPI()

util.load_saved_artifacts()

# Mount a static directory for serving CSS and JavaScript files
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


class LocationResponse(BaseModel):
    locations: List[str]


@app.get('/get_location_names', response_model=LocationResponse)
def get_location_names():
    locations = util.get_location_name()
    # print("Retrieved locations:", locations)
    if locations is None:
        locations = []
    # print("Returning locations:", locations)
    return {"locations": locations}


class PredictionRequest(BaseModel):
    total_sqft: float
    location: str
    bhk: int
    bath: int


class PredictionResponse(BaseModel):
    estimated_price: float


@app.post('/predict_home_price', response_model=PredictionResponse)
async def predict_home_price(data: PredictionRequest):
    total_sqft = data.total_sqft
    location = data.location
    bhk = data.bhk
    bath = data.bath

    estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)
    return {"estimated_price": estimated_price}


if __name__ == "__main__":
    print("Starting FastAPI Server for Home Price Prediction...")
    # util.load_saved_artifacts()
    # locations = util.get_location_name()
    # print(locations)
    # estimated_price = util.get_estimated_price('1st Phase JP Nagar', 1000, 3, 2)
    # print(estimated_price)
