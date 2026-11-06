/* Built-in template copy only. Creator text is supplied separately by the contract adapter. */
(() => {
  "use strict";
  const languages = ["uz-Latn", "uz-Cyrl", "en", "ru"];
  const rows = `
cv-kicker-a|Kundalik|Кундалик|Journal|Дневник
cv-valley|Bizning vodiy|Бизнинг водий|Our valley|Наша долина
cv-line|Tong oldida vodiy sokin. U sizni kutib olishga tayyorlanmoqda.|Тонг олдида водий сокин. У сизни кутиб олишга тайёрланмоқда.|Before dawn, the valley is quiet. It is getting ready to welcome you.|Перед рассветом долина тиха. Она готовится встретить вас.
cv-guest-to|Hurmatli mehmon|Ҳурматли меҳмон|Dear guest|Дорогой гость
cv-open-t|Tongni kutib olish|Тонгни кутиб олиш|Welcome the dawn|Встретить рассвет
cv-hint-t|Vodiy ohanglari uchun ovozni yoqing|Водий оҳанглари учун овозни ёқинг|Turn on sound to hear the valley|Включите звук долины
penutup-end-x|Kelgan barchaga bayram mushaklari. Vodiydan xayrli tun.|Келган барчага байрам мушаклари. Водийдан хайрли тун.|Fireworks for everyone who joined us. Good night from the valley.|Фейерверк для всех, кто пришёл. Доброй ночи из долины.
hero-cue-t|Sekin aylantiring — vodiy siz bilan uyg‘onadi|Секин айлантиринг — водий сиз билан уйғонади|Scroll slowly — the valley grows with you|Листайте медленно — долина оживает с вами
lg-1|tong|тонг|dawn|рассвет
lg-2|gullar ochilishi|гуллар очилиши|flowers bloom|цветение
lg-3|darvoza|дарвоза|the gateway|ворота
lg-4|chiroqlar|чироқлар|lights come on|зажигаются огни
lg-5|tun guli|тун гули|night bloom|ночной цветок
salam-kick|hammasi boshlanishidan oldin|ҳаммаси бошланишидан олдин|before it all begins|перед началом
salam-ttl|Vodiydan salom|Водийдан салом|Greetings from the valley|Привет из долины
mempelai-kick|ikki xil gullash vaqti|икки хил гуллаш вақти|two different hours of bloom|два времени цветения
mempelai-ttl|Tong guli, tun guli|Тонг гули, тун гули|Morning flower, night flower|Утренний и ночной цветок
meet-lbl|uchrashuv soati|учрашув соати|our meeting hour|час нашей встречи
kisah-kick|hikoyamiz sahifalari|ҳикоямиз саҳифалари|chapters of our story|главы нашей истории
kisah-ttl|Urug‘dan hosilgacha|Уруғдан ҳосилгача|From seed to harvest|От семени до урожая
harvest-k|hosilimiz kuni|ҳосилимиз куни|our harvest day|день нашего урожая
harvest-go-t|Tadbir kunini ko‘rish|Тадбир кунини кўриш|See the celebration day|Посмотреть день праздника
jambunga-kick|Gullar soati|Гуллар соати|Flower clock|Цветочные часы
jambunga-ttl|Vodiyning gul soati|Водийнинг гул соати|The valley flower clock|Цветочные часы долины
jambunga-intro|Har bir gul o‘z vaqtida ochiladi. Soat milini aylantirib, vodiyning kun davomida o‘zgarishini tomosha qiling.|Ҳар бир гул ўз вақтида очилади. Соат милини айлантириб, водийнинг кун давомида ўзгаришини томоша қилинг.|Each flower opens at its own hour. Turn the hand and watch the valley change through the day.|Каждый цветок раскрывается в свой час. Поверните стрелку и наблюдайте, как меняется долина.
jambunga-note|Tongdan tungacha gullar birin-ketin ochiladi.|Тонгдан тунгача гуллар бирин-кетин очилади.|From dawn to night, the flowers open one by one.|От рассвета до ночи цветы раскрываются один за другим.
dial-play-t|Bir kunni tomosha qilish|Бир кунни томоша қилиш|Play a whole day|Показать весь день
dial-reset-t|Sahifa vaqtiga qaytish|Саҳифа вақтига қайтиш|Return to scroll time|Вернуться ко времени страницы
bunyi-kick|vodiy ohanglari|водий оҳанглари|sounds of the valley|звуки долины
bunyi-ttl|Tabiat ohanglari|Табиат оҳанглари|Sounds we keep|Звуки, которые мы храним
bunyi-intro|Tabiat ovozlarini birma-bir yoqing. Orqadagi vodiy ham ularga javob beradi.|Табиат овозларини бирма-бир ёқинг. Орқадаги водий ҳам уларга жавоб беради.|Turn on the sounds of nature one by one. The valley responds to each one.|Включайте звуки природы по одному. Долина откликается на каждый из них.
snd-rain-n|Yomg‘ir|Ёмғир|Rain|Дождь
snd-rain-m|Yomg‘ir tomchilari|Ёмғир томчилари|Raindrops|Капли дождя
snd-river-n|Daryo|Дарё|River|Река
snd-river-m|Oqar suv ovozi|Оқар сув овози|Flowing water|Текущая вода
snd-wind-n|Shamol|Шамол|Wind in the bamboo|Ветер в бамбуке
snd-wind-m|Barglarning shitirlashi|Баргларнинг шитирлаши|Leaves rustling in the wind|Шелест листвы на ветру
snd-birds-n|Qushlar|Қушлар|Birdsong|Пение птиц
snd-birds-m|Tonggi qushlar sayrashi|Тонгги қушлар сайраши|Birds greeting the morning|Утреннее пение птиц
snd-crickets-n|Chigirtkalar|Чигирткалар|Crickets|Сверчки
snd-crickets-m|Tun ohangi|Тун оҳанги|The sound of evening|Звуки вечера
snd-frogs-n|Qurbaqalar|Қурбақалар|Frogs after rain|Лягушки после дождя
snd-frogs-m|Ko‘l bo‘yidagi tovushlar|Кўл бўйидаги товушлар|Voices beside the pond|Голоса у пруда
snd-hint|Yomg‘ir yog‘adi, qushlar qo‘nadi, chiroqlar yonadi.|Ёмғир ёғади, қушлар қўнади, чироқлар ёнади.|Rain falls, birds settle and fireflies appear.|Идёт дождь, прилетают птицы и появляются светлячки.
snd-stop-t|Biroz sukunat|Бироз сукунат|A moment of silence|Минута тишины
menanti-kick|Har bir tong bizni o‘sha kunga yaqinlashtiradi.|Ҳар бир тонг бизни ўша кунга яқинлаштиради.|Each dawn brings us closer to that day.|Каждый рассвет приближает нас к этому дню.
cd-d-l|kun|кун|days|дней
cd-h-l|soat|соат|hours|часов
cd-m-l|daqiqa|дақиқа|minutes|минут
cd-s-l|soniya|сония|seconds|секунд
cal-g-t|Google Taqvimga saqlash|Google Тақвимга сақлаш|Save to Google Calendar|Сохранить в Google Календарь
cal-ics-t|.ics faylini yuklash|.ics файлини юклаш|Download .ics file|Скачать файл .ics
acara-kick|siz yetib kelganingizda|сиз етиб келганингизда|when you arrive|когда вы приедете
acara-ttl|Bir vodiy, bir bayram|Бир водий, бир байрам|One valley, one celebration|Одна долина, один праздник
ev-1-map-t|Yo‘nalish|Йўналиш|Directions|Маршрут
ev-1-cal-t|Saqlash|Сақлаш|Save|Сохранить
susunan-kick|bir poyada ko‘p gullar|бир пояда кўп гуллар|one stem, many flowers|один стебель, много цветов
susunan-intro|Bayram lahzalari ketma-ket ochiladi.|Байрам лаҳзалари кетма-кет очилади.|The moments of the day unfold one by one.|Мгновения праздника раскрываются одно за другим.
lokasi-kick|so‘qmoq bo‘ylab|сўқмоқ бўйлаб|follow the path|следуйте по тропинке
lokasi-ttl|Vodiyga yo‘l|Водийга йўл|The path to the valley|Дорога в долину
loc-map-t|Xaritani ochish|Харитани очиш|Open map|Открыть карту
loc-copy-t|Manzilni nusxalash|Манзилни нусхалаш|Copy address|Скопировать адрес
busana-kick|vodiy ranglaridan|водий рангларидан|picked from the valley|краски долины
busana-ttl|Bayram ranglari|Байрам ранглари|Colors of the day|Цвета праздника
swatch-hint|Rangni bosing — vodiyda shu rangdagi gullar ochiladi|Рангни босинг — водийда шу рангдаги гуллар очилади|Tap a color — flowers in the valley follow it|Нажмите на цвет — долина зацветёт этим цветом
galeri-kick|saqlangan xotiralar|сақланган хотиралар|memories we keep|наши воспоминания
galeri-ttl|Xotiralar ko‘li|Хотиралар кўли|Pond of memories|Пруд воспоминаний
galeri-intro|Xotiralar nilufar barglari kabi suzadi. Biriga tegining.|Хотиралар нилуфар барглари каби сузади. Бирига тегининг.|Our memories float like lotus leaves. Touch one to see it.|Наши воспоминания плывут, как листья лотоса. Прикоснитесь к одному из них.
pond-hint|nilufar bargiga tegining|нилуфар баргига тегининг|touch a lotus leaf|прикоснитесь к листу лотоса
rsvp-kick|so‘qmoqdagi kichik iz|сўқмоқдаги кичик из|a small footprint on the path|след на тропинке
rsvp-ttl|Vodiyga qadamingiz|Водийга қадамингиз|Your path to the valley|Ваш путь в долину
rsvp-hi-a|Sizni kutamiz,|Сизни кутамиз,|Will you join us,|Вы придёте,
rsvp-intro|Kelishingiz haqida xabar bering. Har bir javob vodiy so‘qmog‘ida iz qoldiradi.|Келишингиз ҳақида хабар беринг. Ҳар бир жавоб водий сўқмоғида из қолдиради.|Let us know if you can come. Each reply leaves a little footprint on the valley path.|Сообщите, сможете ли вы прийти. Каждый ответ оставляет след на тропинке долины.
rsvp-name-l|Ismingiz|Исмингиз|Your name|Ваше имя
rsvp-st-l|Kelishingiz|Келишингиз|Attendance|Присутствие
st-yes-t|Kelaman|Келаман|I will attend|Приду
st-no-t|Kela olmayman|Кела олмайман|I cannot attend|Не смогу прийти
st-maybe-t|Hali aniq emas|Ҳали аниқ эмас|Not sure yet|Пока не знаю
rsvp-msg-l|Xabar|Хабар|Message|Сообщение
rsvp-send-t|Javob yuborish|Жавоб юбориш|Leave your footprint|Оставить след
doa-kick|maysalar orasidagi chiroqlar|майсалар орасидаги чироқлар|lights among the grass|огоньки в траве
doa-ttl|Tilaklar chirog‘i|Тилаклар чироғи|Fireflies of wishes|Светлячки пожеланий
doa-intro|Har bir tasdiqlangan tilak vodiyda bir chiroq bo‘ladi.|Ҳар бир тасдиқланган тилак водийда бир чироқ бўлади.|Each approved wish becomes a firefly in the valley.|Каждое одобренное пожелание становится светлячком в долине.
wish-name-l|Ismingiz|Исмингиз|Your name|Ваше имя
wish-msg-l|Tilaklaringiz|Тилакларингиз|Your wishes|Ваши пожелания
wish-send-t|Tilak yuborish|Тилак юбориш|Release a firefly|Выпустить светлячка
wish-empty|Hozircha tilaklar yo‘q. Birinchi bo‘ling.|Ҳозирча тилаклар йўқ. Биринчи бўлинг.|No wishes yet. Be the first to light up our night.|Пожеланий пока нет. Зажгите первый огонёк.
penutup-kick|bu kecha so‘qmoq bo‘yida|бу кеча сўқмоқ бўйида|tonight beside the path|сегодня вечером у тропинки
penutup-ttl|Bir kecha ochiladigan gul|Бир кеча очиладиган гул|A flower for one night|Цветок одной ночи
wj-note|Tun guli tonggacha ochiladi. Bu kecha uchun rahmat.|Тун гули тонггача очилади. Бу кеча учун раҳмат.|The night flower closes before dawn. Thank you for being part of this night.|Ночной цветок закроется до рассвета. Спасибо, что вы с нами этой ночью.
close-par-b-l|Oila|Оила|Family|Семья
close-par-g-l|Oila|Оила|Family|Семья
close-bye-a|Vodiyda ko‘rishguncha,|Водийда кўришгунча,|See you in the valley,|До встречи в долине,
fw-btn-t|Mushakbozlik|Мушакбозлик|Light the fireworks|Зажечь фейерверк
turut-l|Hurmat bilan|Ҳурмат билан|With love from|С уважением
back-top-t|Tongga qaytish|Тонгга қайтиш|Back to dawn|Вернуться к рассвету
close-end-a|Bir kun|Бир кун|A day in|День в
close-end-v|bizning vodiyda|бизнинг водийда|our valley|нашей долине
hud-bloom-l|ochildi|очилди|blooming|цветёт
ni-hero-t|Tong|Тонг|Dawn|Рассвет
ni-salam-t|Salom|Салом|Welcome|Приветствие
ni-mempelai-t|Juftlik|Жуфтлик|The couple|Пара
ni-kisah-t|Hikoya|Ҳикоя|Story|История
ni-jambunga-t|Gul soati|Гул соати|Flower clock|Цветочные часы
ni-bunyi-t|Ohanglar|Оҳанглар|Sounds|Звуки
ni-menanti-t|Intizorlik|Интизорлик|Countdown|Ожидание
ni-acara-t|Tadbir|Тадбир|Celebration|Праздник
ni-susunan-t|Dastur|Дастур|Schedule|Программа
ni-lokasi-t|Manzil|Манзил|Venue|Место
ni-busana-t|Libos|Либос|Dress code|Дресс-код
ni-galeri-t|Rasmlar|Расмлар|Gallery|Галерея
ni-rsvp-t|Javob|Жавоб|RSVP|Ответ
ni-doa-t|Tilaklar|Тилаклар|Wishes|Пожелания
ni-penutup-t|Tun|Тун|Night|Ночь
choose|Kelishingizni tanlang.|Келишингизни танланг.|Please choose your attendance.|Выберите вариант присутствия.
sent|Javobingiz saqlandi. Rahmat!|Жавобингиз сақланди. Раҳмат!|Your response was saved. Thank you!|Ваш ответ сохранён. Спасибо!
moderated|Tilagingiz yuborildi. U tasdiqlangandan keyin ko‘rinadi.|Тилагингиз юборилди. У тасдиқлангандан кейин кўринади.|Your wish was sent. It will appear after approval.|Пожелание отправлено. Оно появится после одобрения.
failed|Yuborilmadi. Qayta urinib ko‘ring.|Юборилмади. Қайта уриниб кўринг.|Could not send. Please try again.|Не удалось отправить. Попробуйте ещё раз.
nameRequired|Ismingizni kiriting.|Исмингизни киритинг.|Please enter your name.|Введите ваше имя.
wishRequired|Tilagingizni yozing.|Тилагингизни ёзинг.|Please write your wish.|Напишите пожелание.
calendarFarewell|Vodiyda ko‘rishguncha|Водийда кўришгунча|See you in the valley|До встречи в долине
calendarTomorrow|Ertaga:|Эртага:|Tomorrow:|Завтра:
`;
  const dictionary = Object.fromEntries(rows.trim().split("\n").map((line) => { const [key, ...values] = line.split("|"); return [key, values]; }));
  const text = window.lanskapText = (key) => dictionary[key]?.[languages.indexOf(window.lanskapPlatform?.locale || "uz-Latn")] ?? key;
  const runtimeRows = `
Hentikan|To‘xtatish|Тўхтатиш|Stop|Остановить
Putar sehari|Bir kunni tomosha qilish|Бир кунни томоша қилиш|Play a whole day|Показать весь день
Tinggal|Qoldi|Қолди|Only|Осталось
Fajar Lagi|tong|тонг|dawns to go|рассветов
Hari Ini Harinya|Bugun o‘sha kun|Бугун ўша кун|Today is the day|Сегодня тот самый день
Hari Ini, Kami Menikah|Bugun to‘yimiz|Бугун тўйимиз|Today we get married|Сегодня наша свадьба
Kami Sudah Menikah|To‘yimiz bo‘lib o‘tdi|Тўйимиз бўлиб ўтди|We are married|Наша свадьба состоялась
Acara|Tadbir|Тадбир|Celebration|Праздник
Alamat disalin.|Manzil nusxalandi.|Манзил нусхаланди.|Address copied.|Адрес скопирован.
Musim Semai|Urug‘|Уруғ|Sowing|Посев
Musim Tanam|Nihol|Ниҳол|Planting|Посадка
Musim Rawat|Parvarish|Парвариш|Growing|Рост
Musim Menguning|Hosil|Ҳосил|Harvest|Урожай
Telang|Klitoriya|Клитория|Butterfly pea|Клитория
Teratai|Nilufar|Нилуфар|Lotus|Лотос
Bunga Matahari|Kungaboqar|Кунгабоқар|Sunflower|Подсолнух
Bunga Pukul Sembilan|Portulak|Портулак|Nine o’clock flower|Цветок девяти часов
Bunga Pukul Empat|Mirabilis|Мирабилис|Four o’clock flower|Ночная красавица
Melati|Yasmin|Ясмин|Jasmine|Жасмин
Sedap Malam|Tuberoza|Тубероза|Tuberose|Тубероза
Wijayakusuma|Tun malikasi|Тун маликаси|Queen of the night|Царица ночи
gerimis|mayin yomg‘ir|майин ёмғир|drizzle|морось
subuh berkabut|tumanli tong|туманли тонг|misty dawn|туманный рассвет
berkabut tipis|yengil tuman|енгил туман|light mist|лёгкий туман
cerah|ochiq|очиқ|clear|ясно
cerah berawan|bulutli|булутли|partly cloudy|переменная облачность
hangat|iliq|илиқ|warm|тепло
keemasan|oltin yog‘du|олтин ёғду|golden|золотой свет
senja|shom|шом|dusk|сумерки
malam cerah|ochiq tun|очиқ тун|clear night|ясная ночь
kamu di sini|siz shu yerdasiz|сиз шу ердасиз|you are here|вы здесь
sawah|dala|дала|rice field|поле
sungai|daryo|дарё|river|река
telaga|ko‘l|кўл|pond|пруд
Sampai jumpa di lembah.|Vodiyda ko‘rishguncha.|Водийда кўришгунча.|See you in the valley.|До встречи в долине.
Jejakmu sudah tercetak.|Javobingiz saqlandi.|Жавобингиз сақланди.|Your footprint is here.|Ваш след оставлен.
Salammu kami terima.|Javobingiz saqlandi.|Жавобингиз сақланди.|We received your greetings.|Мы получили ваш ответ.
Kami tunggu kabar baiknya.|Javobingizni kutamiz.|Жавобингизни кутамиз.|We will wait for your news.|Будем ждать ваших новостей.
Lihat lembah di belakang — ada yang sedang berjalan menuju pesta.|Vodiydagi mehmonni ko‘ring.|Водийдаги меҳмонни кўринг.|See the guest walking through the valley.|Посмотрите на гостя в долине.
Sebuah perahu kertas berlayar di telaga membawa salammu.|Salomingiz ko‘l bo‘ylab suzmoqda.|Саломингиз кўл бўйлаб сузмоқда.|A paper boat carries your greetings across the pond.|Бумажный кораблик несёт ваш привет по пруду.
Seseorang berdiri di mulut jalan, masih menimbang.|Sizning javobingizni kutamiz.|Сизнинг жавобингизни кутамиз.|Someone waits at the beginning of the path.|Кто-то ждёт у начала тропинки.
Memutar ulang hari dari fajar…|Tongga qaytmoqdamiz…|Тонгга қайтмоқдамиз…|Returning to dawn…|Возвращаемся к рассвету…
Kembang api menyala di hati kami.|Bayram mushaklari.|Байрам мушаклари.|Fireworks light up the night.|Фейерверк освещает ночь.
Lembah masih biru. Kabut tidur di atas sawah.|Vodiy hali moviy. Dalani tuman qoplagan.|Водий ҳали мовий. Далани туман қоплаган.|The valley is still blue. Mist rests over the fields.|Долина ещё синяя. Над полями дремлет туман.
Langit timur memerah muda. Telang membuka kelopak birunya.|Sharq osmoni pushti. Klitoriya ochilmoqda.|Шарқ осмони пушти. Клитория очилмоқда.|The eastern sky turns pink. Butterfly pea opens its blue petals.|Восточное небо розовеет. Клитория раскрывает синие лепестки.
Matahari naik dari balik gunung. Embun berkilau di ujung rumput.|Quyosh tog‘ ortidan chiqadi. Shabnam yaltiraydi.|Қуёш тоғ ортидан чиқади. Шабнам ялтирайди.|The sun rises behind the mountain. Dew sparkles on the grass.|Солнце встаёт из-за гор. На траве блестит роса.
Teratai di telaga mulai mekar. Burung-burung pagi melintas.|Ko‘lda nilufarlar ochiladi. Qushlar uchib o‘tadi.|Кўлда нилуфарлар очилади. Қушлар учиб ўтади.|Lotuses open on the pond. Morning birds fly past.|На пруду раскрываются лотосы. Пролетают утренние птицы.
Kabut pergi. Rumput tumbuh setinggi mata kaki.|Tuman tarqaladi. Maysa o‘smoqda.|Туман тарқалади. Майса ўсмоқда.|The mist clears. Grass grows around the path.|Туман уходит. Вдоль тропинки растёт трава.
Batu-batu jalan setapak muncul satu per satu.|So‘qmoq toshlari birin-ketin paydo bo‘ladi.|Сўқмоқ тошлари бирин-кетин пайдо бўлади.|The stones of the path appear one by one.|Камни тропинки появляются один за другим.
Pukul sembilan: bunga pukul sembilan menepati janjinya.|Soat to‘qqiz. Portulak gullari ochiladi.|Соат тўққиз. Портулак гуллари очилади.|Nine o’clock: the nine o’clock flowers keep their promise.|Девять часов: цветы раскрываются точно вовремя.
Janur kuning berdiri di mulut jalan. Kupu-kupu berdatangan.|Yo‘l boshida sariq bezak. Kapalaklar uchmoqda.|Йўл бошида сариқ безак. Капалаклар учмоқда.|Golden palm leaves mark the path. Butterflies arrive.|Золотые пальмовые листья украшают вход. Слетаются бабочки.
Gerbang kayu didirikan di bawah pohon trembesi.|Daraxt tagida yog‘och darvoza qad ko‘taradi.|Дарахт тагида ёғоч дарвоза қад кўтаради.|A wooden gateway rises beneath the rain tree.|Под раскидистым деревом появляются деревянные ворота.
Matahari tepat di atas kepala. Bunga matahari menengadah.|Quyosh tepada. Kungaboqarlar unga yuzlanadi.|Қуёш тепада. Кунгабоқарлар унга юзланади.|The sun is overhead. Sunflowers lift their heads.|Солнце в зените. Подсолнухи поднимают головы.
Kursi-kursi disusun, baris demi baris.|O‘rindiqlar qator-qator joylashadi.|Ўриндиқлар қатор-қатор жойлашади.|Chairs are arranged, row by row.|Ряд за рядом расставляются стулья.
Trembesi berbunga merah muda. Kelopaknya jatuh di lorong.|Daraxt pushti gullaydi. Gulbarglar yo‘lga tushadi.|Дарахт пушти гуллайди. Гулбарглар йўлга тушади.|The rain tree blossoms pink. Petals drift onto the aisle.|Дерево покрывается розовыми цветами. Лепестки падают на дорожку.
Meja panjang digelar, tiang-tiang lampu dibentangkan.|Uzun stol va chiroq ustunlari tayyorlanadi.|Узун стол ва чироқ устунлари тайёрланади.|A long table is set and strings of lights are hung.|Накрывают длинный стол и развешивают гирлянды.
Padi menguning di teras sawah. Angin sore mulai turun.|Dalada sholi sarg‘ayadi. Kechki shabada esadi.|Далада шоли сарғаяди. Кечки шабада эсади.|Rice turns golden on the terraces. An evening breeze arrives.|На террасах золотится рис. Приходит вечерний ветерок.
Pukul empat: bunga pukul empat bangun. Tamu mulai berdatangan.|Soat to‘rt. Mirabilis ochilib, mehmonlar keladi.|Соат тўрт. Мирабилис очилиб, меҳмонлар келади.|Four o’clock: evening flowers wake. Guests begin to arrive.|Четыре часа: просыпаются вечерние цветы. Приходят гости.
Cahaya keemasan. Dua orang berjalan pelan menuju gerbang.|Oltin yog‘du. Ikki inson darvoza sari yuradi.|Олтин ёғду. Икки инсон дарвоза сари юради.|Golden light. Two people walk slowly toward the gateway.|Золотой свет. Двое медленно идут к воротам.
Matahari tenggelam. Janji diucapkan di bawah langit jingga.|Quyosh botadi. To‘q sariq osmon ostida va’dalar aytiladi.|Қуёш ботади. Тўқ сариқ осмон остида ваъдалар айтилади.|The sun sets. Promises are made beneath an orange sky.|Солнце садится. Под оранжевым небом звучат обещания.
Lampu-lampu menyala satu per satu. Melati mulai harum.|Chiroqlar birin-ketin yonadi. Yasmin ifori taraladi.|Чироқлар бирин-кетин ёнади. Ясмин ифори таралади.|Lights come on one by one. Jasmine fills the air.|Один за другим зажигаются огни. Пахнет жасмином.
Bulan naik. Sedap malam menebar wangi.|Oy ko‘tariladi. Tuberoza ifori taraladi.|Ой кўтарилади. Тубероза ифори таралади.|The moon rises. Tuberose releases its fragrance.|Восходит луна. Тубероза наполняет воздух ароматом.
Kunang-kunang keluar dari rumput. Lembah berpesta pelan.|Maysa orasida chiroqlar. Vodiyda sokin bayram.|Майса орасида чироқлар. Водийда сокин байрам.|Fireflies rise from the grass. The valley celebrates quietly.|Из травы вылетают светлячки. Долина тихо празднует.
Wijayakusuma bersiap. Ia hanya mekar satu malam.|Tun malikasi tayyor. U faqat bir kecha ochiladi.|Тун маликаси тайёр. У фақат бир кеча очилади.|The queen of the night prepares to bloom for a single night.|Царица ночи готовится расцвести на одну ночь.
Wijayakusuma mekar. Malam ini tak akan terulang.|Tun malikasi ochildi. Bu kecha qaytmaydi.|Тун маликаси очилди. Бу кеча қайтмайди.|The queen of the night blooms. This night will never return.|Царица ночи расцвела. Эта ночь не повторится.
Kelopak birunya membuka sebelum matahari terbit; diseduh, ia jadi teh biru.|Moviy gulbarglar quyoshdan oldin ochiladi.|Мовий гулбарглар қуёшдан олдин очилади.|Its blue petals open before sunrise and make a blue tea.|Её синие лепестки раскрываются до рассвета и дают синий чай.
Bangun bersama matahari dari lumpur telaga, dan tetap bersih tanpa noda.|Quyosh bilan uyg‘onib, suvdan pok ko‘tariladi.|Қуёш билан уйғониб, сувдан пок кўтарилади.|It rises clean from the pond with the sun.|Он просыпается с солнцем и остаётся чистым над водой.
Sepanjang hari menoleh mengikuti matahari, dari timur ke barat.|Kun bo‘yi sharqdan g‘arbga quyoshga ergashadi.|Кун бўйи шарқдан ғарбга қуёшга эргашади.|It follows the sun from east to west through the day.|Весь день он следует за солнцем с востока на запад.
Namanya adalah janjinya: mekar sekitar pukul sembilan pagi.|Nomiga mos ravishda ertalab to‘qqizda ochiladi.|Номига мос равишда эрталаб тўққизда очилади.|Its name is its promise: it opens at about nine in the morning.|Его имя — обещание: он раскрывается около девяти утра.
Tidur seharian, bangun pukul empat sore, lalu harum sampai malam.|Kunduzi uxlaydi, soat to‘rtda ochilib, tungacha ifor taratadi.|Кундузи ухлайди, соат тўртда очилиб, тунгача ифор таратади.|It sleeps all day, opens at four and stays fragrant into the night.|Спит весь день, раскрывается в четыре и благоухает до ночи.
Kuncupnya dirangkai jadi ronce pengantin; harumnya menguat selepas senja.|Kurtaklari gulchambarga teriladi; ifori shomda kuchayadi.|Куртаклари гулчамбарга терилади; ифори шомда кучаяди.|Its buds form wedding garlands; its scent grows stronger after dusk.|Из бутонов плетут свадебные гирлянды; аромат усиливается после заката.
Wanginya baru terasa saat malam — penghias meja pesta di banyak pernikahan.|Tunda ifori seziladi — bayram dasturxoni bezagi.|Тунда ифори сезилади — байрам дастурхони безаги.|Its fragrance awakens at night, adorning many wedding tables.|Её аромат пробуждается ночью и украшает свадебные столы.
Mekar hanya satu malam, lalu menutup sebelum fajar. Langka, dan layak ditunggu.|Bir kecha ochilib, tonggacha yopiladi. Uni kutishga arziydi.|Бир кеча очилиб, тонггача ёпилади. Уни кутишга арзийди.|It blooms for one night, closing before dawn. Rare and worth the wait.|Цветёт одну ночь и закрывается до рассвета. Редкий цветок, которого стоит ждать.
24 jam|24 soat|24 соат|24 hours|24 часа
Lembah kembali mengikuti guliranmu.|Vodiy sahifaga ergashmoqda.|Водий саҳифага эргашмоқда.|The valley follows your scrolling again.|Долина снова следует за страницей.
setiap kotak adalah satu fajar — yang berkilau di ujung adalah hari kami|Har bir katak bir tong, oxirgisi bayram kunimiz.|Ҳар бир катак бир тонг, охиргиси байрам кунимиз.|Each tile is one dawn; the sparkling one is our day.|Каждая клетка — рассвет, последняя — наш день.
jadilah kunang-kunang pertama|Birinchi tilakni yozing|Биринчи тилакни ёзинг|Be the first firefly|Зажгите первый огонёк
masih menimbang…|hali o‘ylanmoqda…|ҳали ўйланмоқда…|still deciding…|ещё думает…
kamu|siz|сиз|you|вы
Nyalakan suara|Ovozni yoqish|Овозни ёқиш|Turn sound on|Включить звук
Matikan suara|Ovozni o‘chirish|Овозни ўчириш|Turn sound off|Выключить звук
U|Sh|Ш|N|С
Sampai jumpa di lembah — |Vodiyda ko‘rishguncha — |Водийда кўришгунча — |See you in the valley — |До встречи в долине — 
`;
  const runtime = Object.fromEntries(runtimeRows.trim().split("\n").map((line) => { const [key, ...values] = line.split("|"); return [key, values]; }));
  window.lanskapTranslate = (value) => {
    const source = String(value ?? "");
    const index = languages.indexOf(window.lanskapPlatform?.locale || "uz-Latn");
    if (runtime[source]) return runtime[source][index];
    for (const [original, values] of Object.entries(runtime)) if (values.includes(source)) return values[index];
    if (source.includes(" · ")) return source.split(" · ").map(window.lanskapTranslate).join(" · ");
    const parts = {
      "Catatan ": ["Qayd ", "Қайд ", "Note ", "Запись "],
      "pukul ": ["soat ", "соат ", "at ", "в "],
      "mekar: ": ["ochilgan: ", "очилган: ", "blooming: ", "цветёт: "],
      "mekar pukul ": ["ochilishi: ", "очилиши: ", "blooms at ", "цветёт в "],
      "Lihat lembah pukul ": ["Vodiyni ko‘rish: ", "Водийни кўриш: ", "See the valley at ", "Долина в "],
      "Mohon kabari kami sebelum ": ["Javob muddati: ", "Жавоб муддати: ", "Please reply before ", "Ответьте до "],
      "Buka foto ": ["Rasmni ochish ", "Расмни очиш ", "Open photo ", "Открыть фото "],
      "Doa dari ": ["Tilak: ", "Тилак: ", "Wish from ", "Пожелание от "],
      "Padang di belakang berbunga ": ["Vodiyda gullar ochildi: ", "Водийда гуллар очилди: ", "The valley blooms in ", "Долина цветёт цветом "],
      "Kami menikah pada ": ["To‘yimiz: ", "Тўйимиз: ", "We married on ", "Наша свадьба: "],
    };
    for (const [prefix, translations] of Object.entries(parts)) {
      if (source.startsWith(prefix)) return translations[index] + window.lanskapTranslate(source.slice(prefix.length));
      for (const localized of translations) if (source.startsWith(localized)) return translations[index] + window.lanskapTranslate(source.slice(localized.length));
    }
    const suffixes = { " menyala — lihat lembahnya.": [" yoqildi — vodiyga qarang.", " ёқилди — водийга қаранг.", " is on — watch the valley.", " включён — посмотрите на долину."], " — jam mekar ": [" — gullash vaqti: ", " — гуллаш вақти: ", " — bloom time for ", " — время цветения: "], ". Terima kasih sudah menemani fajar-fajar sebelumnya.": [". Birga bo‘lganingiz uchun rahmat.", ". Бирга бўлганингиз учун раҳмат.", ". Thank you for sharing our dawns.", ". Спасибо, что вы были с нами."] };
    for (const [part, values] of Object.entries(suffixes)) if (source.includes(part)) { const [left, right] = source.split(part); return window.lanskapTranslate(left) + values[index] + window.lanskapTranslate(right); }
    for (const [key, values] of Object.entries(runtime)) if (source === key.toLowerCase() || values.some((value) => source === value.toLowerCase())) return values[index].toLowerCase();
    const dynamic = [
      [/^(.+) mulai mekar$/, [" ochilmoqda", " очилмоқда", " begins to bloom", " начинает цвести"]],
      [/^(.+) kunang-kunang doa menyala di lembah$/, [" ta tilak chirog‘i", " та тилак чироғи", " wish fireflies in the valley", " светлячков пожеланий в долине"]],
    ];
    for (const [pattern, endings] of dynamic) { const match = pattern.exec(source); if (match) return window.lanskapTranslate(match[1]) + endings[index]; }
    for (const [pattern, endings] of dynamic) for (const ending of endings) if (source.endsWith(ending)) return window.lanskapTranslate(source.slice(0, -ending.length)) + endings[index];
    if (/\bselesai\b/.test(source)) return source.replace(/selesai/, ["yakunigacha", "якунигача", "until the end", "до окончания"][index]);
    if (/ mekar$/.test(source)) return window.lanskapTranslate(source.slice(0, -6)) + [" ochiladi", " очилади", " blooms", " цветёт"][index];
    return source;
  };
  window.lanskapLocalize = () => {
    for (const key of Object.keys(dictionary)) { const node = document.getElementById(key); if (node) { node.textContent = text(key); node.classList.remove("is-empty"); } }
    for (const id of ["rsvp-name", "wish-name"]) document.getElementById(id).placeholder = text("rsvp-name-l");
    document.getElementById("rsvp-msg").placeholder = text("rsvp-msg-l");
    document.getElementById("wish-msg").placeholder = text("wish-msg-l");
    const labels = { "viewer-close": ["Yopish", "Ёпиш", "Close", "Закрыть"], "viewer-prev": ["Oldingi rasm", "Олдинги расм", "Previous photo", "Предыдущее фото"], "viewer-next": ["Keyingi rasm", "Кейинги расм", "Next photo", "Следующее фото"], viewer: ["Rasmlar", "Расмлар", "Photos", "Фотографии"], "hud-clock": ["Gul soatini ochish", "Гул соатини очиш", "Open flower clock", "Открыть цветочные часы"], "hud-snd": ["Ovozni boshqarish", "Овозни бошқариш", "Toggle sound", "Переключить звук"], nav: ["Vodiy bo‘ylab", "Водий бўйлаб", "Valley timeline", "Время долины"] };
    labels.dial = ["Vodiy soati mili", "Водий соати мили", "Valley clock hand", "Стрелка часов долины"];
    labels.wj = ["Tun gulini ochish", "Тун гулини очиш", "Open the night flower", "Открыть ночной цветок"];
    labels["pf-b-frame"] = labels["pf-g-frame"] = ["Gulni ochish", "Гулни очиш", "Open the flower", "Раскрыть цветок"];
    labels["sec-cover"] = ["Taklifnoma muqovasi", "Таклифнома муқоваси", "Invitation cover", "Обложка приглашения"];
    const index = languages.indexOf(window.lanskapPlatform?.locale || "uz-Latn");
    for (const [id, values] of Object.entries(labels)) document.getElementById(id)?.setAttribute("aria-label", values[index]);
    for (const id of ["hero", "salam", "mempelai", "kisah", "jambunga", "bunyi", "menanti", "acara", "susunan", "lokasi", "busana", "galeri", "rsvp", "doa", "penutup"]) document.getElementById(`sec-${id}`)?.setAttribute("aria-label", text(`ni-${id}-t`));
  };
  window.lanskapLocalizeGenerated = () => {
    // Source-generated botanical labels; authored story/program/wish text is left intact.
    document.querySelectorAll(".jr, .vn, #hud, #hero-note, #dial-what, #flist, #vmap, #meet-svg, #rsvp-ok, #menanti-head, #dawns-cap, #fly-count, #pf-b-when, #pf-g-when, #pf-b-fl, #pf-g-fl, .pf-see, #ev-1-bloom, #ev-1-time").forEach((root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const translated = window.lanskapTranslate(node.textContent);
        if (translated !== node.textContent) node.textContent = translated;
      }
    });
    document.querySelectorAll('#pond-pads [aria-label], #flies [aria-label], #dial[aria-valuetext]').forEach((node) => {
      for (const attribute of ["aria-label", "aria-valuetext"]) {
        const value = node.getAttribute(attribute);
        if (value) { const translated = window.lanskapTranslate(value); if (value !== translated) node.setAttribute(attribute, translated); }
      }
    });
    const index = languages.indexOf(window.lanskapPlatform?.locale || "uz-Latn");
    const set = (id, value) => { const node = document.getElementById(id); if (node && node.textContent !== value) node.textContent = value; };
    const time = window.lanskapPlatform.eventTime || "";
    set("fc-akad", [window.lanskapPlatform.eventLabel, time].filter(Boolean).join(" · "));
    const now = new Date();
    const hm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    set("fc-now", ["Sizning joyingizda hozir soat ", "Сизнинг жойингизда ҳозир соат ", "Your local time is ", "Ваше местное время: "][index] + hm);
  };
  window.lanskapFormatDate = (o, noDay) => {
    if (!o) return "";
    const date = new Date(Date.UTC(o.y, o.m - 1, o.d));
    const locale = window.lanskapPlatform.locale;
    const months = locale === "uz-Cyrl" ? "январ феврал март апрел май июн июл август сентябр октябр ноябр декабр".split(" ") : "yanvar fevral mart aprel may iyun iyul avgust sentabr oktabr noyabr dekabr".split(" ");
    const days = locale === "uz-Cyrl" ? "якшанба душанба сешанба чоршанба пайшанба жума шанба".split(" ") : "yakshanba dushanba seshanba chorshanba payshanba juma shanba".split(" ");
    if (locale.startsWith("uz")) return (noDay ? "" : days[date.getUTCDay()] + ", ") + o.d + " " + months[o.m - 1] + " " + o.y;
    return date.toLocaleDateString(window.lanskapPlatform.intlLocale, { ...(noDay ? {} : { weekday: "long" }), day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  };
})();
