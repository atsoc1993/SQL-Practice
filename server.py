# pip install fastapi pydantic uvicorn
# uvicorn server:app --reload to run with reload on changes

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict
from dotenv import load_dotenv
from sqlalchemy import create_engine, Integer, String, BigInteger, Boolean, select, ForeignKey, Float, and_
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
    FullName: str

class UserInfoResponse(BaseModel):
    UserID: int
    UserFullName: str

class Company(MappedAsDataclass, Base):
    __tablename__ = "Company"
    StockID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, init=False)
    CompanyName: Mapped[str] = mapped_column(String(50), nullable=False)
    AssetTicker: Mapped[str] = mapped_column(String(10), nullable=False)
    CirculatingShares: Mapped[int] = mapped_column(BigInteger, nullable=False)
    MarketCapitalization: Mapped[float] = mapped_column(BigInteger, nullable=False)

class CompanyInfo(BaseModel):
    StockID: int
    CompanyName: str
    AssetTicker: str
    CirculatingShares: int
    MarketCapitalization: float


class Order(MappedAsDataclass, Base):
    __tablename__ = "Order"
    OrderID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, init=False)
    UserID: Mapped[int] = mapped_column(Integer, ForeignKey("User.UserID", onupdate="CASCADE", ondelete="RESTRICT"))
    StockID: Mapped[int] = mapped_column(Integer, ForeignKey("Company.StockID", onupdate="CASCADE", ondelete="RESTRICT"))
    IsBid: Mapped[bool] = mapped_column(Boolean, nullable=False)
    Price: Mapped[float] = mapped_column(Float, nullable=False)

class OrderInfo(BaseModel):
    OrderID: int
    UserID: int
    StockID: int
    IsBid: bool
    Price: float

class UserOrdersRequest(BaseModel):
    UserID: int
    StockID: int
    
@app.get('/users/get_users')
def get_users() ->  list[dict]:
    engine = create_engine(f'{base_url}/{db}')
    with Session(engine) as session:
        users = session.scalars(select(User)).all()
        return [{'UserID': u.UserID, 'UserFullName': u.UserFullName} for u in users]

@app.post('/users/user_orders')
def get_users_orders(users_orders_request: UserOrdersRequest) -> list[dict]:
    engine = create_engine(f'{base_url}/{db}')
    with Session(engine) as session:
        orders = session.scalars(
            select(Order).where(
                and_(
                    Order.StockID == users_orders_request.StockID, 
                    Order.StockID == users_orders_request.UserID
                )
            )
        ).all()
        return [{'UserID': o.UserID, 'StockID': o.StockID, 'IsBid': o.IsBid, 'Price': o.Price} for o in orders]
    
@app.post('/users/add_user')
def add_user(payload: UserInfo) -> int:
    engine = create_engine(f'{base_url}/{db}')
    print(f'Received User Info: {payload}')
    with Session(engine) as session:
        user = User(UserFullName=payload.FullName)
        session.add(user)
        session.commit()
        return user.UserID


@app.get('/companies/get_companies')
def get_companies() -> list[dict]:
    engine = create_engine(f'{base_url}/{db}')
    with Session(engine) as session:
        companies = session.scalars(select(Company)).all()
        return [{'StockID': c.StockID, 'Name': c.CompanyName, 'AssetTicker': c.AssetTicker, 'CirculatingShares': c.CirculatingShares, 'MarketCapitalization': c.MarketCapitalization} for c in companies]
    

@app.post('/companies/add_company')
def add_company(payload: CompanyInfo) -> int:
    engine = create_engine(f'{base_url}/{db}')
    print(f'Received Company Info: {payload}')
    with Session(engine) as session:
        company = Company(
            CompanyName=payload.CompanyName, 
            AssetTicker=payload.AssetTicker,
            CirculatingShares=payload.CirculatingShares,
            MarketCapitalization=payload.MarketCapitalization
        )
        session.add(company)
        session.commit()
        return company.StockID
    
@app.get('/companies/get_company_by_id/{company_id}')
def get_company_by_id(company_id: int) -> list[dict]:
    engine = create_engine(f'{base_url}/{db}')
    with Session(engine) as session:
        company = session.scalar(select(Company).where(Company.StockID == company_id))
        return {'StockID': company.StockID, 'CompanyName': company.CompanyName, 'AssetTicker': company.AssetTicker, 'CirculatingShares': company.CirculatingShares, 'MarketCapitalization': company.MarketCapitalization}

    
@app.get('/orders/get_orders')
def get_orders() -> list[dict]:
    engine = create_engine(f'{base_url}/{db}')
    with Session(engine) as session:
        orders = session.scalars(select(Order)).all()
        return [{'OrderID': o.OrderID, 'UserID': o.UserID, 'StockID': o.StockID, 'IsBid': o.IsBid, 'Price': o.Price} for o in orders]
        

@app.post('/orders/add_order')
def add_order(payload: OrderInfo) -> int:
    engine = create_engine(f'{base_url}/{db}')
    print(f'Received Order Info: {payload}')
    with Session(engine) as session:
        order = Order(
            UserID=payload.UserID,
            StockID=payload.StockID,
            IsBid=payload.IsBid,
            Price=payload.Price
        )
        session.add(order)
        session.commit()
        return order.StockID