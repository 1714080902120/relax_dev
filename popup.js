let loadImg = document.getElementById("loadImg");

// When the button is clicked, inject logMoreImg into current page
loadImg.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: outputLog,
  });
});

// The body of this function will be execuetd as a content script inside the
// current page

async function outputLog() {
  chrome.storage.sync.get("json", async ({ json }) => {
    const img = await selectImg(json);
    await renderLog(img);

    function selectImg() {
      const typesList = Object.keys(json);
      const type = typesList[getRandomIndex(typesList.length)];
      const targetObj = json[type];
      const keysList = Object.keys(targetObj);
      const randomKey = keysList[getRandomIndex(keysList.length)];
      const target = targetObj[randomKey];

      return fetch(
        `https://raw.githubusercontent.com/1714080902120/resources-library/main/${type}/${target}`
      ).then((res) => res.blob());
    }

    function renderLog(res) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(res);
      fileReader.onload = function () {
        const imgBase64 = fileReader.result;
        console.log(
          "%c ",
          `
          background-image: url(${imgBase64});
          padding-top: 500px;
          padding-left: 1000px; 
          background-size: contain;
          background-position: center center;
          background-repeat: no-repeat;
        `
        );
      };
    }

    function getRandomIndex(num) {
      const { floor, random } = Math;
      return floor(random() * num);
    }
  });
}
