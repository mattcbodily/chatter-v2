delete from message
where group_id = ${id};

delete from user_group_join
where group_id = ${id};

delete from chat_group
where group_id = ${id};