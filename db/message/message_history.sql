select m.message, m.sender_id, u.first_name, u.last_name, u.email from message m
join users u on m.sender_id = u.user_id
where group_id = ${group};