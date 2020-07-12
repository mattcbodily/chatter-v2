module.exports = {
    getUserGroups: (req, res) => {
        const {id} = req.params,
              db = req.app.get('db');

        db.group.get_user_groups({id})
        .then(groups => res.status(200).send(groups))
        .catch(err => res.status(500).send(err))
    },
    createGroup: async(req, res) => {
        const {groupName, user_id} = req.body,
              db = req.app.get('db');

        let groupId = await db.group.create_group({groupName});

        db.group.user_group_join({user_id, group_id: groupId[0].group_id});

        res.sendStatus(200);
    },
    getUsers: (req, res) => {
        const db = req.app.get('db');

        db.group.get_users()
        .then(users => res.status(200).send(users))
        .catch(err => console.log(err))
    },
    addUser: (req, res) => {
        const {user_id, group_id} = req.body,
              db = req.app.get('db');

        db.group.user_group_join({user_id, group_id})
        .then(() => res.sendStatus(200))
        .catch(err => console.log(err))
    }
}