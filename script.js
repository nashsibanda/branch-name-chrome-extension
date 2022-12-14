let url = "";
let prefix;
const prefixEntry = document.getElementById("prefix")

async function init() {
  const tabs = await chrome.tabs.query({active: true, lastFocusedWindow: true})
  url = tabs[0].url;
  addBranchName();
}

const branchNameDisplay = document.getElementById("branch-name")
const branchCommandDisplay = document.getElementById("branch-command")
const container = document.getElementById("container")

function addBranchName() {
  if (url.includes("trello.com/c/")) {
    container.classList.remove("hide")
    let trimmed = url.replace(/\/c\/([\d\w]*)\//, "tr-$1/").replace("http://trello.com", "").replace("https://trello.com", "").replace(/\/\d+-/i, "/")
    let withPrefix = `${prefix ? prefix : "ml"}/${trimmed}`.replace(/^(.{60}[^-]*).*/, "$1")
    branchNameDisplay.innerText = withPrefix;
    branchCommandDisplay.innerText = "git checkout -b " + withPrefix;
  } else {
    container.classList.add("hide")
  }
}

getData()

function getData() {
    chrome.storage.sync.get('prefix', function ( data ) {
        prefix = data.prefix;
        prefixEntry.value = prefix || "";
    })
}

function savePrefix() {
  prefix = prefixEntry.value.replace(/[^\da-zA-Z]/g, "");
  
  chrome.storage.sync.set( {
    prefix: prefix,
  } )
  addBranchName();
}

const doneBtn = document.getElementById("done-btn");
doneBtn.addEventListener('click', () => {
  savePrefix()
});

prefixEntry.addEventListener('input', () => {
  savePrefix()
});

const copyBtn = document.getElementById("copy-btn");
copyBtn.addEventListener('click', () => {
  copyToClipboard(branchNameDisplay.innerText)
});

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}

const copyCmdBtn = document.getElementById("copy-cmd-btn");
copyCmdBtn.addEventListener('click', () => {
  copyToClipboard()
});

function copyToClipboard() {
  navigator.clipboard.writeText(branchCommandDisplay.innerText);
}

init()
