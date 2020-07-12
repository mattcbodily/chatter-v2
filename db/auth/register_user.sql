insert into chat_users (
    username,
    email,
    password,
    profile_picture
) values (
    ${username},
    ${email},
    ${hash},
    ${profilePicture}
)
returning user_id, username, email;