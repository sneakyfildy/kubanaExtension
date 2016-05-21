$(document).on('click', 'a.external', function(){
    chrome.tabs.create({
        url: $(this).attr('href')
    });
});