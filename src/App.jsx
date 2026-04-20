import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Ellipsis,
  Home,
  Mail,
  MessageCirclePlus,
} from 'lucide-react'
import './App.css'

const DEMO_PROFILES = {
  recepce: {
    employeeName: 'Eva Svobodová',
    employeeRole: 'Specialistka recepce',
    hotelLabel: 'Orea Pyramida, Praha',
    alert: 'Dnes v 16:30 proběhne krátké požární cvičení.',
    shifts: [
      {
        id: 'shift-1',
        dateLabel: 'Dnes',
        date: 'Po 13. 4.',
        time: '14:00 - 22:00',
        role: 'Recepce',
        location: 'Orea Hotel Pyramida',
        manager: 'Petra Nováková',
        coworkers: 'Jana K., Milan V.',
        notes: 'Počítejte s pozdními příjezdy konferenčních hostů.',
      },
      {
        id: 'shift-2',
        dateLabel: 'Zítra',
        date: 'Út 14. 4.',
        time: '06:00 - 14:00',
        role: 'Recepce',
        location: 'Orea Hotel Pyramida',
        manager: 'Petra Nováková',
        coworkers: 'Lukáš M., Anna B.',
        notes: 'Od 7:00 pomozte s ranní špičkou u snídaní.',
      },
    ],
    pendingActions: [
      'Potvrďte zítřejší ranní předání směny s Petrou',
      'Opravit záchod na pokoji 327',
      'Opravit zablokovaný výtah ve 13. patře',
    ],
    updates: [
      {
        id: 'upd-spa-closed',
        postedAt: 'Dnes 7:45',
        title: 'Vstup do spa je zavřený do 16:00',
        tone: 'urgent',
        tagLabel: 'Důležité',
        body: 'Hosty prosím veďte boční chodbou vedle lobby baru.',
      },
      {
        id: 'upd-conference-lobby',
        postedAt: 'Dnes 9:10',
        title: 'Konference v hlavním lobby baru',
        tone: 'urgent',
        tagLabel: 'Důležité',
        body: 'Od 12:00 omezený průchod hlavním vchodem — používejte boční vstup od parkoviště.',
      },
    ],
    gss: {
      score: 4.89,
      target: 4.9,
      highlightLabel: 'Výborné hodnocení hostů',
      praiseAuthor: 'Armin, Německo',
      praiseText:
        'Eva mi skvěle poradila, jak se dostat na pláž a dala nám přesně to, co jsme potřebovali. 5 hvězdiček.',
    },
  },
  housekeeping: {
    employeeName: 'Anna Bartošová',
    employeeRole: 'Pokojská',
    hotelLabel: 'Orea Pyramida, Praha',
    alert: 'Dnes od 15:00 probíhá kontrola kvality pokojů.',
    shifts: [
      {
        id: 'shift-hk-1',
        dateLabel: 'Dnes',
        date: 'Po 13. 4.',
        time: '07:00 - 15:00',
        role: 'Housekeeping',
        location: 'Orea Hotel Pyramida',
        manager: 'Ivana Kovářová',
        coworkers: 'Lenka P., Klára T.',
        notes: 'Priorita: pokoje 301-320 před 11:30.',
      },
      {
        id: 'shift-hk-2',
        dateLabel: 'Zítra',
        date: 'Út 14. 4.',
        time: '07:00 - 15:00',
        role: 'Housekeeping',
        location: 'Orea Hotel Pyramida',
        manager: 'Ivana Kovářová',
        coworkers: 'Monika R., Petra H.',
        notes: 'Převzít prádlo ze skladu do 8:00.',
      },
    ],
    pendingActions: ['Potvrďte převzetí zásob prádla na zítřek'],
    updates: [
      {
        id: 'upd-vip-arrivals',
        postedAt: 'Dnes 6:30',
        title: 'VIP příjezdy od 17:00',
        tone: 'urgent',
        tagLabel: 'Důležité',
        body: 'Připravte pokoje 312, 314 a 316 do 16:30.',
      },
    ],
    gss: {
      score: 4.91,
      target: 4.9,
      highlightLabel: 'Cíl je splněný',
      praiseAuthor: 'Marta, Polsko',
      praiseText:
        'Anna nám rychle připravila pokoj a byla velmi milá při řešení extra požadavku. 5 hvězdiček.',
    },
  },
}

const createTodoItems = (actions = []) =>
  actions.map((label, index) => ({
    id: `todo-${index}-${label}`,
    label,
    done: false,
  }))

const PROFILE_DETAILS = {
  recepce: {
    payrolls: [
      { id: 'pay-03-2026', label: 'Výplatní páska - březen 2026.pdf' },
      { id: 'pay-02-2026', label: 'Výplatní páska - únor 2026.pdf' },
    ],
    courses: [
      { id: 'course-bozp', title: 'BOZP - aktualizace 2026', status: 'done' },
      { id: 'course-fire', title: 'Požární bezpečnost', status: 'in_progress' },
      { id: 'course-guest-care', title: 'Guest care standard', status: 'required' },
    ],
    positions: [
      {
        id: 'pos-front-office-junior',
        title: 'Junior Front Office',
        period: '2022 - 2023',
        summary: 'Podpora check-in/check-out procesů a guest care.',
        responsibilities: [
          'Práce se systémem rezervací',
          'Komunikace s hosty při příjezdu i odjezdu',
          'Spolupráce s housekeeping na připravenosti pokojů',
        ],
        skills: ['Guest service', 'Front office systems', 'Team collaboration'],
      },
      {
        id: 'pos-recepce-specialist',
        title: 'Specialistka recepce',
        period: '2023 - současnost',
        summary: 'Koordinace směny recepce a podpora VIP příjezdů.',
        responsibilities: [
          'Koordinace provozu recepce na směně',
          'Řešení nestandardních požadavků hostů',
          'Mentoring nových kolegů na recepci',
        ],
        skills: ['Shift coordination', 'Conflict handling', 'Mentoring'],
      },
    ],
  },
  housekeeping: {
    payrolls: [
      { id: 'pay-03-2026', label: 'Výplatní páska - březen 2026.pdf' },
      { id: 'pay-02-2026', label: 'Výplatní páska - únor 2026.pdf' },
    ],
    courses: [
      { id: 'course-clean-standard', title: 'Standard úklidu OREA', status: 'done' },
      { id: 'course-chemicals', title: 'Bezpečnost práce s chemií', status: 'in_progress' },
      { id: 'course-vip-rooms', title: 'Příprava VIP pokojů', status: 'required' },
    ],
    positions: [
      {
        id: 'pos-housekeeping-assistant',
        title: 'Housekeeping Assistant',
        period: '2021 - 2023',
        summary: 'Příprava pokojů a podpora týmové kontroly kvality.',
        responsibilities: [
          'Úklid pokojů dle standardu OREA',
          'Doplňování skladových zásob na patrech',
          'Spolupráce při kontrolách kvality',
        ],
        skills: ['Quality standards', 'Attention to detail', 'Teamwork'],
      },
      {
        id: 'pos-room-attendant',
        title: 'Pokojská',
        period: '2023 - současnost',
        summary: 'Zodpovědnost za pokoje s prioritními příjezdy.',
        responsibilities: [
          'Plánování priorit dle příjezdů hostů',
          'Komunikace s recepcí a vedoucí směny',
          'Kontrola vybavení a readiness pokojů',
        ],
        skills: ['Prioritization', 'Cross-team communication', 'Operational reliability'],
      },
    ],
  },
}

const EXTERNAL_SYSTEMS = [
  {
    id: 'vema',
    label: 'Vema',
    url: 'https://intranet.orea.cz/vema',
    description: 'Personální a docházkový systém.',
  },
  {
    id: 'lutherone',
    label: 'LutherONE',
    url: 'https://intranet.orea.cz/lutherone',
    description: 'Vzdělávání a rozvoj.',
  },
  {
    id: 'bi-dwh',
    label: 'BI a DWH Orea',
    url: 'https://intranet.orea.cz/bi-dwh',
    description: 'Reporty a datový sklad.',
  },
]

const OPEN_POSITIONS = [
  {
    id: 'job-recepce-devet-skal',
    title: 'Recepční',
    location: 'Orea Hotel Devět Skal, Žďár nad Sázavou',
    isNew: true,
  },
  {
    id: 'job-kuchar-sklar',
    title: 'Kuchař',
    location: 'Orea Resort Sklář, Harrachov',
    isNew: false,
  },
  {
    id: 'job-provozni-pyramida',
    title: 'Provozní manažer',
    location: 'Orea Hotel Pyramida, Praha',
    isNew: false,
  },
]

const LANGUAGE_OPTIONS = [
  { value: 'cs', label: 'Čeština' },
  { value: 'en', label: 'English' },
  { value: 'uk', label: 'Українська' },
  { value: 'tl', label: 'Filipino' },
]

