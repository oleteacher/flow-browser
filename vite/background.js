// This is a minimal background script for the WebUI extension
console.log("Flow Browser WebUI background script loaded");

// Listen for extension installation or update
chrome.runtime.onInstalled.addListener(() => {
  console.log("Flow Browser WebUI extension installed or updated");
});
