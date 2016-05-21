var isBackground = true;
/**
 * Main extension object
 */
function _Extension(){
    var me = this;
    me.msgToShow = [];
    
    me.init             =  function(){
        me.Sub.options = getOptions();
        me.initListeners();
        window.setTimeout(me.startUpdate, 0);
    }

    me.startUpdate      = function(){
        for ( var i in me.Sub.Tickers ){
            me.Sub.Tickers[i].run();
        }

        me.scheduleRequest();
    }

    me.scheduleRequest  = function(){
        window.setTimeout(me.startUpdate, 1000 * me.Sub.appData.mainInt);
    }
    me.appData  = {
        debug   : true
    };

    /**
     * listeners initialisation
     */
    me.initListeners    = function(){
        if ( CommonFn.isChrome() ){
            me.addChromeListeners();
		}
    };

    me.Tech = {
        /**
         *play hardcoded sound
         */
        playInboxSound  : function(){
            var sound = document.getElementById( "inboxSound" );
            sound && sound.play();
        },
        /**
         * play sound by its id, see background.html
         */
        playSoundById  : function( id ){
            var sound = document.getElementById( id );
            sound && sound.play();
        },
        /**
         * alert error to console with possible custom text
         */
        errorAlert     : function(e, custom_text){
            var txt = e.errorText || e.responseText || e.statusText
				,type;

            if ( me.appData.debug )
                console.log(["Error, text: " + txt, e, 'Custom: ' + custom_text]);

        /*if ( e.status && e.status == 401 )
                type = 'not_logged';
            else
                type = 'connection_error';

            me.Tech.setBadge( type );*/
        },
        /**
         * set extension badge text
         */
        setBadge       : function( badgeText ){
            var text = badgeText || '';

            if ( CommonFn.isChrome() ){
                chrome.browserAction.setBadgeText({
                    text : String(text)
                });

                chrome.browserAction.setBadgeBackgroundColor({
                    color: [150, 0, 0, 255]
                });
            }else if ( CommonFn.isOpera() ){
                Extension.opera.badge.badge.textContent = text;
            }
        },
        setBadgeTitle       : function( text ){
            text = text || '';
            
            if ( CommonFn.isChrome() )
                chrome.browserAction.setTitle({
                    title : text
                });
            else if ( CommonFn.isOpera() )
                Extension.opera.badge.title = text;

        }
    };

    me.Ticker = {
        /**
         * base ticker stuff
         */
        ajaxTick            : function( url, params, callback ){
            $.ajax({
                url         : url,
                type        : "GET",
                data        : params,
                timeout     : 30000,
                contentType : 'application/json; charset=utf-8',
                dataType    : 'html',
                context     : me,
                success     : function (response) {
                    response && callback && callback(response);
                },
                error       : me.Tech.errorAlert
            });
        },

        /**
         * complex ajax ticker, calls base ticker if time is good
         */
        ajaxTickByTime    : function( url, params, callback, type, interval ){
            var lastTime = getItem(type);

            if ( !lastTime ) {
                var lastTickTime = new Date().getTime();

                setItem(type, lastTickTime);
                me.Ticker.ajaxTick(url, params, callback);
            }else{
                var nowTime = new Date().getTime(),
                diff;
                try{
                    diff = (parseInt( nowTime ) - parseInt( lastTime )) / 1000;
                }catch(e){
                    diff = -1;
                }

                if (diff >= interval || diff < 0) {
                    me.Ticker.ajaxTick(url, params, callback);
                    setItem(type, nowTime);
                }
            }
        },

        /**
         * calls custom callback by time supplied
         */
        tickByTime    : function( fn, type, interval ){
            var lastTime = getItem(type);

            if ( !lastTime ) {
                var lastTickTime = new Date().getTime();

                setItem(type, lastTickTime);
                setTimeout(fn, interval);
            }else{
                var nowTime = new Date().getTime(),
                diff;
                try{
                    diff = (parseInt( nowTime ) - parseInt( lastTime )) / 1000;
                }catch(e){
                    diff = -1;
                }

                if (diff >= interval || diff < 0) {
                    setTimeout(function(){
                        fn.call()
                    }, interval);
                    setItem(type, nowTime);
                }
            }
        }
    };

    me.storeServerOptions   = function(resp){
        var curOpts = getOptions() || {};

        try{
            var newOpts = resp && resp.length > 0 && JSON.parse(resp) || {};
        }catch(e){
            return true;
        }

        curOpts = CommonFn.apply(curOpts, newOpts);

        setItem( 'options', JSON.stringify(curOpts) );
        setItem( 'server_options', JSON.stringify(newOpts) );
		
        //me.checkVersion();
    };

    me.checkVersion         = function(){
		var storedVersion = getItem('clientVersion') || 0;
		storedVersion = parseInt(storedVersion, 10);
		
		if ( me.currentVersion ){
			if ( storedVersion < me.currentVersion ){
				me.Sub.clearOnUpdate();
			}
		}
		
		setItem('clientVersion', me.currentVersion);
	};

//@@TODO collapse listeners
    me.addChromeListeners   = function(){
        chrome.extension.onRequest.addListener(
            function(request, sender, sendResponse) {
                var resp;
                switch ( request.method ){
                    case  "getOptions"  :
                        resp = getOptions();
                        sendResponse(resp);
                        break;
                    case  "setOptions"  :
                        setOptions(request.options);
                        break;
                    case "getOptionsById"   :
                        var res = getOptionsById( request.optionIds );
                        sendResponse( res );
                        break;
                    case "updateBgOptions"  :
                        me.Sub.options = getOptions();
                        sendResponse();
                        break;
                    case "setOption"        :
                        setOneOption(request.id, request.val);
                        sendResponse();
                    case "playSound"        :
                        switch(request.type){
                            case 'chat' :
                                var reqId   = request.id,
                                lsId        = getItem('lastPersonalMsgId');
						
                                if (reqId !== lsId){
									me.Tech.playInboxSound();
								}
                        }
						
                        break;
                }
                
            });
    };
	
	this.isChromeNotif = function(){		
		return !!(window.chrome && window.chrome.notifications);
	};
	
    me.Sub = new subExtension( me );
}


function SubTicker( args ){
    var me = this;

    me.run = function() {
        args.fn.apply( args.runScope || this, args.params );
    }

    me.isDisabled =  function(){
        return false;
    }
}

function setItem(key, value) {
    try {
        window.localStorage.removeItem(key);
        window.localStorage.setItem(key, value);
    }catch(e) {
        log("Error inside setItem");
        log(e);
    }
}
function getItem(key) {
    var value;
    try {
        value = window.localStorage.getItem(key);
    }catch(e) {
        log("Error inside getItem() for key:" + key);
        value = "null";
    }
    return value;
}