const TRANSLATIONS = {
  cs: {
    appName: 'OreaPeople',
    demoMode: 'Demo režim',
    homeOverview: 'tady je dnešní přehled',
    notifications: 'Notifikace',
    openUserProfile: 'Otevřít profil uživatele',
    nextShift: 'Další směna',
    nearestShifts: 'Nejbližší směny',
    openShiftCalendar: 'Další směny',
    requiresAttention: 'Vyžaduje pozornost',
    noImportantMessage: 'Dnes nejsou žádné důležité změny.',
    todo: 'TO DO',
    noTodoMessage: 'Nemáte žádný úkol k potvrzení.',
    askButton: 'Zeptat se',
    settings: 'Nastavení',
    language: 'Jazyk',
    oreaDigiBuddy: 'Orea DigiBuddy',
    oreaDigiBuddyAnswer: 'Orea DigiBuddy odpověď',
    noShift: 'Bez směny',
    today: 'Dnes',
    mode: 'Režim',
    frontDesk: 'Recepce',
    housekeeping: 'Housekeeping',
    back: 'Zpět',
    hotel: 'Hotel',
    email: 'E-mail',
    hrSupport: 'Podpora HR',
    payrolls: 'Výplatní pásky',
    courses: 'Kurzy',
    done: 'Hotovo',
    inProgress: 'Rozpracováno',
    required: 'Povinné',
    positionsAtOrea: 'Pozice v Orea',
    assignedEquipment: 'Svěřené vybavení',
    reportEquipmentIssue: 'Nahlásit závadu nebo potřebu nového vybavení',
    backToProfile: 'Zpět na profil',
    mainResponsibilities: 'Hlavní odpovědnosti',
    keySkills: 'Klíčové dovednosti',
    statusOffSite: 'Mimo směnu',
    statusOnShift: 'Na směně',
    statusPaused: 'Směna přerušená',
    statusEnded: 'Směna ukončená',
    lastAction: 'Poslední akce',
    nextShiftSentence: 'Vaše další směna',
    at: 'v',
    noShiftPlannedToday: 'Dnes nemáte naplánovanou směnu.',
    atShiftLocation: 'Jste na místě směny',
    imAtLocation: 'Jsem na místě',
    nextShiftStartsAt: 'Vaše další směna začíná v',
    clockIn: 'Clock in',
    clockOut: 'Clock-out',
    gss: 'Guest Satisfaction Score',
    targetReached: 'Cíl splněn',
    closeToTarget: 'Těsně pod cílem',
    noMoreShifts: 'Žádné další směny nejsou naplánované.',
    messages: 'Zprávy',
    quickMessages: 'Rychlé zprávy',
    emails: 'E-maily',
    broadcastMessages: 'Hromadná sdělení',
    backToConversations: 'Zpět na konverzace',
    writeMessageDemo: 'Napište zprávu... (demo)',
    new: 'Nové',
    backToEmailList: 'Zpět na seznam e-mailů',
    from: 'Od',
    time: 'Čas',
    confirmed: 'Potvrzeno',
    confirmRead: 'Potvrdit přečtení',
    newMessage: 'Nová zpráva',
    externalSystems: 'Další systémy',
    externalSystemsIntro:
      'Přístup přes OreaPeople jako druhý faktor. Na počítači by vás přihlášení v externím systému nejdřív vyzvalo k potvrzení v této mobilní aplikaci (v demu neukazujeme).',
    documents: 'Dokumenty',
    documents2faHint: 'Stažení je chráněno dvoufázovým ověřením v této aplikaci.',
    employmentContract: 'Pracovní smlouva.pdf',
    annualReview2025: 'Roční hodnocení za 2025',
    download: 'Stáhnout',
    digiBuddyIntro:
      'AI asistent nad interní dokumentací. V budoucnu poběží nad RAG databází firemního know-how.',
    digiBuddyPlaceholder: 'Napište dotaz (např. Jaký je postup při nočním check-inu?)',
    growthAndFeedback: 'Rozvoj a feedback',
    employeeSatisfaction: 'Zaměstnanecká spokojenost',
    npsIntro: 'Pravidelný měsíční pulse. Plný průzkum běží v LutherONE, v demu ukládáme odpověď jen lokálně.',
    thanksForFeedback: 'Děkujeme za zpětnou vazbu.',
    yourScore: 'Vaše hodnocení',
    npsQuestion: 'Když byste měli doporučit Orea jako zaměstnavatele, doporučili byste ho?',
    npsLow: '0 – Rozhodně ne',
    npsHigh: '10 – Rozhodně ano',
    npsAria: 'Hodnocení 0 až 10',
    requestsAndTimeOff: 'Žádanky a volno',
    vacation: 'Dovolená',
    vacationBalance: 'Zbývá vám 6,5 dne',
    requestVacation: 'Požádat o dovolenou',
    doctorLeavePass: 'Propustka k lékaři',
    newRequest: 'Nová žádanka',
    sickDayBalance: 'Zbývá: 2 ze 3 dnů',
    report: 'Nahlásit',
    businessTrip: 'Služební cesta',
    sickDay: 'Sick day',
    showRequestHistory: 'Zobrazit historii žádanek',
    benefits: 'Benefity',
    pluxeeCard: 'Pluxee karta',
    pluxeeBalance: 'Aktuální zůstatek: 2 400 Kč',
    companyDiscounts: 'Firemní slevy',
    activeOffers: '12 aktivních nabídek',
    benefitsAfterProbation: 'Benefity jsou dostupné po skončení zkušební doby.',
    referColleague: 'Doporuč kolegu',
    referralIntro: 'Znáte někoho, kdo by se k nám hodil? Za úspěšné doporučení získáte odměnu.',
    yourCode: 'Váš kód',
    shareCode: 'Sdílet kód',
    showOpenPositions: 'Zobrazit otevřené pozice',
    referralStats: 'Vaše doporučení: 1 aktivní, 0 přijatých',
    openPositions: 'Otevřené pozice',
    help: 'Pomoc',
    responseTime: 'Obvyklá doba odpovědi: do 24 hodin',
    anonymousReport: 'Anonymní oznámení',
    whistleIntro:
      'Chráněný kanál pro nahlášení neetického jednání v souladu se zákonem o ochraně oznamovatelů.',
    submitReport: 'Podat oznámení',
    identityProtected: 'Vaše identita zůstane chráněna.',
    mainNavigation: 'Main navigation',
    homeTab: 'Domů',
    messagesTab: 'Zprávy',
    moreTab: 'Více',
    calendarDotHint: 'Tečka označuje den s naplánovanou směnou.',
    close: 'Zavřít',
    shiftDetail: 'Detail směny',
    shiftManager: 'Vedoucí směny',
    coworkers: 'Na směně s vámi',
    importantNote: 'Důležitá poznámka',
    changeShift: 'Potřebuji změnit tuto směnu',
    shiftChangeReason: 'Důvod změny směny',
    familyReasons: 'Rodinné důvody',
    healthReasons: 'Zdravotní důvody',
    urgentPersonalSituation: 'Naléhavá osobní situace',
    replacementPreference: 'Preference náhrady',
    canArrangeSwap: 'Mohu se domluvit na výměně',
    needHelpCoveringShift: 'Prosím o pomoc s pokrytím směny',
    sendRequestToManager: 'Odeslat žádost vedoucí',
    swapSentPending: 'Odesláno. Čeká na schválení vedoucí.',
    clockInConfirmation: 'Clock in potvrzení',
    geolocation: 'Geolokace',
    clockInPrompt:
      'Detekovali jsme přítomnost na pracovišti. Chcete se nyní přihlásit na směnu pomocí Clock in?',
    later: 'Později',
    clockOutForm: 'Clock-out formulář',
    chooseDepartureType: 'Zvolte typ odchodu',
    departureType: 'Typ odchodu',
    pauseShift: 'Přerušit směnu',
    endShift: 'Ukončit směnu',
    pauseReasonRequired: 'Důvod přerušení (povinné)',
    departureNote: 'Poznámka k odchodu',
    pausePlaceholder: 'Např. Odcházím na cigáro',
    endPlaceholder: 'Např. Směna dokončena',
    additionalNote: 'Doplňující poznámka',
    additionalNotePlaceholder: 'Např. návrat za 10 minut / lékař',
    confirmClockOut: 'Potvrdit Clock-out',
    cancel: 'Zrušit',
    biometricVerification: 'Biometrické ověření',
    accessVerification: 'Ověření přístupu',
    verifyBiometricDemo: 'Ověřit biometrií (demo)',
    opened: 'Otevřeno',
    downloaded: 'Staženo',
    referralCodePrepared: 'Kód byl připraven ke sdílení.',
    referralCodeFallback: 'Kód: EVA-2026-REC',
    requestCreated: 'Žádanka „{request}“ byla v demu založena.',
    whistleAccepted: 'Oznámení bylo v demu přijato do chráněného kanálu.',
    equipmentReported: 'Požadavek byl v demu odeslán IT podpoře.',
    clockOutDefaultReason: 'Odcházím na krátkou přestávku',
    pauseShiftType: 'Přerušení směny',
    endShiftType: 'Ukončení směny',
    important: 'Důležité',
    hotelTarget: 'Cíl hotelu',
    broadcastHint:
      'Stejné důležité informace jako v sekci Vyžaduje pozornost na Domů. U povinných sdělení potvrďte přečtení zde.',
    verifyBiometricExternal:
      'Pro otevření systému v nové kartě potvrďte svou totožnost biometrií (demo simulace).',
    verifyBiometricDocument:
      'Pro stažení dokumentu potvrďte svou totožnost biometrií (demo simulace).',
    desktopApprovalHint: 'Při přihlášení z desktopu byste obdrželi požadavek na schválení zde v aplikaci.',
    sensitiveDocsHint:
      'Citlivé dokumenty jsou v produkci chráněny stejným druhým faktorem jako přístup k systémům.',
    assignedIphone: 'iPhone 14 — přiděleno 15.3.2024',
    assignedLaptop: 'Notebook Lenovo T14 — přiděleno 1.9.2023',
  },
  en: {
    appName: 'OreaPeople',
    demoMode: 'Demo mode',
    homeOverview: "here is today's overview",
    notifications: 'Notifications',
    openUserProfile: 'Open user profile',
    nextShift: 'Next shift',
    nearestShifts: 'Upcoming shifts',
    openShiftCalendar: 'More shifts',
    openNearestShifts: 'Upcoming shifts',
    requiresAttention: 'Requires attention',
    noImportantMessage: 'There are no important updates today.',
    todo: 'TO DO',
    noTodoMessage: 'No tasks to confirm.',
    askButton: 'Ask',
    settings: 'Settings',
    language: 'Language',
    oreaDigiBuddy: 'Orea DigiBuddy',
    oreaDigiBuddyAnswer: 'Orea DigiBuddy answer',
    ...{
      mode: 'Mode',
      frontDesk: 'Front desk',
      housekeeping: 'Housekeeping',
      back: 'Back',
      hotel: 'Hotel',
      email: 'Email',
      hrSupport: 'HR support',
      payrolls: 'Payslips',
      courses: 'Courses',
      done: 'Done',
      inProgress: 'In progress',
      required: 'Required',
      positionsAtOrea: 'Positions at Orea',
      assignedEquipment: 'Assigned equipment',
      reportEquipmentIssue: 'Report an issue or request new equipment',
      backToProfile: 'Back to profile',
      mainResponsibilities: 'Main responsibilities',
      keySkills: 'Key skills',
      statusOffSite: 'Off shift',
      statusOnShift: 'On shift',
      statusPaused: 'Shift paused',
      statusEnded: 'Shift ended',
      lastAction: 'Last action',
      nextShiftSentence: 'Your next shift',
      at: 'at',
      noShiftPlannedToday: 'No shift is scheduled for today.',
      atShiftLocation: 'You are at the shift location',
      imAtLocation: 'I am at location',
      nextShiftStartsAt: 'Your next shift starts at',
      clockIn: 'Clock in',
      clockOut: 'Clock-out',
      gss: 'Guest Satisfaction Score',
      targetReached: 'Target reached',
      closeToTarget: 'Just below target',
      noMoreShifts: 'No additional shifts are scheduled.',
      messages: 'Messages',
      quickMessages: 'Quick messages',
      emails: 'Emails',
      broadcastMessages: 'Broadcast announcements',
      backToConversations: 'Back to conversations',
      writeMessageDemo: 'Write a message... (demo)',
      new: 'New',
      backToEmailList: 'Back to email list',
      from: 'From',
      time: 'Time',
      confirmed: 'Confirmed',
      confirmRead: 'Confirm read',
      newMessage: 'New message',
      externalSystems: 'External systems',
      externalSystemsIntro:
        'Access via OreaPeople as a second factor. On desktop, login to an external system would first ask for confirmation in this mobile app (not shown in demo).',
      documents: 'Documents',
      documents2faHint: 'Download is protected by two-factor verification in this app.',
      employmentContract: 'Employment contract.pdf',
      annualReview2025: 'Annual review 2025',
      download: 'Download',
      digiBuddyIntro:
        'AI assistant over internal documentation. In the future it will run on a RAG company knowledge base.',
      digiBuddyPlaceholder: 'Write a question (e.g. What is the process for late-night check-in?)',
      growthAndFeedback: 'Growth and feedback',
      employeeSatisfaction: 'Employee satisfaction',
      npsIntro:
        'Regular monthly pulse. Full survey runs in LutherONE; in demo we only store the answer locally.',
      thanksForFeedback: 'Thank you for your feedback.',
      yourScore: 'Your score',
      npsQuestion: 'Would you recommend Orea as an employer?',
      npsLow: '0 - Definitely no',
      npsHigh: '10 - Definitely yes',
      npsAria: 'Rating 0 to 10',
      requestsAndTimeOff: 'Requests and time off',
      vacation: 'Vacation',
      vacationBalance: 'You have 6.5 days left',
      requestVacation: 'Request vacation',
      doctorLeavePass: 'Doctor appointment leave',
      newRequest: 'New request',
      sickDayBalance: 'Remaining: 2 of 3 days',
      report: 'Report',
      businessTrip: 'Business trip',
      sickDay: 'Sick day',
      showRequestHistory: 'Show request history',
      benefits: 'Benefits',
      pluxeeCard: 'Pluxee card',
      pluxeeBalance: 'Current balance: CZK 2,400',
      companyDiscounts: 'Company discounts',
      activeOffers: '12 active offers',
      benefitsAfterProbation: 'Benefits are available after probation period.',
      referColleague: 'Refer a colleague',
      referralIntro: 'Know someone who would fit? You get a reward for successful referral.',
      yourCode: 'Your code',
      shareCode: 'Share code',
      showOpenPositions: 'Show open positions',
      referralStats: 'Your referrals: 1 active, 0 hired',
      openPositions: 'Open positions',
      help: 'Help',
      responseTime: 'Usual response time: within 24 hours',
      anonymousReport: 'Anonymous report',
      whistleIntro:
        'Protected channel for reporting unethical behavior in line with whistleblower protection law.',
      submitReport: 'Submit report',
      identityProtected: 'Your identity will remain protected.',
      mainNavigation: 'Main navigation',
      homeTab: 'Home',
      messagesTab: 'Messages',
      moreTab: 'More',
      calendarDotHint: 'Dot indicates a day with planned shift.',
      close: 'Close',
      shiftDetail: 'Shift detail',
      shiftManager: 'Shift manager',
      coworkers: 'Coworkers on shift',
      importantNote: 'Important note',
      changeShift: 'I need to change this shift',
      shiftChangeReason: 'Shift change reason',
      familyReasons: 'Family reasons',
      healthReasons: 'Health reasons',
      urgentPersonalSituation: 'Urgent personal situation',
      replacementPreference: 'Replacement preference',
      canArrangeSwap: 'I can arrange a swap',
      needHelpCoveringShift: 'Please help cover this shift',
      sendRequestToManager: 'Send request to manager',
      swapSentPending: 'Sent. Waiting for manager approval.',
      clockInConfirmation: 'Clock in confirmation',
      geolocation: 'Geolocation',
      clockInPrompt:
        'We detected your presence at the workplace. Do you want to clock in now?',
      later: 'Later',
      clockOutForm: 'Clock-out form',
      chooseDepartureType: 'Choose departure type',
      departureType: 'Departure type',
      pauseShift: 'Pause shift',
      endShift: 'End shift',
      pauseReasonRequired: 'Pause reason (required)',
      departureNote: 'Departure note',
      pausePlaceholder: 'e.g. Going for a quick smoke break',
      endPlaceholder: 'e.g. Shift completed',
      additionalNote: 'Additional note',
      additionalNotePlaceholder: 'e.g. back in 10 minutes / doctor',
      confirmClockOut: 'Confirm clock-out',
      cancel: 'Cancel',
      biometricVerification: 'Biometric verification',
      accessVerification: 'Access verification',
      verifyBiometricDemo: 'Verify biometrically (demo)',
      opened: 'Opened',
      downloaded: 'Downloaded',
      referralCodePrepared: 'Code prepared for sharing.',
      referralCodeFallback: 'Code: EVA-2026-REC',
      requestCreated: 'Request "{request}" has been created in demo.',
      whistleAccepted: 'Report has been received in the protected demo channel.',
      equipmentReported: 'Request has been sent to IT support in demo.',
      clockOutDefaultReason: 'I am taking a short break',
      pauseShiftType: 'Shift pause',
      endShiftType: 'Shift end',
      important: 'Important',
      hotelTarget: 'Hotel target',
      broadcastHint:
        'The same important information as in the Requires attention section on Home. Confirm mandatory announcements as read here.',
      verifyBiometricExternal:
        'To open the system in a new tab, confirm your identity with biometrics (demo simulation).',
      verifyBiometricDocument:
        'To download the document, confirm your identity with biometrics (demo simulation).',
      desktopApprovalHint:
        'When logging in from desktop, you would receive an approval request here in the app.',
      sensitiveDocsHint:
        'Sensitive documents are protected in production by the same second factor as system access.',
      assignedIphone: 'iPhone 14 - assigned 15/03/2024',
      assignedLaptop: 'Lenovo T14 laptop - assigned 01/09/2023',
    },
  },
  uk: {
    appName: 'OreaPeople',
    demoMode: 'Демо режим',
    homeOverview: 'ось огляд на сьогодні',
    notifications: 'Сповіщення',
    openUserProfile: 'Відкрити профіль',
    nextShift: 'Наступна зміна',
    nearestShifts: 'Найближчі зміни',
    openShiftCalendar: 'Наступні зміни',
    openNearestShifts: 'Найближчі зміни',
    requiresAttention: 'Потребує уваги',
    noImportantMessage: 'Сьогодні немає важливих змін.',
    todo: 'TO DO',
    noTodoMessage: 'Немає завдань для підтвердження.',
    askButton: 'Запитати',
    settings: 'Налаштування',
    language: 'Мова',
    oreaDigiBuddy: 'Orea DigiBuddy',
    oreaDigiBuddyAnswer: 'Відповідь Orea DigiBuddy',
    mode: 'Режим',
    frontDesk: 'Рецепція',
    housekeeping: 'Хаускіпінг',
    back: 'Назад',
    hotel: 'Готель',
    email: 'Е-mail',
    hrSupport: 'Підтримка HR',
    payrolls: 'Розрахункові листи',
    courses: 'Курси',
    done: 'Готово',
    inProgress: 'У процесі',
    required: "Обов'язково",
    positionsAtOrea: 'Посади в Orea',
    assignedEquipment: 'Закріплене обладнання',
    reportEquipmentIssue: 'Повідомити про несправність або потребу в новому обладнанні',
    backToProfile: 'Назад до профілю',
    mainResponsibilities: 'Основні обовʼязки',
    keySkills: 'Ключові навички',
    statusOffSite: 'Поза зміною',
    statusOnShift: 'На зміні',
    statusPaused: 'Зміну призупинено',
    statusEnded: 'Зміну завершено',
    lastAction: 'Остання дія',
    nextShiftSentence: 'Ваша наступна зміна',
    at: 'в',
    noShiftPlannedToday: 'На сьогодні зміна не запланована.',
    atShiftLocation: 'Ви на місці зміни',
    imAtLocation: 'Я на місці',
    nextShiftStartsAt: 'Ваша наступна зміна починається о',
    clockIn: 'Clock in',
    clockOut: 'Clock-out',
    gss: 'Guest Satisfaction Score',
    targetReached: 'Ціль виконано',
    closeToTarget: 'Трохи нижче цілі',
    noMoreShifts: 'Додаткові зміни не заплановано.',
    messages: 'Повідомлення',
    quickMessages: 'Швидкі повідомлення',
    emails: 'Електронні листи',
    broadcastMessages: 'Масові повідомлення',
    backToConversations: 'Назад до розмов',
    writeMessageDemo: 'Напишіть повідомлення... (демо)',
    new: 'Нове',
    backToEmailList: 'Назад до списку листів',
    from: 'Від',
    time: 'Час',
    confirmed: 'Підтверджено',
    confirmRead: 'Підтвердити прочитання',
    newMessage: 'Нове повідомлення',
    externalSystems: 'Інші системи',
    externalSystemsIntro:
      'Доступ через OreaPeople як другий фактор. На комп’ютері вхід до зовнішньої системи спочатку попросить підтвердження в цьому мобільному застосунку (у демо не показуємо).',
    documents: 'Документи',
    documents2faHint: 'Завантаження захищене двофакторною перевіркою в цьому застосунку.',
    employmentContract: 'Трудовий договір.pdf',
    annualReview2025: 'Річна оцінка за 2025',
    download: 'Завантажити',
    digiBuddyIntro:
      'AI асистент по внутрішній документації. У майбутньому працюватиме на RAG-базі знань компанії.',
    digiBuddyPlaceholder: 'Напишіть запит (наприклад: Який процес нічного check-in?)',
    growthAndFeedback: 'Розвиток і зворотний зв’язок',
    employeeSatisfaction: 'Задоволеність працівників',
    npsIntro:
      'Регулярний щомісячний pulse. Повне опитування в LutherONE, у демо відповідь зберігається локально.',
    thanksForFeedback: 'Дякуємо за зворотний звʼязок.',
    yourScore: 'Ваша оцінка',
    npsQuestion: 'Чи порекомендували б ви Orea як роботодавця?',
    npsLow: '0 - Точно ні',
    npsHigh: '10 - Точно так',
    npsAria: 'Оцінка від 0 до 10',
    requestsAndTimeOff: 'Запити та відпустка',
    vacation: 'Відпустка',
    vacationBalance: 'У вас залишилось 6,5 дня',
    requestVacation: 'Подати заявку на відпустку',
    doctorLeavePass: 'Відпустка до лікаря',
    newRequest: 'Нова заявка',
    sickDayBalance: 'Залишилось: 2 з 3 днів',
    report: 'Повідомити',
    businessTrip: 'Службове відрядження',
    sickDay: 'Sick day',
    showRequestHistory: 'Показати історію заявок',
    benefits: 'Бенефіти',
    pluxeeCard: 'Картка Pluxee',
    pluxeeBalance: 'Поточний баланс: 2 400 Kč',
    companyDiscounts: 'Корпоративні знижки',
    activeOffers: '12 активних пропозицій',
    benefitsAfterProbation: 'Бенефіти доступні після випробувального терміну.',
    referColleague: 'Порекомендуй колегу',
    referralIntro: 'Знаєте когось, хто нам підійде? За успішну рекомендацію ви отримаєте бонус.',
    yourCode: 'Ваш код',
    shareCode: 'Поділитися кодом',
    showOpenPositions: 'Показати відкриті вакансії',
    referralStats: 'Ваші рекомендації: 1 активна, 0 прийнятих',
    openPositions: 'Відкриті вакансії',
    help: 'Допомога',
    responseTime: 'Звичайний час відповіді: до 24 годин',
    anonymousReport: 'Анонімне повідомлення',
    whistleIntro:
      'Захищений канал для повідомлення про неетичну поведінку згідно із законом про захист викривачів.',
    submitReport: 'Подати повідомлення',
    identityProtected: 'Ваша особа залишиться захищеною.',
    mainNavigation: 'Main navigation',
    homeTab: 'Головна',
    messagesTab: 'Повідомлення',
    moreTab: 'Більше',
    calendarDotHint: 'Крапка позначає день із запланованою зміною.',
    close: 'Закрити',
    shiftDetail: 'Деталь зміни',
    shiftManager: 'Керівник зміни',
    coworkers: 'На зміні з вами',
    importantNote: 'Важлива примітка',
    changeShift: 'Потрібно змінити цю зміну',
    shiftChangeReason: 'Причина зміни',
    familyReasons: 'Сімейні причини',
    healthReasons: "Причини здоров'я",
    urgentPersonalSituation: 'Термінова особиста ситуація',
    replacementPreference: 'Побажання заміни',
    canArrangeSwap: 'Можу домовитися про заміну',
    needHelpCoveringShift: 'Потрібна допомога з покриттям зміни',
    sendRequestToManager: 'Надіслати запит керівнику',
    swapSentPending: 'Надіслано. Очікує схвалення керівника.',
    clockInConfirmation: 'Підтвердження Clock in',
    geolocation: 'Геолокація',
    clockInPrompt: 'Ми виявили вашу присутність на робочому місці. Хочете зараз увійти в зміну?',
    later: 'Пізніше',
    clockOutForm: 'Форма Clock-out',
    chooseDepartureType: 'Оберіть тип виходу',
    departureType: 'Тип виходу',
    pauseShift: 'Призупинити зміну',
    endShift: 'Завершити зміну',
    pauseReasonRequired: 'Причина паузи (обовʼязково)',
    departureNote: 'Примітка до виходу',
    pausePlaceholder: 'Напр. виходжу на коротку перерву',
    endPlaceholder: 'Напр. зміну завершено',
    additionalNote: 'Додаткова примітка',
    additionalNotePlaceholder: 'Напр. повернуся за 10 хв / лікар',
    confirmClockOut: 'Підтвердити Clock-out',
    cancel: 'Скасувати',
    biometricVerification: 'Біометрична перевірка',
    accessVerification: 'Перевірка доступу',
    verifyBiometricDemo: 'Підтвердити біометрією (демо)',
    opened: 'Відкрито',
    downloaded: 'Завантажено',
    referralCodePrepared: 'Код підготовлено для поширення.',
    referralCodeFallback: 'Код: EVA-2026-REC',
    requestCreated: 'Заявку "{request}" створено в демо.',
    whistleAccepted: 'Повідомлення прийнято в захищений демо-канал.',
    equipmentReported: 'Запит надіслано до IT-підтримки в демо.',
    clockOutDefaultReason: 'Йду на коротку перерву',
    pauseShiftType: 'Пауза зміни',
    endShiftType: 'Завершення зміни',
    important: 'Важливо',
    hotelTarget: 'Ціль готелю',
    broadcastHint:
      'Ті самі важливі повідомлення, що й у секції Потребує уваги на Головній. Для обовʼязкових повідомлень підтвердьте прочитання тут.',
    verifyBiometricExternal:
      'Щоб відкрити систему в новій вкладці, підтвердьте особу біометрією (демо-симуляція).',
    verifyBiometricDocument:
      'Щоб завантажити документ, підтвердьте особу біометрією (демо-симуляція).',
    desktopApprovalHint:
      'Під час входу з десктопу ви б отримали запит на схвалення тут у застосунку.',
    sensitiveDocsHint:
      'Чутливі документи у продакшні захищені тим самим другим фактором, що й доступ до систем.',
    assignedIphone: 'iPhone 14 — призначено 15.3.2024',
    assignedLaptop: 'Ноутбук Lenovo T14 — призначено 1.9.2023',
  },
  tl: {
    appName: 'OreaPeople',
    demoMode: 'Demo mode',
    homeOverview: 'narito ang iyong buod ngayong araw',
    notifications: 'Mga notification',
    openUserProfile: 'Buksan ang profile ng user',
    nextShift: 'Susunod na shift',
    nearestShifts: 'Mga paparating na shift',
    openShiftCalendar: 'Mga susunod na shift',
    openNearestShifts: 'Mga paparating na shift',
    requiresAttention: 'Kailangang bigyan ng pansin',
    noImportantMessage: 'Walang mahahalagang update ngayon.',
    todo: 'TO DO',
    noTodoMessage: 'Walang task na kailangang kumpirmahin.',
    askButton: 'Magtanong',
    settings: 'Settings',
    language: 'Wika',
    oreaDigiBuddy: 'Orea DigiBuddy',
    oreaDigiBuddyAnswer: 'Sagot ng Orea DigiBuddy',
    mode: 'Mode',
    frontDesk: 'Front desk',
    housekeeping: 'Housekeeping',
    back: 'Bumalik',
    hotel: 'Hotel',
    email: 'Email',
    hrSupport: 'HR support',
    payrolls: 'Payslips',
    courses: 'Mga kurso',
    done: 'Tapos',
    inProgress: 'Kasalukuyang ginagawa',
    required: 'Required',
    positionsAtOrea: 'Mga posisyon sa Orea',
    assignedEquipment: 'Naka-assign na kagamitan',
    reportEquipmentIssue: 'I-report ang sira o humiling ng bagong kagamitan',
    backToProfile: 'Bumalik sa profile',
    mainResponsibilities: 'Pangunahing responsibilidad',
    keySkills: 'Mahahalagang kasanayan',
    statusOffSite: 'Wala sa shift',
    statusOnShift: 'Nasa shift',
    statusPaused: 'Naka-pause ang shift',
    statusEnded: 'Tapos na ang shift',
    lastAction: 'Huling aksyon',
    nextShiftSentence: 'Ang susunod mong shift',
    at: 'sa',
    noShiftPlannedToday: 'Walang naka-iskedyul na shift ngayon.',
    atShiftLocation: 'Nasa lugar ka ng shift',
    imAtLocation: 'Nasa lugar ako',
    nextShiftStartsAt: 'Magsisimula ang susunod mong shift sa',
    clockIn: 'Clock in',
    clockOut: 'Clock-out',
    gss: 'Guest Satisfaction Score',
    targetReached: 'Naabot ang target',
    closeToTarget: 'Bahagyang kulang sa target',
    noMoreShifts: 'Wala nang naka-iskedyul na shift.',
    messages: 'Mga mensahe',
    quickMessages: 'Mabilis na mensahe',
    emails: 'Mga email',
    broadcastMessages: 'Broadcast na mensahe',
    backToConversations: 'Bumalik sa usapan',
    writeMessageDemo: 'Mag-type ng mensahe... (demo)',
    new: 'Bago',
    backToEmailList: 'Bumalik sa listahan ng email',
    from: 'Mula',
    time: 'Oras',
    confirmed: 'Kumpirmado',
    confirmRead: 'Kumpirmahin ang nabasa',
    newMessage: 'Bagong mensahe',
    externalSystems: 'Ibang systems',
    externalSystemsIntro:
      'Access sa OreaPeople bilang second factor. Sa desktop, magre-request muna ng kumpirmasyon sa mobile app na ito bago pumasok sa external system (hindi ipinapakita sa demo).',
    documents: 'Mga dokumento',
    documents2faHint: 'Protektado ang pag-download ng two-factor verification sa app na ito.',
    employmentContract: 'Employment contract.pdf',
    annualReview2025: 'Taunang evaluation 2025',
    download: 'I-download',
    digiBuddyIntro:
      'AI assistant para sa internal documentation. Sa hinaharap, gagamit ito ng RAG database ng company know-how.',
    digiBuddyPlaceholder: 'Maglagay ng tanong (hal. Ano ang proseso sa late-night check-in?)',
    growthAndFeedback: 'Growth at feedback',
    employeeSatisfaction: 'Kasiyahan ng empleyado',
    npsIntro:
      'Regular na buwanang pulse. Ang full survey ay nasa LutherONE, at sa demo local lang ang save ng sagot.',
    thanksForFeedback: 'Salamat sa iyong feedback.',
    yourScore: 'Iyong score',
    npsQuestion: 'Irerekomenda mo ba ang Orea bilang employer?',
    npsLow: '0 - Hindi talaga',
    npsHigh: '10 - Oo talaga',
    npsAria: 'Rating 0 hanggang 10',
    requestsAndTimeOff: 'Requests at leave',
    vacation: 'Bakasyon',
    vacationBalance: 'May natitira kang 6.5 araw',
    requestVacation: 'Humiling ng bakasyon',
    doctorLeavePass: 'Leave para sa doktor',
    newRequest: 'Bagong request',
    sickDayBalance: 'Natitira: 2 sa 3 araw',
    report: 'I-report',
    businessTrip: 'Business trip',
    sickDay: 'Sick day',
    showRequestHistory: 'Ipakita ang history ng requests',
    benefits: 'Benefits',
    pluxeeCard: 'Pluxee card',
    pluxeeBalance: 'Kasalukuyang balanse: 2,400 CZK',
    companyDiscounts: 'Company discounts',
    activeOffers: '12 aktibong alok',
    benefitsAfterProbation: 'Available ang benefits matapos ang probation period.',
    referColleague: 'Mag-refer ng kasama',
    referralIntro: 'May kilala ka bang babagay sa amin? May reward para sa successful referral.',
    yourCode: 'Iyong code',
    shareCode: 'Ibahagi ang code',
    showOpenPositions: 'Ipakita ang open positions',
    referralStats: 'Iyong referrals: 1 active, 0 hired',
    openPositions: 'Open positions',
    help: 'Tulong',
    responseTime: 'Karaniwang oras ng sagot: hanggang 24 oras',
    anonymousReport: 'Anonymous report',
    whistleIntro:
      'Protektadong channel para i-report ang unethical behavior alinsunod sa whistleblower protection law.',
    submitReport: 'Magsumite ng report',
    identityProtected: 'Mananatiling protektado ang iyong identidad.',
    mainNavigation: 'Main navigation',
    homeTab: 'Home',
    messagesTab: 'Messages',
    moreTab: 'More',
    calendarDotHint: 'Ang tuldok ay nagpapakita ng araw na may naka-planong shift.',
    close: 'Isara',
    shiftDetail: 'Detalye ng shift',
    shiftManager: 'Shift manager',
    coworkers: 'Kasama mo sa shift',
    importantNote: 'Mahalagang tala',
    changeShift: 'Kailangan kong baguhin ang shift na ito',
    shiftChangeReason: 'Dahilan ng pagbabago ng shift',
    familyReasons: 'Dahilan ng pamilya',
    healthReasons: 'Dahilan ng kalusugan',
    urgentPersonalSituation: 'Agarang personal na sitwasyon',
    replacementPreference: 'Preference sa kapalit',
    canArrangeSwap: 'Kaya kong makipagpalit ng shift',
    needHelpCoveringShift: 'Kailangan ko ng tulong sa pag-cover ng shift',
    sendRequestToManager: 'Ipadala ang request sa manager',
    swapSentPending: 'Naipadala na. Naghihintay ng approval ng manager.',
    clockInConfirmation: 'Clock in confirmation',
    geolocation: 'Geolocation',
    clockInPrompt: 'Nakita namin na nasa workplace ka. Gusto mo bang mag-clock in ngayon?',
    later: 'Mamaya',
    clockOutForm: 'Clock-out form',
    chooseDepartureType: 'Piliin ang uri ng pag-alis',
    departureType: 'Uri ng pag-alis',
    pauseShift: 'I-pause ang shift',
    endShift: 'Tapusin ang shift',
    pauseReasonRequired: 'Dahilan ng pause (required)',
    departureNote: 'Note sa pag-alis',
    pausePlaceholder: 'hal. Maikling break muna',
    endPlaceholder: 'hal. Tapos na ang shift',
    additionalNote: 'Karagdagang tala',
    additionalNotePlaceholder: 'hal. balik sa 10 minuto / doktor',
    confirmClockOut: 'Kumpirmahin ang clock-out',
    cancel: 'Kanselahin',
    biometricVerification: 'Biometric verification',
    accessVerification: 'Pag-verify ng access',
    verifyBiometricDemo: 'I-verify gamit ang biometrics (demo)',
    opened: 'Binuksan',
    downloaded: 'Na-download',
    referralCodePrepared: 'Naihanda na ang code para ibahagi.',
    referralCodeFallback: 'Code: EVA-2026-REC',
    requestCreated: 'Nagawa na sa demo ang request na "{request}".',
    whistleAccepted: 'Natanggap ang report sa protected demo channel.',
    equipmentReported: 'Naipadala ang request sa IT support sa demo.',
    clockOutDefaultReason: 'Aalis muna ako para sa maikling break',
    pauseShiftType: 'Pag-pause ng shift',
    endShiftType: 'Pagtatapos ng shift',
    important: 'Mahalaga',
    hotelTarget: 'Target ng hotel',
    broadcastHint:
      'Parehong mahalagang impormasyon tulad ng nasa Requires attention sa Home. Kumpirmahin dito ang mandatory announcements na nabasa.',
    verifyBiometricExternal:
      'Para buksan ang system sa bagong tab, kumpirmahin ang identity gamit ang biometrics (demo simulation).',
    verifyBiometricDocument:
      'Para i-download ang dokumento, kumpirmahin ang identity gamit ang biometrics (demo simulation).',
    desktopApprovalHint:
      'Kapag nag-login mula desktop, makakatanggap ka ng approval request dito sa app.',
    sensitiveDocsHint:
      'Sa production, protektado ang sensitive documents ng kaparehong second factor gaya ng access sa systems.',
    assignedIphone: 'iPhone 14 — naka-assign noong 15.3.2024',
    assignedLaptop: 'Lenovo T14 laptop — naka-assign noong 1.9.2023',
  },
}

