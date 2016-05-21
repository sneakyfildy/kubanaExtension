var templator = new Templator();

var map = {
    lineup : {
        index   : 1
        ,getStr : function(obj){
            var artistName			= obj.name
                ,artistCountry		= ''
				,$artistLine
				,photo				= {};
            
			// check country for existance
            if ( artistName.indexOf('(') >= 0 && artistName.indexOf(')') >= 0 ){
                artistCountry = artistName.slice( artistName.indexOf('(') );
                artistName = artistName.substring( 0, artistName.indexOf('(') - 1 );
                artistCountry = artistCountry.replace(/\(|\)/gim,'');
				
				// avoid non-conventional country names. Add more when catch.
                switch ( artistCountry.toLowerCase() ){
                    case 'isr':
                        artistCountry = 'il';
                        break;
                    case null:
                        artistCountry = 'un';
                        break;
                    case '':
                        artistCountry = 'un';
                        break;
                    case undefined:
                        artistCountry = 'un';
                        break;
                }
                
            }else{
				// if no country - go UN :) - united nations
                artistCountry = 'un';
            }
			
			$artistLine = templator.makeArtistLine(
				obj.link
				,artistName
				,obj.content
				,Texts.getText('about_artist')
				,$.guid++
				,artistCountry
				,'http://vk.com/audio?q={0}'.format( encodeURI(artistName) )
				,Texts.getText('to_vk_audio')
			);
			
            if (obj.photo){
				photo.$img = $( '<a>', {href: obj.link, title: Texts.getText('go_to_off_site') + '\n' + obj.link} )
						.append( $( '<img>', {class: 'spoiler_photo', src: obj.photo} ) );
            }
            
            return {
                res			: $artistLine
                ,photo		: photo
				,is$		: true
            };
                
        }
        ,more   : function(){
			// set artist count in the button
            var ls = CommonFn.getBg()
                ,count = ls.getItem('lineup_count');
                
            $('#tab1').text( '{0} ({1})'.format( $('#tab1').text(), count ) );
        }
    },
    news : {
        index   : 2
        ,getStr : function(obj){            
			var $res = templator.makeNewsLine(
				obj.link
				,obj.name
				,obj["small-content"] + '...'
				,Texts.getText('about_news')
				,obj.date
				,Texts.getText('go_to_off_site')
			);
			
            return {
                res     : $res
				,is$	: true
            };
        }
        ,more   : function(){
			// set last news date text in the button
            var ls = CommonFn.getBg()
                ,last = ls.getItem('news_last_date');

            if ( last && last.length > 0 ){
                !$('#tab2').hasClass('twoline') && $('#tab2').addClass('twoline');
                $('#tab2').text( '{0} ({1})'.format( $('#tab2').text(), last ) );
            }else
                $('#tab2').removeClass('twoline');
        }
    },
    ticket : {
        index   : 3
        ,getStr : function(ticketPageHtml){
            return {
                res: $('<div>').html( templator.parseHTML( document, ticketPageHtml ) )
            };
        }
    },
    twitter : {
        index   : 4
        ,getStr : function(obj){
			var $res;
			
			$res = templator.makeTwitterLine( parseLinks(obj.text), obj.date, obj.link );
			
            return {
                res     : $res
				,is$	: true
            };

        }
        ,more   : function(){
			// no dynamic html!
            var $strovaInfo = $('<div id="strovaInfo">\n\
            <div class="strovaPhoto"><img src="/img/strova.jpeg"></div>\n\
            <span class="strovaName"><a class="away_link" href="https://twitter.com/SuperStrova">\u0418\u043B\u044C\u044F \u041E\u0441\u0442\u0440\u043E\u0432\u0441\u043A\u0438\u0439</a></span>\n\
            </div>');

            $('#tabContent4 .toSet').prepend( $strovaInfo );
        }
    }
};

function reWidth(){
    $('body').animate({
        width: 460
    }, 1);
}


function createContent(method, str){
    var ls = CommonFn.getBg()
        ,storeData;
    
    try{
        storeData = ls.getItem( method + '_str' );
        storeData = ( !str ) ? JSON.parse( storeData ) : storeData;
    }catch(e){
        alertError(e);
        return {};
    }

    generateLineByStoreData(storeData, method);
	
	// set listener on all unprocessed images
	$('img[data-set!=on]').on('error', function(e){
		$(this).parent().css('box-shadow', 'none');
		$(this).parent().css('top', '0px');
		$(this).replaceWith( $( '<span>' + $(this).attr('alt') + '</span>' ) );
	});
	
	// prevent double set listeners
	$('img[data-set!=on]').attr('data-set', 'on');
}

/**
 * Generates and appends line of data to main html.
 * 
 * @param {array} rawData - parsed localStorage JSON
 * @param {string} method processed tab id
 */
