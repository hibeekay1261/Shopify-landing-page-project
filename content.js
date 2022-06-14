// document.body.innerHTML= "Hello World";

document.createElement("div");
div.innerHTML = "";

// Send message to background script to convert file to base64 string
sendFileToBackground(file).then(response => {
  console.log(response);
  // Create a new image element and set the src to the base64 string
  const image = document.createElement('img');
  image.src = response.data;
  // Append the image to the DOM
  div.appendChild(image);
});

chrome.runtime.sendMessage(
  "Hello background page",
  (response) => {
    console.log(response, 'content')
  }
)

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message)
  console.log(sender)
  sendResponse('Thank you')	
})