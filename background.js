// onUpdated
// chrome.tabs.onUpdated.addListener((tab, event) => {
//   const files = event.target.files;
//   chrome.tabs.sendMessage(tab.id, { type: 'update' }, (response) => {
//     console.log(response);
//   });
//   console.log(files);
// }); 

chrome.tabs.onActivated.addListener((tab) => {
  // const files = event.target.files;
  // console.log(files);
  chrome.tabs.get(tab.tabId, (tab) => {
    console.log(tab)
    if(tab.url === 'http://127.0.0.1:5500/Spotify-landing-page/index.html') {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content.js'],
      });

      setTimeout(() => { 
        chrome.tabs.sendMessage(
          tab.id,
          "Hello " + tab.id,
          (response) => {
            console.log(response, 'background')
          }
          
        )
      }, 2000)
    }

   
  })
})


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message)
  console.log(sender)
  sendResponse('Hello from background page')	
})