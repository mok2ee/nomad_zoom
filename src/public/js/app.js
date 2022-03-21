const nickForm = document.querySelector("#nick");
const msgList = document.querySelector("ul");
const msgForm = document.querySelector("#msg");
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
    console.log("Connected to Server");
});

socket.addEventListener("message", (message) => {
    console.log("Server : ", message.data);
    const li = document.createElement("li");
    li.innerHTML = message.data;
    msgList.appendChild(li);
});

socket.addEventListener("close", () => {
    console.log("finish");
});

function handleNickSubmit(e) {
    e.preventDefault();
    const input = nickForm.querySelector("input");
    const val = {
        type: "name",
        data: input.value,
    };
    socket.send(JSON.stringify(val));
}

function handleMsgSubmit(e) {
    e.preventDefault();
    const input = msgForm.querySelector("input");
    const val = {
        type: "msg",
        data: input.value,
    };
    socket.send(JSON.stringify(val));
    input.value = "";
}

nickForm.addEventListener("submit", handleNickSubmit);
msgForm.addEventListener("submit", handleMsgSubmit);
