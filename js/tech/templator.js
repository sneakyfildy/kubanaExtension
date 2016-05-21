function Templator(){
	var me = this;
	
	
	/**
	 * 
	 * @param {string} country
	 * @returns {jQuery}
	 */
	this.makeArtistCountry = function(country){
		var flagSrc = 'img/flags/' + country.toLowerCase() + '.gif'
			,$res;
			
		$res = $( '<img>', {alt: country.toLowerCase(), title: country.toUpperCase(), src: flagSrc} );
		
		return $res;
	};
	
	this.makeArtistLine = function(link, artistName, artistContent, artistTitle, guid, artistCountry, vkontakteAudioLink, audioTitle ){
		var $res
			,$audioLink
			,$spoilerTrigger
			,$artistCountry = me.makeArtistCountry(artistCountry);
		
		
		$audioLink = $('<span>', {class: 'audio-link'} )
				.append( 
					$( '<a>', {href: vkontakteAudioLink, title: audioTitle} )
						.append( $( '<img>', {src: '../img/vk_audio.png', alt: 'vk'} ) )
				);
		
		$spoilerTrigger = $( '<span>', {class: 'spoiler_trigger', title: artistTitle} )
				.text(artistName)
				.append(
					$( '<span>', {class: 'flag'}).append( $artistCountry )
					,$audioLink
				);
		
		$res = $('<li>', {class: 'artist'})
				.append(
					$spoilerTrigger
					,$('<div>', {class: 'spoiler_content', id: 'spoiler_content' + guid}).html( me.parseHTML(document, artistContent, true) )
				);
		
		return $res;
	};
	
	
	this.makeNewsLine = function(link, caption, text, about, date, linkTitle){
		var $res
			,title = (text + '\n\n' + linkTitle + '\n' + link)
					.replace(/\&nbsp;/gim, ' ')
					.replace(/\&laquo;/gim, '"')
					.replace(/\&raquo;/gim, '"');
		
		$res = $('<li>', {class: 'news'} )
				.append( 
					$('<span>', {class: 'news_date'} ) 
						.append( $( '<a>', {class: 'away_link', href: link, title: title} ).text(date) )
					,$('<div>').html( me.parseHTML(document, caption) )
				);
		
		return $res;
	};
	
	
	this.makeTwitterLine	= function(text, date, link){
		var $res;
		
		$res = $('<li>', {class: 'twit'})
				.append( 
					$('<span>', {class: 'news_date'})
						.append( $('<a>', {class: 'away_link', href: link}).text(date) )
					,$('<div>').html( this.parseHTML(document, text) )
				);
		
		return $res;
	};
	
	/**
	* Safely parse an HTML fragment, removing any executable
	* JavaScript, and return a document fragment.
	*
	* @param {Document} doc The document in which to create the
	*     returned DOM tree.
	* @param {string} html The HTML fragment to parse.
	* @param {boolean} allowStyle If true, allow <style> nodes and
	*     style attributes in the parsed fragment. Gecko 14+ only.
	* @param {nsIURI} baseURI The base URI relative to which resource
	*     URLs should be processed. Note that this will not work for
	*     XML fragments.
	* @param {boolean} isXML If true, parse the fragment as XML.
	*/
   this.parseHTML = function(doc, html, allowStyle, baseURI, isXML) {
	   // will not be run in chrome and opera
	   var Components = Components || false;
	   
	   if ( !Components ){
		   return html;
	   }
	   
	   var PARSER_UTILS = "@mozilla.org/parserutils;1";

	   // User the newer nsIParserUtils on versions that support it.
	   if (PARSER_UTILS in Components.classes) {
		   var parser = Components.classes[PARSER_UTILS]
								  .getService(Ci.nsIParserUtils);
		   if ("parseFragment" in parser)
			   return parser.parseFragment(html, allowStyle ? parser.SanitizerAllowStyle : 0,
										   !!isXML, baseURI, doc.documentElement);
	   }

	   return Components.classes["@mozilla.org/feed-unescapehtml;1"]
						.getService(Components.interfaces.nsIScriptableUnescapeHTML)
						.parseFragment(html, !!isXML, baseURI, doc.documentElement);
   };
}