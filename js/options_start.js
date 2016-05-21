$(document).ready(function(){
        getOpt();
        var flag = document.location.href.indexOf('addBack') >= 0 ;
        flag && addBackBtn();
    }
);

function addBackBtn(){
    var $btn = $('<a href="popup.html" class="backBtn">\u041D\u0430\u0437\u0430\u0434</a>');
    $('#contentArea').append($btn);
}