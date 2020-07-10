--this query adds the user to the General channel
insert into user_group_join (
    user_id,
    group_id
) values (
    ${user_id},
    5
);