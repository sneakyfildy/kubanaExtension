// front-end options engins

var ls = CommonFn.getBg();

var curOpt = ls.getOptions();

function getOpt(){
    for (var i in curOpt){
        ( curOpt[i] ) ? $("#" + i).attr("checked", true) : {};
    }
}

//options change listener
$(".chB").live("change",function(){
    var id = $(this).attr("id"),
    val = ($(this).attr("checked")) ? true : false;
    ls.setOneOption(id, val);
});