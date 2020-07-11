insert into chat_group (
    group_name,
    direct_message
) values (
    ${groupName},
    false
)
returning group_id;