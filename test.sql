create database if not exists leocosta_orderbook_test2;

use leocosta_orderbook_test2;

-- drop table if exists orders;
-- drop table if exists users;
-- drop table if exists global_counters;

create table if not exists global_counters (
	id tinyint primary key,
    user_id_counter bigint,
    order_id_counter bigint
);

insert ignore into global_counters (id, user_id_counter, order_id_counter) values (1, 0, 0);

create table if not exists users (
	user_id bigint primary key
);

update global_counters
set user_id_counter = last_insert_id(user_id_counter + 1)
where id = 1;
set @next_user_id := last_insert_id();
insert into users values (@next_user_id);

update global_counters
set user_id_counter = last_insert_id(user_id_counter + 1)
where id = 1;
set @next_user_id := last_insert_id();
insert into users values (@next_user_id);

create table if not exists orders (
	order_id bigint primary key not null,
	user_id bigint not null,
    constraint fk_user_id
		foreign key (user_id) references users(user_id)
        on update cascade
        on delete restrict
);

update global_counters
set order_id_counter = last_insert_id(order_id_counter + 1)
where id = 1;
set @next_order_id := last_insert_id();

insert into orders (order_id, user_id)
select @next_order_id, 1;

select order_id, user_id from orders;

