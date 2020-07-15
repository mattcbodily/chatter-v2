module.exports = {
    updateUser: async(req, res) => {
        const {id} = req.params,
              db = req.app.get('db');

        db.user.update_user({username: req.body.username, email: req.body.email, id: +id})
        .then(user => {
            req.session.user = user[0];
            res.status(200).send(req.session.user);
        })
        .catch(err => res.status(500).send(err));
    }
}