const getLocalizedProfileData = (profileKey, language) => {
  const baseProfile = DEMO_PROFILES[profileKey]
  if (language === 'cs') return baseProfile
  const translations = {
    en: {
      recepce: {
        employeeRole: 'Front Desk Specialist',
        alert: 'Today at 16:30 there will be a short fire drill.',
        pendingActions: [
          "Confirm tomorrow morning's handover with Petra",
          'Fix toilet in room 327',
          'Fix blocked elevator on the 13th floor',
        ],
        shiftLabels: ['Today', 'Tomorrow'],
        updateTag: 'Important',
        gssLabel: 'Excellent guest ratings',
        gssPraiseAuthor: 'Armin, Germany',
        gssPraiseText:
          'Eva gave me great advice on how to get to the beach and exactly what we needed. 5 stars.',
        shiftRoles: ['Front desk', 'Front desk'],
        shiftNotes: [
          'Expect late arrivals of conference guests.',
          'From 7:00 help with morning breakfast peak.',
        ],
        updates: [
          {
            postedAt: 'Today 7:45',
            title: 'Spa access is closed until 16:00',
            body: 'Please direct guests through the side hallway next to the lobby bar.',
          },
          {
            postedAt: 'Today 9:10',
            title: 'Conference in main lobby bar',
            body: 'From 12:00 main entrance is limited - use the side entrance from parking.',
          },
        ],
      },
      housekeeping: {
        employeeRole: 'Room attendant',
        alert: 'Today from 15:00 quality checks of rooms will take place.',
        pendingActions: ['Confirm linen stock handover for tomorrow'],
        shiftLabels: ['Today', 'Tomorrow'],
        updateTag: 'Important',
        gssLabel: 'Target achieved',
        gssPraiseAuthor: 'Marta, Poland',
        gssPraiseText:
          'Anna prepared our room quickly and was very kind when solving an extra request. 5 stars.',
        shiftRoles: ['Housekeeping', 'Housekeeping'],
        shiftNotes: [
          'Priority: rooms 301-320 before 11:30.',
          'Collect linen stock from storage by 8:00.',
        ],
        updates: [
          {
            postedAt: 'Today 6:30',
            title: 'VIP arrivals from 17:00',
            body: 'Prepare rooms 312, 314 and 316 by 16:30.',
          },
        ],
      },
    },
    uk: {
      recepce: {
        employeeRole: 'Фахівчиня рецепції',
        alert: 'Сьогодні о 16:30 відбудеться коротке пожежне тренування.',
        pendingActions: [
          'Підтвердьте завтрашню ранкову передачу зміни з Петрою',
          'Відремонтувати туалет у номері 327',
          'Полагодити заблокований ліфт на 13 поверсі',
        ],
        shiftLabels: ['Сьогодні', 'Завтра'],
        updateTag: 'Важливо',
        gssLabel: 'Відмінні оцінки гостей',
        gssPraiseAuthor: 'Армін, Німеччина',
        gssPraiseText:
          'Єва чудово порадила, як дістатися до пляжу, і дала нам саме те, що потрібно. 5 зірок.',
        shiftRoles: ['Рецепція', 'Рецепція'],
        shiftNotes: [
          'Очікуйте пізні заїзди учасників конференції.',
          'З 7:00 допоможіть із ранковим піком на сніданках.',
        ],
        updates: [
          {
            postedAt: 'Сьогодні 7:45',
            title: 'Вхід до спа зачинено до 16:00',
            body: 'Просимо вести гостей боковим коридором біля лобі-бару.',
          },
          {
            postedAt: 'Сьогодні 9:10',
            title: 'Конференція у головному лобі-барі',
            body: 'З 12:00 головний вхід обмежено — використовуйте бічний вхід з паркінгу.',
          },
        ],
      },
      housekeeping: {
        employeeRole: 'Покоївка',
        alert: 'Сьогодні з 15:00 відбувається контроль якості номерів.',
        pendingActions: ['Підтвердьте отримання запасів білизни на завтра'],
        shiftLabels: ['Сьогодні', 'Завтра'],
        updateTag: 'Важливо',
        gssLabel: 'Ціль досягнута',
        gssPraiseAuthor: 'Марта, Польща',
        gssPraiseText:
          'Анна швидко підготувала номер і була дуже привітна при вирішенні додаткового запиту. 5 зірок.',
        shiftRoles: ['Хаускіпінг', 'Хаускіпінг'],
        shiftNotes: [
          'Пріоритет: номери 301-320 до 11:30.',
          'Забрати запас білизни зі складу до 8:00.',
        ],
        updates: [
          {
            postedAt: 'Сьогодні 6:30',
            title: 'VIP-заїзди з 17:00',
            body: 'Підготуйте номери 312, 314 і 316 до 16:30.',
          },
        ],
      },
    },
    tl: {
      recepce: {
        employeeRole: 'Front desk specialist',
        alert: 'Ngayong 16:30 magkakaroon ng maikling fire drill.',
        pendingActions: [
          "Kumpirmahin ang handover ng shift bukas ng umaga kay Petra",
          'Ayusin ang toilet sa kuwarto 327',
          'Ayusin ang nakabarang elevator sa 13th floor',
        ],
        shiftLabels: ['Ngayon', 'Bukas'],
        updateTag: 'Mahalaga',
        gssLabel: 'Napakagandang rating ng bisita',
        gssPraiseAuthor: 'Armin, Germany',
        gssPraiseText:
          'Mahusay ang payo ni Eva kung paano pumunta sa beach at ibinigay niya ang eksaktong kailangan namin. 5 stars.',
        shiftRoles: ['Front desk', 'Front desk'],
        shiftNotes: [
          'Asahan ang late arrivals ng conference guests.',
          'Mula 7:00 tumulong sa morning peak ng breakfast.',
        ],
        updates: [
          {
            postedAt: 'Ngayon 7:45',
            title: 'Sarado ang spa access hanggang 16:00',
            body: 'Pakigabayan ang mga bisita sa side hallway katabi ng lobby bar.',
          },
          {
            postedAt: 'Ngayon 9:10',
            title: 'Conference sa main lobby bar',
            body: 'Mula 12:00 limitado ang main entrance - gamitin ang side entrance mula parking.',
          },
        ],
      },
      housekeeping: {
        employeeRole: 'Room attendant',
        alert: 'Ngayong 15:00 magkakaroon ng quality check ng mga kuwarto.',
        pendingActions: ['Kumpirmahin ang pagtanggap ng stock ng linen para bukas'],
        shiftLabels: ['Ngayon', 'Bukas'],
        updateTag: 'Mahalaga',
        gssLabel: 'Abot ang target',
        gssPraiseAuthor: 'Marta, Poland',
        gssPraiseText:
          'Mabilis na naihanda ni Anna ang kuwarto at napakabait sa pagresolba ng extra request. 5 stars.',
        shiftRoles: ['Housekeeping', 'Housekeeping'],
        shiftNotes: [
          'Priority: mga kuwarto 301-320 bago 11:30.',
          'Kunin ang stock ng linen sa storage bago 8:00.',
        ],
        updates: [
          {
            postedAt: 'Ngayon 6:30',
            title: 'VIP arrivals mula 17:00',
            body: 'Ihanda ang mga kuwarto 312, 314 at 316 bago 16:30.',
          },
        ],
      },
    },
  }
  const localized = translations[language]?.[profileKey]
  if (!localized) return baseProfile
  return {
    ...baseProfile,
    employeeRole: localized.employeeRole,
    alert: localized.alert,
    pendingActions: localized.pendingActions,
    shifts: baseProfile.shifts.map((shift, index) => ({
      ...shift,
      dateLabel: localized.shiftLabels?.[index] || shift.dateLabel,
      role: localized.shiftRoles?.[index] || shift.role,
      notes: localized.shiftNotes?.[index] || shift.notes,
    })),
    updates: baseProfile.updates.map((update, index) => ({
      ...update,
      tagLabel: localized.updateTag || update.tagLabel,
      postedAt: localized.updates?.[index]?.postedAt || update.postedAt,
      title: localized.updates?.[index]?.title || update.title,
      body: localized.updates?.[index]?.body || update.body,
    })),
    gss: {
      ...baseProfile.gss,
      highlightLabel: localized.gssLabel || baseProfile.gss.highlightLabel,
      praiseAuthor: localized.gssPraiseAuthor || baseProfile.gss.praiseAuthor,
      praiseText: localized.gssPraiseText || baseProfile.gss.praiseText,
    },
  }
}

