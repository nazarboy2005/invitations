(function(){const AGEWORD={
    uz: {1:'bir',2:'ikki',3:'uch',4:'toʻrt',5:'besh',6:'olti',7:'yetti',8:'sakkiz',9:'toʻqqiz',10:'oʻn',11:'oʻn bir',12:'oʻn ikki',13:'oʻn uch',14:'oʻn toʻrt',15:'oʻn besh',16:'oʻn olti',17:'oʻn yetti',18:'oʻn sakkiz',19:'oʻn toʻqqiz',20:'yigirma'},
    en: {1:'one',2:'two',3:'three',4:'four',5:'five',6:'six',7:'seven',8:'eight',9:'nine',10:'ten',11:'eleven',12:'twelve',13:'thirteen',14:'fourteen',15:'fifteen',16:'sixteen',17:'seventeen',18:'eighteen',19:'nineteen',20:'twenty'},
    ru: {1:'один',2:'два',3:'три',4:'четыре',5:'пять',6:'шесть',7:'семь',8:'восемь',9:'девять',10:'десять',11:'одиннадцать',12:'двенадцать',13:'тринадцать',14:'четырнадцать',15:'пятнадцать',16:'шестнадцать',17:'семнадцать',18:'восемнадцать',19:'девятнадцать',20:'двадцать'}
  };
function ageWord(lang, age){
    var n = parseInt(age, 10);
    if (!isFinite(n)) return age || '';
    return (AGEWORD[lang] && AGEWORD[lang][n]) || String(n);
  }
function ageLabel(lang, age){
    var w = ageWord(lang, age);
    if (lang === 'en') return "— turns " + w + " —";
    if (lang === 'ru') return "— исполняется " + w + " —";
    return "— " + w + " yoshda —";
  }
function closing(lang, name){
    var who = name || '';
    if (lang === 'en')
      return "With love and bunting flags, from " + who + " and family. See you under the lights.";
    if (lang === 'ru')
      return "С любовью и гирляндами флажков, от " + who + " и семьи. Увидимся под огнями.";
    return who + " va oilasidan mehr va bayroqchalar bilan. Chiroqlar ostida ko'rishguncha.";
  }
window.sharlarAgeLabel=ageLabel;window.sharlarClosing=closing;})();
