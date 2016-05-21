/**
 * define real extension here
 */
function subExtension( base ){
    var me = this;
    
    me.appData = {
        newsUrl                 : 'http://www.app.kubana.com/browserNews.htm',
        lineUpUrl               : 'http://www.app.kubana.com/browserLineUp.htm',
        ticketUrl               : 'http://www.bloknotus.com/extension/kubana/static/ticketinfo.php',//'http://www.kubana.com/buy.htm',
        ticketUrlSpecial        : 'http://kubana.cultserv.ru/event/details/16892?lang=RU',
        ticketUrlSpecialKubana  : 'http://www.kubana.com/online.htm',
        serverOptionsUrl        : 'http://www.bloknotus.com/extension/kubana/options/',
        twitterUrl              : 'http://www.bloknotus.com/extension/kubana/static/twitter.php',
        twitterMsgTemplate      : 'https://twitter.com/SuperStrova/status/',
        scheduleUrl             : 'http://www.bloknotus.com/extension/kubana/static/schedule.php',
		combinedUrl             : 'http://www.bloknotus.com/extension/kubana/static/combined.php',
        mainInt                 : 5, //sec
        lineupInt               : 120,
        newsInt                 : 125,
        ticketInt               : 600, // 10 min
        twitterInt              : 300, // 5 min
        daysInt                 : 10,
        notifInt                : 345,
        serverOptionsInt        : 3600, // 1 hour
		combinedInt				: 10000 // 10 sec
    };
    
    //@@version
    me.version = {
        major   : 0,
        minor   : 5,
        patch   : 0
    };
    
    me.globals = {
        days                : 24*60*60*1000
        ,defaultBadgeTitle  : _('default_badge_text')
    };
    
    me.countTimeTillKubana = function(){
        var year    = 2013,
            goal    = new Date(year, 7, 14, 10).getTime() + 240 * 60 * 1000,
            stop    = new Date(year, 7, 19, 23).getTime() + 240 * 60 * 1000,
            ct      = new Date().getTime(),
            t_start = goal - ct,
            t_stop  = stop - ct,
            title   = '';

        if ( t_start < 0 && t_stop < 0 ){
            year++;
            goal = new Date(year, 7, 14, 10);
            t_start = goal - ct;
        }
		
        if ( t_start > me.globals.days ){
            var timeGrade;
            
            t_start = parseTime( t_start );
            base.Tech.setBadge( t_start );
            t_start = parseInt( t_start );
            
            if ( t_start > 300 )
                timeGrade = 0;
            else if ( t_start > 150 )
                timeGrade = 1;
            else if ( t_start > 60 )
                timeGrade = 2;
            else if ( t_start > 30 )
                timeGrade = 3;
            else
                timeGrade = 4;
            
            title = Texts.kubana_time_grades[timeGrade] + '\n';
            title = me.checkSpecDates( title );
            title += _('default_badge_text');
            
        }else if ( t_start < me.globals.days && t_start > 0 ){
            base.Tech.setBadge( '!' );
            title = ( _('less_than_day_left') );
        }else if ( t_stop > 0 && t_start < 0 ){
            base.Tech.setBadge('!!!');
            title = _('why_you_are_here');
        }
        
        base.Tech.setBadgeTitle(title);
    };
	
    me.checkSpecDates = function( currentTitle ){
        var addTitle    = '',
            cd          = new Date(),
            day         = String( cd.getDate() ),
            month       = String( cd.getMonth() );
        
        addTitle = Texts.special_dates[month] && Texts.special_dates[month][day] || '';
        
        currentTitle += addTitle + ( ( !!addTitle ) ? '\n' : '' );
        
        return currentTitle;
        
    };
	
    me.Notifier = {
        news        : {
            notify  : function( item ){				
                me.Notifier.doNotify(
					'news'
					,{
						html: item["small-content"] + '...'
						,header: Texts.getText('news_update') + ' ' + item.date
					}
					,item.link
				);
            }
        },
        lineup        : {
            notify  : function( item ){                
				me.Notifier.doNotify(
					'lineup'
					,{
						html	: item.name
						,header	: Texts.getText('lineup_update')
					}
					,item.link
				);
            }
        },
        twit        : {
            notify  : function( item ){
                me.Notifier.doNotify(
					'twit'
					,{
						html: item.text
						,header: Texts.getText('twit_update_caption') + ' ' + item.date
					}
					,item.link
				);
            }
        }
        ,doNotify    : function( type, msg, link ){
			if ( base.isChromeNotif() ){
				var chromeLink = link || msg.link;
				
				msg.html = msg.html.replace('&laquo;', '"').replace('&raquo;', '"').replace('&nbsp;', ' ');
				msg.header = msg.header.replace('&laquo;', '"').replace('&raquo;', '"').replace('&nbsp;', ' ');

				var opt = {
					type    : "basic",
					title   : msg.header,
					message : msg.html,
					iconUrl : "/icon128.png",
					buttons : [
						{
							title       : Texts.getText('watch')
							,iconUrl    : '/img/kubana.ico'
						}
					]
				};

				chrome.notifications.create('', opt, function(id){
					me.notifShown = me.notifShown || {};
					me.notifShown[id] = chromeLink;
				});
			}
            
            
        }
    };
	
    me.initTickers = function(){
        me.Tickers = {
            newsTicker  : new SubTicker({
                fn          : base.Ticker.ajaxTickByTime,
                params      : [me.appData.newsUrl, null, me.storeNews, 'news_ts', me.appData.newsInt],
                runScope    : base
            }),
            lineupTicker  : new SubTicker({
                fn          : base.Ticker.ajaxTickByTime,
                params      : [me.appData.lineUpUrl, null, me.storeLineUp, 'lineup_ts', me.appData.lineupInt],
                runScope    : base
            }),
            ticketTicker  : new SubTicker({
                fn          : base.Ticker.ajaxTickByTime,
                params      : [me.appData.ticketUrl, null, me.storeTicket, 'ticket_ts', me.appData.ticketInt],
                runScope    : base
            }),
            daysTicker  : new SubTicker({
                fn          : base.Ticker.tickByTime,
                params      : [me.countTimeTillKubana, 'days', me.appData.daysInt],
                runScope    : base
            }),
            serverOptionsTicker: new SubTicker({
                fn          : base.Ticker.ajaxTickByTime,
                params      : [me.appData.serverOptionsUrl, null, base.storeServerOptions, 'server_options_ts', me.appData.serverOptionsInt],
                runScope    : base
            }),
            twitterTicker: new SubTicker({
                fn          : base.Ticker.ajaxTickByTime,
                params      : [me.appData.twitterUrl, null, me.storeTwitter, 'twitter_ts', me.appData.twitterInt],
                runScope    : base
            })/*,
            notifTicker: new SubTicker({
                fn          : base.Ticker.tickByTime,
                params      : [me.purgeNotif, 'notif_ts', me.appData.notifInt],
                runScope    : me
            })*/
        };
        
		if ( chrome.notifications ){
			chrome.notifications.onButtonClicked.addListener(function(id, index){
				var url = me.notifShown[id];
				delete me.notifShown[id];
				goToLink(url, true);            
			});
			
			chrome.notifications.onClosed.addListener(function(id){
				delete me.notifShown[id];
			});
		}
    };
	
   this.purgeNotif = function(){
       me.notifShown = me.notifShown || {};
       var opt = {
            type    : "basic",
            title   : 'Purge test title',
            message : 'Purge test message',
            iconUrl : "/icon128.png"
        };
        
       for (var id in me.notifShown){
           chrome.notifications.update(id, opt, function(wasUpdated){            
           });
       }
   };
   
   this.storeNews = function( news ){
        var newsCount
			,newsNew
			,newsOld
			,lastDate;

        try{
            newsNew = JSON.parse(news);
            newsNew = newsNew.news;
            newsCount = newsNew.length;
            lastDate = newsNew[0].date;
            newsNew = JSON.stringify(newsNew);
        }catch(e){
            console.log('Error JSON in storeNews' + e);
            return;
        }

        if ( newsCount > 0 ){
                newsOld = getItem('news_str');
				
                if ( newsOld !== newsNew ){
                    me.checkNews(newsOld, newsNew);
				}
                
                news = null;
                newsOld = null;

            setItem("news_str", newsNew);
            setItem("news_count", newsCount);
            newsNew = null;
        }
		
        if (lastDate){
            setItem("news_last_date", lastDate);
		}
    };
	
	this.checkNews = function(newsOld, newsNew){
        var falseCount,
            veryNew = [];
	
        try{
            newsOld = JSON.parse(newsOld) || [];
            newsNew = JSON.parse(newsNew) || [];
        }catch(e){
            base.Tech.errorAlert(e, 'checkNews');
        }
		
        for ( var i in newsNew ){
            falseCount = 0;
            for (var j in newsOld){
                if ( newsNew[i].link === newsOld[j].link){
                    falseCount++;
				}
            }

            if ( falseCount === 0 ){
                veryNew.push( newsNew[i] );
			}
        }

        veryNew.length > 0 && veryNew.length < 5 && me.alertChange(veryNew, 'news');
    };
	
    this.storeLineUp = function( lineup_new ){
        lineup_new = me.sortArtist(lineup_new);

        if ( !lineup_new )
            return;

        var lineup_old_count = getItem( 'lineup_count' );
		
		// TODO refactor condition, Will not trigger correct
		if ( lineup_old_count && parseInt( lineup_new.count, 10 ) !== parseInt( lineup_old_count, 10 )){
			var lineup_old = getItem( 'lineup_str' );

			try{
				me.checkLineup( lineup_old, lineup_new.arr );
			}catch(e){
				base.Tech.errorAlert(e, 'lineup storing');
			}
		}

        setItem("lineup_str", lineup_new.arr);
        setItem("lineup_count", lineup_new.count);
        lineup_new = null;
        lineup_old = null;
    };
	
	// TODO refactor camel
	this.checkLineup = function(old_n, new_n){
        var false_count,
            very_new = [];
        try{
            old_n = JSON.parse(old_n) || [];
            new_n = JSON.parse(new_n) || [];
        }catch(e){
            console.log('Cannot parse news in checkLineup. ', e);
        }
        
		// debug
		//old_n[1].link = 'http://ya.ru';
		
        for ( var i in new_n ){
            false_count = 0;
            for (var j in old_n){
                if ( new_n[i].link === old_n[j].link)
                    false_count++;
            }

            if ( false_count === 0 )
                very_new.push( new_n[i] );
        }

        very_new.length > 0 && very_new.length < 10 && me.alertChange(very_new, 'lineup');
    };
	
    this.storeTicket = function(ticket_html){
        var $html,
            $res;

        try{
            $html = $(ticket_html);
        }catch(e){
			base.Tech.errorAlert(e, 'storeTicket');
		}

        var $text_ticket = $('<div class="ticket_wrap"></div>');

        $html.each(function(){
            ( $(this).html() !== null ) && $text_ticket.append( '<p>{0}</p>'.format( $(this).html() ) );
        });
		
        $text_ticket = $('<div><span class="spoiler_simple">{0}</span><div class="spoiler_content_simple">{1}</div></div>'.format(Texts.ticket_cat, $text_ticket.html()));
		
        $text_ticket.prepend('<div><a href="http://www.kubana.com/online.htm" title="{0}">{1}</a></div>'.format( Extension.Sub.appData.ticketUrlSpecialKubana, Texts.ticket_buy_online ) );
        $text_ticket.prepend('<div><a href="http://www.kubana.com/buy.htm" title="http://www.kubana.com/buy.htm">{0}</a></div>'.format( Texts.ticket_official ) );

        $text_ticket.prepend('<h2>{0}</h2>'.format( Texts.ticket_caption ) );

        setItem('ticket_str', $text_ticket.html());
		
		me.addSchedule($text_ticket);
		/*
        $.ajax({
            url         : me.appData.ticketUrlSpecial,
            type        : "GET",
            timeout     : 30000,
            contentType : 'application/json; charset=utf-8',
            dataType    : 'html',
            success     : function (response) {
                me.addTicketTable(response);
            },
            context     : me,
            error       : base.Tech.errorAlert
        });
		*/
    };

    this.storeTwitter = function(data){
        var twitsNew
        ,twitsNewStr
        ,twitsOldStr
        ,lastDate;

        twitsNew = me.trimTwits(data);
        twitsNewStr = JSON.stringify(twitsNew);
        
        if ( twitsNew.length > 0 ){
            twitsOldStr = getItem('twitter_str') || '[]';

            if ( twitsOldStr !== twitsNewStr )
                me.checkTwits(twitsOldStr, twitsNew);

            twitsOldStr = null;
            setItem("twitter_str", twitsNewStr);
            twitsNewStr = null;

            setItem("last_twit_id", twitsNew[0].id);
        }
    };
	
	this.checkTwits = function(twitsOldStr, twitsNew){
        var falseCount,
            twitsOld,
            veryNew = [];
	
        try{
            twitsOld = JSON.parse(twitsOldStr) || [];
        }catch(e){
            console.log('Cannot parse twits in checktwits. ', e);
        }
		
        for ( var i = 0, l1 = twitsNew.length; i < l1; i++ ){
            falseCount = 0;
            for ( var j = 0, l2 = twitsOld.length; j < l2; j++ ){
                if ( twitsNew[i].id === twitsOld[j].id )
                    falseCount++;
            }

            if ( twitsOld[0] && falseCount === 0 && twitsNew[i].id > twitsOld[0].id)
                veryNew.push( twitsNew[i] );
        }

        veryNew.length > 0 && veryNew.length < 10 && me.alertChange(veryNew, 'twit');
    };

    me.alertChange = function( changes, type ){
        me.options && me.options.soundOn && base.Tech.playSoundById('inboxSound');
        if ( me.options && me.options.visualAlertOn && CommonFn.isChrome() )
            for (var i in changes){
                me.Notifier[type].notify( changes[i] );
            }
    };

    me.addTicketTable = function(resp){
        var $ticket;

        var $temp = $(resp);
        $temp = $temp.find('.central_main_table');
        $ticket = $('<div>' + getItem('ticket_str') + '</div>');
        $temp.find('a').attr('href', me.appData.ticketUrlSpecialKubana);
        $temp.find('a').attr('title', Texts.getText('ticket_official_full'));

        $ticket.append($temp);

        me.addSchedule( $ticket );
    };

    me.addSchedule  = function($html){
        $html.append('<h2>{0}</h2>'.format( Texts.schedule_caption ) );
        me.$ticketHtml = $html;

        $.ajax({
            url         : me.appData.scheduleUrl,
            type        : "GET",
            timeout     : 30000,
            contentType : 'application/json; charset=utf-8',
            dataType    : 'html',
            success     : function (response) {
                $html.append('<div>{0}</div>'.format( response ) );
                setItem('ticket_str', me.$ticketHtml.html());
            },
            context     : me,
            error       : function(){
                setItem('ticket_str', me.$ticketHtml.html());
                base.Tech.errorAlert();
            }
        });
        
        //$html.append('<p>{0}</p>'.format( Texts.no_schedule ) );

        //setItem('ticket_str', $html.html());
    };

    me.sortArtist = function( arg ){
        var obj
        ,arr = []
        ,tempW
        ,tempO
        ,j;
        try{
            obj = JSON.parse( arg ).artist;
        }catch(e){
            console.log(e);
            return false;
        }

        arr = CommonFn.objToArr(obj);

        for (var i = 1, l = arr.length; i < l; i++){
            tempW = arr[i].name[0];
            tempO = arr[i];
            j = i - 1;
            while ( tempW < arr[j].name[0] ){
                arr[j + 1] = arr[j];
                j--;
                if ( j < 0 )
                    break;
            }
            arr[j + 1] = tempO;
        }

        var count = arr.length;
        //arr[2].link = 'artist ololo link'; //debugging
        try{
            arr = JSON.stringify(arr);
        }catch(e){
            console.log(e);
            return false;
        }

        return {
            count   : count,
            arr     : arr
        };

    };

    me.trimTwits = function(data){
        var raw, clean = [], date, month, hours, mins, days;

        try{
            raw = JSON.parse(data);
        }catch(e){
            alertError(e);
            return false;
        }

        for (var i = 0, l = raw.length; i < l; i++){
            date = new Date(raw[i].created_at);

            days = twoDigitMe( date.getDate() );
            month = twoDigitMe( date.getMonth() + 1 );
            hours = twoDigitMe( date.getHours() );
            mins = twoDigitMe( date.getMinutes() );

            date = '{0}.{1}.{2} {3}:{4}'.format( days.d1 + days.d2, month.d1 + '' + month.d2, date.getFullYear(), hours.d1 + '' + hours.d2, mins.d1 + '' + mins.d2 );
            clean.push(
                {
                    id                  : raw[i].id,
                    reply_msg_id_str    : raw[i].in_reply_to_status_id_str,
                    reply_user_id_str   : raw[i].in_reply_to_screen_name,
                    date                : date,
                    text                : raw[i].text,
                    link                : me.appData.twitterMsgTemplate + raw[i].id_str
                }
            );
        }
        //clean[0].id = '11';
        return clean;
    };
	
	this.clearOnUpdate = function(){
		var clearItems		= ['twitter_ts', 'ticket_ts', 'lineup_ts', 'server_options_ts', 'news_ts'];
		
		for ( var i = 0; i < clearItems.length; i++ ){
			setItem( clearItems[i], 0 );
		}
	};
	
    me.initTickers();
}




function parseTime(ts){
    var d = Math.floor( ts / Extension.Sub.globals.days );
    return d;
}

function threeDigitMe( n ){
    return {
        d1 : String( Math.floor( n / 100 ) % 10 ),
        d2 : String( Math.floor( n / 10 ) % 10 ),
        d3: String ( n % 10 )
    };
}

function twoDigitMe( n ){
    return {d1 : String( Math.floor( n / 10 ) % 10 ), d2: String ( n % 10 )};
}