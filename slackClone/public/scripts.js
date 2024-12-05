// const username = prompt("what is your username");
// const password = prompt("what is your password");
const username = "Alvan";
const password = "x";

const clientOption = {
  query: {
    userName: username,
    password,
  },
  auth: {
    userName: username,
    password,
    jwt: "23322",
  },
};

const socket = io("http://localhost:9000", clientOption);
// const socket2 = io("http://localhost:9000/wiki");
// const socket3 = io("http://localhost:9000/mozilla");
// const socket4 = io("http://localhost:9000/linux");
const namespaceSockets = [];
const listeners = {
  nsChange: [],
  messageToRoom: [],
};

let selectedNsId = 0;
const addListener = (nsId) => {
  if (!listeners.nsChange[nsId]) {
    namespaceSockets[nsId].on("nsChange", (data) => {
      console.log("nsChangeData", data);
    });
    listeners.nsChange[nsId] = true;
  }

  if (!listeners.messageToRoom[nsId]) {
    namespaceSockets[nsId].on("messageToRoom", (data) => {
      // console.log(data);

      document.querySelector("#messages").innerHTML += buildMessageHtml(data);
    });
    listeners.messageToRoom[nsId] = true;
  }
};

socket.on("connect", () => {
  console.log("connected");
  socket.emit("clientConnect");
});

socket.on("nsList", (nsData) => {
  // console.log(nsData);
  const namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;

    //initialize thisNs at its index in the namespaceSockets
    // if the connection is new, it will be null
    // if the connection already exists, it will reconnect and remain in its spot

    // let thisNs = namespaceSockets[ns.id];
    if (!namespaceSockets[ns.id]) {
      namespaceSockets[ns.id] = io(`http://localhost:9000${ns.endpoint}`);
    }
    addListener(ns.id);
  });

  Array.from(document.getElementsByClassName("namespace")).forEach((el) => {
    el.addEventListener("click", (e) => {
      joinNs(el, nsData);
    });
  });

  joinNs(document.getElementsByClassName("namespace")[0], nsData);
});
