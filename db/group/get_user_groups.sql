select * from chat_group g
join user_group_join ug on g.group_id = ug.group_id
where ug.user_id = ${id};