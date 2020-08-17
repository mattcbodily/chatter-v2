require('dotenv').config();
const express = require('express'),
      massive = require('massive'),
      session = require('express-session'),
      socket = require('socket.io'),
      authCtrl = require('./controllers/authController'),
      userCtrl = require('./controllers/userController'),
      groupCtrl = require('./controllers/groupController'),
      messageCtrl = require('./controllers/messageController'),
      {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env,
      app = express(),
      io = socket(app.listen(SERVER_PORT, () => console.log(`Chatting on ${SERVER_PORT}`)));

app.use(express.json());
app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: SESSION_SECRET,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 365}
}));

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(db => {
    app.set('db', db);
    console.log('db connected')
});

//Auth Endpoints
app.post('/api/register', authCtrl.register);
app.post('/api/login', authCtrl.login);
app.get('/api/logout', authCtrl.logout);

//User Endpoints
app.put('/api/user/:id', userCtrl.updateUser);

//Group Endpoints
app.get('/api/groups/:id', groupCtrl.getUserGroups);
app.get('/api/users', groupCtrl.getUsers);
app.post('/api/group', groupCtrl.createGroup);
app.post('/api/user', groupCtrl.addUsers);
app.put('/api/group-name', groupCtrl.changeGroupName);
app.delete('/api/group/:id', groupCtrl.deleteGroup);

//Message Endpoints
app.get('/api/message-reaction/:id', messageCtrl.getMessageReactions);
app.put('/api/message', messageCtrl.editMessage);
app.delete('/api/message/:id/:group', messageCtrl.deleteMessage);

//sockets
io.on('connection', socket => {
    console.log('user connected')
    socket.on('join room', async data => {
        const {group} = data,
              db = app.get('db');
        
        console.log("Room joined", group);

        let room = await db.group.get_active_group({group});
        let messages = await db.message.message_history({group});
        socket.join(room);
        io.to(room).emit('room joined', messages);
    });
    socket.on("message sent", async data => {
        const {group, sender, message} = data,
              db = app.get("db");

        await db.message.create_message({group, sender, message});
        let messages = await db.message.message_history({group});
        socket.emit("message dispatched", messages);
      });
    socket.on("emoji react", async data => {
        const {message_id, reaction, sender, group} = data,
              db = app.get('db');

        await db.message.add_message_reaction({message_id, sender, reaction});
        let messages = await db.message.message_history({group});
        socket.emit('reaction added', messages)
    })
    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });
});