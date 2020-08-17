insert into message_reaction (
    message_id,
    sender_id,
    reaction
) values (
    ${message_id},
    ${sender},
    ${reaction}
);