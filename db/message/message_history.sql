select m.message_id, m.message, m.sender_id, cu.username, cu.email from message m
join chat_users cu on m.sender_id = cu.user_id
where m.group_id = ${group};