const joinRoom = async (roomTitle, nsId) => {
  //   console.log(roomTitle, nsId);
  const ackRes = await namespaceSockets[nsId].emitWithAck("joinRoom", {
    roomTitle,
    nsId,
  });
  console.log(ackRes);

  document.querySelector(
    ".curr-room-num-users"
  ).innerHTML = ` <span class="fa-solid fa-users"> ${ackRes.numUser}</span`;
  document.querySelector(".curr-room-text").innerHTML = roomTitle;

  document.querySelector("#messages").innerHTML = "";
  ackRes.history.forEach((message) => {
    document.querySelector("#messages").innerHTML += buildMessageHtml(message);
  });
};
