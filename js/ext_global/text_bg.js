var Texts = {
    getText                : function( key ){
        return this[key];
    }
    ,connection_error       : "\u0421\u0435\u0440\u0432\u0435\u0440 \u041A\u0430\u043D\u043E\u0431\u0443 \u043D\u0435 \u043E\u0442\u0432\u0435\u0447\u0430\u0435\u0442. \n\u041F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435 \u043D\u0435\u043C\u043D\u043E\u0433\u043E, \u043A\u0430\u043A \u043F\u0440\u0430\u0432\u0438\u043B\u043E, \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u044F \u0438\u0441\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 \u043C\u0438\u043D\u0443\u0442\u044B."
    ,about_artist           : "\u041E\u0431 \u0430\u0440\u0442\u0438\u0441\u0442\u0435"
    ,about_news             : "\u0427\u0443\u0442\u044C \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435"
    ,hide                   : "\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C"
    ,schedule_caption       : "\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u0435"
    ,no_schedule            : "\u0420\u0430\u0441\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u043F\u043E\u043A\u0430 \u043D\u0435\u0442"
    ,ticket_caption         : "\u0411\u0438\u043B\u0435\u0442\u044B"
    ,ticket_cat             : "\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438 \u0438 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435"
    ,ticket_buy_online      : "\u0417\u0430\u043A\u0430\u0437 \u0431\u0438\u043B\u0435\u0442\u043E\u0432 \u043E\u043D\u043B\u0430\u0439\u043D"
    ,ticket_official        : "\u0420\u0430\u0437\u0434\u0435\u043B \"\u0411\u0438\u043B\u0435\u0442\u044B\" \u043D\u0430 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u043C \u0441\u0430\u0439\u0442\u0435"
    // pereyti v razdel "kupt' online" na ofic. sayte
    ,ticket_official_full   : "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u0432 \u0440\u0430\u0437\u0434\u0435\u043B \"\u041A\u0443\u043F\u0438\u0442\u044C online\" \u043D\u0430 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u043C \u0441\u0430\u0439\u0442\u0435"
    //obnovlenie novostei
    ,news_update            : '\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0441\u0442\u0435\u0439'
    ,lineup_update          : '\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432'
    ,twit_update_caption    : '\u0422\u0432\u0438\u0442 \u041A\u043E\u043C\u0430\u043D\u0434\u0430\u043D\u0442\u0435'
    ,more_info              : '\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435 \u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044F'
    // pereyti na sait
	,watch                  : '\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043D\u0430 \u0441\u0430\u0439\u0442'
    // pereyti na off site festivalya
    ,go_to_off_site         : '\u041F\u0435\u0440\u0435\u0445\u043E\u0434 \u043D\u0430 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u0430\u0439\u0442 \u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043B\u044F'
    ,to_vk_audio             : '\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u0430\u0443\u0434\u0438\u043E \u0437\u0430\u043F\u0438\u0441\u044F\u043C \u044D\u0442\u043E\u0433\u043E \u0430\u0440\u0442\u0438\u0441\u0442\u0430 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435 vk.com'
    // ostalos menshe odnogo dnya
    ,less_than_day_left     : '\u041E\u0441\u0442\u0430\u043B\u043E\u0441\u044C \u043C\u0435\u043D\u044C\u0448\u0435 \u043E\u0434\u043D\u043E\u0433\u043E \u0434\u043D\u044F!!!'
    // rashirenie KubanaFest
    ,default_badge_text     : '\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u0435 Kubana Bar \n Kubana 2014 14-19 \u0430\u0432\u0433\u0443\u0441\u0442\u0430. \u0412\u0435\u0441\u0435\u043B\u043E\u0432\u043A\u0430.'
    ,kubana_time_grades     : [
        '\u041F\u043E\u0447\u0442\u0438 \u0433\u043E\u0434 \u0435\u0449\u0435 \u0436\u0434\u0430\u0442\u044C.',
        '\u0415\u0449\u0435 \u043D\u0435 \u0441\u043A\u043E\u0440\u043E :(',
        '\u041C\u0435\u043D\u044C\u0448\u0435, \u0447\u0435\u043C \u043F\u043E\u043B\u0433\u043E\u0434\u0430 \u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C.',
        '\u0423\u0436\u0435 \u0431\u043B\u0438\u0437\u043A\u043E.',
        '\u0421\u043E\u0432\u0441\u0435\u043C \u0447\u0443\u0442\u044C-\u0447\u0443\u0442\u044C \u043F\u043E\u0442\u0435\u0440\u043F\u0435\u0442\u044C!'
        
    ]
    ,why_you_are_here       : '\u0410\u043C\u0438\u0433\u043E, \u043F\u043E\u0447\u0435\u043C\u0443 \u0442\u044B \u0432\u0438\u0434\u0438\u0448\u044C \u044D\u0442\u043E\u0442 \u0442\u0435\u043A\u0441\u0442?! \n \u0422\u044B \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043D\u0430 \u041A\u0443\u0431\u0430\u043D\u0435, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \n \u041A\u0423\u0411\u0410\u041D\u0410 \u0423\u0416\u0415 \u0418\u0414\u0415\u0422!!!'
    ,special_dates          : {
        '0' : {
            '1' : '\u0421 \u041D\u043E\u0432\u044B\u043C \u0413\u043E\u0434\u043E\u043C!',
            '7' : '\u0421\u0447\u0430\u0441\u0442\u043B\u0438\u0432\u043E\u0433\u043E \u0440\u043E\u0436\u0434\u0435\u0441\u0442\u0432\u0430!',
            // s dnyem rozhdeniya tebya dorogoi alexey
            '18' : '\u0421 \u0434\u043D\u0435\u043C \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F \u0442\u0435\u0431\u044F, \u0434\u043E\u0440\u043E\u0433\u043E\u0439 \u0410\u043B\u0435\u043A\u0441\u0435\u0439!'
        },
        '1' : {
            // s prazdnikom, muzhiki
            '23' : '\u0421 \u043F\u0440\u0430\u0437\u0434\u043D\u0438\u043A\u043E\u043C, \u043C\u0443\u0436\u0438\u043A\u0438!'
        },
        '2' : {
            '8' : '\u0427\u0442\u043E \u0431\u044B \u043C\u044B \u0431\u0435\u0437 \u0432\u0430\u0441 \u0434\u0435\u043B\u0430\u043B\u0438? \u0421 \u043F\u0440\u0430\u0437\u0434\u043D\u0438\u043A\u043E\u043C \u0442\u0435\u0431\u044F, \u043F\u0440\u0435\u043A\u0440\u0430\u0441\u043D\u0430\u044F \u043F\u043E\u043B\u043E\u0432\u0438\u043D\u0430!'
        },
        '3' : {
            '1' : '\u0421\u0420\u041E\u0427\u041D\u0410\u042F \u041D\u041E\u0412\u041E\u0421\u0422\u042C! \u041D\u0430 \u041A\u0443\u0431\u0430\u043D\u0435 \u0432\u044B\u0441\u0442\u0443\u043F\u0438\u0442 \u0441 \u043F\u0440\u0435\u0437\u0435\u043D\u0442\u0430\u0446\u0438\u0435\u0439 \u0430\u043B\u044C\u0431\u043E\u043C\u0430 \u0424\u0438\u043B\u0438\u043F\u043F \u0411\u0435\u0434\u0440\u043E\u0441\u043E\u0432\u0438\u0447 \u041A\u0438\u0440\u043A\u043E\u0440\u043E\u0432!'
        },
        '4' : {
            '1' : '\u041F\u0435\u0440\u0432\u043E\u043C\u0430\u0439, \u043F\u0435\u0440\u0432\u043E\u043C\u0430\u0439. \u0421\u0440\u043E\u0447\u043D\u043E \u0432\u043E\u0434\u043A\u0438 \u043D\u0430\u043B\u0438\u0432\u0430\u0439.'
        },
        '11' : {
            '29' : '\u0421 \u043D\u0430\u0441\u0442\u0443\u043F\u0430\u044E\u0449\u0438\u043C!',
            '30' : '\u0421 \u043D\u0430\u0441\u0442\u0443\u043F\u0430\u044E\u0449\u0438\u043C!',
            '31' : '\u0421 \u043D\u0430\u0441\u0442\u0443\u043F\u0430\u044E\u0449\u0438\u043C!'
        }
    }
};

var Paths   = {
};
    
