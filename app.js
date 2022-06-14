document.querySelector("#files").addEventListener("change", (e) => { //CHANGE EVENT FOR UPLOADING PHOTOS
  if (window.File && window.FileReader && window.FileList && window.Blob) { //CHECK IF FILE API IS SUPPORTED
    const files = e.target.files; //FILE LIST OBJECT CONTAINING UPLOADED FILES
    const output = document.querySelector("#result");
    output.innerHTML = "";
    for (let i = 0; i < files.length; i++) { // LOOP THROUGH THE FILE LIST OBJECT
        if (!files[i].type.match("image")) continue; // ONLY PHOTOS (SKIP CURRENT ITERATION IF NOT A PHOTO)
        const picReader = new FileReader(); // RETRIEVE DATA URI 
        picReader.addEventListener("load", function (event) { // LOAD EVENT FOR DISPLAYING PHOTOS
          const picFile = event.target;
          const div = document.createElement("div");
          div.innerHTML = `<img class="thumbnail" src="${picFile.result}" title="${picFile.name}"/>`;
          output.appendChild(div);
        });
        picReader.readAsDataURL(files[i]); //READ THE IMAGE
    }
  } else {
    alert("Your browser does not support File API");
  }
});


async function serialize(src) {
  const cls = Object.prototype.toString.call(src).slice(8, -1);
  switch (cls) {
    case 'FormData': {
      return {
        cls,
        value: await Promise.all(Array.from(src.keys(), async key => [
          key,
          await Promise.all(src.getAll(key).map(serialize)),
        ])),
      };
    }
    case 'Blob':
    case 'File':
      return new Promise(resolve => {
        const { name, type, lastModified } = src;
        const reader = new FileReader();
        reader.onload = () => resolve({
          cls, name, type, lastModified,
          value: reader.result.slice(reader.result.indexOf(',') + 1),
        });
        reader.readAsDataURL(src);
      });
    default:
      return src == null ? undefined : {
        cls: 'json',
        value: JSON.stringify(src),
      };
  }
}


// Function to send file to extension background script.
function sendFileToBackground(file) {
  const formData = new FormData();
  formData.append('file', file);
  console.log('chrome', browser);
 
  return chrome.runtime.sendMessage({
    type: 'upload',
    data: formData,
  });

}

// Function which will convert the file to base64 string.
function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const input = document.querySelector('#files');
const preview = document.querySelector('.preview');


input.style.opacity = 0;

input.addEventListener('change', sendFileToBackgroundExtension(input.files[0]));

function updateImageDisplay() {
  while(preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }

  const curFiles = input.files;
  if(curFiles.length === 0) {
    const para = document.createElement('p');
    para.textContent = 'No files currently selected for upload';
    preview.appendChild(para);
  } else {
    const list = document.createElement('ol');
    preview.appendChild(list);

    for(const file of curFiles) {
      const listItem = document.createElement('li');
      const para = document.createElement('p');
      if(validFileType(file)) {
        para.textContent = `File name ${file.name}, file size ${returnFileSize(file.size)}.`;
        const image = document.createElement('img');
        image.src = URL.createObjectURL(file);

        listItem.appendChild(image);
        listItem.appendChild(para);
      } else {
        para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`;
        listItem.appendChild(para);
      }

      list.appendChild(listItem);
    }
  }
}


const fileTypes = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/webp",
  "image/x-icon"
];

function validFileType(file) {
  return fileTypes.includes(file.type);
}


function returnFileSize(number) {
  if(number < 1024) {
    return number + 'bytes';
  } else if(number >= 1024 && number < 1048576) {
    return (number/1024).toFixed(1) + 'KB';
  } else if(number >= 1048576) {
    return (number/1048576).toFixed(1) + 'MB';
  }
}



// Send file to extension background script.
function sendFileToBackgroundExtension(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


(function() {
  var a = b = 5;
})();

console.log(b);

