function tabEvent(tabId, event, url) {
    this.tabId = tabId;
    this.event = event;
    this.url = url;
}

// Event when url is entered in address textbox
chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
    tabQuery("new");  
});

// Event when actice tab is changed
chrome.tabs.onActiveChanged.addListener(function (tabId, selectInfo) {
    tabQuery("clicked");
});

// Event when chrome change focus
chrome.windows.onFocusChanged.addListener(function (windowId) {
    tabQuery("focused");
});

function tabQuery(action) {
    chrome.tabs.query({ "active": true, currentWindow: true }, function(tabs) {    
        if(tabs != null && tabs.length > 0) {
            logCurrentUrl(new tabEvent(tabs[0].id, action, tabs[0].url));

        }    
    });
}

function logCurrentUrl(e) {
    console.log(JSON.stringify(e));
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "http://100.115.92.2:8080/url", true);
    xhr.send(JSON.stringify(e));
}

