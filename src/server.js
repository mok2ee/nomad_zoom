import http from "http";
import SocketIO from "socket.io";
import express from "express";
// import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

/////////////////////////////////////////////////////////////////////////////////////////////////

const port = 3000;
const handleListen = () => console.log(`Listening on http://localhost:${port}`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

/////////////////////////////////////////////////////////////////////////////////////////////////

function publicRooms() {
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

/////////////////////////////////////////////////////////////////////////////////////////////////

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anonymous";
    socket.emit("create_room_list", publicRooms());
    console.log("BrowserEvent : connect");

    socket.on("save_nickname", (nickname, callback) => {
        callback(nickname);
        const old = socket.nickname;
        socket.nickname = nickname;
        console.log(`save_nickname[${socket.id}] : [${old}] changed nickname to [${socket.nickname}]`);
    });

    socket.on("create_room", (room) => {
        wsServer.sockets.emit("create_room", room);
        console.log(`create_room[${socket.id}] : [${socket.nickname}] creates room [${room}]`);
    });

    socket.on("enter_room", (room, callback) => {
        callback(room);
        socket.join(room);
        socket.to(room).emit("enter_room", room, socket.nickname);
        console.log(`enter_room[${socket.id}] : [${socket.nickname}] joins room [${room}]`);
    });

    socket.on("leave_room", (room, callback) => {
        callback();
        socket.leave(room);
        socket.to(room).emit("leave_room", room, socket.nickname);
        wsServer.sockets.emit("update_room_list", publicRooms());
        console.log(`leave_room[${socket.id}] : [${socket.nickname}] leaves room [${room}]`);
    });

    socket.on("send_chat", (chat, room, callback) => {
        callback(chat, socket.nickname);
        socket.to(room).emit("send_chat", chat, socket.nickname);
        console.log(`send_chat[${socket.id}] : [${socket.nickname}] chat [${chat}] in room [${room}]`);
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => {
            socket.to(room).emit("leave_room", room, socket.nickname);
        });
        console.log(`disconnecting[${socket.id}] : [${socket.nickname}] disconecting...`);
    });

    socket.on("disconnect", () => {
        wsServer.sockets.emit("update_room_list", publicRooms());
        console.log(`disconnect[${socket.id}] : [${socket.nickname}] disconect`);
    });

    socket.onAny((e) => {});
});

/////////////////////////////////////////////////////////////////////////////////////////////////

httpServer.listen(port, handleListen);
