const buildMessageHtml = (data) => {
  return `
    <li>
            <div class="user-image">
              <img src="${data.avatar}" />
            </div>
            <div class="user-message">
              <div class="user-name-time">${data.username} <span>${new Date(
    data.date
  ).toDateString()}</span></div>
              <div class="message-text">${data.newMessage}</div>
            </div>
          </li>
    `;
};
