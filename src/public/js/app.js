const socket = io();

const nicknameDiv = document.getElementById("nickname");
const roomDiv = document.getElementById("room");
const chatDiv = document.getElementById("chat");

const roomH3 = roomDiv.querySelector("h3");
const chatH3 = chatDiv.querySelector("h3");

const roomUl = roomDiv.querySelector("ul");
const chatUl = chatDiv.querySelector("ul");

const nicknameForm = nicknameDiv.querySelector("form");
const roomForm = roomDiv.querySelector("form");
const chatForm = chatDiv.querySelector("form");

const nicknameInput = nicknameForm.querySelector("input");
const roomInput = roomForm.querySelector("input");
const chatInput = chatForm.querySelector("input");

const editNicknameBtn = nicknameDiv.querySelector("#btnEditNickname");
const saveNicknameBtn = nicknameDiv.querySelector("#btnSaveNickname");
const createRoomBtn = roomDiv.querySelector("#btnCreateRoom");
const leaveRoomBtn = chatDiv.querySelector("#btnLeaveChat");
const sendChatBtn = chatDiv.querySelector("#btnSendChat");

roomDiv.hidden = true;
chatDiv.hidden = true;
editNicknameBtn.hidden = true;

//////////////////////////////////////////////////////////////////////////////////////////////

const user = {
    nickname: "Anonymous",
    room: "",
};

//////////////////////////////////////////////////////////////////////////////////////////////

nicknameForm.addEventListener("submit", handleSaveNickname);
editNicknameBtn.addEventListener("click", handleEditNickname);
roomForm.addEventListener("submit", handleCreateRoom);
leaveRoomBtn.addEventListener("click", handleLeaveRoom);
chatForm.addEventListener("submit", handleSendChat);

//////////////////////////////////////////////////////////////////////////////////////////////

function saveNickname(nickname) {
    user.nickname = nickname;
    roomDiv.hidden = chatDiv.hidden ? false : roomDiv.hidden;
    roomH3.innerText = `Welcome, ${nickname} !`;
    nicknameInput.disabled = true;
    editNicknameBtn.hidden = false;
    saveNicknameBtn.hidden = true;
}

function createRoomList(rooms) {
    rooms.forEach(makeRoom);
}

function updateRoomList(rooms) {
    roomUl.innerHTML = "";
    rooms.forEach(makeRoom);
}

function makeRoom(room) {
    const li = document.createElement("li");
    li.innerText = room;
    const btn = document.createElement("button");
    btn.addEventListener("click", () => {
        socket.emit("enter_room", room, enterRoom);
    });
    btn.innerText = "join";
    li.appendChild(btn);
    roomUl.appendChild(li);
}

function enterRoom(room) {
    user.room = room;
    roomDiv.hidden = true;
    chatDiv.hidden = false;
    chatH3.innerText = `Room ${room}`;
    enterRoomChat(room, user.nickname);
}

function enterRoomChat(room, nickname) {
    const li = document.createElement("li");
    li.innerText = `Welcome to room ${room}, ${nickname}!`;
    chatUl.appendChild(li);
}

function leaveRoom() {
    user.room = "";
    roomDiv.hidden = false;
    chatDiv.hidden = true;
    chatUl.innerHTML = "";
    chatInput.value = "";
}

function leaveRoomChat(room, nickname) {
    const li = document.createElement("li");
    li.innerText = `${nickname} has left room ${room}.`;
    chatUl.appendChild(li);
}

function sendChat(chat, nickname) {
    const li = document.createElement("li");
    li.innerText = `${nickname} : ${chat}`;
    chatUl.appendChild(li);
}

//////////////////////////////////////////////////////////////////////////////////////////////

function handleSaveNickname(e) {
    e.preventDefault();
    const value = nicknameInput.value;
    socket.emit("save_nickname", value, saveNickname);
}

function handleEditNickname() {
    nicknameInput.disabled = false;
    editNicknameBtn.hidden = true;
    saveNicknameBtn.hidden = false;
}

function handleCreateRoom(e) {
    e.preventDefault();
    const value = roomInput.value;
    socket.emit("create_room", value);
    socket.emit("enter_room", value, enterRoom);
    roomInput.value = "";
}

function handleLeaveRoom() {
    socket.emit("leave_room", user.room, leaveRoom);
}

function handleSendChat(e) {
    e.preventDefault();
    const value = chatInput.value;
    socket.emit("send_chat", value, user.room, sendChat);
    chatInput.value = "";
}

//////////////////////////////////////////////////////////////////////////////////////////////

function handleConnect() {
    logServerEvent("connect");
}

function handleConnectError() {
    logServerEvent("connect_error");
}

//////////////////////////////////////////////////////////////////////////////////////////////

function logServerEvent(event) {
    console.log(`Server__Event : ${event}`);
}

//////////////////////////////////////////////////////////////////////////////////////////////

socket.on("connect", handleConnect);
socket.on("connect_error", handleConnectError);
socket.on("create_room_list", createRoomList);
socket.on("update_room_list", updateRoomList);
socket.on("create_room", makeRoom);
socket.on("enter_room", enterRoomChat);
socket.on("leave_room", leaveRoomChat);
socket.on("send_chat", sendChat);
