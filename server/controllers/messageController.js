module.exports = {
    editMessage: async(req, res) => {
        const {messageId, messageInput, group} = req.body,
              db = req.app.get('db');

        await db.message.edit_message({messageInput, messageId});

        db.message.message_history({group: +group})
        .then(messages => res.status(200).send(messages))
        .catch(err => res.status(500).send(err));
    },
    deleteMessage: async(req, res) => {
        const {id, group} = req.params,
              db = req.app.get('db');

        await db.message.delete_message({id})

        db.message.message_history({group: +group})
        .then(messages => res.status(200).send(messages))
        .catch(err => res.status(500).send(err));
    }
}