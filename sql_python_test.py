# pip install PyMySQL
# pip install SQLAlchemy
import pymysql.cursors
from dotenv import load_dotenv
import os

load_dotenv()

host = os.getenv('HOST')
password = os.getenv('PASSWORD')

connection = pymysql.connect(
    host=host,
    user='root',
    password=password,
    cursorclass=pymysql.cursors.DictCursor
)

cur = connection.cursor()

db_name = 'LEOCOSTA_PYMYSQL_ORDERBOOK_TEST'
users_table_name = 'Users'

def drop_db_if_exists() -> None:
    cur.execute(
        f"DROP DATABASE IF EXISTS {db_name};"
    )
    print(f"Dropped DB: {db_name}")
    return

def create_db_if_not_exists() -> None:
    cur.execute(
        f"CREATE DATABASE IF NOT EXISTS {db_name};"
    )
    print(f"Created DB: {db_name}")
    return


def use_db() -> str:
    cur.execute(
        f'USE {db_name};'
    )
    print(f'Using DB: {db_name}')
    return
    
def create_user_table() -> str:
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS Users (
            UserID INT NOT NULL PRIMARY KEY AUTO_INCREMENT
        );
        """
    )
    print(f'Created User Table')
    return

drop_db_if_exists()
create_db_if_not_exists()
use_db()
create_user_table()