function generateLineByStoreData(rawData, method){	
    try{
		var $line
			,line_str
			,index = map[method].index
			,tag = '#tabContent{0} .toSet'.format(index)
			,data = ( $.isArray(rawData) ) ? rawData : [rawData];
		
        for (var i = 0; i < data.length; i++){
            line_str = map[method].getStr( data[i] );
			
			// for compatibility left option, when !!is$ == false 
			if ( line_str.is$ ){
				$line = line_str.res;
			}else{
				$line = $(line_str.res);
			}
			
            $(tag).append($line);
			
            if ( !!line_str.photo ){
                attachPhoto( line_str.photo, $line.find('.spoiler_content').attr('id') );
			}
        }

        map[method].more && map[method].more();
    }catch(e){
        alertError(e);
    }
}

function attachPhoto( photo_str, id ){
    setTimeout(
        function(){			
            $('#' + id).prepend( photo_str.$img );
        }
        ,100
    );
}

// navigation click process
$(document).on('click', '.tabHeader', function(e){
    var currentIndex,
        targetIndex;

    // calculate nav index
    try{
       targetIndex = parseInt( e.target.id.replace('tab', ''), 10 );
    }catch(e){alertError(e);}

    // show matching content block, hide others
    if (targetIndex){
        // calculate matching block
        try{
            currentIndex = parseInt( $('.tabHeader.active').attr('id').replace('tab', ''), 10 );
        }catch(e){
			alertError(e);
		}

        //do nothing if click on active
        if ( targetIndex === currentIndex ){
            return;
		}
		
        // store current scrollpos in current tabContent
        $('#tabContent' + currentIndex).attr('scroll_pos', $(document).scrollTop());

        // remove active class from ALL nav blocks
        $('.tabHeader').removeClass('active');
        
		// attach active class on clicked block
        $(this).addClass('active');

        // remove active class from ALL content blocks
        $('.tabContent').removeClass('active');
		
        // calculate new active block = $content and attach active class to it
        var $content = $('#tabContent' + targetIndex);
        $content.addClass('active');

        //remember current scroll position for content blocks that are hiding atm
        //$('.tabContent:not(.active)').attr('scroll_pos', $(document).scrollTop());
        // show new active content block
		/*
        $content && $content.length > 0 && $content.fadeIn(100, function(){
            // return to scroll position if exists
            var scroll_pos = $(this).attr('scroll_pos') || 0;
            $(document).scrollTop(scroll_pos);
        });
		*/
		$content.css({'top': -450});
		$content.show();
		$('.tabContent:visible:not(.active)').hide();
		$content.css({'top': 0});
		var scrollPos = $content.attr('scroll_pos') || 0;
        //$(document).scrollTop(scroll_pos);
		
		$('body').animate({
			scrollTop: scrollPos			
		}, 200);

        // hide all inactive and invisible
        //$('.tabContent:visible:not(.active)').fadeOut(100);
    }
});

$(document).on('click', '.spoiler_trigger', function(e){
    var target = e.target || e.srcElement;

    if ( target.tagName !== 'SPAN' ){
        return;
	}

    var $this = $(this);
    
    if ( !$this.hasClass('open') ){
        $this.parents('li').toggleClass('open');
        $this.parents('.tabContent').find('.spoiler_trigger.open').trigger('click');
		
        $this.parent().children('.spoiler_content').slideDown(180, function(){
            var sp_h = $(this).parent().children('.spoiler_content').height(),
                win_h = 600,
                cur_x = $(this).offset().top,
                cur_s = $(this).scrollTop(),
                doc_x = $(document).scrollTop();

            if (sp_h > win_h || ( sp_h + cur_x - doc_x ) > win_h || ( cur_x - doc_x ) < 0 ){
                $(document).scrollTop(cur_x - 120);
			}
        });
        $this.attr( 'original_title', $this.attr('title') );
        $this.attr( 'title', Texts.getText('hide') );
    }else{
        $this.parent().children('.spoiler_content').slideUp(180, function(){
			$this.parents('li').toggleClass('open');
		});
        $this.attr('title', $this.attr('original_title'));
    }
    
    $this.toggleClass('open');
    //$this.parents('li').toggleClass('open');
    $this.parent().children('a.away_link').toggleClass('open');
});

$(document).on('click', '.spoiler_simple', function(){
    var $this = $(this);
    $this.toggleClass('open');
    if ( $this.hasClass('open') ){
        $this.attr('originalText', $this.text());
        $this.html( Texts.getText('hide') );
        $this.parent().children('.spoiler_content_simple').slideDown(100);
    }else{
        $this.html( $this.attr('originalText') );
        $this.parent().children('.spoiler_content_simple').slideUp(100);
    }
});
            
$(document).on('click', '#tabContent-container a, #tabBar a', function(e){
    var href = $(this).attr('href');

    if ( !$(this).hasClass('internal_link') ){
        goToLink(href);
        e.preventDefault();
    }
});

$(document).ready(function(){
    reWidth();
    createContent('lineup');
    createContent('news');
    createContent('ticket', true);
    createContent('twitter');

});

// chrome devTools
function parseLinks(msg){
    msg = msg.replace(/((?:[a-zA-Z][a-zA-Z0-9+.-]{2,}:\/\/|www\.)[\w$\-_+*'=\|\/\\(){}[\]%@&#~,:;.!?]{2,}[\w$\-_+*=\|\/\\({%@&#~])/gim, "<a href='$1'>$1</a>");
    return msg;
}