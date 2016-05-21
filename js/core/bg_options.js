// back-end options engine

/**
 * get all options
 */
function getOptions(){
    var options = false,
        serverOptions = {};
    
    try{
        options = JSON.parse( getItem("options") );
    }catch(e){
        options = getDefaultOptions() || {};
    }

    try{
        serverOptions = JSON.parse( getItem('server_options') );
    }catch(e){}

    options = CommonFn.apply(options, serverOptions);
    return options || getDefaultOptions();
}

/**
 * get array of options by ids
 * ids - object/array
 */
function getOptionsById( ids ){
    var options = getOptions(),
        res = {};

    for (var i in ids){
        res[ids[i]] = options[ids[i]];
    }

    return res;
}

/** 
 * set all options
 * request - object
 */
function setOptions(request){
    var options = request.options || request,
        server_options;

    try{
        server_options = JSON.parse( getItem('server_options') );
    }catch(e){
        server_options = {};
    }
    
    options = CommonFn.apply( options, server_options );
    setItem("options", JSON.stringify( options ));
    
    return options;
}

/**
 * set one option
 * oId - id of option, string
 * oVal - value, any type
 */
function setOneOption(oId, oVal){//debugger;
    var curOpts = getOptions(),
        serverOpts;
        
    curOpts[oId] = oVal;
    try{
        serverOpts = JSON.parse( getItem('server_options') );
    }catch(e){
        serverOpts = {};
    }

    curOpts = CommonFn.apply(curOpts, serverOpts);
    
    setItem("options", JSON.stringify(curOpts));
    Extension.Sub.options = curOpts;
    
    return curOpts;
    
}

/**
 * get default extension options
 * returns just static object
 */
function getDefaultOptions(){
    var options = {
        "visualAlertOn"             : true,
        "visualAlertDelayOn"        : true,
        "visualAlertClickCloseOn"   : true,
        "soundOn"                   : true,
        "smartNav"                  : false
    };
    
    return options;
}

/**
 * get and than set default options
 * like "reset"
 */
function setDefaultOptions(){
    var res = {
        options: getDefaultOptions()
    }

    setOptions(res);
    return true;
}
