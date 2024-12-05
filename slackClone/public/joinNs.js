const joinNs = (el, nsData) => {
  const nsEndpoint = el.getAttribute("ns");
  // console.log(nsEndpoint);
  const clickedNs = nsData.find((row) => row.endpoint === nsEndpoint);
  rooms = clickedNs.rooms;
  selectedNsId = clickedNs.id;

  document.querySelector("#message-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const newMessage = document.querySelector("#user-message").value;
    namespaceSockets[selectedNsId].emit("newMessageToRoom", {
      newMessage,
      date: Date.now(),
      avatar: "https://via.placeholder.com/30",
      username,
      selectedNsId,
    });
    document.querySelector("#user-message").value = "";
  });
  let roomList = document.querySelector(".room-list");

  roomList.innerHTML = "";
  let firstRoom;
  console.log(rooms);
  rooms.forEach((room, id) => {
    if (id === 0) {
      firstRoom = room.roomTitle;
    }
    roomList.innerHTML += `<li class='room' namespaceId='${
      room.namespaceId
    }'><span class="fa-solid fa-${
      room.privateRoom ? "lock" : "globe"
    }"></span>${room.roomTitle}</li>`;
  });
  joinRoom(firstRoom, clickedNs.id);

  const roomNodes = document.querySelectorAll(".room");
  Array.from(roomNodes).forEach((el) => {
    el.addEventListener("click", (e) => {
      const nsId = el.getAttribute("namespaceId");
      joinRoom(e.target.innerText, nsId);
    });
  });
};
