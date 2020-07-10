insert into chat_group (
    group_name,
    direct_message
) values (
    ${groupName},
    ${directMessage}
)
returning group_id;