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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log("background.js: ", request);
	switch (request.type) {
		case 'rtxClick':	
		  if (request.deedId) {
			  const deedId = request.deedId.startsWith('#') ? request.deedId : '#' + request.deedId;
				chrome.tabs.query({}, function (tabs) {
					const tabToActivate = tabs.find(tab => tab.title.startsWith(deedId));
					if (tabToActivate) {
						chrome.tabs.update(tabToActivate.id, { active: true });
					}
				});
			}
		  break;
		case 'odaLoad':
			if (request.oda && request.number) {
				//console.log("oda: ", request.oda, "number: ", request.number);
				const url = `https://www.otherside-wiki.xyz/api/call_oda.php?oda=${request.oda.toLowerCase()}&id=${request.number}`;
			
				// Perform the fetch call
				fetch(url)
					.then(response => {
						if (!response.ok) {
							throw new Error(`HTTP error! status: ${response.status}`);
						}
						return response.json();
					})
					.then(data => {
						// see if data.id is the same as request.number
						if (data.id !== request.number) {
							console.error("id mismatch: ", data.id, request.number);
							console.log(url);
							return;
						}
		//				console.log("for "+request.number+" data: ", data);
						// Send data back to the content script
						sendResponse({ data: data, position: request.position });
					})
					.catch(error => {
						console.error("Error fetching data: ", error);
					});
			}
	}
    
    return true;
});
