export const keyboardLayouts = {
  Russian: [
    {
      name: 'ru-йцуке',
      layout: {
        default: [
          'ё 1 2 3 4 5 6 7 8 9 0 - = {backspace}',
          '{tab} й ц у к е н г ш щ з х ъ |',
          '{capslock} ф ы в а п р о л д ж э {enter}',
          '{shift} я ч с м и т ь б ю . {shift}',
          '{space}',
        ],
        shift: [
          'Ё ! " № ; % : ? * ( ) _ + {backspace}',
          '{tab} Й Ц У К Е Н Г Ш Щ З Х Ъ \\',
          '{capslock} Ф Ы В А П Р О Л Д Ж Э {enter}',
          '{shift} Я Ч С М И Т Ь Б Ю , {shift}',
          '{space}',
        ],
      },
    },
    {
      name: 'ru-яверт',
      layout: {
        default: [
          'ю 1 2 3 4 5 6 7 8 9 0 - ч {backspace}',
          '{tab} я в е р т ы у и о п ш щ э',
          '{capslock} а с д ф г х й к л ; " {enter}',
          '{shift} з ь ц ж б н м . . / {shift}',
          '{space}',
        ],
        shift: [
          'Ю ! ъ Ъ $ % ё Ё * ( ) _ ч {backspace}',
          '{tab} Я В Е Р Т Ы У И О П Ш Щ Э',
          '{capslock} А С Д Ф Г Х Й К Л : \' {enter}',
          '{shift} З Ь Ц Ж Б Н М < > ? {shift}',
          '{space}',
        ],
      },
    },
  ],
}

export default keyboardLayouts

/*
{
    lang: "ru-йцуке",
    //AUTHENTIC    layout: ["ё|Ё 1|! 2|\" 3|№ 4|; 5|% 6|: 7|? 8|* 9|( 0|) -|_ =|+ <<backspace>>",
            "<<tab>> й ц у к е н г ш щ з х ъ ||\\",
            "<<capslock>> ф ы в а п р о л д ж э <<enter>>",
            "<<shift>> я ч с м и т ь б ю .|, <<shift>>",
            "<<space>>"]
}, {
    lang: "ru-яверт",
    //PHONETIC
    layout: ["ю 1|! 2|ъ 3|Ъ 4|$ 5|% 6|ё 7|Ё 8|* 9|( 0|) -|_ ч <<backspace>>",
            "<<tab>> я в е р т ы у и о п ш щ э",
            "<<capslock>> а с д ф г х й к л ;|: \"|' <<enter>>",
            "<<shift>> з ь ц ж б н м .|< .|> /|? <<shift>>",
            "<<space>>"]
}
 */
