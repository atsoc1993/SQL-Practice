from sqlalchemy import (
    create_engine, 
    Integer, 
    String, 
    ForeignKey, 
    Connection,
    Engine,
    Boolean
)
from sqlalchemy.orm import(
    DeclarativeBase, 
    MappedAsDataclass, 
    Session, 
    Mapped,
    mapped_column,
)
from pydantic import BaseModel
from dotenv import load_dotenv
import os 

load_dotenv()


def drop_db_if_exists(conn: Connection, db: str) -> None:
    conn.exec_driver_sql(
        f"DROP DATABASE IF EXISTS {db};"
    )
    print(f"Dropped DB: {db}")
    return

def create_db_if_not_exists(conn: Connection, db: str) -> None:
    conn.exec_driver_sql(
        f"CREATE DATABASE IF NOT EXISTS {db};"
    )
    print(f"Created DB: {db}")
    return

class Base(DeclarativeBase):
    pass

class User(MappedAsDataclass, Base):
    __tablename__ = "User"
    UserID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, init=False)
    UserFullName: Mapped[str] = mapped_column(String(50), nullable=False)

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
    UserID: Mapped[int] = mapped_column(Integer, ForeignKey("User.UserID", onupdate="CASCADE", ondelete="RESTRICT"))
    StockID: Mapped[int] = mapped_column(Integer, ForeignKey("Company.StockID", onupdate="CASCADE", ondelete="RESTRICT"))
    IsBid: Mapped[bool] = mapped_column(Boolean)

class OrderInfo(BaseModel):
    user_id: int
    stock_id: int
    is_bid: bool

def insert_users(full_names: list[str], engine: Engine) -> list[int]:
    with Session(engine) as session:
        users = [User(UserFullName=name) for name in full_names]
        session.add_all(users)
        session.commit()
        return [u.UserID for u in users]


def insert_companies(companies: list[CompanyInfo], engine: Engine) -> list[int]:
    with Session(engine) as session:
        companies: list[Company] = [Company(CompanyName=company.name, AssetTicker=company.ticker) for company in companies]
        session.add_all(companies)
        session.commit()
        return [c.StockID for c in companies]
    
def insert_orders(orders: list[OrderInfo], engine: Engine) -> list[int]:
    orders[0].is_bid
    with Session(engine) as session:
        orders: list[Order] = [Order(StockID=order.stock_id, UserID=order.user_id, IsBid=order.is_bid) for order in orders]
        session.add_all(orders)
        session.commit()
        return [o.OrderID for o in orders]
    
user = "root"
password = os.getenv('PASSWORD')
host = os.getenv('HOST')
db = "LEOCOSTA_SQLALCHEMY_ORDERBOOK_TEST"
base_url = f"mysql+pymysql://{user}:{password}@{host}"

server_engine = create_engine(base_url, isolation_level="AUTOCOMMIT")
with server_engine.connect() as conn:
    # drop_db_if_exists(
    #     conn=conn,
    #     db=db
    # )
    create_db_if_not_exists(
        conn=conn,
        db=db
    )
    
engine = create_engine(f'{base_url}/{db}')

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

user_full_names = ["Bob Doe", "Alice Joe", "John Doe", "Jane Doe"]
generated_user_ids = insert_users(
    full_names=user_full_names,
    engine=engine
)

print(generated_user_ids)
companies_info: list[CompanyInfo] = [
    CompanyInfo(name="Test Company #1", ticker="TC1"),
    CompanyInfo(name="Test Company #2", ticker="TC2"),
    CompanyInfo(name="Test Company #3", ticker="TC3"),
    CompanyInfo(name="Test Company #4", ticker="TC4")
]

generated_company_ids = insert_companies(
    companies=companies_info,
    engine=engine
)
print(generated_company_ids)

orders_info: list[OrderInfo] = [
    OrderInfo(user_id=1, stock_id=1, is_bid=False),
    OrderInfo(user_id=2, stock_id=2, is_bid=True),
    OrderInfo(user_id=3, stock_id=3, is_bid=True),
    OrderInfo(user_id=4, stock_id=4, is_bid=False)
]

generated_order_ids = insert_orders(
    orders=orders_info,
    engine=engine
)
print(generated_order_ids)


