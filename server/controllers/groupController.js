module.exports = {
    getUserGroups: (req, res) => {
        const {id} = req.params,
              db = req.app.get('db');

        db.group.get_user_groups({id})
        .then(groups => res.status(200).send(groups))
        .catch(err => res.status(500).send(err))
    },
    createGroup: async(req, res) => {
        const {groupName, user_id, userArr} = req.body,
              db = req.app.get('db');

        let groupId = await db.group.create_group({groupName});

        //add creating user
        db.group.user_group_join({user_id, group_id: groupId[0].group_id});

        userArr.forEach(user => {
            db.group.user_group_join({user_id: user.user_id, group_id: groupId[0].group_id})
        })

        res.sendStatus(200);
    },
    changeGroupName: (req, res) => {
        const {groupName, group_id} = req.body,
              db = req.app.get('db');

        db.group.change_group_name({groupName, group_id})
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err))
    },
    deleteGroup: (req, res) => {
        const {id} = req.params,
              db = req.app.get('db');

        db.group.delete_group({id: +id})
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
    },
    getUsers: (req, res) => {
        const db = req.app.get('db');

        db.group.get_users()
        .then(users => res.status(200).send(users))
        .catch(err => console.log(err))
    },
    addUsers: (req, res) => {
        const {userArr, group_id} = req.body,
              db = req.app.get('db');

        //add the invited users
        userArr.forEach(async user => {
            const foundUser = await db.group.check_group_users({user_id: user.user_id, group_id});
            if(!foundUser[0]){
                db.group.user_group_join({user_id: user.user_id, group_id})
            }
        })

        res.sendStatus(200);
    }
}