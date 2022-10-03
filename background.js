let json = null;

chrome.runtime.onInstalled.addListener(() => {
  fetch(
    `https://raw.githubusercontent.com/1714080902120/resources-library/main/map.json`
  )
    .then((res) => res.json())
    .then(async (res) => {
      json = res;
      chrome.storage.sync.set({ json })
      await outputLog();
    });
});

async function outputLog() {
  const img = await selectImg();
  await renderLog(img);
}

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
