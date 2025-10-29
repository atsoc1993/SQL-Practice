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

def create_company_table() -> None:
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS `Company` (
                StockID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                CompanyName VARCHAR(50) NOT NULL,
                AssetTicker VARCHAR(10) NOT NULL
            );
            """
        )
        print(f'Created Company Table')

def create_order_table() -> None:
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS `Order` (
            OrderID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            UserID INT NOT NULL,
            StockID INT NOT NULL,
            CONSTRAINT fk_order_user_ids
                FOREIGN KEY (UserID)
                    REFERENCES `User`(UserID)
                    ON DELETE RESTRICT
                    ON UPDATE CASCADE,
            CONSTRAINT fk_order_stock_ids
                FOREIGN KEY (StockID)
                    REFERENCES `Company`(StockID)
                    ON DELETE RESTRICT
                    ON UPDATE CASCADE
        );
        """
    )
    print(f'Created Order Table')
    return

def alter_order_table_to_include_bids_and_ask_type() -> None:
    cur.execute(
        """
        ALTER TABLE `Order`
            ADD COLUMN `Side` TINYINT(1) NOT NULL DEFAULT 1,
            ADD CONSTRAINT valid_bid_type CHECK (`Side` IN (0, 1));
        """
    )
    print(f'Added Bids & Asks to Order Table')


'''
General Table Creation & Alteration
'''
drop_db_if_exists()
create_db_if_not_exists()
use_db()
create_user_table()
create_company_table()
create_order_table()
alter_order_table_to_include_bids_and_ask_type()


'''
User Table Mods & Getters Test
'''
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
Company Table Mods & Getters Test
'''
def create_singular_company(company_name: str, asset_ticker: str) -> None:
    cur.execute("INSERT INTO `Company` (CompanyName,AssetTicker) VALUES (%s, %s)", (company_name, asset_ticker))
    print(f'Inserted company\'s name & ticker into Company Table')
    return 

def create_multiple_companies(companies_info: list[tuple[str,str]]) -> None:
    cur.executemany("INSERT INTO `Company` (CompanyName,AssetTicker) VALUES (%s, %s)", (companies_info))
    print(f'Inserted MULTIPLE companies\' names & tickes into Company Table')
    return 

def get_all_companies() -> list[dict]:
    cur.execute("SELECT * FROM `Company`")
    return cur.fetchall()

test_company_1_details = ("Test Company #1", 'TC1')
create_singular_company(test_company_1_details[0], test_company_1_details[1])

test_company_2_details = ("Test Company #2", 'TC2')
test_company_3_details = ("Test Company #3", 'TC3')
test_company_4_details = ("Test Company #4", 'TC4')
create_multiple_companies(
    (test_company_2_details, test_company_3_details, test_company_4_details)
)

all_companies = get_all_companies()
print(f'All Companies: {all_companies}')

'''
Order Table Mods & Getters Test
'''

mini_side_hashmap = {
    'Bid': 0,
    'Ask': 1,
}

mini_reverse_side_hashmap = {
    0: 'Bid',
    1: 'Ask'
}

def create_order_for_user(user_id: int, stock_id: int, bid_or_ask: str) -> None:
    cur.execute("INSERT INTO `Order` (UserID, StockID, `Side`) VALUES (%s, %s, %s)", (user_id, stock_id, mini_side_hashmap[bid_or_ask]))
    print(f'Created {mini_reverse_side_hashmap[mini_side_hashmap[bid_or_ask]]} Order of Stock ID: {stock_id} for User ID: {user_id}')
    return

def get_all_orders() -> list[dict]:
    cur.execute("SELECT * FROM `Order`")
    return cur.fetchall()

def get_all_order_ids() -> list[dict]:
    orders = get_all_orders()
    return [order['OrderID'] for order in orders]

create_order_for_user(1, 1, 'Bid')
create_order_for_user(2, 1, 'Ask')
create_order_for_user(3, 2, 'Bid')
all_current_orders = get_all_orders()
print(f'All Current Orders: {all_current_orders}')

# all_current_order_ids = get_all_order_ids()
# print(f'All Current Order IDs: {all_current_order_ids}')
