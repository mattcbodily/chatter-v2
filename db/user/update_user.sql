update chat_users
set (username, email) = (${username}, ${email})
where user_id = ${id};

select user_id, username, email, profile_picture from chat_users
where user_id = ${id};