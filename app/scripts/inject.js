chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getUsr') {
      const regex = /"username":"([^"]+)"/;
      const match = document.body.innerHTML.match(regex);
      const user = match && match[1];
      sendResponse({ usr: user });
    }
});
 