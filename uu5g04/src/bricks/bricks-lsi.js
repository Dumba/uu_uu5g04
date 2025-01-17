/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

import UU5 from "uu5g04";

const BricksLsi = {
  dataTable: {
    invalidDataLabel: {
      en: "Invalid data",
      cs: "Chybná data",
      sk: "Chybné dáta",
      uk: "Некоректні дані",
    },
  },
  homeScreen: {
    "cs-cs": {
      iOS:
        "<uu5string/>Pro vytvoření zástupce této webové aplikace otevřte menu sdílení a vyberte <strong>Přidat na Plochu</strong>.",
      android:
        "<uu5string/>Pro vytvoření zástupce této webové aplikace otevřte menu prohlížeče a vyberte <strong>Přidat na plochu</strong>.",
    },

    en: {
      iOS:
        "<uu5string/>To create a shortcut of this web app open the share menu and tap on <strong>Add to homescreen</strong>.",
      android:
        "<uu5string/>To create a shortcut of this web app open the browser option menu and tap on <strong>Add to homescreen</strong>.",
    },
    sk: {
      iOS:
        "<uu5string/>Pre vytvorenie zástupcu tejto webovej aplikácie otvorte menu zdieľania a vyberte <strong>Pridať na plochu</strong>.",
      android:
        "<uu5string/>Pre vytvorenie zástupcu tejto webovej aplikácie otvorte menu prehliadača a vyberte <strong>Pridať na plochu</strong>.",
    },
    uk: {
      iOS:
        "<uu5string/>Щоб створити посилання до цього веб-додатку, відкрийте меню Поділитись і натисніть <strong>Додати на домашній екран</strong>.",
      android:
        "<uu5string/>Щоб створити посилання до цього веб-додатку, відкрийте меню налаштувань браузера і натисніть <strong>Додати на домашній екран</strong>.",
    },

    /*'cs-cs': {
      iOS: '<uu5string/>Pro přidáni této webové aplikace na úvodní obrazovku: stlačte %icon a pak <strong>Přidat na úvodní obrazovku</strong>.',
      android: '<uu5string/>Pro přidáni této webové aplikace na úvodní obrazovku otevřete menu nastavení prohlížeče a stlačte <strong>Přidat na úvodní obrazovku</strong>. <small>K menu se dostanete stlačením hardwaroveho tlačítka, když ho vaše zařízení má, nebo stlačením pravé horní menu ikony <span className="ath-action-icon">icon</span>.</small>'
    },

    'de-de': {
      iOS: '<uu5string/>Um diese Web-App zum Home-Bildschirm hinzuzufügen, tippen Sie auf %icon und dann <strong>Zum Home-Bildschirm</strong>.',
      android: '<uu5string/>Um diese Web-App zum Home-Bildschirm hinzuzufügen, öffnen Sie das Menü und tippen dann auf <strong>Zum Startbildschirm hinzufügen</strong>. <small>Wenn Ihr Gerät eine Menütaste hat, lässt sich das Browsermenü über diese öffnen. Ansonsten tippen Sie auf %icon.</small>'
    },

    'da-dk': {
      iOS: '<uu5string/>For at tilføje denne web app til hjemmeskærmen: Tryk %icon og derefter <strong>Føj til hjemmeskærm</strong>.',
      android: '<uu5string/>For at tilføje denne web app til hjemmeskærmen, åbn browser egenskaber menuen og tryk på <strong>Føj til hjemmeskærm</strong>. <small>Denne menu kan tilgås ved at trykke på menu knappen, hvis din enhed har en, eller ved at trykke på det øverste højre menu ikon %icon.</small>'
    },

    'el-gr': {
      iOS: '<uu5string/>Για να προσθέσετε την εφαρμογή στην αρχική οθόνη: πατήστε το %icon και μετά <strong>Πρόσθεσε στην αρχική οθόνη</strong>.',
      android: '<uu5string/>Για να προσθέσετε την εφαρμογή στην αρχική οθόνη, ανοίξτε τις επιλογές του browser σας και πατήστε το <strong>Προσθήκη στην αρχική οθόνη</strong>. <small>Μπορείτε να έχετε πρόσβαση στο μενού, πατώντας το κουμπί του μενού του κινητού σας ή το πάνω δεξιά κουμπί του μενού %icon.</small>'
    },

    'en-us': {
      iOS: '<uu5string/>To add this web app to the home screen: tap %icon and then <strong>Add to Home Screen</strong>.',
      android: '<uu5string/>To add this web app to the home screen open the browser option menu and tap on <strong>Add to homescreen</strong>. <small>The menu can be accessed by pressing the menu hardware button if your device has one, or by tapping the top right menu icon %icon.</small>'
    },

    'es-es': {
      iOS: '<uu5string/>Para añadir esta aplicación web a la pantalla de inicio: pulsa %icon y selecciona <strong>Añadir a pantalla de inicio</strong>.',
      android: '<uu5string/>Para añadir esta aplicación web a la pantalla de inicio, abre las opciones y pulsa <strong>Añadir a pantalla inicio</strong>. <small>El menú se puede acceder pulsando el botón táctil en caso de tenerlo, o bien el icono de la parte superior derecha de la pantalla %icon.</small>'
    },

    'fi-fi': {
      iOS: '<uu5string/>Liitä tämä sovellus kotivalikkoon: klikkaa %icon ja tämän jälkeen <strong>Lisää kotivalikkoon</strong>.',
      android: '<uu5string/>Lisätäksesi tämän sovelluksen aloitusnäytölle, avaa selaimen valikko ja klikkaa tähti -ikonia tai <strong>Lisää aloitusnäytölle tekstiä</strong>. <small>Valikkoon pääsee myös painamalla menuvalikkoa, jos laitteessasi on sellainen tai koskettamalla oikealla yläkulmassa menu ikonia %icon.</small>'
    },

    'fr-fr': {
      iOS: '<uu5string/>Pour ajouter cette application web sur l\'écran d\'accueil : Appuyez %icon et sélectionnez <strong>Ajouter sur l\'écran d\'accueil</strong>.',
      android: '<uu5string/>Pour ajouter cette application web sur l\'écran d\'accueil : Appuyez sur le bouton "menu", puis sur <strong>Ajouter sur l\'écran d\'accueil</strong>. <small>Le menu peut-être accessible en appuyant sur le bouton "menu" du téléphone s\'il en possède un <i className="fa fa-bars"></i>. Sinon, il se trouve probablement dans la coin supérieur droit du navigateur %icon.</small>'
    },

    'he-il': {
      iOS: '<uu5string/><span dir="rtl">להוספת האפליקציה למסך הבית: ללחוץ על %icon ואז <strong>הוסף למסך הבית</strong>.</span>',
      android: '<uu5string/>To add this web app to the home screen open the browser option menu and tap on <strong>Add to homescreen</strong>. <small>The menu can be accessed by pressing the menu hardware button if your device has one, or by tapping the top right menu icon %icon.</small>'
    },

    'hu-hu': {
      iOS: '<uu5string/>Ha hozzá szeretné adni ezt az alkalmazást a kezdőképernyőjéhez, érintse meg a következő ikont: %icon , majd a <strong>Hozzáadás a kezdőképernyőhöz</strong> menüpontot.',
      android: '<uu5string/>Ha hozzá szeretné adni ezt az alkalmazást a kezdőképernyőjéhez, a böngésző menüjében kattintson a <strong>Hozzáadás a kezdőképernyőhöz</strong> menüpontra. <small>A böngésző menüjét a következő ikon megérintésével tudja megnyitni: %icon.</small>'
    },

    'it-it': {
      iOS: '<uu5string/>Per aggiungere questa web app alla schermata iniziale: premi %icon e poi <strong>Aggiungi a Home</strong>.',
      android: '<uu5string/>Per aggiungere questa web app alla schermata iniziale, apri il menu opzioni del browser e premi su <strong>Aggiungi alla homescreen</strong>. <small>Puoi accedere al menu premendo il pulsante hardware delle opzioni se la tua device ne ha uno, oppure premendo l\'icona %icon in alto a destra.</small>'
    },

    'ja-jp': {
      iOS: '<uu5string/>このウェプアプリをホーム画面に追加するには、%iconをタップして<strong>ホーム画面に追加</strong>してください。',
      android: '<uu5string/>このウェプアプリをホーム画面に追加するには、ブラウザのオプションメニューから<strong>ホーム画面に追加</strong>をタップしてください。<small>オプションメニューは、一部の機種ではデバイスのメニューボタンから、それ以外では画面右上の%iconからアクセスできます。</small>'
    },

    'ko-kr': {
      iOS: '<uu5string/>홈 화면에 바로가기 생성: %icon 을 클릭한 후 <strong>홈 화면에 추가</strong>.',
      android: '<uu5string/>브라우저 옵션 메뉴의 <string>홈 화면에 추가</string>를 클릭하여 홈화면에 바로가기를 생성할 수 있습니다. <small>옵션 메뉴는 장치의 메뉴 버튼을 누르거나 오른쪽 상단의 메뉴 아이콘 %icon을 클릭하여 접근할 수 있습니다.</small>'
    },

    'nb-no': {
      iOS: '<uu5string/>For å installere denne appen på hjem-skjermen: trykk på %icon og deretter <strong>Legg til på Hjem-skjerm</strong>.',
      android: '<uu5string/>For å legge til denne webappen på startsiden åpner en nettlesermenyen og velger <strong>Legg til på startsiden</strong>. <small>Menyen åpnes ved å trykke på den fysiske menyknappen hvis enheten har det, eller ved å trykke på menyikonet øverst til høyre %icon.</small>'
    },

    'pt-br': {
      iOS: '<uu5string/>Para adicionar este app à tela de início: clique %icon e então <strong>Tela de início</strong>.',
      android: '<uu5string/>Para adicionar este app à tela de início, abra o menu de opções do navegador e selecione <strong>Adicionar à tela inicial</strong>. <small>O menu pode ser acessado pressionando o "menu" button se o seu dispositivo tiver um, ou selecionando o ícone %icon no canto superior direito.</small>'
    },

    'pt-pt': {
      iOS: '<uu5string/>Para adicionar esta app ao ecrã principal: clique %icon e depois <strong>Ecrã principal</strong>.',
      android: '<uu5string/>Para adicionar esta app web ecrã principal, abra o menu de opções do navegador e selecione <strong>Adicionar à tela inicial</strong>. <small>O menu pode ser acessado pressionando o "menu" button se o seu dispositivo tiver um, ou selecionando o ícone %icon no canto superior direito.</small>'
    },

    'nl-nl': {
      iOS: '<uu5string/>Om deze webapp aan je startscherm toe te voegen, klik op %icon en dan <strong>Zet in startscherm</strong>.',
      android: '<uu5string/>Om deze webapp aan je startscherm toe te voegen, open de browserinstellingen en tik op <strong>Toevoegen aan startscherm</strong>. <small>Gebruik de "menu" knop als je telefoon die heeft, anders het menu-icoon rechtsbovenin %icon.</small>'
    },

    'ru-ru': {
      iOS: '<uu5string/>Чтобы добавить этот сайт на свой домашний экран, нажмите на иконку %icon и затем <strong>На экран "Домой"</strong>.',
      android: '<uu5string/>Чтобы добавить сайт на свой домашний экран, откройте меню браузера и нажмите на <strong>Добавить на главный экран</strong>. <small>Меню можно вызвать, нажав на кнопку меню вашего телефона, если она есть. Или найдите иконку сверху справа %icon[иконка].</small>'
    },

    'sk-sk': {
      iOS: '<uu5string/>Pre pridanie tejto webovej aplikácie na úvodnú obrazovku: stlačte %icon a potom <strong>Pridať na úvodnú obrazovku</strong>.',
      android: '<uu5string/>Pre pridanie tejto webovej aplikácie na úvodnú obrazovku otvorte menu nastavenia prehliadača a stlačte <strong>Pridať na úvodnú obrazovku</strong>. <small>K menu sa dostanete stlačením hardwaroveho tlačidla, ak ho vaše zariadenie má, alebo stlačením pravej hornej menu ikony <span className="ath-action-icon">icon</span>.</small>'
    },

    'sv-se': {
      iOS: '<uu5string/>För att lägga till denna webbapplikation på hemskärmen: tryck på %icon och därefter <strong>Lägg till på hemskärmen</strong>.',
      android: '<uu5string/>För att lägga till den här webbappen på hemskärmen öppnar du webbläsarens alternativ-meny och väljer <strong>Lägg till på startskärmen</strong>. <small>Man hittar menyn genom att trycka på hårdvaruknappen om din enhet har en sådan, eller genom att trycka på menyikonen högst upp till höger %icon.</small>'
    },

    'tr-tr': {
      iOS: '<uu5string/>Uygulamayı ana ekrana eklemek için, %icon ve ardından <strong>ana ekrana ekle</strong> butonunu tıklayın.',
      android: '<uu5string/>Uygulamayı ana ekrana eklemek için, menüye girin ve <strong>ana ekrana ekle</strong> butonunu tıklayın. <small>Cihazınız menü tuşuna sahip ise menüye girmek için menü tuşunu tıklayın. Aksi takdirde %icon butonunu tıklayın.</small>'
    },

    'uk-ua': {
      iOS: '<uu5string/>Щоб додати цей сайт на початковий екран, натисніть %icon, а потім <strong>На початковий екран</strong>.',
      android: '<uu5string/>Щоб додати цей сайт на домашній екран, відкрийте меню браузера та виберіть <strong>Додати на головний екран</strong>. <small>Це можливо зробити, натиснувши кнопку меню на вашому смартфоні, якщо така є. Або ж на іконці зверху справа %icon.</small>'
    },

    'zh-cn': {
      iOS: '<uu5string/>如要把应用程序加至主屏幕,请点击%icon, 然后<strong>添加到主屏幕</strong>',
      android: '<uu5string/>To add this web app to the home screen open the browser option menu and tap on <strong>Add to homescreen</strong>. <small>The menu can be accessed by pressing the menu hardware button if your device has one, or by tapping the top right menu icon %icon.</small>'
    },

    'zh-tw': {
      iOS: '<uu5string/>如要把應用程式加至主屏幕, 請點擊%icon, 然後<strong>加至主屏幕</strong>.',
      android: '<uu5string/>To add this web app to the home screen open the browser option menu and tap on <strong>Add to homescreen</strong>. <small>The menu can be accessed by pressing the menu hardware button if your device has one, or by tapping the top right menu icon %icon.</small>'
    }*/
  },
  spreadsheet: {
    invalidDataLabel: {
      cs: "Chybná data",
      nl: "Onjuiste data",
      en: "Invalid data",
      "en-gb": "Invalid data",
      "en-us": "Invalid data",
      fr: "Données invalides",
      de: "Ungültige Daten",
      pl: "Nieprawidłowe dane",
      ru: "Неверные данные",
      sk: "Neplatné údaje",
      es: "Datos inválidos",
      uk: "Невірні дані",
    },
  },
  calendar: {
    dayNames: {
      cs: ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"],
      nl: ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"],
      en: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "en-gb": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "en-us": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      fr: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
      de: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
      pl: ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"],
      ru: ["Понедельник", "Вторник", "Cреда", "Четверг", "Пятница", "Cуббота", "Воскресенье"],
      sk: ["Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota", "Nedeľa"],
      es: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
      uk: ["Понеділок", "Вівторок", "Cереда", "Четвер", "П'ятниця", "Cубота", "Неділя"],
    },
    dayNamesShort: {}, // filled in automatically below
    monthNames: {
      cs: [
        "leden",
        "únor",
        "březen",
        "duben",
        "květen",
        "červen",
        "červenec",
        "srpen",
        "září",
        "říjen",
        "listopad",
        "prosinec",
      ],
      nl: [
        "Januari",
        "Februari",
        "Maart",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Augustus",
        "September",
        "Oktober",
        "November",
        "December",
      ],
      en: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      "en-gb": [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      "en-us": [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      fr: [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
      ],
      de: [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember",
      ],
      pl: [
        "Styczeń",
        "Luty",
        "Marzec",
        "Kwiecień",
        "Maj",
        "Czerwiec",
        "Lipiec",
        "Sierpień",
        "Wrzesień",
        "Październik",
        "Listopad",
        "Grudzień",
      ],
      ru: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ],
      sk: [
        "Január",
        "Február",
        "Marec",
        "Apríl",
        "Máj",
        "Jún",
        "Júl",
        "August",
        "September",
        "Október",
        "November",
        "December",
      ],
      es: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
      uk: [
        "Січень",
        "Лютий",
        "Березень",
        "Квітень",
        "Травень",
        "Червень",
        "Липень",
        "Серпень",
        "Вересень",
        "Жовтень",
        "Листопад",
        "Грудень",
      ],
    },
    monthNamesShort: {
      en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      cs: ["led", "úno", "bře", "dub", "kvě", "čvn", "čvc", "srp", "zář", "říj", "lis", "pro"],
      sk: ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"],
      uk: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
    },
    today: {
      cs: "Dnes",
      en: "Today",
      sk: "Dnes",
      uk: "Сьогодні",
    },
    dateInPast: {
      cs: "Vybrané datum nemůže být v minulosti.",
      en: "Selected date cannot be in the past.",
      sk: "Vybraný dátum nemôže byť v minulosti",
      uk: "Обрана дата не може бути в минулому.",
    },
  },
  confirmModal: {
    confirmButtonText: {
      cs: "Souhlasím",
      en: "Confirm",
      sk: "Súhlasím",
      uk: "Підтвердити",
    },
    refuseButtonText: {
      cs: "Nesouhlasím",
      en: "Refuse",
      sk: "Nesúhlasím",
      uk: "Відхилити",
    },
  },
  sessionWatch: {
    header: {
      cs: "Relace brzy vyprší",
      en: "Session Expiring",
      sk: "Relácia čoskoro vyprší",
      uk: "Сесія скоро закінчиться",
    },
    content: {
      cs:
        "Po vypršení budete z bezpečnostních důvodů automaticky odhlášeni. Přihlašte se, aby se relace prodloužila, nebo si uložte rozpracovaná data.",
      en:
        "When your session expires you will be automatically logged out for security reasons. Please log in again to extend your session or save any unsaved changes.",
      sk:
        "Po vypršaní budete z bezpečnostných dôvodov automaticky odhlásený. Prihláste sa, aby sa relácia predĺžila, alebo si uložte rozpracované dáta.",
      uk:
        "Коли сесія закінчиться вас буде автоматично розлогінено з міркувань безпеки. Будь ласка, увійдіть знову щоб продовжити сесію або зберегти внесені зміни.",
    },
    logInButton: {
      cs: "Přihlásit se",
      en: "Log in",
      sk: "Prihlásiť sa",
      uk: "Увійти",
    },
    cancelButton: {
      cs: "Zrušit",
      en: "Cancel",
      sk: "Zrušiť",
      uk: "Відмінити",
    },
  },
  colorPalette: {
    baseColor: {
      cs: "Základní barva",
      en: "Base color",
      sk: "Základná farba",
      uk: "Базовий колір",
    },
    shade: {
      cs: "Odstín",
      en: "Shade",
      sk: "Odtieň",
      uk: "Відтінок",
    },
    selectSchema: {
      cs: "Odstíny se zobrazí po vybrání barvy.",
      en: "Choose color to view shades.",
      sk: "Odtiene sa zobrazia po vybraní farby.",
      uk: "Щоб переглянути відтінки оберіть колір.",
    },
    noShades: {
      cs: "Tato barva nemá žádné odstíny.",
      en: "Shades not available for this color.",
      sk: "Táto farba nemá žiadne odtiene.",
      uk: "Для цього кольору немає доступних відтінків.",
    },
  },
  alertBus: {
    showAll: {
      cs: "Zobrazit všechny upozornění",
      en: "Show all alerts",
      sk: "Zobraziť všetky upozornenia",
      uk: "Показати всі сповіщення",
    },
    clearAll: {
      cs: "Vymazat vše",
      en: "Clear all",
      sk: "Vymazať všetko",
      uk: "Очистити все",
    },
  },
  contextMenu: {
    backButton: {
      cs: "Zpět",
      en: "Back",
      sk: "Späť",
      uk: "Назад",
    },
  },
  unauthenticated: {
    text: {
      cs: "Pouze přihlášený uživatel může zobrazit tento obsah.",
      en: "You are not authenticated to view this content.",
    },
    login: {
      cs: "Přihlásit se",
      en: "Log in",
    },
    inlineLogin: {
      cs: "Pro zobrazení obsahu se přihlašte",
      en: "Log in to show content",
    },
  },
  unauthorized: {
    text: {
      cs: "Nemáte potřebná práva k zobrazení tohoto obsahu.",
      en: "You don't have rights to see this content.",
    },
  },
  modalBus: {
    collapse: {
      cs: "Sbalit",
      en: "Collapse",
    },
    expand: {
      cs: "Rozbalit",
      en: "Expand",
    },
    inactiveModal: {
      cs: "Neaktivní modal",
      en: "Inactive modal",
    },
  },
  inlineComponentHeaders: {
    accordionEditHeader: {
      cs: "Upravit accordion",
      en: "Edit accordion",
    },
    accordionName: {
      cs: "Akordeon",
      en: "Accordion",
    },
    cardEditHeader: {
      cs: "Upravit kartu",
      en: "Edit card",
    },
    cardName: {
      en: "Card",
      cs: "Karta",
    },
    containerEditHeader: {
      cs: "Upravit kontejner",
      en: "Edit container",
    },
    containerName: {
      cs: "Kontejner",
      en: "Container",
    },
    dataTableName: {
      cs: "Tabulka s daty",
      en: "Data table",
    },
    googleMapName: {
      cs: "Mapa",
      en: "Map",
    },
    imageName: {
      cs: "Obrázek",
      en: "Image",
    },
    newspaperName: {
      cs: "Zprávy",
      en: "Newspaper",
    },
    newspaperEditHeader: {
      cs: "Upravit zprávy",
      en: "Edit newspaper",
    },
    qRCodeModalHeader: {
      cs: "Upravit QR kód",
      en: "Edit QR code",
    },
    qRCodeName: {
      cs: "QR kód",
      en: "QR code",
    },
    sectionName: {
      en: "Section",
      cs: "Sekce",
    },
    sectionEditHeader: {
      cs: "Editace sekce",
      en: "Section editation",
    },
    tableName: {
      cs: "Tabulka",
      en: "Table",
    },
    tabsName: {
      en: "Tabs",
      cs: "Taby",
    },
    tabsEditHeader: {
      cs: "Editace záložek",
      en: "Tabs editation",
    },
    carouselEditHeader: {
      cs: "Upravit carousel",
      en: "Edit carousel",
    },
    carouselName: { en: "Carousel", cs: "Carousel" },
    panelEditHeader: {
      cs: "Upravit panel",
      en: "Edit panel",
    },
  },
  cookieBar: {
    close: {
      cs: "Zavřít",
      en: "Close",
      sk: "Zavrieť",
      uk: "Закрити",
    }
  }
};

function getWeekDayNamesShort(lang) {
  let formatter = new Intl.DateTimeFormat(lang, { timeZone: "UTC", weekday: "short" });
  let names = [2, 3, 4, 5, 6, 7, 8].map((it) => formatter.format(Date.UTC(2020, 10, it)));
  let capitalizedNames = names.map((it) => it.charAt(0).toUpperCase() + it.substring(1, 2));
  return capitalizedNames;
}

for (let lang in UU5.Environment.languageList) {
  BricksLsi.calendar.dayNamesShort[lang] = getWeekDayNamesShort(lang);
}

export { BricksLsi };
export default BricksLsi;
