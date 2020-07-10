create table if not exists chat_users (
    user_id serial primary key,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    email varchar(250) not null,
    password varchar(250) not null
);

create table if not exists chat_group (
    group_id serial primary key,
    group_name varchar(30),
    direct_message boolean
);

create table if not exists user_group_join (
    join_id serial primary key,
    user_id int references chat_users(user_id),
    group_id int references chat_group(group_id)
);

create table if not exists message (
    message_id serial primary key,
    group_id int references chat_group(group_id),
    sender_id int references chat_users,
    message text
);