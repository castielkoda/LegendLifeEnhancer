function setTitle(num) {
    document.title = `#${num} - ${document.title}`;
}
chrome.webRequest.onBeforeSendHeaders.addListener(
	logTrafficRequests,
	{ urls: ['<all_urls>'] },
	['requestHeaders']
  );
  
  function logTrafficRequests(details) {
	let landPingMatch = details.url.match(/https:\/\/lotm\.otherside\.xyz\/api\/trpc\/land\.ping\?input=(.+)/);
	if (landPingMatch) {
	  let num = details.requestHeaders.find(header => header.name.toLowerCase() === 'x-land-token-id').value;
	  if (!num) {
		console.error('Deed not found');
		return;
	  }
	  const tabUrl = details.url;
	  // Assuming deeds and deedTimers are defined somewhere in the scope
	  // change window title to deed number + existing title unless it's already been posted
	  if (details.tabId > 0) {
		  chrome.tabs.get(details.tabId, function(tab) {
			  if (tab.title.startsWith('#')) {
				  return;
			  }
			  chrome.scripting.executeScript({
				  target: { tabId: tab.id },
				  function: setTitle,
				  args: [num]
			  });
		  });
	  }
	}
}
