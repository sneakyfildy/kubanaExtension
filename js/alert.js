// close me when clicked
chrome.extension.sendRequest({
    "method"    : "getOptionsById",
    'optionIds'  : ["visualAlertClickCloseOn"]
}, function(res){
    !!res.visualAlertClickCloseOn && document.body.addEventListener("click", closeMe, false);
});

// calculating popup number
var num = document.location.href.substr(document.location.href.indexOf('?')).replace('?', '')

num = ( num ) ? parseInt(num) : false;

// requesting html content from bg
if ( num !== false )
    chrome.extension.sendRequest({
        "method":"getMsgNotify",
        'i'     : num
    }, function(res){
        // setup content
        if ( res.msg )
            document.getElementById("content").innerHTML = res.msg;

        if ( res.header )
            document.getElementById("header").innerHTML = res.header;

        // attach listeners to new A elements
        var links = document.getElementsByTagName('a');

        if (links.length > 0)
            for (var i in links){
                links.item(i) && links.item(i).addEventListener("click", onLinkClick, false);
            }
    });

// closing popup
function closeMe(){
    window.setTimeout(function(){
        window.close()
        }, 60);
}

// moving to url
function onLinkClick(e){
    goToLink(this.href);
    e.preventDefault();
}