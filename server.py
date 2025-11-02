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
    model_config = ConfigDict(from_attributes=True)


class Order(MappedAsDataclass, Base):
    __tablename__ = "Order"
    OrderID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, init=False)
    UserID: Mapped[int] = mapped_column(Integer, ForeignKey("User.UserID", onupdate="CASCADE", ondelete="RESTRICT"))
    StockID: Mapped[int] = mapped_column(Integer, ForeignKey("Company.StockID", onupdate="CASCADE", ondelete="RESTRICT"))
    IsBid: Mapped[bool] = mapped_column(Boolean, nullable=False)
    Price: Mapped[float] = mapped_column(Float, nullable=False)

class OrderInfo(BaseModel):
    UserID: int
    StockID: int
    IsBid: bool
    Price: float

class UserOrdersRequest(BaseModel):
    UserID: int
    StockID: int
    
@app.get('/users/get_users', response_model=list[User])
def get_users() -> list[User]:
    engine = create_engine(f'{base_url}/{db}')
    with Session(engine) as session:
        users = session.scalars(select(User)).all()
        return users

@app.post('/users/user_orders', response_model=list[Order])
def get_users_orders(users_orders_request: UserOrdersRequest) -> list[Order]:
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
        return orders
    
@app.post('/users/add_user')
def add_user(payload: UserInfo) -> int:
    engine = create_engine(f'{base_url}/{db}')
    print(f'Received User Info: {payload}')
    with Session(engine) as session:
        user = User(UserFullName=payload.FullName)
        session.add(user)
        session.commit()
        return user.UserID


@app.get('/companies/get_companies', response_model=list[Company])
def get_companies() -> list[CompanyInfo]:
    engine = create_engine(f'{base_url}/{db}')
    with Session(engine) as session:
        companies = session.scalars(select(Company)).all()

            #Come back to this
    #     raise HTTPException(status_code=403)
    # #     return JSONResponse({
    # #         'message': str(e)
    # #     },
    # #     status_code=403
    # # )
        return companies
    

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
    
@app.get('/companies/get_company_by_id/{company_id}', response_model=Company)
def get_company_by_id(company_id: int) -> Company:
    engine = create_engine(f'{base_url}/{db}')
    with Session(engine) as session:
        company = session.scalar(select(Company).where(Company.StockID == company_id))
        return company
    
@app.get('/orders/get_orders')
def get_orders() -> list[Order]:
    engine = create_engine(f'{base_url}/{db}')
    with Session(engine) as session:
        orders = session.scalars(select(Order)).all()
        return orders
        

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