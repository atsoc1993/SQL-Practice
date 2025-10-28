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
    cursorclass=pymysql.cursors.DictCursor,
    autocommit=True
)

cur = connection.cursor()

db_name = 'LEOCOSTA_PYMYSQL_ORDERBOOK_TEST'
users_table_name = 'User'

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


def use_db() -> None:
    cur.execute(
        f'USE {db_name};'
    )
    print(f'Using DB: {db_name}')
    return
    
def create_user_table() -> None:
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS `User` (
            UserID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            UserFullName VARCHAR(50) NOT NULL
        );
        """
    )
    print(f'Created User Table')
    return

def create_order_table() -> None:
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS `Order` (
            OrderID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            UserID INT NOT NULL,
            CONSTRAINT fk_orders_user_id
                FOREIGN KEY (UserID)
                    REFERENCES `User`(UserID)
                    ON DELETE RESTRICT
                    ON UPDATE CASCADE
        );
        """
    )
    print(f'Created User Table')
    return

def create_singular_user(full_name: str) -> None:
    cur.execute("INSERT INTO `User` (UserFullName) VALUES (%s)", (full_name,))
    print(f'Inserted user\'s full name into User Table')
    return 

def create_multiple_users(full_names: tuple[str]) -> None:
    cur.executemany("INSERT INTO `User` (UserFullName) VALUES (%s)", full_names)
    print(f'Inserted MULTIPLE users\' full names into User Table')
    return 

def get_all_users() -> list[dict]:
    cur.execute("SELECT * FROM `User`")
    return cur.fetchall()

def get_all_user_ids() -> list[int]:
    users = get_all_users()
    return [user['UserID'] for user in users]

def get_all_user_full_names() -> list[str]:
    users = get_all_users()
    return [user['UserFullName'] for user in users]

drop_db_if_exists()
create_db_if_not_exists()
use_db()
create_user_table()
create_order_table()


'''
User Table Mods & Getters Test
'''
test_user_1_name = "Leo Costa"
create_singular_user(full_name=test_user_1_name)

all_user_ids = get_all_user_ids()
all_user_full_names = get_all_user_full_names()
print(f'All Current User IDs: {all_user_ids}')
print(f'All Current User Full Names: {all_user_full_names}')

test_user_2_name = "Bob Doe"
test_user_3_name = "Alice Doe"
test_user_4_name = "John Doe"
create_multiple_users(
    (test_user_2_name, test_user_3_name, test_user_4_name)
)

all_user_ids = get_all_user_ids()
all_user_full_names = get_all_user_full_names()
print(f'All Current User IDs: {all_user_ids}')
print(f'All Current User Full Names: {all_user_full_names}')


'''
Order Table Mods & Getters Test
'''

def create_order_for_user(user_id: int) -> None:
    cur.execute("INSERT INTO `Order` (UserID) VALUES (%s)", (1))
    print(f'Created Order for User ID: {user_id}')
    return

def get_all_orders() -> list[dict]:
    cur.execute("SELECT * FROM `Order`")
    return cur.fetchall()

def get_all_order_ids() -> list[dict]:
    orders = get_all_orders()
    return [order['OrderID'] for order in orders]

create_order_for_user(1)
all_current_order_ids = get_all_order_ids()
print(f'All Current Order IDs: {all_current_order_ids}')
