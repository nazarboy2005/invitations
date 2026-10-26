/* Built-in game copy only. Authored invitation text is never translated here. */
(() => {
  const rows = `
Tamu Istimewa|Aziz mehmon|Special guest|Дорогой гость
Peta|Xarita|Map|Карта
Putar|Aylantirish|Rotate|Повернуть
Misi Utama|Asosiy maqsad|Main quest|Главная цель
Jelajahi pulau|Orolni kezing|Explore the island|Исследуйте остров
Masuk|Kirish|Enter|Войти
WASD / panah: berjalan|WASD / strelkalar: yurish|WASD / arrows: walk|WASD / стрелки: идти
Seret: putar kamera|Surish: kamerani aylantirish|Drag: rotate camera|Перетаскивание: поворот камеры
Enter: masuk|Enter: kirish|Enter: enter|Enter: войти
M: peta|M: xarita|M: map|M: карта
Tampilan Biasa|Sahifa ko‘rinishi|Page view|Обычный вид
Mode Jelajah|Orol ko‘rinishi|Island view|Режим острова
Undangan Pernikahan|Nikoh to‘yiga taklifnoma|Wedding invitation|Приглашение на свадьбу
Semua jalan menuju pelaminan|Barcha yo‘llar baxt sari|All paths lead to our wedding|Все дороги ведут к свадьбе
Pemain 1 · Tamu Undangan|Birinchi o‘yinchi · Aziz mehmon|Player 1 · Invited guest|Игрок 1 · Дорогой гость
Kamu, tamu istimewa kami|Siz, aziz mehmonimiz|You, our special guest|Вы, наш дорогой гость
Memuat dunia|Orol yuklanmoqda|Loading the island|Загрузка острова
Tips: ketuk tanah untuk berjalan ke sana.|Maslahat: borish uchun yerga bosing.|Tip: tap the ground to walk there.|Совет: нажмите на землю, чтобы идти туда.
Tips: ikuti berlian emas untuk misi utama.|Maslahat: oltin belgiga ergashing.|Tip: follow the gold quest marker.|Совет: следуйте за золотым указателем.
Tips: ada enam harta tersembunyi di pulau ini.|Orolni o‘zingizga qulay sur’atda kezing.|Explore the island at your own pace.|Исследуйте остров в удобном темпе.
Tips: waktu di pulau berjalan — malam hari penuh kunang-kunang.|Maslahat: orolda kun va tun almashadi.|Tip: the island has a day and night cycle.|Совет: на острове сменяются день и ночь.
Tips: pesan yang kamu tinggalkan akan menjadi lentera.|Tilaklar egasi tasdiqlagach ko‘rinadi.|Wishes appear after the host approves them.|Пожелания появятся после одобрения хозяином.
Mulai Petualangan|Sayohatni boshlash|Start adventure|Начать путешествие
Mulai dari awal|Boshidan boshlash|Start over|Начать заново
Sebuah undangan pernikahan dunia terbuka. Jelajahi sesukamu — semua jalan tetap bermuara di hari bahagia kami.|Orol bo‘ylab erkin sayohat qiling. Har bir yo‘l bayramimiz sari olib boradi.|Explore freely. Every path leads to our happy day.|Путешествуйте свободно. Все дороги ведут к нашему празднику.
Dermaga Kedatangan|Kelish bandargohi|Arrival pier|Причал прибытия
Prolog|Muqaddima|Prologue|Пролог
Selamat datang di|Xush kelibsiz|Welcome to|Добро пожаловать на
Kartu Langka · Satu Party|Birgalikdagi sayohat|One shared adventure|Общее путешествие
Event utama dimulai|Bayram boshlanadi|The celebration begins|Праздник начинается
Cara bermain|Qanday o‘ynaladi|How to play|Как играть
Berjalan|Yurish|Walk|Ходить
— geser tongkat di kiri bawah, ketuk tanah, atau pakai WASD.|— joystikni suring, yerga bosing yoki WASD tugmalaridan foydalaning.|— use the joystick, tap the ground or use WASD.|— используйте джойстик, нажмите на землю или используйте WASD.
— dekati pintu sebuah bangunan; ketuk ikonnya untuk berjalan otomatis.|— binoga yaqinlashing yoki uning belgisini bosing.|— approach a building or tap its marker to walk automatically.|— подойдите к зданию или нажмите его значок.
Perjalanan cepat|Tezkor sayohat|Fast travel|Быстрое перемещение
— ketuk lokasi di bilah bawah atau di peta.|— pastki menyudan yoki xaritadan joy tanlang.|— choose a location in the bottom bar or on the map.|— выберите место внизу или на карте.
Mulai Jelajah|Sayrni boshlash|Start exploring|Начать прогулку
Lihat Peta Pulau|Orol xaritasi|Island map|Карта острова
Pilih Karakter|Juftlik|The couple|Молодожёны
Rumah Barat & Timur|Orolning ikki uyi|Two island homes|Два дома острова
Dua karakter dari dua sisi pulau. Masing-masing punya kelebihan dan kekurangan — dan ternyata, statistik kami saling melengkapi.|Birgalikdagi sayohatimizning bosh qahramonlari.|The main characters in our shared adventure.|Главные герои нашего общего путешествия.
Rumah Keluarga|Oila uyi|Family home|Семейный дом
Lanjut jelajah|Sayrni davom ettirish|Continue exploring|Продолжить прогулку
Lokasi berikutnya|Keyingi joy|Next location|Следующее место
Ruang Trofi|Hikoyamiz|Our story|Наша история
Pencapaian Terbuka|Xotiralar|Memories|Воспоминания
Pencapaian terbuka|Xotiralar|Memories|Воспоминания
Setiap babak kisah kami tersimpan sebagai pencapaian. Tidak ada yang dibeli — semuanya kami raih pelan-pelan, berdua.|Hikoyamizning har bir bobi — birgalikdagi xotira.|Each chapter of our story is a shared memory.|Каждая глава нашей истории — общее воспоминание.
Perunggu|Bronza|Bronze|Бронза
Perak|Kumush|Silver|Серебро
Emas|Oltin|Gold|Золото
Api Unggun|Gulxan|Campfire|Костёр
Titik Simpan|Taqvim|Save point|Точка сохранения
Api unggun ini menyimpan progresmu. Saat semua angkanya habis, event utama dimulai.|Bu gulxan yonida bayramgacha qolgan vaqtni bilib oling.|Rest by the campfire and count down to our celebration.|У костра можно узнать, сколько осталось до праздника.
Event utama dimulai dalam|Bayramgacha|The celebration starts in|До начала праздника
Hari|Kun|Days|Дней
Jam|Soat|Hours|Часов
Menit|Daqiqa|Minutes|Минут
Detik|Soniya|Seconds|Секунд
Event sedang berlangsung — sampai jumpa di sana!|Bayram boshlandi — sizni kutamiz!|The celebration has started — see you there!|Праздник начался — до встречи!
Simpan progres ke kalendermu supaya tidak terlewat.|Sanani taqvimingizga saqlang.|Save the date to your calendar.|Сохраните дату в календарь.
Google Kalender|Google Taqvim|Google Calendar|Google Календарь
Unduh .ics|.ics yuklash|Download .ics|Скачать .ics
Istirahat di api unggun sampai…|Orolda vaqtni tanlang…|Rest by the campfire until…|Отдыхать у костра до…
Pagi|Tong|Morning|Утро
Siang|Kunduz|Afternoon|День
Senja|Shom|Sunset|Закат
Malam|Tun|Night|Ночь
Pendopo Agung|Bayram saroyi|Celebration pavilion|Праздничный павильон
Hadir di Hari Bahagia|Baxtli kunimizda birga bo‘ling|Join our happy day|Разделите наш счастливый день
Tujuan 1|Asosiy tadbir|Main event|Главное событие
Tujuan utama|Asosiy tadbir|Main event|Главное событие
Pasang Penanda|Yo‘nalish|Directions|Маршрут
Simpan Tanggal|Sanani saqlash|Save the date|Сохранить дату
Catatan misi|Eslatma|Note|Примечание
Gapura Janur|Bayram darvozasi|Festival gate|Праздничные ворота
Jadwal Festival|Bayram dasturi|Celebration schedule|Программа праздника
Jadwal festival di hari-H. Butir yang sedang berlangsung akan menyala sendiri.|Bayram dasturi. Joriy bosqich o‘z vaqtida belgilanadi.|The celebration schedule. The current item lights up when it begins.|Программа праздника. Текущий пункт подсвечивается автоматически.
Menara Sinkronisasi|Xarita minorasi|Map tower|Картографическая башня
Puncak Bukit Utara|Shimoliy tepalik|Northern hilltop|Северный холм
Dari puncak menara ini, peta pulau bisa disinkronkan dengan peta dunia nyata. Sinkronkan, lalu pasang penanda ke lokasi acara.|Minora tepasidan bayram manziliga yo‘l toping.|Find the way from the island to our celebration.|Найдите путь с острова на наш праздник.
Sinkronisasi|Xarita|Map|Карта
Sinkronkan Peta|Xaritani ochish|Open map|Открыть карту
Peta tersinkron|Xarita tayyor|Map ready|Карта готова
Patokan|Mo‘ljal|Landmark|Ориентир
Pasang Penanda Arah|Yo‘nalishni ochish|Open directions|Открыть маршрут
Salin Alamat|Manzilni nusxalash|Copy address|Копировать адрес
Ruang Ganti|Kiyim xonasi|Dressing room|Гардеробная
Kostum Pesta|Bayram libosi|Celebration outfit|Праздничный наряд
Bapak/Ibu Tamu Undangan|Aziz mehmon|Dear guest|Дорогой гость
Kamu|Siz|You|Вы
Warna kostum|Libos rangi|Outfit colour|Цвет наряда
Gaya|Uslub|Style|Стиль
Rambut pendek|Qisqa soch|Short hair|Короткие волосы
Rambut panjang|Uzun soch|Long hair|Длинные волосы
Berhijab|Ro‘mol|Headscarf|Платок
Pakai Kostum Ini|Shu libosni kiyish|Wear this outfit|Надеть наряд
Pilih warna, lalu lihat karaktermu berganti kostum di pulau.|Rang tanlang va oroldagi qahramoningizga qo‘llang.|Choose a colour, then dress your island character.|Выберите цвет для своего персонажа на острове.
Kostum terpasang! Lihat karaktermu di pulau.|Libos tayyor! Orolga qayting.|Outfit ready! Return to the island.|Наряд готов! Вернитесь на остров.
Studio Foto|Fotostudiya|Photo studio|Фотостудия
Album Tangkapan Layar|Suratlar albomi|Photo album|Фотоальбом
Setiap foto di album ini adalah tangkapan layar dari petualangan kami. Ketuk untuk masuk ke mode foto.|Suratni kattalashtirish uchun bosing.|Tap a photo to open photo mode.|Нажмите на фото для просмотра.
MODE FOTO|FOTO REJIMI|PHOTO MODE|ФОТОРЕЖИМ
Balai Petualang|Mehmonlar uyi|Adventurers’ hall|Зал путешественников
Gabung Party (RSVP)|Ishtirok javobi|Join the party (RSVP)|Ответ на приглашение
Isi formulir di balai ini untuk bergabung ke party kami. Setiap balasan membantu kami menyiapkan kursi dan hidangan.|Ishtirokingiz haqida xabar bering. Javobingiz tayyorgarlikda yordam beradi.|Let us know if you can join us. Your reply helps us prepare.|Сообщите, сможете ли вы прийти. Ваш ответ поможет подготовиться.
Pendaftaran party ditutup|Javob muddati|Reply by|Ответить до
Nama pemain|Ismingiz|Your name|Ваше имя
Kamu ikut dalam party?|Kelasizmi?|Will you join us?|Вы придёте?
Ikut!|Kelaman|I will attend|Приду
Berhalangan|Kela olmayman|I cannot attend|Не смогу
Masih ragu|Hali aniq emas|Maybe|Пока не знаю
Pesan untuk kami|Izoh|Note for us|Сообщение для нас
Kirim Formulir Party|Javobni yuborish|Send reply|Отправить ответ
Pilih dulu apakah kamu ikut, ya — lalu kirim lagi.|Avval javobni tanlang.|Please choose your attendance first.|Сначала выберите ответ.
Kartu Anggota Party|Mehmon kartasi|Party member card|Карточка гостя
Pemain baru|Mehmon|Guest|Гость
Bergabung|Ishtirok etadi|Attending|Участвует
Formulirmu sudah kami terima. Terima kasih sudah bergabung!|Javobingiz qabul qilindi. Rahmat!|Your reply has been received. Thank you!|Ваш ответ получен. Спасибо!
Taman Pesan|Tilaklar bog‘i|Wishes garden|Сад пожеланий
Pesan dari Pemain Lain|Mehmonlar tilaklari|Guest wishes|Пожелания гостей
Tinggalkan pesan untuk kami. Setiap pesan akan menyala sebagai lentera di Taman Pesan dan bisa dibaca pemain lain yang lewat.|Tilagingizni qoldiring. Egasi tasdiqlagach, u bog‘da chiroq bo‘lib yonadi.|Leave us a wish. After host approval it will light a lantern in the garden.|Оставьте пожелание. После одобрения оно зажжёт фонарь в саду.
Nama|Ismingiz|Name|Имя
Pesan|Tilagingiz|Message|Пожелание
Nyalakan Lentera|Tilak yuborish|Light a lantern|Зажечь фонарь
Belum ada lentera yang menyala. Jadilah yang pertama!|Hozircha tasdiqlangan tilaklar yo‘q.|No approved wishes yet.|Одобренных пожеланий пока нет.
Bukit Senja|Shom tepaligi|Sunset hill|Закатный холм
Kredit Akhir|Yakun|Closing credits|Финальные титры
Pemeran utama|Bosh qahramonlar|Starring|В главных ролях
Dengan restu|Oila nomidan|With our families’ blessing|С благословением семей
Pemain istimewa|Aziz mehmon|Special guest|Дорогой гость
Kamu, yang sudah menjelajah sampai sini|Siz, sayohatimizning aziz mehmoni|You, our fellow adventurer|Вы, наш спутник в путешествии
Terima kasih telah bermain.|Sayohatingiz uchun rahmat.|Thank you for playing.|Спасибо за игру.
Putar Kredit|Yakuniy so‘zlar|Roll credits|Показать титры
Hentikan|To‘xtatish|Stop|Остановить
Main Lagi|Yana o‘ynash|Play again|Играть снова
Mempelai|Juftlik|Couple|Молодожёны
Kisah|Hikoya|Story|История
Waktu|Vaqt|Time|Время
Acara|Tadbir|Event|Событие
Susunan|Dastur|Schedule|Программа
Lokasi|Manzil|Venue|Место
Busana|Libos|Dress code|Дресс-код
Galeri|Suratlar|Gallery|Галерея
Ucapan|Tilaklar|Wishes|Пожелания
Kredit|Yakun|Credits|Титры
Peta Dunia|Orol xaritasi|World map|Карта мира
Terjelajahi|Ko‘rilgan|Explored|Исследовано
Ketuk penanda untuk melihat lokasi, lalu tekan Pergi.|Joy belgisini tanlang, so‘ng Borish tugmasini bosing.|Tap a marker, then choose Go.|Нажмите на значок, затем «Идти».
Pergi|Borish|Go|Идти
Normal|Asl|Normal|Обычный
Hangat|Iliq|Warm|Тёплый
Hitam putih|Oq-qora|Black and white|Чёрно-белый
Lokasi ditemukan|Yangi joy topildi|Location discovered|Место открыто
Tutup|Yopish|Close|Закрыть
Foto sebelumnya|Oldingi surat|Previous photo|Предыдущее фото
Foto berikutnya|Keyingi surat|Next photo|Следующее фото
Tutup mode foto|Foto rejimini yopish|Close photo mode|Закрыть фоторежим
Garis bantu|Kataklar|Grid|Сетка
Putar kamera|Kamerani aylantirish|Rotate camera|Повернуть камеру
Ganti tampilan|Ko‘rinishni almashtirish|Switch view|Сменить вид
Nyalakan atau matikan suara|Ovozni yoqish yoki o‘chirish|Toggle sound|Включить или выключить звук
Buka peta pulau|Orol xaritasini ochish|Open island map|Открыть карту острова
Peta pulau|Orol xaritasi|Island map|Карта острова
Perjalanan cepat|Tezkor sayohat|Fast travel|Быстрое перемещение
Alamat disalin|Manzil nusxalandi|Address copied|Адрес скопирован
Tersalin|Nusxalandi|Copied|Скопировано
Teks disalin|Matn nusxalandi|Text copied|Текст скопирован
Belum|Kutilmoqda|Upcoming|Ожидается
Berlangsung|Davom etmoqda|In progress|Идёт сейчас
Selesai|Tugadi|Finished|Завершено
Sepanjang hari|Kun bo‘yi|All day|Весь день
Waktu menyusul|Vaqt belgilanmagan|Time to be confirmed|Время уточняется

Batu Prasasti|Bitik toshi|Inscription stone|Камень с надписью
Penginapan|Mehmonxona|Guesthouse|Гостиница
Bioskop Pulau|Orol kinoteatri|Island cinema|Кинотеатр острова
Papan Misi|Vazifalar taxtasi|Quest board|Доска заданий
Kapal Karam|Eski kema|Shipwreck|Старый корабль
Sumur Harapan|Niyat qudug‘i|Wishing well|Колодец желаний
Pak Nelayan|Baliqchi|Fisherman|Рыбак
Pendoponya cantik sekali, ya! Aku sudah tidak sabar.|Bayram saroyi naqadar chiroyli! Bayramni intiqlik bilan kutyapman.|The pavilion is beautiful! I cannot wait.|Какой красивый павильон! Жду с нетерпением.
Sudah mampir ke Balai Petualang? Jangan lupa isi formulir party-nya!|Mehmonlar uyiga kirdingizmi? Ishtirokingiz haqida xabar bering.|Have you visited the hall? Remember to send your reply.|Вы уже были в зале гостей? Не забудьте ответить.
Kabarnya ada harta karun tersembunyi di sekitar pulau ini…|Orolning har bir burchagida yangi manzara bor…|Every corner of the island has something to discover…|В каждом уголке острова есть что открыть…
Warga Pulau|Orol aholisi|Island resident|Житель острова
Kembali ke Dermaga Kedatangan|Kelish bandargohiga qayting|Return to the arrival pier|Вернитесь к причалу
Baca Batu Prasasti di dekat dermaga|Bandargoh yonidagi bitikni o‘qing|Read the inscription by the pier|Прочитайте надпись у причала
Kunjungi rumah |Uyga tashrif buyuring: |Visit the home of |Посетите дом:\u0020
Lihat pencapaian di Ruang Trofi|Hikoyamiz bilan tanishing|Visit our story room|Узнайте нашу историю
Simpan progres di Api Unggun|Gulxan yonida sanani saqlang|Save the date by the campfire|Сохраните дату у костра
Datangi Pendopo Agung|Bayram saroyiga kiring|Visit the celebration pavilion|Посетите праздничный павильон
Lewati Gapura Janur|Bayram darvozasidan o‘ting|Visit the festival gate|Пройдите к праздничным воротам
Naik ke Menara Sinkronisasi|Xarita minorasiga chiqing|Climb the map tower|Поднимитесь на башню
Cek Penginapan untuk tamu jauh|Mehmonxonani ko‘ring|Visit the guesthouse|Посетите гостиницу
Ganti kostum di Ruang Ganti|Kiyim xonasida libos tanlang|Choose an outfit in the dressing room|Выберите наряд в гардеробной
Masuk ke Studio Foto|Fotostudiyaga kiring|Enter the photo studio|Войдите в фотостудию
Tonton adegan di Bioskop|Kinoteatrga kiring|Visit the cinema|Посетите кинотеатр
Ambil misi di Papan Misi|Vazifalar taxtasini ko‘ring|Visit the quest board|Посетите доску заданий
Buka jurnal di Kapal Karam|Eski kemadagi daftarni oching|Open the journal on the ship|Откройте журнал на корабле
Isi formulir party di Balai Petualang|Mehmonlar uyida javob qoldiring|Send your reply at the hall|Оставьте ответ в зале гостей
Mampir ke Sumur Harapan|Niyat qudug‘iga boring|Visit the wishing well|Посетите колодец желаний
Nyalakan lentera di Taman Pesan|Tilaklar bog‘ida chiroq yoqing|Light a lantern in the wishes garden|Зажгите фонарь в саду пожеланий
Tutup hari di Bukit Senja|Sayohatni Shom tepaligida yakunlang|End the day at sunset hill|Завершите день на закатном холме
Rumah |Uy: |Home: |Дом:\u0020
Berjalan ke |Bu joyga borish: |Walk to |Идти к:\u0020
Baca pesan dari |Tilakni o‘qish: |Read the wish from |Прочитать пожелание от:\u0020
Pesan dari |Tilak egasi: |Wish from |Пожелание от:\u0020
Klik lokasi mana pun untuk perjalanan cepat.|Tez borish uchun joyni bosing.|Tap a location to travel quickly.|Нажмите на место для быстрого перехода.
Perjalanan cepat ke |Tezkor sayohat: |Fast travel to |Быстрый переход:\u0020
 m dari sini| m masofada| m away| м отсюда
Kamu sudah di sini|Siz shu yerdasiz|You are here|Вы уже здесь
Jelajahi|Sayr qilish|Explore|Исследовать
Masuk ke |Kirish: |Enter |Войти:\u0020
Semua lokasi sudah kamu jelajahi. Sampai jumpa di hari-H!|Barcha joylarni ko‘rdingiz. Bayramda ko‘rishguncha!|You have explored every location. See you on our happy day!|Вы посетили все места. До встречи на празднике!
 misi sampingan diterima| ta vazifa qabul qilindi| side quests accepted| дополнительных заданий принято
Langkah Pertama|Birinchi qadam|First step|Первый шаг
Kamu tiba di |Xush kelibsiz: |You arrived at |Вы прибыли:\u0020
Penjelajah Pemula|Yangi sayohatchi|New explorer|Начинающий исследователь
Tiga lokasi sudah kamu kunjungi.|Uchta joyga tashrif buyurdingiz.|You have visited three locations.|Вы посетили три места.
Penjelajah Sejati|Mohir sayohatchi|True explorer|Настоящий исследователь
Semua lokasi di pulau sudah kamu jelajahi!|Oroldagi barcha joylarni ko‘rdingiz!|You explored the whole island!|Вы исследовали весь остров!
Tamu Teladan|E’tiborli mehmon|Thoughtful guest|Внимательный гость
Formulir party sudah terkirim.|Ishtirok javobingiz yuborildi.|Your attendance reply was sent.|Ваш ответ отправлен.
Pembawa Doa|Ezgu niyat|Well-wisher|Доброе пожелание
Lenteramu menyala di Taman Pesan.|Chirog‘ingiz Tilaklar bog‘ida yonmoqda.|Your lantern shines in the wishes garden.|Ваш фонарь горит в саду пожеланий.
Hati yang Lapang|Saxovatli qalb|Generous heart|Щедрое сердце
Koinmu jatuh ke Sumur Harapan.|Niyatingiz qabul qilindi.|Your wish was received.|Ваше пожелание получено.
Gaya Pesta|Bayram libosi|Party style|Праздничный стиль
Kostum baru sudah kamu kenakan.|Yangi libosingiz tayyor.|Your new outfit is ready.|Ваш новый наряд готов.
Pemburu Harta|Xazina izlovchi|Treasure hunter|Искатель сокровищ
Semua kenang-kenangan tersembunyi sudah ditemukan.|Barcha esdaliklar topildi.|All hidden keepsakes were found.|Все памятные вещи найдены.
Pengambil Misi|Vazifa oluvchi|Quest taker|Участник задания
Misi sampingan pertamamu sudah diterima.|Birinchi vazifangiz qabul qilindi.|Your first side quest was accepted.|Первое задание принято.
Lokasi |Joy |Location |Место\u0020
 dari | / | of | из\u0020
Beralih ke tampilan biasa|Sahifa ko‘rinishiga o‘tish|Switch to page view|Перейти в обычный вид
Beralih ke mode jelajah|Orol ko‘rinishiga o‘tish|Switch to island view|Перейти к острову
Lanjut Membaca|O‘qishni davom ettirish|Continue reading|Продолжить чтение
Tips|Maslahat|Tip|Совет
WASD untuk berjalan, seret untuk memutar kamera|Yurish uchun WASD, kamerani aylantirish uchun suring|Use WASD to walk and drag to rotate the camera|WASD — идти, перетаскивание — поворот камеры
Geser tongkat di kiri bawah, atau ketuk tanah untuk berjalan|Yurish uchun joystikni suring yoki yerga bosing|Move the joystick or tap the ground to walk|Двигайте джойстик или нажмите на землю
Ikuti berlian emas untuk misi utama.|Asosiy maqsad sari oltin belgiga ergashing.|Follow the gold marker to the main quest.|Следуйте за золотым указателем к главной цели.
Lanjutkan · |Davom etish · |Continue · |Продолжить ·\u0020
Pukul |Soat |At |В\u0020
 hari lagi| kun qoldi| days to go| дн. осталось
besok!|ertaga!|tomorrow!|завтра!
hari ini!|bugun!|today!|сегодня!
Event utama telah|Bayram|The celebration has|Праздник
berlangsung|boshlandi|started|начался
Prasasti menyala|Bitik yoritildi|Inscription illuminated|Надпись освещена
Party terbentuk! |Juftlik tayyor! |Party formed! |Пара готова!\u0020
 · rata-rata statistik | · o‘rtacha ko‘rsatkich | · average score | · средний показатель\u0020
Dua karakter, satu party.|Ikki qahramon, bir sayohat.|Two characters, one party.|Два героя, одно путешествие.
Pencapaian |Xotira |Memory |Воспоминание\u0020
Terbuka pada hari pernikahan|To‘y kuni ochiladi|Opens on the wedding day|Откроется в день свадьбы
Terbuka dalam |Ochilishiga |Opens in |Откроется через\u0020
 hari · | kun · | days · | дн. ·\u0020
Terbuka!|Ochildi!|Unlocked!|Открыто!
Diraih bersama semua tamu yang hadir.|Barcha mehmonlar bilan birga.|Together with all our guests.|Вместе со всеми гостями.
Legenda|Afsona|Legend|Легенда
Tanggal event akan segera diumumkan.|Tadbir sanasi tez orada e’lon qilinadi.|The event date will be announced soon.|Дата события будет объявлена позже.
Event utama telah selesai. Terima kasih sudah menjadi bagian dari cerita kami.|Bayram yakunlandi. Hikoyamizning bir bo‘lagi bo‘lganingiz uchun rahmat.|The celebration has ended. Thank you for being part of our story.|Праздник завершён. Спасибо, что стали частью нашей истории.
Titik simpan terakhir|Oxirgi bekat|Last save point|Последняя точка сохранения
Acara Utama|Asosiy tadbir|Main event|Главное событие
Sampai jumpa di hari bahagia kami!|Baxtli kunimizda ko‘rishguncha!|See you on our happy day!|До встречи на нашем празднике!
Besok: |Ertaga: |Tomorrow: |Завтра:\u0020
Progres tersimpan — berkas kalender diunduh.|Taqvim fayli yuklandi.|Calendar file downloaded.|Файл календаря загружен.
Titik simpan|Dam olish bekati|Save point|Точка сохранения
Kamu beristirahat sampai |Dam olish vaqti: |Resting until |Отдых до:\u0020
Waktu di pulau sudah berganti.|Orolda vaqt almashdi.|The time on the island has changed.|Время на острове изменилось.
Sedang berlangsung|Davom etmoqda|In progress|Идёт сейчас
Peta dunia nyata terbuka di layar menara.|Manzil xaritasi minora ekranida ochildi.|The venue map is open on the tower screen.|Карта места открыта на экране башни.
Tekan “Pasang Penanda Arah” untuk membuka petunjuk jalan.|Yo‘lni ko‘rish uchun “Yo‘nalishni ochish” tugmasini bosing.|Choose “Open directions” to see the route.|Нажмите «Открыть маршрут», чтобы увидеть путь.
Buka foto |Suratni ochish: |Open photo |Открыть фото:\u0020
 tangkapan| ta surat| photos| фото
Siaran langsung|Jonli efir|Live stream|Прямой эфир
Adegan ini tidak bisa dilewati — tapi boleh dijeda kapan saja.|Videoni istalgan vaqtda to‘xtatib turishingiz mumkin.|You can pause the video at any time.|Видео можно приостановить в любой момент.
Maaf, tombol lewati sedang dalam perbaikan.|Videoni ko‘rishni davom ettiring.|Continue watching the video.|Продолжайте просмотр видео.
Tenang, durasinya tidak lebih lama dari antrean prasmanan.|Kichik xotiramizdan bahramand bo‘ling.|Enjoy this little memory.|Насладитесь этим воспоминанием.
Misi diterima|Vazifa qabul qilindi|Quest accepted|Задание принято
Terima Misi|Vazifani olish|Accept quest|Принять задание
 misi sampingan diterima. Selesaikan di hari-H, ya!| ta vazifa qabul qilindi. Bayramda bajaring!| side quests accepted. Complete them on our happy day!| заданий принято. Выполните их на празднике!
Belum ada misi sampingan yang diterima.|Hozircha vazifa olinmagan.|No side quests accepted yet.|Задания пока не приняты.
Harta |Esdalik |Keepsake |Памятная вещь\u0020
Masih tersembunyi|Hali topilmagan|Still hidden|Пока не найдено
Harta ini belum kamu temukan|Bu esdalik hali topilmadi|You have not found this keepsake|Эта памятная вещь пока не найдена
Cari kilau emas yang melayang di sudut-sudut pulau.|Orolda oltin yaltirashlarni izlang.|Look for golden glints around the island.|Ищите золотые искры на острове.
Semua harta sudah kamu temukan. Pesan rahasia terbuka!|Barcha esdaliklar topildi. Maxfiy xabar ochildi!|All keepsakes found. Secret message unlocked!|Все памятные вещи найдены. Тайное послание открыто!
Ketuk setiap kotak untuk menggali hartanya.|Esdalikni ochish uchun katakni bosing.|Tap each box to reveal its keepsake.|Нажмите на ячейку, чтобы открыть памятную вещь.
Harta tersembunyi berkilau di sudut-sudut pulau. Dekati kilaunya untuk memungutnya.|Yashirin esdaliklar orol bo‘ylab yaltiraydi. Olish uchun yaqinlashing.|Hidden keepsakes sparkle around the island. Walk near to collect them.|Памятные вещи мерцают на острове. Подойдите, чтобы собрать их.
Harta ditemukan · |Esdalik topildi · |Keepsake found · |Найдена памятная вещь ·\u0020
Ikut party|Kelaman|Attending|Приду
Mendoakan dari jauh|Kela olmayman|Cannot attend|Не смогу прийти
Masih menimbang|Hali aniq emas|Maybe|Пока не знаю
Terima kasih sudah mengabari. Doamu tetap kami bawa sampai hari-H.|Xabar berganingiz uchun rahmat. Ezgu tilaklaringiz biz bilan.|Thank you for letting us know. Your good wishes are with us.|Спасибо за ответ. Ваши добрые пожелания с нами.
 lentera sudah menyala di Taman Pesan.| ta tilak chirog‘i yonmoqda.| lanterns shine in the wishes garden.| фонарей горит в саду пожеланий.
Tagar disalin|Heshteg nusxalandi|Hashtag copied|Хештег скопирован
Main lagi|Yana o‘ynash|Play again|Играть снова
Progres lokasi diulang — harta & misimu tetap tersimpan.|Sayohat boshlandi. Topilgan esdaliklar saqlanadi.|The journey has restarted. Your discoveries are kept.|Путешествие начато заново. Находки сохранены.
Lokasi Acara|Tadbir manzili|Event venue|Место события
 – selesai| — yakunigacha| — until the end| — до завершения
Keahlian Khusus|Alohida mahorat|Special skill|Особый навык
Item Andalan|Sevimli buyum|Signature item|Любимый предмет

Kebahagiaan|Baxt|Happiness|Счастье
Layar judul|Boshlanish sahifasi|Title screen|Начальный экран
dan|va|and|и
Pilih karakter|Juftlikni tanlash|Choose a character|Выберите персонажа
Tutup peta|Xaritani yopish|Close map|Закрыть карту
Mode foto|Foto rejimi|Photo mode|Фоторежим
Filter foto|Surat filtrlari|Photo filters|Фильтры фото
Hijau Daun|Barg yashili|Leaf green|Зелёный лист
Biru Laguna|Moviy|Lagoon blue|Голубая лагуна
Krem Pasir|Qumrang|Sand cream|Песочный
Jingga Senja|Shom zarg‘aldog‘i|Sunset orange|Закатный оранжевый
Sepia|Sepiya|Sepia|Сепия
SSR|Noyob|Rare|Редкое
U|Sh|N|С
Platinum|Platina|Platinum|Платина
RSVP|Javob|RSVP|Ответ
P1|1|1|1
P2|2|2|2
SS |Kadr |Frame |Кадр\u0020
`;
  const cyrl = (text) => {
    const pairs = {"o‘":"ў","g‘":"ғ",sh:"ш",ch:"ч",yo:"ё",yu:"ю",ya:"я",ye:"е",ts:"ц"};
    const letters = {a:"а",b:"б",d:"д",e:"е",f:"ф",g:"г",h:"ҳ",i:"и",j:"ж",k:"к",l:"л",m:"м",n:"н",o:"о",p:"п",q:"қ",r:"р",s:"с",t:"т",u:"у",v:"в",x:"х",y:"й",z:"з","‘":"ъ"};
    return text.replace(/o‘|g‘|sh|ch|yo|yu|ya|ye|ts|[a-z‘]/gi, (v) => { const value=pairs[v.toLowerCase()] || letters[v.toLowerCase()] || v;return v[0]===v[0].toUpperCase()?value[0].toUpperCase()+value.slice(1):value; });
  };
  const entries=Object.fromEntries(rows.trim().split('\n').filter(row => row.trim()).map(row=>{const [key,uz,en,ru]=row.split('|');return [key,{"uz-Latn":uz,"uz-Cyrl":cyrl(uz),en,ru}];}));
  for (const row of Object.values(entries)) if(row["uz-Latn"] && !entries[row["uz-Latn"]]) entries[row["uz-Latn"]]=row;
  window.PulauCopy = { entries, cyrl, translate(value, locale) {return entries[value]?.[locale] || value;} };
})();
