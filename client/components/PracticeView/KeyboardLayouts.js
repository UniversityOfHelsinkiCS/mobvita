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
        caps: [
          'ё 1 2 3 4 5 6 7 8 9 0 - = {backspace}',
          '{tab} Й Ц У К Е Н Г Ш Щ З Х Ъ \\',
          '{capslock} Ф Ы В А П Р О Л Д Ж Э {enter}',
          '{shift} Я Ч С М И Т Ь Б Ю , {shift}',
          '{space}',
        ],
        capsShift: [
          'Ё ! " № ; % : ? * ( ) _ + {backspace}',
          '{tab} й ц у к е н г ш щ з х ъ |',
          '{capslock} ф ы в а п р о л д ж э {enter}',
          '{shift} я ч с м и т ь б ю . {shift}',
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
        caps: [
          'ю 1 2 3 4 5 6 7 8 9 0 - ч {backspace}',
          '{tab} Я В Е Р Т Ы У И О П Ш Щ Э',
          '{capslock} А С Д Ф Г Х Й К Л : \' {enter}',
          '{shift} З Ь Ц Ж Б Н М < > ? {shift}',
          '{space}',
        ],
        capsShift: [
          'Ю ! ъ Ъ $ % ё Ё * ( ) _ ч {backspace}',
          '{tab} я в е р т ы у и о п ш щ э',
          '{capslock} а с д ф г х й к л ; " {enter}',
          '{shift} з ь ц ж б н м . . / {shift}',
          '{space}',
        ],
      },
    },
  ],
  Tatar: [
    {
      name: 'Tatar',
      layout: {
        default: [
          'һ 1 2 3 4 5 6 7 8 9 0 - = {backspace}',
          '{tab} й ө у к е н г ш ә з х ү',
          '{capslock} ф ы в а п р о л д ң э \\ {enter}',
          '{shift} ґ я ч с м и т җ б ю . {shift}',
          '{ctrlAlt} {space}',
        ],
        caps: [
          'һ 1 2 3 4 5 6 7 8 9 0 - = {backspace}',
          '{tab} Й Ө У К Е Н Г Ш Ә З Х Ү',
          '{capslock} Ф Ы В А П Р О Л Д Ң Э \\ {enter}',
          '{shift} Ґ Я Ч С М И Т Җ Б Ю , {shift}',
          '{ctrlAlt} {space}',
        ],
        shift: [
          'Һ ! " № ; % : ? * ( ) _ + {backspace}',
          '{tab} Й Ө У К Е Н Г Ш Ә З Х Ү',
          '{capslock} Ф Ы В А П Р О Л Д Ң Э \\ {enter}',
          '{shift} Ґ Я Ч С М И Т Җ Б Ю , {shift}',
          '{ctrlAlt} {space}',
        ],
        capsShift: [
          'Һ ! " № ; % : ? * ( ) _ + {backspace}',
          '{tab} й ө у к е н г ш ә з х ү',
          '{capslock} ф ы в а п р о л д ң э \\ {enter}',
          '{shift} ґ я ч с м и т җ б ю . {shift}',
          '{ctrlAlt} {space}',
        ],
        ctrlAlt: [
          'ё  @ # $   [ ] { }   {backspace}',
          '{tab}  ц       щ   ъ',
          '{capslock}          ж \'  {enter}',
          '{shift}        ь < >  {shift}',
          '{ctrlAlt} {space}',
        ],
        ctrlAltShift: [
          'Ё             {backspace}',
          '{tab}  Ц       Щ   Ъ',
          '{capslock}          Ж   {enter}',
          '{shift}        Ь    {shift}',
          '{ctrlAlt} {space}',
        ],
      },
    },
  ],
  Syriac: [
    {
      name: 'Syriac',
      layout: {
        default: [
          '\u070f 1 2 3 4 5 6 7 8 9 0 - = {backspace}',
          '{tab} \u0714 \u0728 \u0716 \u0729 \u0726 \u071c \u0725 \u0717 \u071e \u071a \u0713 \u0715 \u0706',
          '{capslock} \u072b \u0723 \u071d \u0712 \u0720 \u0710 \u072c \u0722 \u0721 \u071f \u071b {enter}',
          '{shift} \u0706 ] [ \u0724 \u072a \u0727 \u0700 \u002e \u0718 \u0719 \u0707 {shift}',
          '{space}',
        ],
        shift: [
          '\u032e \u0021 \u030a \u0325 \u0749 \u2670 \u2671 \u070a \u00bb \u0029 \u0028 \u00ab \u002b {backspace}',
          '{tab} \u0730 \u0733 \u0736 \u073a \u073d \u0740 \u0741 \u0308 \u0304 \u0307 \u0303 \u074a \u003a',
          '{capslock} \u0731 \u0734 \u0737 \u073b \u073e \u0711 \u0640 \u0324 \u0331 \u0323 \u0330 {enter}',
          '{shift} \u003a \u0732 \u0735 \u0738 \u073c \u073f \u0739 \u0742 \u060c \u061b \u061f {shift}',
          '{space}',
        ],
        caps: [
          '\u070f 1 2 3 4 5 6 7 8 9 0 - = {backspace}',
          '{tab} \u0730 \u0733 \u0736 \u073a \u073d \u0740 \u0741 \u0308 \u0304 \u0307 \u0303 \u074a \u003a',
          '{capslock} \u0731 \u0734 \u0737 \u073b \u073e \u0711 \u0640 \u0324 \u0331 \u0323 \u0330 {enter}',
          '{shift} \u003a \u0732 \u0735 \u0738 \u073c \u073f \u0739 \u0742 \u060c \u061b \u061f {shift}',
          '{space}',
        ],
        capsShift: [
          '\u032e \u0021 \u030a \u0325 \u0749 \u2670 \u2671 \u070a \u00bb \u0029 \u0028 \u00ab \u002b {backspace}',
          '{tab} \u0714 \u0728 \u0716 \u0729 \u0726 \u071c \u0725 \u0717 \u071e \u071a \u0713 \u0715 \u0706',
          '{capslock} \u072b \u0723 \u071d \u0712 \u0720 \u0710 \u072c \u0722 \u0721 \u071f \u071b {enter}',
          '{shift} \u0706 ] [ \u0724 \u072a \u0727 \u0700 \u002e \u0718 \u0719 \u0707 {shift}',
          '{space}',
        ],
      },
    },
  ],
}

export const keyboardDisplay = {
  '{backspace}': 'backspace',
  '{enter}': 'enter',
  '{tab}': 'tab',
  '{shift}': 'shift',
  '{ctrl}': 'ctrl',
  '{alt}': 'alt',
  '{capslock}': 'capslock',
  '{space}': 'space',
  '{ctrlAlt}': 'ctrl + alt',
}

export default keyboardLayouts