const getLocalizedExternalSystems = (language) => {
  if (language === 'cs') return EXTERNAL_SYSTEMS
  const descriptions = {
    en: ['HR and attendance system.', 'Learning and development.', 'Reports and data warehouse.'],
    uk: [
      'Кадрова система та облік відвідуваності.',
      'Навчання та розвиток.',
      'Звіти та сховище даних.',
    ],
    tl: ['HR at attendance system.', 'Learning at development.', 'Reports at data warehouse.'],
  }
  return EXTERNAL_SYSTEMS.map((system, index) => ({
    ...system,
    description: descriptions[language]?.[index] || system.description,
  }))
}

const getLocalizedOpenPositions = (language) => {
  if (language === 'cs') return OPEN_POSITIONS
  const titles = {
    en: ['Receptionist', 'Chef', 'Operations Manager'],
    uk: ['Адміністратор рецепції', 'Кухар', 'Операційний менеджер'],
    tl: ['Receptionist', 'Chef', 'Operations Manager'],
  }
  return OPEN_POSITIONS.map((position, index) => ({
    ...position,
    title: titles[language]?.[index] || position.title,
  }))
}

const getLocalizedProfileDetails = (profileKey, language) => {
  const baseDetails = PROFILE_DETAILS[profileKey]
  if (language === 'cs') return baseDetails
  const courseTitles = {
    en: [
      ['OHS - update 2026', 'Fire safety', 'Guest care standard'],
      ['OREA cleaning standard', 'Chemical safety at work', 'VIP room preparation'],
    ],
    uk: [
      ['Охорона праці - оновлення 2026', 'Пожежна безпека', 'Стандарт обслуговування гостей'],
      ['Стандарт прибирання OREA', 'Безпека роботи з хімією', 'Підготовка VIP номерів'],
    ],
    tl: [
      ['OHS - update 2026', 'Fire safety', 'Guest care standard'],
      ['OREA cleaning standard', 'Kaligtasan sa paggamit ng kemikal', 'Paghahanda ng VIP rooms'],
    ],
  }
  const positionTranslations = {
    en: {
      recepce: [
        {
          title: 'Junior Front Office',
          period: '2022 - 2023',
          summary: 'Support for check-in/check-out processes and guest care.',
          responsibilities: [
            'Work with reservation system',
            'Communicate with guests during arrival and departure',
            'Cooperate with housekeeping on room readiness',
          ],
          skills: ['Guest service', 'Front office systems', 'Team collaboration'],
        },
        {
          title: 'Front Desk Specialist',
          period: '2023 - present',
          summary: 'Shift coordination at front desk and support for VIP arrivals.',
          responsibilities: [
            'Coordinate front desk operation during shift',
            'Handle non-standard guest requests',
            'Mentor new colleagues at reception',
          ],
          skills: ['Shift coordination', 'Conflict handling', 'Mentoring'],
        },
      ],
      housekeeping: [
        {
          title: 'Housekeeping Assistant',
          period: '2021 - 2023',
          summary: 'Room preparation and support in team quality checks.',
          responsibilities: [
            'Clean rooms according to OREA standard',
            'Refill floor supply stock',
            'Support quality inspections',
          ],
          skills: ['Quality standards', 'Attention to detail', 'Teamwork'],
        },
        {
          title: 'Room Attendant',
          period: '2023 - present',
          summary: 'Responsibility for rooms with priority arrivals.',
          responsibilities: [
            'Plan priorities based on guest arrivals',
            'Communicate with front desk and shift lead',
            'Check room equipment and readiness',
          ],
          skills: ['Prioritization', 'Cross-team communication', 'Operational reliability'],
        },
      ],
    },
    uk: {
      recepce: [
        {
          title: 'Молодший Front Office',
          period: '2022 - 2023',
          summary: 'Підтримка процесів check-in/check-out та обслуговування гостей.',
          responsibilities: [
            'Робота із системою бронювань',
            'Комунікація з гостями при заїзді та виїзді',
            'Співпраця з хаускіпінгом щодо готовності номерів',
          ],
          skills: ['Guest service', 'Front office systems', 'Team collaboration'],
        },
        {
          title: 'Фахівчиня рецепції',
          period: '2023 - тепер',
          summary: 'Координація зміни рецепції та підтримка VIP-заїздів.',
          responsibilities: [
            'Координація роботи рецепції на зміні',
            'Розвʼязання нестандартних запитів гостей',
            'Менторинг нових колег на рецепції',
          ],
          skills: ['Shift coordination', 'Conflict handling', 'Mentoring'],
        },
      ],
      housekeeping: [
        {
          title: 'Housekeeping Assistant',
          period: '2021 - 2023',
          summary: 'Підготовка номерів і підтримка командного контролю якості.',
          responsibilities: [
            'Прибирання номерів за стандартом OREA',
            'Поповнення запасів на поверхах',
            'Співпраця під час перевірок якості',
          ],
          skills: ['Quality standards', 'Attention to detail', 'Teamwork'],
        },
        {
          title: 'Покоївка',
          period: '2023 - тепер',
          summary: 'Відповідальність за номери з пріоритетними заїздами.',
          responsibilities: [
            'Планування пріоритетів за заїздами гостей',
            'Комунікація з рецепцією та керівником зміни',
            'Контроль оснащення та готовності номерів',
          ],
          skills: ['Prioritization', 'Cross-team communication', 'Operational reliability'],
        },
      ],
    },
    tl: {
      recepce: [
        {
          title: 'Junior Front Office',
          period: '2022 - 2023',
          summary: 'Suporta sa check-in/check-out process at guest care.',
          responsibilities: [
            'Trabaho sa reservation system',
            'Komunikasyon sa mga bisita sa pagdating at pag-alis',
            'Pakikipagtulungan sa housekeeping para sa room readiness',
          ],
          skills: ['Guest service', 'Front office systems', 'Team collaboration'],
        },
        {
          title: 'Front Desk Specialist',
          period: '2023 - kasalukuyan',
          summary: 'Koordinasyon ng shift sa reception at suporta para sa VIP arrivals.',
          responsibilities: [
            'Koordinasyon ng operasyon ng reception sa shift',
            'Pagresolba ng special guest requests',
            'Mentoring ng mga bagong kasamahan sa reception',
          ],
          skills: ['Shift coordination', 'Conflict handling', 'Mentoring'],
        },
      ],
      housekeeping: [
        {
          title: 'Housekeeping Assistant',
          period: '2021 - 2023',
          summary: 'Paghahanda ng kuwarto at suporta sa team quality checks.',
          responsibilities: [
            'Paglilinis ng kuwarto ayon sa OREA standard',
            'Pagre-refill ng supplies sa bawat palapag',
            'Pakikipagtulungan sa quality checks',
          ],
          skills: ['Quality standards', 'Attention to detail', 'Teamwork'],
        },
        {
          title: 'Room Attendant',
          period: '2023 - kasalukuyan',
          summary: 'Pananagutan sa mga kuwartong may priority arrivals.',
          responsibilities: [
            'Pagplano ng priorities ayon sa guest arrivals',
            'Komunikasyon sa reception at shift lead',
            'Pagsusuri ng equipment at readiness ng kuwarto',
          ],
          skills: ['Prioritization', 'Cross-team communication', 'Operational reliability'],
        },
      ],
    },
  }
  return {
    ...baseDetails,
    payrolls: baseDetails.payrolls,
    courses: baseDetails.courses.map((course, index) => ({
      ...course,
      title: courseTitles[language]?.[profileKey === 'recepce' ? 0 : 1]?.[index] || course.title,
    })),
    positions: baseDetails.positions.map((position, index) => ({
      ...position,
      ...(positionTranslations[language]?.[profileKey]?.[index] || {}),
    })),
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [demoProfile, setDemoProfile] = useState('recepce')
  const [selectedShiftId, setSelectedShiftId] = useState(null)
  const [showSwapForm, setShowSwapForm] = useState(false)
  const [showShiftSheet, setShowShiftSheet] = useState(false)
  const [swapStatus, setSwapStatus] = useState('none')
  const [swapReason, setSwapReason] = useState('Rodinné důvody')
  const [swapOption, setSwapOption] = useState('Mohu se domluvit na výměně')
  const [readAnnouncementIds, setReadAnnouncementIds] = useState(() => new Set())
  const [documentStatus, setDocumentStatus] = useState('')
  const [activeMessagePanel, setActiveMessagePanel] = useState('quick')
  const [selectedQuickThreadId, setSelectedQuickThreadId] = useState(null)
  const [selectedEmailId, setSelectedEmailId] = useState(null)
  const [showProfileScreen, setShowProfileScreen] = useState(false)
  const [selectedPositionId, setSelectedPositionId] = useState(null)
  const [showBiometricGate, setShowBiometricGate] = useState(false)
  const [pendingBiometricAction, setPendingBiometricAction] = useState(null)
  const [shiftAttendanceStatus, setShiftAttendanceStatus] = useState('off_site')
  const [isAtShiftLocation, setIsAtShiftLocation] = useState(false)
  const [showGeoClockInPrompt, setShowGeoClockInPrompt] = useState(false)
  const [showClockOutSheet, setShowClockOutSheet] = useState(false)
  const [clockOutAction, setClockOutAction] = useState('pause')
  const [clockOutReason, setClockOutReason] = useState('Odcházím na krátkou přestávku')
  const [clockOutNote, setClockOutNote] = useState('')
  const [knowledgeQuery, setKnowledgeQuery] = useState('')
  const [knowledgeAnswer, setKnowledgeAnswer] = useState('')
  const [language, setLanguage] = useState('cs')
  const [showShiftCalendar, setShowShiftCalendar] = useState(false)
  const [referralStatus, setReferralStatus] = useState('')
  const [requestStatus, setRequestStatus] = useState('')
  const [whistleStatus, setWhistleStatus] = useState('')
  const [equipmentStatus, setEquipmentStatus] = useState('')
  const [showOnboardingAccountModal, setShowOnboardingAccountModal] = useState(false)
  const [onboardingBankAccount, setOnboardingBankAccount] = useState('')
  const [onboardingCorrespondenceEmail, setOnboardingCorrespondenceEmail] = useState('')
  const [onboardingChildrenCount, setOnboardingChildrenCount] = useState('')
  const [onboardingSpouse, setOnboardingSpouse] = useState('')
  const [onboardingStatus, setOnboardingStatus] = useState('')
  const [todoItems, setTodoItems] = useState(() =>
    createTodoItems(getLocalizedProfileData('recepce', 'cs').pendingActions),
  )
  const [attendanceMeta, setAttendanceMeta] = useState({
    lastActionTime: '',
    pauseReason: '',
    pauseType: '',
  })
  const [npsScore, setNpsScore] = useState(null)
  const [npsSubmitted, setNpsSubmitted] = useState(false)
  const t = (key, fallback) => TRANSLATIONS[language]?.[key] || fallback

  const profileData = getLocalizedProfileData(demoProfile, language)
  const shifts = profileData.shifts
  const updates = profileData.updates
  const importantUpdates = updates.filter((update) => update.tone === 'urgent')
  const importantFeed = importantUpdates.length > 0 ? importantUpdates : updates
  const hasImportantItems = importantFeed.length > 0
  const noImportantMessage = t('noImportantMessage', 'Dnes nejsou žádné důležité změny.')
  const gssData = profileData.gss
  const locale = language === 'cs' ? 'cs-CZ' : language === 'uk' ? 'uk-UA' : 'en-US'
  const gssScoreLabel = gssData.score.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const gssTargetLabel = gssData.target.toLocaleString(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  const isGssOnTarget = gssData.score >= gssData.target
  const profileDetails = getLocalizedProfileDetails(demoProfile, language)
  const externalSystems = getLocalizedExternalSystems(language)
  const openPositions = getLocalizedOpenPositions(language)
  const employeeInitials = profileData.employeeName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const employeeEmail = `${profileData.employeeName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '.')}@orea.cz`

  const selectedShift = shifts.find((shift) => shift.id === selectedShiftId) || shifts[0]
  const selectedPosition =
    profileDetails.positions.find((position) => position.id === selectedPositionId) || null

  const sortedTodoItems = useMemo(
    () => [...todoItems].sort((a, b) => Number(a.done) - Number(b.done)),
    [todoItems],
  )
  const getLocalizedTodoLabel = (item) => {
    const indexMatch = item.id.match(/^todo-(\d+)-/)
    const itemIndex = indexMatch ? Number(indexMatch[1]) : -1
    return profileData.pendingActions[itemIndex] || item.label
  }
  const nowLabel = () =>
    new Date().toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    })
  const shiftStatusMeta = {
    off_site: { label: t('statusOffSite', 'Mimo směnu'), tone: 'status-pill info' },
    on_shift: { label: t('statusOnShift', 'Na směně'), tone: 'status-pill success' },
    paused: { label: t('statusPaused', 'Směna přerušená'), tone: 'status-pill warning' },
    ended: { label: t('statusEnded', 'Směna ukončená'), tone: 'status-pill urgent' },
  }
  const currentShiftStatus = shiftStatusMeta[shiftAttendanceStatus]
  const openPositionsRef = useRef(null)
  const nearestShiftsRef = useRef(null)

  useEffect(() => {
    const shouldPromptClockIn =
      isAtShiftLocation &&
      (shiftAttendanceStatus === 'off_site' || shiftAttendanceStatus === 'paused')
    // This prompt intentionally follows shift/location state in demo mode.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowGeoClockInPrompt(shouldPromptClockIn)
  }, [isAtShiftLocation, shiftAttendanceStatus])

  const handleClockIn = () => {
    if (!isAtShiftLocation || shiftAttendanceStatus === 'ended') return
    setShiftAttendanceStatus('on_shift')
    setAttendanceMeta((current) => ({
      ...current,
      lastActionTime: nowLabel(),
      pauseReason: '',
      pauseType: '',
    }))
    setShowGeoClockInPrompt(false)
  }

  const openClockOutSheet = () => {
    setClockOutAction('pause')
    setClockOutReason(t('clockOutDefaultReason', 'Odcházím na krátkou přestávku'))
    setClockOutNote('')
    setShowClockOutSheet(true)
  }

  const submitClockOut = (event) => {
    event.preventDefault()
    const reason = clockOutReason.trim()
    const note = clockOutNote.trim()
    if (clockOutAction === 'pause' && !reason) return
    if (clockOutAction === 'pause') {
      setShiftAttendanceStatus('paused')
      setIsAtShiftLocation(false)
      setAttendanceMeta({
        lastActionTime: nowLabel(),
        pauseReason: note ? `${reason} (${note})` : reason,
        pauseType: t('pauseShiftType', 'Přerušení směny'),
      })
    } else {
      setShiftAttendanceStatus('ended')
      setIsAtShiftLocation(false)
      setAttendanceMeta({
        lastActionTime: nowLabel(),
        pauseReason: note || '',
        pauseType: t('endShiftType', 'Ukončení směny'),
      })
    }
    setShowClockOutSheet(false)
  }

  const submitSwapRequest = (event) => {
    event.preventDefault()
    setSwapStatus('pending')
    setShowSwapForm(false)
  }

  const toggleTodoItem = (itemId) => {
    setTodoItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              done: !item.done,
            }
          : item,
      ),
    )
  }

  const openShiftDetails = (shiftId) => {
    setSelectedShiftId(shiftId)
    setShowShiftSheet(true)
    setShowSwapForm(false)
    setSwapStatus('none')
  }

  const submitNps = (score) => {
    if (npsSubmitted) return
    setNpsScore(score)
    setNpsSubmitted(true)
  }

  const submitKnowledgeQuery = (event) => {
    event.preventDefault()
    if (!knowledgeQuery.trim()) return
    const answerByLanguage = {
      cs: 'Orea je nejlepší hotelový řetězec v Česku.',
      en: 'Orea is the best hotel chain in the Czech Republic.',
      uk: 'Orea - найкраща готельна мережа в Чехії.',
      tl: 'Ang Orea ang pinakamahusay na hotel chain sa Czech Republic.',
    }
    setKnowledgeAnswer(answerByLanguage[language] || answerByLanguage.cs)
  }

  const shareReferralCode = async () => {
    const referralCode = 'EVA-2026-REC'
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(referralCode)
      }
      setReferralStatus(t('referralCodePrepared', 'Kód byl připraven ke sdílení.'))
    } catch {
      setReferralStatus(t('referralCodeFallback', 'Kód: EVA-2026-REC'))
    }
  }

  const jumpToOpenPositions = () => {
    openPositionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const submitRequest = (requestLabel) => {
    setRequestStatus(t('requestCreated', `Žádanka „${requestLabel}“ byla v demu založena.`).replace('{request}', requestLabel))
  }

  const submitWhistleblowing = () => {
    setWhistleStatus(t('whistleAccepted', 'Oznámení bylo v demu přijato do chráněného kanálu.'))
  }

  const reportEquipmentIssue = () => {
    setEquipmentStatus(t('equipmentReported', 'Požadavek byl v demu odeslán IT podpoře.'))
  }

  const openOnboardingAccountModal = () => {
    setShowOnboardingAccountModal(true)
  }

  const closeOnboardingAccountModal = () => {
    setShowOnboardingAccountModal(false)
  }

  const submitOnboardingAccountSetup = (event) => {
    event.preventDefault()
    setOnboardingStatus(
      t('onboardingAccountSaved', 'Onboarding údaje byly v demu uloženy.'),
    )
    setShowOnboardingAccountModal(false)
  }

  const switchDemoProfile = () => {
    const nextProfile = demoProfile === 'recepce' ? 'housekeeping' : 'recepce'
    setDemoProfile(nextProfile)
    setSelectedShiftId(null)
    setShowShiftSheet(false)
    setShowProfileScreen(false)
    setSelectedPositionId(null)
    setShowSwapForm(false)
    setSwapStatus('none')
    setDocumentStatus('')
    setReadAnnouncementIds(new Set())
    setActiveMessagePanel('quick')
    setSelectedQuickThreadId(null)
    setSelectedEmailId(null)
    setShiftAttendanceStatus('off_site')
    setIsAtShiftLocation(false)
    setShowGeoClockInPrompt(false)
    setShowClockOutSheet(false)
    setClockOutAction('pause')
    setClockOutReason(t('clockOutDefaultReason', 'Odcházím na krátkou přestávku'))
    setClockOutNote('')
    setTodoItems(createTodoItems(getLocalizedProfileData(nextProfile, language).pendingActions))
    setAttendanceMeta({
      lastActionTime: '',
      pauseReason: '',
      pauseType: '',
    })
    setShowBiometricGate(false)
    setPendingBiometricAction(null)
    setNpsScore(null)
    setNpsSubmitted(false)
    setKnowledgeQuery('')
    setKnowledgeAnswer('')
    setReferralStatus('')
    setRequestStatus('')
    setWhistleStatus('')
    setEquipmentStatus('')
    setShowOnboardingAccountModal(false)
    setOnboardingBankAccount('')
    setOnboardingCorrespondenceEmail('')
    setOnboardingChildrenCount('')
    setOnboardingSpouse('')
    setOnboardingStatus('')
  }

  const handleDocumentAction = (label) => {
    setDocumentStatus(`${t('opened', 'Otevřeno')}: ${label}`)
  }

  const requestExternalSystem = (system) => {
    setPendingBiometricAction({ kind: 'external', system })
    setShowBiometricGate(true)
  }

  const requestDocumentDownload = (label) => {
    setPendingBiometricAction({ kind: 'document', label })
    setShowBiometricGate(true)
  }

  const closeBiometricGate = () => {
    setShowBiometricGate(false)
    setPendingBiometricAction(null)
  }

  const confirmBiometricAction = () => {
    if (!pendingBiometricAction) return
    if (pendingBiometricAction.kind === 'external') {
      window.open(pendingBiometricAction.system.url, '_blank', 'noopener,noreferrer')
    } else {
      setDocumentStatus(`${t('downloaded', 'Staženo')}: ${pendingBiometricAction.label}`)
    }
    setShowBiometricGate(false)
    setPendingBiometricAction(null)
  }

  const quickThreads = {
    cs: [
      {
        id: 'petra',
        name: 'Petra (vedoucí směny)',
        preview: 'Schváleno. Doplňte poznámku k předání směny.',
        time: '10:20',
        unread: 0,
        messages: [
          { id: 1, direction: 'in', text: 'Schváleno. Před odchodem doplňte poznámku k předání směny.', time: '10:18' },
          { id: 2, direction: 'out', text: 'Potvrzuji, doplním ji do 21:45.', time: '10:20' },
        ],
      },
      {
        id: 'tym-recepce',
        name: 'Tým recepce',
        preview: 'Checklist noční uzávěrky je nahraný.',
        time: '11:42',
        unread: 2,
        messages: [
          { id: 1, direction: 'in', text: 'Checklist noční uzávěrky je nahraný.', time: '11:42' },
          { id: 2, direction: 'out', text: 'Díky, projdu ho před koncem směny.', time: '11:44' },
        ],
      },
      {
        id: 'housekeeping',
        name: 'Housekeeping',
        preview: 'Pokoje 312 a 314 jsou připravené.',
        time: '12:05',
        unread: 1,
        messages: [{ id: 1, direction: 'in', text: 'Pokoje 312 a 314 jsou připravené.', time: '12:05' }],
      },
    ],
    en: [
      {
        id: 'petra',
        name: 'Petra (shift lead)',
        preview: 'Approved. Add a handover note for the shift.',
        time: '10:20',
        unread: 0,
        messages: [
          { id: 1, direction: 'in', text: 'Approved. Before leaving, add a handover note for the shift.', time: '10:18' },
          { id: 2, direction: 'out', text: 'Confirmed, I will add it by 21:45.', time: '10:20' },
        ],
      },
      {
        id: 'tym-recepce',
        name: 'Front desk team',
        preview: 'The night closing checklist is uploaded.',
        time: '11:42',
        unread: 2,
        messages: [
          { id: 1, direction: 'in', text: 'The night closing checklist is uploaded.', time: '11:42' },
          { id: 2, direction: 'out', text: 'Thanks, I will review it before the shift ends.', time: '11:44' },
        ],
      },
      {
        id: 'housekeeping',
        name: 'Housekeeping',
        preview: 'Rooms 312 and 314 are ready.',
        time: '12:05',
        unread: 1,
        messages: [{ id: 1, direction: 'in', text: 'Rooms 312 and 314 are ready.', time: '12:05' }],
      },
    ],
    uk: [
      {
        id: 'petra',
        name: 'Петра (керівниця зміни)',
        preview: 'Схвалено. Додайте примітку до передачі зміни.',
        time: '10:20',
        unread: 0,
        messages: [
          { id: 1, direction: 'in', text: 'Схвалено. Перед виходом додайте примітку до передачі зміни.', time: '10:18' },
          { id: 2, direction: 'out', text: 'Підтверджую, додам до 21:45.', time: '10:20' },
        ],
      },
      {
        id: 'tym-recepce',
        name: 'Команда рецепції',
        preview: 'Чекліст нічного закриття завантажено.',
        time: '11:42',
        unread: 2,
        messages: [
          { id: 1, direction: 'in', text: 'Чекліст нічного закриття завантажено.', time: '11:42' },
          { id: 2, direction: 'out', text: 'Дякую, перегляну до завершення зміни.', time: '11:44' },
        ],
      },
      {
        id: 'housekeeping',
        name: 'Хаускіпінг',
        preview: 'Номери 312 та 314 готові.',
        time: '12:05',
        unread: 1,
        messages: [{ id: 1, direction: 'in', text: 'Номери 312 та 314 готові.', time: '12:05' }],
      },
    ],
    tl: [
      {
        id: 'petra',
        name: 'Petra (shift lead)',
        preview: 'Aprubado. Magdagdag ng handover note sa shift.',
        time: '10:20',
        unread: 0,
        messages: [
          { id: 1, direction: 'in', text: 'Aprubado. Bago umalis, magdagdag ng handover note sa shift.', time: '10:18' },
          { id: 2, direction: 'out', text: 'Kumpirmado, idaragdag ko bago 21:45.', time: '10:20' },
        ],
      },
      {
        id: 'tym-recepce',
        name: 'Front desk team',
        preview: 'Na-upload na ang checklist ng night closing.',
        time: '11:42',
        unread: 2,
        messages: [
          { id: 1, direction: 'in', text: 'Na-upload na ang checklist ng night closing.', time: '11:42' },
          { id: 2, direction: 'out', text: 'Salamat, rerepasuhin ko bago matapos ang shift.', time: '11:44' },
        ],
      },
      {
        id: 'housekeeping',
        name: 'Housekeeping',
        preview: 'Handa na ang mga kuwarto 312 at 314.',
        time: '12:05',
        unread: 1,
        messages: [{ id: 1, direction: 'in', text: 'Handa na ang mga kuwarto 312 at 314.', time: '12:05' }],
      },
    ],
  }[language]

  const emails = {
    cs: [
      {
        id: 'mail-1',
        from: 'HR OREA',
        subject: 'Aktualizace směrnice BOZP',
        preview: 'Nová verze směrnice je dostupná k potvrzení.',
        time: '11:12',
        unread: true,
        body: 'Dobrý den,\n\nod dnešního dne platí aktualizovaná směrnice BOZP. Prosíme o přečtení a potvrzení do konce týdne.\n\nDěkujeme,\nHR tým',
      },
      {
        id: 'mail-2',
        from: 'Front Office',
        subject: 'Změna check-in postupu',
        preview: 'Od zítřejší ranní směny platí nový postup.',
        time: '09:41',
        unread: false,
        body: 'Ahoj,\n\nod zítřejší ranní směny používejte nový check-in postup pro skupinové rezervace. Detaily jsou v příloze interního manuálu.\n\nFront Office',
      },
    ],
    en: [
      {
        id: 'mail-1',
        from: 'OREA HR',
        subject: 'Updated OHS policy',
        preview: 'A new policy version is available for confirmation.',
        time: '11:12',
        unread: true,
        body: 'Hello,\n\nan updated OHS policy is valid as of today. Please read and confirm by the end of the week.\n\nThank you,\nHR team',
      },
      {
        id: 'mail-2',
        from: 'Front Office',
        subject: 'Check-in process change',
        preview: 'A new process applies from tomorrow morning shift.',
        time: '09:41',
        unread: false,
        body: 'Hi,\n\nstarting with tomorrow morning shift, use the new check-in process for group reservations. Details are in the attached internal manual.\n\nFront Office',
      },
    ],
    uk: [
      {
        id: 'mail-1',
        from: 'HR OREA',
        subject: 'Оновлення інструкції з безпеки',
        preview: 'Нова версія інструкції доступна для підтвердження.',
        time: '11:12',
        unread: true,
        body: 'Добрий день,\n\nз сьогоднішнього дня діє оновлена інструкція з безпеки. Просимо ознайомитися та підтвердити до кінця тижня.\n\nДякуємо,\nКоманда HR',
      },
      {
        id: 'mail-2',
        from: 'Front Office',
        subject: 'Зміна процесу check-in',
        preview: 'Завтра зранку починає діяти новий процес.',
        time: '09:41',
        unread: false,
        body: 'Привіт,\n\nзавтра з ранкової зміни використовуйте новий процес check-in для групових бронювань. Деталі в доданому внутрішньому мануалі.\n\nFront Office',
      },
    ],
    tl: [
      {
        id: 'mail-1',
        from: 'HR OREA',
        subject: 'Update sa OHS policy',
        preview: 'May bagong bersyon ng policy para sa kumpirmasyon.',
        time: '11:12',
        unread: true,
        body: 'Magandang araw,\n\nsimula ngayon ay epektibo na ang updated OHS policy. Pakibasa at pakikumpirma bago matapos ang linggo.\n\nSalamat,\nHR team',
      },
      {
        id: 'mail-2',
        from: 'Front Office',
        subject: 'Pagbabago sa check-in process',
        preview: 'May bagong proseso simula bukas na morning shift.',
        time: '09:41',
        unread: false,
        body: 'Hi,\n\nsimula bukas na morning shift, gamitin ang bagong check-in process para sa group reservations. Nasa attached internal manual ang detalye.\n\nFront Office',
      },
    ],
  }[language]

  const selectedQuickThread =
    quickThreads.find((thread) => thread.id === selectedQuickThreadId) || null
  const selectedEmail = emails.find((email) => email.id === selectedEmailId) || null
  const today = new Date()
  const calendarMonthDate = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthLabel = calendarMonthDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
  const firstDayOffset = (calendarMonthDate.getDay() + 6) % 7
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const shiftDays = new Set(
    shifts
      .map((shift) => Number((shift.date.match(/\d{1,2}/) || [])[0]))
      .filter((day) => Number.isInteger(day) && day >= 1 && day <= daysInMonth),
  )
  const calendarCells = Array.from({ length: firstDayOffset + daysInMonth }, (_, index) => {
    if (index < firstDayOffset) return null
    return index - firstDayOffset + 1
  })

  const tabButton = (id, label, icon) => (
    <button
      type="button"
      className={`tab-button ${activeTab === id ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
      aria-current={activeTab === id ? 'page' : undefined}
    >
      <span className="tab-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  )

  return (
    <>
      <div className="desktop-mode-switch">
        <p className="micro-label">{t('demoMode', 'Demo režim')}</p>
        <button type="button" className="location-switch" onClick={switchDemoProfile}>
          {t('mode', 'Režim')}: {demoProfile === 'recepce' ? t('frontDesk', 'Recepce') : t('housekeeping', 'Housekeeping')}
        </button>
      </div>
      <div className="app-shell">
      <header className="top-bar">
        <div>
          <p className="micro-label">{t('appName', 'OreaPeople')}</p>
          <h1>
            {profileData.employeeName.split(' ')[0]}, {t('homeOverview', 'tady je dnešní přehled')}
          </h1>
        </div>
        <div className="top-bar-actions">
          <button type="button" className="icon-button" aria-label={t('notifications', 'Notifikace')}>
            <Bell size={18} strokeWidth={1.9} />
            <span className="icon-dot" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="profile-avatar-button"
            onClick={() => setShowProfileScreen(true)}
            aria-label={t('openUserProfile', 'Otevřít profil uživatele')}
          >
            <span className="profile-avatar">{employeeInitials}</span>
          </button>
        </div>
      </header>

      <div className="alert-banner">{profileData.alert}</div>

      <main className="content-area">
        {showProfileScreen && (
          <section className="screen">
            <article className="card profile-card">
              {!selectedPosition ? (
                <>
                  <button
                    type="button"
                    className="profile-back-button"
                    onClick={() => setShowProfileScreen(false)}
                  >
                    <ArrowLeft size={15} strokeWidth={2} /> {t('back', 'Zpět')}
                  </button>
                  <div className="profile-header">
                    <span className="profile-avatar profile-avatar-large">{employeeInitials}</span>
                    <div>
                      <h3>{profileData.employeeName}</h3>
                      <p className="micro-label">{profileData.employeeRole}</p>
                    </div>
                  </div>
                  <div className="list-item">
                    <p className="item-title">{t('hotel', 'Hotel')}</p>
                    <p>{profileData.hotelLabel}</p>
                  </div>
                  <div className="list-item">
                    <p className="item-title">{t('email', 'E-mail')}</p>
                    <p>{employeeEmail}</p>
                  </div>
                  <div className="list-item">
                    <p className="item-title">{t('hrSupport', 'Podpora HR')}</p>
                    <p>hr@orea.cz</p>
                  </div>
                  <div className="list-item profile-section">
                    <h3>{t('settings', 'Nastavení')}</h3>
                    <div className="profile-list">
                      <label className="profile-setting-row">
                        <span className="item-title">{t('language', 'Jazyk')}</span>
                        <select
                          value={language}
                          onChange={(event) => setLanguage(event.target.value)}
                          className="language-select"
                        >
                          {LANGUAGE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                  <div className="list-item profile-section">
                    <h3>{t('onboarding', 'Onboarding')}</h3>
                    <div className="profile-list">
                      <div className="profile-list-row profile-list-row-static onboarding-info-row">
                        <span>
                          <strong>
                            {t(
                              'onboardingWelcomeText',
                              'Vítejte v OREA, vážíme si, že jste si nás vybral a těšíme se na spolupráci',
                            )}
                          </strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        className="profile-list-row"
                        onClick={openOnboardingAccountModal}
                      >
                        <span>
                          <strong>{t('setupAccount', 'Nastavit účet')}</strong>
                        </span>
                        <ChevronRight size={16} strokeWidth={1.9} />
                      </button>
                      <div className="profile-list-row profile-list-row-static onboarding-info-row">
                        <span>
                          <strong>{t('onboarding', 'Onboarding')}</strong>
                          <br />
                          {t(
                            'onboardingCourseText',
                            'Začněte s kurzem Guest Care Standards',
                          )}
                        </span>
                      </div>
                    </div>
                    {onboardingStatus && <p className="status-message">{onboardingStatus}</p>}
                  </div>
                  <div className="list-item profile-section">
                    <h3>{t('payrolls', 'Výplatní pásky')}</h3>
                    <div className="profile-list">
                      {profileDetails.payrolls.map((payroll) => (
                        <button
                          key={payroll.id}
                          type="button"
                          className="profile-list-row"
                          onClick={() => handleDocumentAction(payroll.label)}
                        >
                          <span>{payroll.label}</span>
                          <ChevronRight size={16} strokeWidth={1.9} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="list-item profile-section">
                    <h3>{t('courses', 'Kurzy')}</h3>
                    <div className="profile-list">
                      {profileDetails.courses.map((course) => (
                        <div key={course.id} className="profile-list-row profile-list-row-static">
                          <span>{course.title}</span>
                          <span className={`status-pill course-${course.status}`}>
                            {course.status === 'done'
                              ? t('done', 'Hotovo')
                              : course.status === 'in_progress'
                                ? t('inProgress', 'Rozpracováno')
                                : t('required', 'Povinné')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="list-item profile-section">
                    <h3>{t('positionsAtOrea', 'Pozice v Orea')}</h3>
                    <div className="profile-list">
                      {profileDetails.positions.map((position) => (
                        <button
                          key={position.id}
                          type="button"
                          className="profile-list-row"
                          onClick={() => setSelectedPositionId(position.id)}
                        >
                          <span>
                            <strong>{position.title}</strong>
                            <br />
                            {position.period}
                          </span>
                          <ChevronRight size={16} strokeWidth={1.9} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="list-item profile-section">
                    <h3>{t('assignedEquipment', 'Svěřené vybavení')}</h3>
                    <div className="profile-list">
                      <button type="button" className="profile-list-row">
                        <span>{t('assignedIphone', 'iPhone 14 — přiděleno 15.3.2024')}</span>
                        <ChevronRight size={16} strokeWidth={1.9} />
                      </button>
                      <button type="button" className="profile-list-row">
                        <span>{t('assignedLaptop', 'Notebook Lenovo T14 — přiděleno 1.9.2023')}</span>
                        <ChevronRight size={16} strokeWidth={1.9} />
                      </button>
                    </div>
                    <button type="button" className="text-button" onClick={reportEquipmentIssue}>
                      {t('reportEquipmentIssue', 'Nahlásit závadu nebo potřebu nového vybavení')}
                    </button>
                    {equipmentStatus && <p className="status-message">{equipmentStatus}</p>}
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="profile-back-button"
                    onClick={() => setSelectedPositionId(null)}
                  >
                    <ArrowLeft size={15} strokeWidth={2} /> {t('backToProfile', 'Zpět na profil')}
                  </button>
                  <h3>{selectedPosition.title}</h3>
                  <p className="micro-label">{selectedPosition.period}</p>
                  <p>{selectedPosition.summary}</p>
                  <div className="list-item">
                    <p className="item-title">{t('mainResponsibilities', 'Hlavní odpovědnosti')}</p>
                    <ul className="profile-bullet-list">
                      {selectedPosition.responsibilities.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="list-item">
                    <p className="item-title">{t('keySkills', 'Klíčové dovednosti')}</p>
                    <div className="profile-skills">
                      {selectedPosition.skills.map((skill) => (
                        <span key={skill} className="status-pill info">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </article>
          </section>
        )}

        {!showProfileScreen && activeTab === 'home' && (
          <section className="screen">
            <article className="card next-shift hero-card">
              <p className="micro-label">{t('nextShift', 'Další směna')}</p>
              <h2 className="shift-time">{shifts[0]?.time || t('noShift', 'Bez směny')}</h2>
              <div className="shift-date-row">
                <p className="shift-date">{shifts[0]?.date || t('today', 'Dnes')}</p>
                <button
                  type="button"
                  className="text-button shift-link shift-link-on-dark"
                  onClick={() => setShowShiftCalendar(true)}
                >
                  {t('openShiftCalendar', 'Další směny')}
                </button>
              </div>
              <p className={currentShiftStatus.tone}>{currentShiftStatus.label}</p>
              {attendanceMeta.lastActionTime && (
                <p className="micro-label">{t('lastAction', 'Poslední akce')}: {attendanceMeta.lastActionTime}</p>
              )}
              {attendanceMeta.pauseType && (
                <p className="micro-label">
                  {attendanceMeta.pauseType}
                  {attendanceMeta.pauseReason ? ` - ${attendanceMeta.pauseReason}` : ''}
                </p>
              )}
              <p>
                {shifts[0]
                  ? `${t('nextShiftSentence', 'Vaše další směna')}: ${shifts[0].role} ${t('at', 'v')} ${
                      shifts[0].location
                    }`
                  : t('noShiftPlannedToday', 'Dnes nemáte naplánovanou směnu.')}
              </p>
              <button
                type="button"
                className={`secondary location-toggle ${isAtShiftLocation ? 'is-active' : ''}`}
                onClick={() => setIsAtShiftLocation((current) => !current)}
              >
                {isAtShiftLocation
                  ? t('atShiftLocation', 'Jste na místě směny')
                  : t('imAtLocation', 'Jsem na místě')}
              </button>
              {shifts[0] && (
                <div className="button-row">
                  <button
                    type="button"
                    className="primary action-button"
                    onClick={() => openShiftDetails(shifts[0].id)}
                  >
                    {t('nextShiftStartsAt', 'Vaše další směna začíná v')} {shifts[0].time}
                  </button>
                  {(shiftAttendanceStatus === 'off_site' || shiftAttendanceStatus === 'paused') && (
                    <button
                      type="button"
                      className="secondary action-button"
                      onClick={handleClockIn}
                      disabled={!isAtShiftLocation || shiftAttendanceStatus === 'ended'}
                    >
                      {t('clockIn', 'Clock in')}
                    </button>
                  )}
                  {shiftAttendanceStatus === 'on_shift' && (
                    <button
                      type="button"
                      className="secondary action-button"
                      onClick={openClockOutSheet}
                    >
                      {t('clockOut', 'Clock-out')}
                    </button>
                  )}
                </div>
              )}
            </article>

            <article className="card">
              <h3>{t('requiresAttention', 'Vyžaduje pozornost')}</h3>
              {hasImportantItems ? (
                importantFeed.map((update) => (
                  <div className="list-item" key={`home-important-${update.id}`}>
                    {update.postedAt ? (
                      <p className="micro-label">{update.postedAt}</p>
                    ) : null}
                    <p className={`status-pill ${update.tone || 'urgent'}`}>
                      {update.tagLabel || t('important', 'Důležité')}
                    </p>
                    <p className="item-title">{update.title}</p>
                    <p>{update.body}</p>
                  </div>
                ))
              ) : (
                <div className="list-item">
                  <p className="item-title">{t('noImportantMessage', noImportantMessage)}</p>
                </div>
              )}
            </article>

            <article className="card home-todo-card">
              <h3>{t('todo', 'TO DO')}</h3>
              {sortedTodoItems.length > 0 ? (
                <div className="todo-checklist list-item">
                  {sortedTodoItems.map((item) => (
                    <label
                      key={item.id}
                      className={`todo-item-row ${item.done ? 'todo-item-completed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleTodoItem(item.id)}
                      />
                      <span className="item-title">{getLocalizedTodoLabel(item)}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="list-item">
                  <p className="item-title">{t('noTodoMessage', 'Nemáte žádný úkol k potvrzení.')}</p>
                </div>
              )}
            </article>

            <article className="card gss-card">
              <p className="micro-label">{t('gss', 'Guest Satisfaction Score')}</p>
              <div className="gss-headline">
                <h3>
                  {gssScoreLabel} <span>/ 5</span>
                </h3>
                <span className={`gss-pill ${isGssOnTarget ? 'gss-pill-on-target' : 'gss-pill-close'}`}>
                  {gssData.highlightLabel}
                </span>
              </div>
              <div className="gss-target-row">
                <p>
                  {t('hotelTarget', 'Cíl hotelu')}: <strong>{gssTargetLabel}</strong>
                </p>
                    <p className={isGssOnTarget ? 'gss-target-on' : 'gss-target-close'}>
                      {isGssOnTarget ? t('targetReached', 'Cíl splněn') : t('closeToTarget', 'Těsně pod cílem')}
                </p>
              </div>
              <blockquote className="gss-quote">
                <p>{gssData.praiseText}</p>
                <footer>{gssData.praiseAuthor}</footer>
              </blockquote>
            </article>

            <article className="card" ref={nearestShiftsRef}>
              <div className="card-header-inline">
                <h3>{t('nearestShifts', 'Nejbližší směny')}</h3>
                <button
                  type="button"
                  className="text-button shift-link"
                  onClick={() => setShowShiftCalendar(true)}
                >
                  {t('openShiftCalendar', 'Další směny')}
                </button>
              </div>
              {shifts.length === 0 ? (
                <div className="list-item">
                  <p className="item-title">{t('noMoreShifts', 'Žádné další směny nejsou naplánované.')}</p>
                </div>
              ) : (
                shifts.map((shift) => (
                  <button
                    type="button"
                    key={shift.id}
                    className={`shift-row ${
                      selectedShift.id === shift.id ? 'shift-row-active' : ''
                    }`}
                    onClick={() => openShiftDetails(shift.id)}
                  >
                    <div>
                      <p className="micro-label">{shift.dateLabel}</p>
                      <p className="item-title">{shift.time}</p>
                      <p>{shift.role}</p>
                    </div>
                    <ChevronRight size={16} strokeWidth={1.9} />
                  </button>
                ))
              )}
            </article>
          </section>
        )}

        {!showProfileScreen && activeTab === 'messages' && (
          <section className="screen">
            <article className="card">
              <h3>{t('messages', 'Zprávy')}</h3>
              <div className="chat-tabs">
                <button
                  type="button"
                  className={
                    activeMessagePanel === 'quick' ? 'chat-tab chat-tab-active' : 'chat-tab'
                  }
                  onClick={() => setActiveMessagePanel('quick')}
                >
                  {t('quickMessages', 'Rychlé zprávy')}
                </button>
                <button
                  type="button"
                  className={
                    activeMessagePanel === 'emails' ? 'chat-tab chat-tab-active' : 'chat-tab'
                  }
                  onClick={() => setActiveMessagePanel('emails')}
                >
                  {t('emails', 'E-maily')}
                </button>
                <button
                  type="button"
                  className={
                    activeMessagePanel === 'broadcast'
                      ? 'chat-tab chat-tab-active'
                      : 'chat-tab'
                  }
                  onClick={() => setActiveMessagePanel('broadcast')}
                >
                  {t('broadcastMessages', 'Hromadná sdělení')}
                </button>
              </div>
            </article>

            <article className="card">
              {activeMessagePanel === 'quick' && (
                <>
                  <h3>{t('quickMessages', 'Rychlé zprávy')}</h3>
                  {!selectedQuickThread ? (
                    <div className="thread-list">
                      {quickThreads.map((thread) => (
                        <button
                          key={thread.id}
                          type="button"
                          className="thread-row"
                          onClick={() => setSelectedQuickThreadId(thread.id)}
                        >
                          <span className="thread-avatar">{thread.name.slice(0, 1)}</span>
                          <span className="thread-meta">
                            <span className="thread-head">
                              <span className="item-title">{thread.name}</span>
                              <span className="thread-time">{thread.time}</span>
                            </span>
                            <span className="thread-preview">{thread.preview}</span>
                          </span>
                          {thread.unread > 0 && <span className="thread-badge">{thread.unread}</span>}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="chat-detail">
                      <button
                        type="button"
                        className="text-back"
                        onClick={() => setSelectedQuickThreadId(null)}
                      >
                        {t('backToConversations', 'Zpět na konverzace')}
                      </button>
                      <p className="item-title">{selectedQuickThread.name}</p>
                      <div className="chat-thread">
                        {selectedQuickThread.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`chat-bubble ${
                              message.direction === 'in' ? 'chat-in' : 'chat-out'
                            }`}
                          >
                            {message.text}
                            <span className="chat-time">{message.time}</span>
                          </div>
                        ))}
                      </div>
                      <div className="chat-input">{t('writeMessageDemo', 'Napište zprávu... (demo)')}</div>
                    </div>
                  )}
                </>
              )}

              {activeMessagePanel === 'emails' && (
                <>
                  <h3>{t('emails', 'E-maily')}</h3>
                  {!selectedEmail ? (
                    <div className="thread-list">
                      {emails.map((email) => (
                        <button
                          key={email.id}
                          type="button"
                          className="thread-row"
                          onClick={() => setSelectedEmailId(email.id)}
                        >
                          <span className="thread-avatar">@</span>
                          <span className="thread-meta">
                            <span className="thread-head">
                              <span className="item-title">{email.from}</span>
                              <span className="thread-time">{email.time}</span>
                            </span>
                            <span className="thread-preview">
                              {email.subject} - {email.preview}
                            </span>
                          </span>
                          {email.unread && <span className="thread-badge">{t('new', 'Nové')}</span>}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="chat-detail">
                      <button
                        type="button"
                        className="text-back"
                        onClick={() => setSelectedEmailId(null)}
                      >
                        {t('backToEmailList', 'Zpět na seznam e-mailů')}
                      </button>
                      <p className="item-title">{selectedEmail.subject}</p>
                      <p>{t('from', 'Od')}: {selectedEmail.from}</p>
                      <p>{t('time', 'Čas')}: {selectedEmail.time}</p>
                      <article className="email-body">{selectedEmail.body}</article>
                    </div>
                  )}
                </>
              )}

              {activeMessagePanel === 'broadcast' && (
                <>
                  <h3>{t('broadcastMessages', 'Hromadná sdělení')}</h3>
                  <p className="broadcast-feed-hint">
                    {t(
                      'broadcastHint',
                      'Stejné důležité informace jako v sekci Vyžaduje pozornost na Domů. U povinných sdělení potvrďte přečtení zde.',
                    )}
                  </p>
                  {hasImportantItems ? (
                    importantFeed.map((update) => {
                      const broadcastRead = readAnnouncementIds.has(update.id)
                      return (
                        <div className="list-item" key={`broadcast-important-${update.id}`}>
                          {update.postedAt ? (
                            <p className="micro-label">{update.postedAt}</p>
                          ) : null}
                          <p className={`status-pill ${update.tone || 'urgent'}`}>
                            {update.tagLabel || t('important', 'Důležité')}
                          </p>
                          <p className="item-title">{update.title}</p>
                          <p>{update.body}</p>
                          <button
                            type="button"
                            className="primary broadcast-confirm-read"
                            onClick={() =>
                              setReadAnnouncementIds((prev) => new Set(prev).add(update.id))
                            }
                            disabled={broadcastRead}
                          >
                            {broadcastRead ? t('confirmed', 'Potvrzeno') : t('confirmRead', 'Potvrdit přečtení')}
                          </button>
                        </div>
                      )
                    })
                  ) : (
                    <div className="list-item">
                      <p className="item-title">{t('noImportantMessage', noImportantMessage)}</p>
                    </div>
                  )}
                </>
              )}
            </article>

            <button type="button" className="fab">
              <MessageCirclePlus size={17} strokeWidth={1.9} />
              {t('newMessage', 'Nová zpráva')}
            </button>
          </section>
        )}

        {!showProfileScreen && activeTab === 'more' && (
          <section className="screen">
            <article className="card external-systems-card">
                <h3>{t('externalSystems', 'Další systémy')}</h3>
              <p className="external-systems-intro">
                {t(
                  'externalSystemsIntro',
                  'Přístup přes OreaPeople jako druhý faktor. Na počítači by vás přihlášení v externím systému nejdřív vyzvalo k potvrzení v této mobilní aplikaci (v demu neukazujeme).',
                )}
              </p>
              <div className="external-systems-list">
                {externalSystems.map((system) => (
                  <button
                    key={system.id}
                    type="button"
                    className="external-system-row"
                    onClick={() => requestExternalSystem(system)}
                  >
                    <span>
                      <span className="item-title">{system.label}</span>
                      <span className="external-system-desc">{system.description}</span>
                    </span>
                    <ChevronRight size={16} strokeWidth={1.9} />
                  </button>
                ))}
              </div>
            </article>

            <article className="card">
              <h3>{t('documents', 'Dokumenty')}</h3>
              <p className="micro-label documents-2fa-hint">
                {t('documents2faHint', 'Stažení je chráněno dvoufázovým ověřením v této aplikaci.')}
              </p>
              <div className="list-item">
                <p className="item-title">{t('employmentContract', 'Pracovní smlouva.pdf')}</p>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => requestDocumentDownload(t('employmentContract', 'Pracovní smlouva.pdf'))}
                >
                  {t('download', 'Stáhnout')}
                </button>
              </div>
              <div className="list-item">
                <p className="item-title">{t('annualReview2025', 'Roční hodnocení za 2025')}</p>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => requestDocumentDownload(`${t('annualReview2025', 'Roční hodnocení za 2025')}.pdf`)}
                >
                  {t('download', 'Stáhnout')}
                </button>
              </div>
              {documentStatus && <p className="status-message">{documentStatus}</p>}
            </article>

            <article className="card knowledge-card">
              <h3>{t('oreaDigiBuddy', 'Orea DigiBuddy')}</h3>
              <p className="knowledge-intro">
                {t(
                  'digiBuddyIntro',
                  'AI asistent nad interní dokumentací. V budoucnu poběží nad RAG databází firemního know-how.',
                )}
              </p>
              <form className="knowledge-form" onSubmit={submitKnowledgeQuery}>
                <textarea
                  className="knowledge-input"
                  placeholder={t(
                    'digiBuddyPlaceholder',
                    'Napište dotaz (např. Jaký je postup při nočním check-inu?)',
                  )}
                  value={knowledgeQuery}
                  onChange={(event) => setKnowledgeQuery(event.target.value)}
                  rows={3}
                />
                <button type="submit" className="primary">
                  {t('askButton', 'Zeptat se')}
                </button>
              </form>
              {knowledgeAnswer && (
                <div className="knowledge-answer">
                  <p className="micro-label">{t('oreaDigiBuddyAnswer', 'Orea DigiBuddy odpověď')}</p>
                  <p>{knowledgeAnswer}</p>
                </div>
              )}
            </article>

            <article className="card nps-card">
              <p className="micro-label">{t('growthAndFeedback', 'Rozvoj a feedback')}</p>
              <h3>{t('employeeSatisfaction', 'Zaměstnanecká spokojenost')}</h3>
              <p className="nps-intro">
                {t(
                  'npsIntro',
                  'Pravidelný měsíční pulse. Plný průzkum běží v LutherONE, v demu ukládáme odpověď jen lokálně.',
                )}
              </p>
              {npsSubmitted ? (
                <div className="list-item">
                  <p className="status-message">
                    {t('thanksForFeedback', 'Děkujeme za zpětnou vazbu.')}
                    {npsScore !== null && ` ${t('yourScore', 'Vaše hodnocení')}: ${npsScore}/10.`}
                  </p>
                </div>
              ) : (
                <>
                  <p className="nps-question item-title">
                    {t(
                      'npsQuestion',
                      'Když byste měli doporučit Orea jako zaměstnavatele, doporučili byste ho?',
                    )}
                  </p>
                  <div className="nps-scale-labels">
                    <span>{t('npsLow', '0 – Rozhodně ne')}</span>
                    <span>{t('npsHigh', '10 – Rozhodně ano')}</span>
                  </div>
                  <div className="nps-scale" role="group" aria-label={t('npsAria', 'Hodnocení 0 až 10')}>
                    {Array.from({ length: 11 }, (_, value) => value).map((value) => (
                      <button
                        key={value}
                        type="button"
                        className="nps-chip"
                        onClick={() => submitNps(value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </article>

            <article className="card">
              <h3>{t('requestsAndTimeOff', 'Žádanky a volno')}</h3>
              <div className="list-item request-row">
                <div>
                  <p className="item-title">{t('vacation', 'Dovolená')}</p>
                  <p>{t('vacationBalance', 'Zbývá vám 6,5 dne')}</p>
                </div>
                <button type="button" className="primary">
                  {t('requestVacation', 'Požádat o dovolenou')}
                </button>
              </div>
              <div className="list-item request-row">
                <div>
                  <p className="item-title">{t('doctorLeavePass', 'Propustka k lékaři')}</p>
                </div>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => submitRequest(t('doctorLeavePass', 'Propustka k lékaři'))}
                >
                  {t('newRequest', 'Nová žádanka')}
                </button>
              </div>
              <div className="list-item request-row">
                <div>
                  <p className="item-title">{t('sickDay', 'Sick day')}</p>
                  <p>{t('sickDayBalance', 'Zbývá: 2 ze 3 dnů')}</p>
                </div>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => submitRequest(t('sickDay', 'Sick day'))}
                >
                  {t('report', 'Nahlásit')}
                </button>
              </div>
              <div className="list-item request-row">
                <div>
                  <p className="item-title">{t('businessTrip', 'Služební cesta')}</p>
                </div>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => submitRequest(t('businessTrip', 'Služební cesta'))}
                >
                  {t('newRequest', 'Nová žádanka')}
                </button>
              </div>
              <button type="button" className="text-button request-history-link">
                {t('showRequestHistory', 'Zobrazit historii žádanek')}
              </button>
              {requestStatus && <p className="status-message">{requestStatus}</p>}
            </article>

            <article className="card">
              <h3>{t('benefits', 'Benefity')}</h3>
              <div className="benefits-list">
                <button type="button" className="benefit-row">
                  <span>
                    <span className="item-title">{t('pluxeeCard', 'Pluxee karta')}</span>
                    <span className="benefit-subtitle">{t('pluxeeBalance', 'Aktuální zůstatek: 2 400 Kč')}</span>
                  </span>
                  <ChevronRight size={16} strokeWidth={1.9} />
                </button>
                <button type="button" className="benefit-row">
                  <span>
                    <span className="item-title">{t('companyDiscounts', 'Firemní slevy')}</span>
                    <span className="benefit-subtitle">{t('activeOffers', '12 aktivních nabídek')}</span>
                  </span>
                  <ChevronRight size={16} strokeWidth={1.9} />
                </button>
              </div>
              <p className="micro-label benefits-note">
                {t('benefitsAfterProbation', 'Benefity jsou dostupné po skončení zkušební doby.')}
              </p>
            </article>

            <article className="card referral-card">
              <h3>{t('referColleague', 'Doporuč kolegu')}</h3>
              <p className="referral-intro">
                {t(
                  'referralIntro',
                  'Znáte někoho, kdo by se k nám hodil? Za úspěšné doporučení získáte odměnu.',
                )}
              </p>
              <p className="item-title">{t('yourCode', 'Váš kód')}: EVA-2026-REC</p>
              <div className="dual-action-row">
                <button type="button" className="secondary" onClick={shareReferralCode}>
                  {t('shareCode', 'Sdílet kód')}
                </button>
                <button type="button" className="secondary" onClick={jumpToOpenPositions}>
                  {t('showOpenPositions', 'Zobrazit otevřené pozice')}
                </button>
              </div>
              <p className="micro-label">{t('referralStats', 'Vaše doporučení: 1 aktivní, 0 přijatých')}</p>
              {referralStatus && <p className="status-message">{referralStatus}</p>}
            </article>

            <article className="card" ref={openPositionsRef}>
              <h3>{t('openPositions', 'Otevřené pozice')}</h3>
              <div className="positions-list">
                {openPositions.map((position) => (
                  <button key={position.id} type="button" className="position-row">
                    <span>
                      <span className="item-title">
                        {position.title}
                        {position.isNew ? (
                          <span className="status-pill info position-new-tag">{t('new', 'Nové')}</span>
                        ) : null}
                      </span>
                      <span className="position-subtitle">{position.location}</span>
                    </span>
                    <ChevronRight size={16} strokeWidth={1.9} />
                  </button>
                ))}
              </div>
            </article>

            <article className="card">
              <h3>{t('help', 'Pomoc')}</h3>
              <p>HR: hr@orea.cz</p>
              <p>{t('responseTime', 'Obvyklá doba odpovědi: do 24 hodin')}</p>
            </article>

            <article className="card whistleblowing-card">
              <h3>{t('anonymousReport', 'Anonymní oznámení')}</h3>
              <p className="whistleblowing-intro">
                {t(
                  'whistleIntro',
                  'Chráněný kanál pro nahlášení neetického jednání v souladu se zákonem o ochraně oznamovatelů.',
                )}
              </p>
              <button type="button" className="primary" onClick={submitWhistleblowing}>
                {t('submitReport', 'Podat oznámení')}
              </button>
              <p className="micro-label">{t('identityProtected', 'Vaše identita zůstane chráněna.')}</p>
              {whistleStatus && <p className="status-message">{whistleStatus}</p>}
            </article>
          </section>
        )}
      </main>

      <nav className="bottom-tabs" aria-label={t('mainNavigation', 'Main navigation')}>
        {tabButton('home', t('homeTab', 'Domů'), <Home size={18} strokeWidth={1.9} />)}
        {tabButton('messages', t('messagesTab', 'Zprávy'), <Mail size={18} strokeWidth={1.9} />)}
        {tabButton('more', t('moreTab', 'Více'), <Ellipsis size={18} strokeWidth={1.9} />)}
      </nav>

      {showShiftCalendar && (
        <div className="sheet-backdrop" onClick={() => setShowShiftCalendar(false)}>
          <section
            className="shift-sheet shift-calendar-sheet"
            onClick={(event) => event.stopPropagation()}
            aria-label={t('openShiftCalendar', 'Další směny')}
          >
            <p className="micro-label">{t('openShiftCalendar', 'Další směny')}</p>
            <h3 className="calendar-month-label">{monthLabel}</h3>
            <div className="shift-calendar-grid">
              {calendarCells.map((day, index) => (
                <div key={`calendar-cell-${index}`} className={`calendar-day ${day ? '' : 'calendar-day-empty'}`}>
                  {day ? (
                    <>
                      <span>{day}</span>
                      {shiftDays.has(day) ? <span className="shift-day-dot" aria-hidden="true" /> : null}
                    </>
                  ) : null}
                </div>
              ))}
            </div>
            <p className="micro-label">{t('calendarDotHint', 'Tečka označuje den s naplánovanou směnou.')}</p>
            <div className="button-row">
              <button type="button" className="secondary" onClick={() => setShowShiftCalendar(false)}>
                {t('close', 'Zavřít')}
              </button>
            </div>
          </section>
        </div>
      )}

      {showShiftSheet && (
        <div className="sheet-backdrop" onClick={() => setShowShiftSheet(false)}>
          <section
            className="shift-sheet"
            onClick={(event) => event.stopPropagation()}
            aria-label={t('shiftDetail', 'Detail směny')}
          >
            <p className="micro-label">{t('shiftDetail', 'Detail směny')}</p>
            <h3>
              {selectedShift.date} · {selectedShift.time}
            </h3>
            <p>{selectedShift.location}</p>
            <p>{t('shiftManager', 'Vedoucí směny')}: {selectedShift.manager}</p>
            <p>{t('coworkers', 'Na směně s vámi')}: {selectedShift.coworkers}</p>
            <p>{t('importantNote', 'Důležitá poznámka')}: {selectedShift.notes}</p>
            <p className={currentShiftStatus.tone}>{currentShiftStatus.label}</p>
            {attendanceMeta.pauseType && (
              <p className="micro-label">
                {attendanceMeta.pauseType}
                {attendanceMeta.pauseReason ? ` - ${attendanceMeta.pauseReason}` : ''}
              </p>
            )}
            <div className="button-row">
              {(shiftAttendanceStatus === 'off_site' || shiftAttendanceStatus === 'paused') && (
                <button
                  type="button"
                  className="primary"
                  onClick={handleClockIn}
                  disabled={!isAtShiftLocation || shiftAttendanceStatus === 'ended'}
                >
                  {t('clockIn', 'Clock in')}
                </button>
              )}
              {shiftAttendanceStatus === 'on_shift' && (
                <button type="button" className="primary" onClick={openClockOutSheet}>
                  {t('clockOut', 'Clock-out')}
                </button>
              )}
              <button
                type="button"
                className="primary"
                onClick={() => setShowSwapForm((current) => !current)}
              >
                {t('changeShift', 'Potřebuji změnit tuto směnu')}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => setShowShiftSheet(false)}
              >
                {t('close', 'Zavřít')}
              </button>
            </div>
            {showSwapForm && (
              <form className="swap-form" onSubmit={submitSwapRequest}>
                <label>
                  {t('shiftChangeReason', 'Důvod změny směny')}
                  <select
                    value={swapReason}
                    onChange={(event) => setSwapReason(event.target.value)}
                  >
                    <option>{t('familyReasons', 'Rodinné důvody')}</option>
                    <option>{t('healthReasons', 'Zdravotní důvody')}</option>
                    <option>{t('urgentPersonalSituation', 'Naléhavá osobní situace')}</option>
                  </select>
                </label>
                <label>
                  {t('replacementPreference', 'Preference náhrady')}
                  <select
                    value={swapOption}
                    onChange={(event) => setSwapOption(event.target.value)}
                  >
                    <option>{t('canArrangeSwap', 'Mohu se domluvit na výměně')}</option>
                    <option>{t('needHelpCoveringShift', 'Prosím o pomoc s pokrytím směny')}</option>
                  </select>
                </label>
                <button type="submit" className="primary">
                  {t('sendRequestToManager', 'Odeslat žádost vedoucí')}
                </button>
              </form>
            )}
            {swapStatus === 'pending' && (
              <p className="status-message">{t('swapSentPending', 'Odesláno. Čeká na schválení vedoucí.')}</p>
            )}
          </section>
        </div>
      )}
      {showGeoClockInPrompt && (
        <div className="sheet-backdrop" onClick={() => setShowGeoClockInPrompt(false)}>
          <section
            className="shift-sheet geo-prompt-sheet"
            onClick={(event) => event.stopPropagation()}
            aria-label={t('clockInConfirmation', 'Clock in potvrzení')}
          >
            <p className="micro-label">{t('geolocation', 'Geolokace')}</p>
            <h3>{t('atShiftLocation', 'Jste na místě směny')}</h3>
            <p>
              {t(
                'clockInPrompt',
                'Detekovali jsme přítomnost na pracovišti. Chcete se nyní přihlásit na směnu pomocí Clock in?',
              )}
            </p>
            <div className="button-row">
              <button type="button" className="primary" onClick={handleClockIn}>
                {t('clockIn', 'Clock in')}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => setShowGeoClockInPrompt(false)}
              >
                {t('later', 'Později')}
              </button>
            </div>
          </section>
        </div>
      )}
      {showClockOutSheet && (
        <div className="sheet-backdrop" onClick={() => setShowClockOutSheet(false)}>
          <section
            className="shift-sheet"
            onClick={(event) => event.stopPropagation()}
            aria-label={t('clockOutForm', 'Clock-out formulář')}
          >
            <p className="micro-label">{t('clockOut', 'Clock-out')}</p>
            <h3>{t('chooseDepartureType', 'Zvolte typ odchodu')}</h3>
            <form className="swap-form" onSubmit={submitClockOut}>
              <label>
                {t('departureType', 'Typ odchodu')}
                <select
                  value={clockOutAction}
                  onChange={(event) => setClockOutAction(event.target.value)}
                >
                  <option value="pause">{t('pauseShift', 'Přerušit směnu')}</option>
                  <option value="end">{t('endShift', 'Ukončit směnu')}</option>
                </select>
              </label>
              <label>
                {clockOutAction === 'pause'
                  ? t('pauseReasonRequired', 'Důvod přerušení (povinné)')
                  : t('departureNote', 'Poznámka k odchodu')}
                <input
                  type="text"
                  value={clockOutReason}
                  onChange={(event) => setClockOutReason(event.target.value)}
                  placeholder={
                    clockOutAction === 'pause'
                      ? t('pausePlaceholder', 'Např. Odcházím na cigáro')
                      : t('endPlaceholder', 'Např. Směna dokončena')
                  }
                  required={clockOutAction === 'pause'}
                />
              </label>
              <label>
                {t('additionalNote', 'Doplňující poznámka')}
                <input
                  type="text"
                  value={clockOutNote}
                  onChange={(event) => setClockOutNote(event.target.value)}
                  placeholder={t('additionalNotePlaceholder', 'Např. návrat za 10 minut / lékař')}
                />
              </label>
              <div className="button-row">
                <button type="submit" className="primary">
                  {t('confirmClockOut', 'Potvrdit Clock-out')}
                </button>
                <button type="button" className="secondary" onClick={() => setShowClockOutSheet(false)}>
                  {t('cancel', 'Zrušit')}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
      {showBiometricGate && pendingBiometricAction && (
        <div className="sheet-backdrop" onClick={closeBiometricGate}>
          <section
            className="shift-sheet geo-prompt-sheet"
            onClick={(event) => event.stopPropagation()}
            aria-label={t('biometricVerification', 'Biometrické ověření')}
          >
            <p className="micro-label">{t('accessVerification', 'Ověření přístupu')}</p>
            <h3>
              {pendingBiometricAction.kind === 'external'
                ? pendingBiometricAction.system.label
                : pendingBiometricAction.label}
            </h3>
            <p>
              {pendingBiometricAction.kind === 'external'
                ? t(
                    'verifyBiometricExternal',
                    'Pro otevření systému v nové kartě potvrďte svou totožnost biometrií (demo simulace).',
                  )
                : t(
                    'verifyBiometricDocument',
                    'Pro stažení dokumentu potvrďte svou totožnost biometrií (demo simulace).',
                  )}
            </p>
            <p className="micro-label">
              {pendingBiometricAction.kind === 'external'
                ? t(
                    'desktopApprovalHint',
                    'Při přihlášení z desktopu byste obdrželi požadavek na schválení zde v aplikaci.',
                  )
                : t(
                    'sensitiveDocsHint',
                    'Citlivé dokumenty jsou v produkci chráněny stejným druhým faktorem jako přístup k systémům.',
                  )}
            </p>
            <div className="button-row">
              <button type="button" className="primary" onClick={confirmBiometricAction}>
                {t('verifyBiometricDemo', 'Ověřit biometrií (demo)')}
              </button>
              <button type="button" className="secondary" onClick={closeBiometricGate}>
                {t('cancel', 'Zrušit')}
              </button>
            </div>
          </section>
        </div>
      )}
      {showOnboardingAccountModal && (
        <div className="sheet-backdrop" onClick={closeOnboardingAccountModal}>
          <section
            className="shift-sheet"
            onClick={(event) => event.stopPropagation()}
            aria-label={t('setupAccount', 'Nastavit účet')}
          >
            <p className="micro-label">{t('onboarding', 'Onboarding')}</p>
            <h3>{t('setupAccount', 'Nastavit účet')}</h3>
            <form className="swap-form" onSubmit={submitOnboardingAccountSetup}>
              <label>
                {t('bankAccount', 'Bankovní účet')}
                <input
                  type="text"
                  value={onboardingBankAccount}
                  onChange={(event) => setOnboardingBankAccount(event.target.value)}
                  required
                />
              </label>
              <label>
                {t('correspondenceEmail', 'Korespondenční email')}
                <input
                  type="email"
                  value={onboardingCorrespondenceEmail}
                  onChange={(event) => setOnboardingCorrespondenceEmail(event.target.value)}
                  required
                />
              </label>
              <label>
                {t('childrenCount', 'Počet dětí')}
                <input
                  type="number"
                  min="0"
                  value={onboardingChildrenCount}
                  onChange={(event) => setOnboardingChildrenCount(event.target.value)}
                />
              </label>
              <label>
                {t('spouse', 'Manželka')}
                <input
                  type="text"
                  value={onboardingSpouse}
                  onChange={(event) => setOnboardingSpouse(event.target.value)}
                />
              </label>
              <div className="button-row">
                <button type="submit" className="primary">
                  {t('save', 'Uložit')}
                </button>
                <button type="button" className="secondary" onClick={closeOnboardingAccountModal}>
                  {t('cancel', 'Zrušit')}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
      </div>
    </>
  )
}

export default App
