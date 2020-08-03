select mr.reaction_id, mr.reaction, m.message_id, m.message, m.sender_id, cu.username, cu.email, cu.profile_picture from message_reaction mr
full join message m on mr.message_id = m.message_id
full join chat_users cu on m.sender_id = cu.user_id
where m.group_id = ${group};