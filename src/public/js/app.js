const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
    console.log("Connected to Server");
});

socket.addEventListener("message", (message) => {
    console.log("Server : ", message.data);
});

socket.addEventListener("close", () => {
    console.log("finish");
});

setTimeout(() => {
    socket.send("hello from the Browser");
}, 5000);
