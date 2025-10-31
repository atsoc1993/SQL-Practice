# pip install fastapi pydantic uvicorn
# uvicorn server:app --reload to run with reload on changes

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from sqlalchemy import create_engine, Integer, String, Boolean, select
from sqlalchemy.orm import Session, MappedAsDataclass, Mapped, mapped_column, DeclarativeBase
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    middleware_class=CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"]
)

user = "root"
password = os.getenv('PASSWORD')
host = os.getenv('HOST')
db = "LEOCOSTA_SQLALCHEMY_ORDERBOOK_TEST"
base_url = f"mysql+pymysql://{user}:{password}@{host}"

class Base(DeclarativeBase):
    pass

class User(MappedAsDataclass, Base):
    __tablename__ = "User"
    UserID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, init=False)
    UserFullName: Mapped[str] = mapped_column(String(50), nullable=False)


class UserInfo(BaseModel):
    full_name: str


class Company(MappedAsDataclass, Base):
    __tablename__ = "Company"
    StockID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, init=False)
    CompanyName: Mapped[str] = mapped_column(String(50), nullable=False)
    AssetTicker: Mapped[str] = mapped_column(String(10), nullable=False)

class CompanyInfo(BaseModel):
    name: str
    ticker: str


class Order(MappedAsDataclass, Base):
    __tablename__ = "Order"
    OrderID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, init=False)
    UserID: Mapped[int] = mapped_column(Integer, nullable=False)
    StockID: Mapped[int] = mapped_column(Integer, nullable=False)
    IsBid: Mapped[bool] = mapped_column(Boolean, nullable=False)

class OrderInfo(BaseModel):
    user_id: int
    stock_id: int
    is_bid: bool

    
@app.get('/get_users')
def get_users():
    engine = create_engine(f'{base_url}/{db}')
    with Session(engine) as session:
        users = session.scalars(select(User)).all()
        return [{'user_id': user.UserID, 'full_name': user.UserFullName} for user in users]

@app.post('/add_user')
def add_user(payload: UserInfo) -> int:
    engine = create_engine(f'{base_url}/{db}')
    print(f'Received User Info: {payload}')
    with Session(engine) as session:
        user = User(UserFullName=payload.full_name)
        session.add(user)
        session.commit()
        return user.UserID


@app.get('/get_companies')
def get_users() -> list[dict, any]:
    engine = create_engine(f'{base_url}/{db}')
    with Session(engine) as session:
        companies = session.scalars(select(Company)).all()
        return [{'stock_id': company.StockID, 'company_name': company.CompanyName, 'asset_ticker': company.AssetTicker} for company in companies]

@app.post('/add_company')
def add_user(payload: CompanyInfo) -> int:
    engine = create_engine(f'{base_url}/{db}')
    print(f'Received Company Info: {payload}')
    with Session(engine) as session:
        company = Company(CompanyName=payload.name, AssetTicker=payload.ticker)
        session.add(company)
        session.commit()
        return company.StockID
    
    
@app.get('/get_orders')
def get_orders() -> list[dict, any]:
    engine = create_engine(f'{base_url}/{db}')
    with Session(engine) as session:
        orders = session.scalars(select(Order)).all()
        return [{'user_id': order.UserID, 'stock_id': order.StockID, 'order_id': order.OrderID, 'is_bid': order.IsBid} for order in orders]

@app.post('/add_order')
def add_order(payload: OrderInfo) -> int:
    engine = create_engine(f'{base_url}/{db}')
    print(f'Received Order Info: {payload}')
    with Session(engine) as session:
        order = Order(UserID=payload.user_id, StockID=payload.stock_id, IsBid=payload.is_bid)
        session.add(order)
        session.commit()
        return order.StockID