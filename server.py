# pip install fastapi pydantic uvicorn
# uvicorn server:app --reload to run with reload on changes

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    middleware_class=CORSMiddleware,
    allow_origins=["*"]
)

@app.get('/')
def test():
    print("Success")
    return {"message": "Success"}