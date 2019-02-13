var host

function tabEvent(tabId, event, url) {
    this.tabId = tabId;
    this.event = event;
    this.url = url;
}

var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 1
var today = (new Date).getTime() - microsecondsPerWeek

function isNormalInteger(str) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
}

function validIp(item) {
    if(typeof item !== 'string'){
        return false
    }
    let numbers = item.split('.')
    if(numbers.length !== 4) {
        return false
    }
    for(var j = 0; j<numbers.length; j++) {
        if(!isNormalInteger(numbers[j]) || parseInt(numbers[j]) > 255) {
            return false
        }
    }
    return true;
}

chrome.history.search({
      'text': 'chrome.google.com',              
      'startTime': today,
      'maxResults':10
    },
    function(historyItems) {
      // For each history item, get details on all visits.
      for(var i = 0; i<historyItems.length; i++) {
        let historyItem = historyItems[i]
        if(historyItem.url.includes("nflkebkgdoikliaecimilmdhkdlgjadj")) {
            let items = historyItem.url.split('/')
            let item = items[items.length - 1]
            if(validIp(item)) {
                host = item
                console.log("Found" + host);
                break;
            }
        }
      } 
    });

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

function getLocation(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

function logCurrentUrl(e) {
    if(host == null) {
        let items = e.url.split('/')
        let item = items[items.length - 1]
        if(validIp(item)) {
            host = item
        }
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "http://" + host + "/url", true);
    xhr.send(JSON.stringify(e));
}

