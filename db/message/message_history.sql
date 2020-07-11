select m.message, m.sender_id, cu.first_name, cu.last_name, cu.email from message m
join chat_users cu on m.sender_id = cu.user_id
where m.group_id = ${group};