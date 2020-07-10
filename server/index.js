require('dotenv').config();
const express = require('express'),
      massive = require('massive'),
      session = require('express-session'),
      socket = require('socket.io'),
      authCtrl = require('./controllers/authController'),
      groupCtrl = require('./controllers/groupController'),
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

//Group Endpoints
app.get('/api/groups/:id', groupCtrl.getUserGroups);
app.post('/api/group', groupCtrl.createGroup);

//sockets
io.on('connection', socket => {
    console.log('user connected')
    socket.on('join room', async data => {
        const {group} = data,
              db = app.get('db');
        
        console.log("Room joined", group);

        let room = await db.groups.get_active_group({id: group});
        let messages = await db.message.message_history({group});
        socket.join(room);
        io.to(room).emit('room joined', messages);
    });
    socket.on("message sent", async data => {
        const { group, sender, message } = data,
              db = app.get("db");

        await db.message.create_message({ group, sender, message });
        let messages = await db.message.message_history({ group });
        socket.emit("message dispatched", messages);
      });
    
      socket.on("disconnect", () => {
        console.log("User Disconnected");
      });
});