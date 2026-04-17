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
  },
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
  const [todoItems, setTodoItems] = useState(() =>
    createTodoItems(DEMO_PROFILES.recepce.pendingActions),
  )
  const [attendanceMeta, setAttendanceMeta] = useState({
    lastActionTime: '',
    pauseReason: '',
    pauseType: '',
  })
  const [npsScore, setNpsScore] = useState(null)
  const [npsSubmitted, setNpsSubmitted] = useState(false)

  const profileData = DEMO_PROFILES[demoProfile]
  const shifts = profileData.shifts
  const updates = profileData.updates
  const importantUpdates = updates.filter((update) => update.tone === 'urgent')
  const importantFeed = importantUpdates.length > 0 ? importantUpdates : updates
  const hasImportantItems = importantFeed.length > 0
  const noImportantMessage = 'Dnes nejsou žádné důležité změny.'
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
  const profileDetails = PROFILE_DETAILS[demoProfile]
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

  const selectedShift = useMemo(
    () => shifts.find((shift) => shift.id === selectedShiftId) || shifts[0],
    [selectedShiftId, shifts],
  )
  const selectedPosition = useMemo(
    () => profileDetails.positions.find((position) => position.id === selectedPositionId) || null,
    [profileDetails.positions, selectedPositionId],
  )

  const sortedTodoItems = useMemo(
    () => [...todoItems].sort((a, b) => Number(a.done) - Number(b.done)),
    [todoItems],
  )
  const nowLabel = () =>
    new Date().toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    })
  const shiftStatusMeta = {
    off_site: { label: 'Mimo směnu', tone: 'status-pill info' },
    on_shift: { label: 'Na směně', tone: 'status-pill success' },
    paused: { label: 'Směna přerušená', tone: 'status-pill warning' },
    ended: { label: 'Směna ukončená', tone: 'status-pill urgent' },
  }
  const currentShiftStatus = shiftStatusMeta[shiftAttendanceStatus]
  const openPositionsRef = useRef(null)
  const nearestShiftsRef = useRef(null)

  const t = (key, fallback) => {
    if (language === 'cs') return fallback
    return TRANSLATIONS[language]?.[key] || fallback
  }

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
    setClockOutReason('Odcházím na krátkou přestávku')
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
        pauseType: 'Přerušení směny',
      })
    } else {
      setShiftAttendanceStatus('ended')
      setIsAtShiftLocation(false)
      setAttendanceMeta({
        lastActionTime: nowLabel(),
        pauseReason: note || '',
        pauseType: 'Ukončení směny',
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
      setReferralStatus('Kód byl připraven ke sdílení.')
    } catch {
      setReferralStatus('Kód: EVA-2026-REC')
    }
  }

  const jumpToOpenPositions = () => {
    openPositionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const submitRequest = (requestLabel) => {
    setRequestStatus(`Žádanka „${requestLabel}“ byla v demu založena.`)
  }

  const submitWhistleblowing = () => {
    setWhistleStatus('Oznámení bylo v demu přijato do chráněného kanálu.')
  }

  const reportEquipmentIssue = () => {
    setEquipmentStatus('Požadavek byl v demu odeslán IT podpoře.')
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
    setClockOutReason('Odcházím na krátkou přestávku')
    setClockOutNote('')
    setTodoItems(createTodoItems(DEMO_PROFILES[nextProfile].pendingActions))
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
  }

  const handleDocumentAction = (label) => {
    setDocumentStatus(`Otevřeno: ${label}`)
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
      setDocumentStatus(`Staženo: ${pendingBiometricAction.label}`)
    }
    setShowBiometricGate(false)
    setPendingBiometricAction(null)
  }

  const quickThreads = [
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
      messages: [
        { id: 1, direction: 'in', text: 'Pokoje 312 a 314 jsou připravené.', time: '12:05' },
      ],
    },
  ]

  const emails = [
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
  ]

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
          Režim: {demoProfile === 'recepce' ? 'Recepce' : 'Housekeeping'}
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
                    <ArrowLeft size={15} strokeWidth={2} /> Zpět
                  </button>
                  <div className="profile-header">
                    <span className="profile-avatar profile-avatar-large">{employeeInitials}</span>
                    <div>
                      <h3>{profileData.employeeName}</h3>
                      <p className="micro-label">{profileData.employeeRole}</p>
                    </div>
                  </div>
                  <div className="list-item">
                    <p className="item-title">Hotel</p>
                    <p>{profileData.hotelLabel}</p>
                  </div>
                  <div className="list-item">
                    <p className="item-title">E-mail</p>
                    <p>{employeeEmail}</p>
                  </div>
                  <div className="list-item">
                    <p className="item-title">Podpora HR</p>
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
                    <h3>Výplatní pásky</h3>
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
                    <h3>Kurzy</h3>
                    <div className="profile-list">
                      {profileDetails.courses.map((course) => (
                        <div key={course.id} className="profile-list-row profile-list-row-static">
                          <span>{course.title}</span>
                          <span className={`status-pill course-${course.status}`}>
                            {course.status === 'done'
                              ? 'Hotovo'
                              : course.status === 'in_progress'
                                ? 'Rozpracováno'
                                : 'Povinné'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="list-item profile-section">
                    <h3>Pozice v Orea</h3>
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
                    <h3>Svěřené vybavení</h3>
                    <div className="profile-list">
                      <button type="button" className="profile-list-row">
                        <span>iPhone 14 — přiděleno 15.3.2024</span>
                        <ChevronRight size={16} strokeWidth={1.9} />
                      </button>
                      <button type="button" className="profile-list-row">
                        <span>Notebook Lenovo T14 — přiděleno 1.9.2023</span>
                        <ChevronRight size={16} strokeWidth={1.9} />
                      </button>
                    </div>
                    <button type="button" className="text-button" onClick={reportEquipmentIssue}>
                      Nahlásit závadu nebo potřebu nového vybavení
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
                    <ArrowLeft size={15} strokeWidth={2} /> Zpět na profil
                  </button>
                  <h3>{selectedPosition.title}</h3>
                  <p className="micro-label">{selectedPosition.period}</p>
                  <p>{selectedPosition.summary}</p>
                  <div className="list-item">
                    <p className="item-title">Hlavní odpovědnosti</p>
                    <ul className="profile-bullet-list">
                      {selectedPosition.responsibilities.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="list-item">
                    <p className="item-title">Klíčové dovednosti</p>
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
              <h2 className="shift-time">{shifts[0]?.time || 'Bez směny'}</h2>
              <p className="shift-date">{shifts[0]?.date || 'Dnes'}</p>
              <p className={currentShiftStatus.tone}>{currentShiftStatus.label}</p>
              {attendanceMeta.lastActionTime && (
                <p className="micro-label">Poslední akce: {attendanceMeta.lastActionTime}</p>
              )}
              {attendanceMeta.pauseType && (
                <p className="micro-label">
                  {attendanceMeta.pauseType}
                  {attendanceMeta.pauseReason ? ` - ${attendanceMeta.pauseReason}` : ''}
                </p>
              )}
              <p>
                {shifts[0]
                  ? `Vaše další směna: ${shifts[0].role} v ${shifts[0].location}`
                  : 'Dnes nemáte naplánovanou směnu.'}
              </p>
              <button
                type="button"
                className="text-button shift-link shift-link-on-dark"
                onClick={() => nearestShiftsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                {t('openNearestShifts', 'Nejbližší směny')}
              </button>
              <button
                type="button"
                className={`secondary location-toggle ${isAtShiftLocation ? 'is-active' : ''}`}
                onClick={() => setIsAtShiftLocation((current) => !current)}
              >
                {isAtShiftLocation ? 'Jste na místě směny' : 'Jsem na místě'}
              </button>
              {shifts[0] && (
                <div className="button-row">
                  <button
                    type="button"
                    className="primary action-button"
                    onClick={() => openShiftDetails(shifts[0].id)}
                  >
                    Vaše další směna začíná v {shifts[0].time}
                  </button>
                  {(shiftAttendanceStatus === 'off_site' || shiftAttendanceStatus === 'paused') && (
                    <button
                      type="button"
                      className="secondary action-button"
                      onClick={handleClockIn}
                      disabled={!isAtShiftLocation || shiftAttendanceStatus === 'ended'}
                    >
                      Clock in
                    </button>
                  )}
                  {shiftAttendanceStatus === 'on_shift' && (
                    <button
                      type="button"
                      className="secondary action-button"
                      onClick={openClockOutSheet}
                    >
                      Clock-out
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
                      {update.tagLabel || 'Důležité'}
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
                      <span className="item-title">{item.label}</span>
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
              <p className="micro-label">Guest Satisfaction Score</p>
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
                  Cíl hotelu: <strong>{gssTargetLabel}</strong>
                </p>
                <p className={isGssOnTarget ? 'gss-target-on' : 'gss-target-close'}>
                  {isGssOnTarget ? 'Cíl splněn' : 'Těsně pod cílem'}
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
                  <p className="item-title">Žádné další směny nejsou naplánované.</p>
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
              <h3>Zprávy</h3>
              <div className="chat-tabs">
                <button
                  type="button"
                  className={
                    activeMessagePanel === 'quick' ? 'chat-tab chat-tab-active' : 'chat-tab'
                  }
                  onClick={() => setActiveMessagePanel('quick')}
                >
                  Rychlé zprávy
                </button>
                <button
                  type="button"
                  className={
                    activeMessagePanel === 'emails' ? 'chat-tab chat-tab-active' : 'chat-tab'
                  }
                  onClick={() => setActiveMessagePanel('emails')}
                >
                  E-maily
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
                  Hromadná sdělení
                </button>
              </div>
            </article>

            <article className="card">
              {activeMessagePanel === 'quick' && (
                <>
                  <h3>Rychlé zprávy</h3>
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
                        Zpět na konverzace
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
                      <div className="chat-input">Napište zprávu... (demo)</div>
                    </div>
                  )}
                </>
              )}

              {activeMessagePanel === 'emails' && (
                <>
                  <h3>E-maily</h3>
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
                          {email.unread && <span className="thread-badge">Nové</span>}
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
                        Zpět na seznam e-mailů
                      </button>
                      <p className="item-title">{selectedEmail.subject}</p>
                      <p>Od: {selectedEmail.from}</p>
                      <p>Čas: {selectedEmail.time}</p>
                      <article className="email-body">{selectedEmail.body}</article>
                    </div>
                  )}
                </>
              )}

              {activeMessagePanel === 'broadcast' && (
                <>
                  <h3>Hromadná sdělení</h3>
                  <p className="broadcast-feed-hint">
                    Stejné důležité informace jako v sekci Vyžaduje pozornost na Domů. U povinných
                    sdělení potvrďte přečtení zde.
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
                            {update.tagLabel || 'Důležité'}
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
                            {broadcastRead ? 'Potvrzeno' : 'Potvrdit přečtení'}
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
              Nová zpráva
            </button>
          </section>
        )}

        {!showProfileScreen && activeTab === 'more' && (
          <section className="screen">
            <article className="card external-systems-card">
              <h3>Další systémy</h3>
              <p className="external-systems-intro">
                Přístup přes OreaPeople jako druhý faktor. Na počítači by vás přihlášení v externím
                systému nejdřív vyzvalo k potvrzení v této mobilní aplikaci (v demu neukazujeme).
              </p>
              <div className="external-systems-list">
                {EXTERNAL_SYSTEMS.map((system) => (
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
              <h3>Dokumenty</h3>
              <p className="micro-label documents-2fa-hint">
                Stažení je chráněno dvoufázovým ověřením v této aplikaci.
              </p>
              <div className="list-item">
                <p className="item-title">Pracovní smlouva.pdf</p>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => requestDocumentDownload('Pracovní smlouva.pdf')}
                >
                  Stáhnout
                </button>
              </div>
              <div className="list-item">
                <p className="item-title">Roční hodnocení za 2025</p>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => requestDocumentDownload('Roční hodnocení za 2025.pdf')}
                >
                  Stáhnout
                </button>
              </div>
              {documentStatus && <p className="status-message">{documentStatus}</p>}
            </article>

            <article className="card knowledge-card">
              <h3>{t('oreaDigiBuddy', 'Orea DigiBuddy')}</h3>
              <p className="knowledge-intro">
                AI asistent nad interní dokumentací. V budoucnu poběží nad RAG databází firemního
                know-how.
              </p>
              <form className="knowledge-form" onSubmit={submitKnowledgeQuery}>
                <textarea
                  className="knowledge-input"
                  placeholder="Napište dotaz (např. Jaký je postup při nočním check-inu?)"
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
              <p className="micro-label">Rozvoj a feedback</p>
              <h3>Zaměstnanecká spokojenost</h3>
              <p className="nps-intro">
                Pravidelný měsíční pulse. Plný průzkum běží v LutherONE, v demu ukládáme odpověď jen
                lokálně.
              </p>
              {npsSubmitted ? (
                <div className="list-item">
                  <p className="status-message">
                    Děkujeme za zpětnou vazbu.
                    {npsScore !== null && ` Vaše hodnocení: ${npsScore}/10.`}
                  </p>
                </div>
              ) : (
                <>
                  <p className="nps-question item-title">
                    Když byste měli doporučit Orea jako zaměstnavatele, doporučili byste ho?
                  </p>
                  <div className="nps-scale-labels">
                    <span>0 – Rozhodně ne</span>
                    <span>10 – Rozhodně ano</span>
                  </div>
                  <div className="nps-scale" role="group" aria-label="Hodnocení 0 až 10">
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
              <h3>Žádanky a volno</h3>
              <div className="list-item request-row">
                <div>
                  <p className="item-title">Dovolená</p>
                  <p>Zbývá vám 6,5 dne</p>
                </div>
                <button type="button" className="primary">
                  Požádat o dovolenou
                </button>
              </div>
              <div className="list-item request-row">
                <div>
                  <p className="item-title">Propustka k lékaři</p>
                </div>
                <button type="button" className="secondary" onClick={() => submitRequest('Propustka k lékaři')}>
                  Nová žádanka
                </button>
              </div>
              <div className="list-item request-row">
                <div>
                  <p className="item-title">Sick day</p>
                  <p>Zbývá: 2 ze 3 dnů</p>
                </div>
                <button type="button" className="secondary" onClick={() => submitRequest('Sick day')}>
                  Nahlásit
                </button>
              </div>
              <div className="list-item request-row">
                <div>
                  <p className="item-title">Služební cesta</p>
                </div>
                <button type="button" className="secondary" onClick={() => submitRequest('Služební cesta')}>
                  Nová žádanka
                </button>
              </div>
              <button type="button" className="text-button request-history-link">
                Zobrazit historii žádanek
              </button>
              {requestStatus && <p className="status-message">{requestStatus}</p>}
            </article>

            <article className="card">
              <h3>Benefity</h3>
              <div className="benefits-list">
                <button type="button" className="benefit-row">
                  <span>
                    <span className="item-title">Pluxee karta</span>
                    <span className="benefit-subtitle">Aktuální zůstatek: 2 400 Kč</span>
                  </span>
                  <ChevronRight size={16} strokeWidth={1.9} />
                </button>
                <button type="button" className="benefit-row">
                  <span>
                    <span className="item-title">Firemní slevy</span>
                    <span className="benefit-subtitle">12 aktivních nabídek</span>
                  </span>
                  <ChevronRight size={16} strokeWidth={1.9} />
                </button>
              </div>
              <p className="micro-label benefits-note">
                Benefity jsou dostupné po skončení zkušební doby.
              </p>
            </article>

            <article className="card referral-card">
              <h3>Doporuč kolegu</h3>
              <p className="referral-intro">
                Znáte někoho, kdo by se k nám hodil? Za úspěšné doporučení získáte odměnu.
              </p>
              <p className="item-title">Váš kód: EVA-2026-REC</p>
              <div className="dual-action-row">
                <button type="button" className="secondary" onClick={shareReferralCode}>
                  Sdílet kód
                </button>
                <button type="button" className="secondary" onClick={jumpToOpenPositions}>
                  Zobrazit otevřené pozice
                </button>
              </div>
              <p className="micro-label">Vaše doporučení: 1 aktivní, 0 přijatých</p>
              {referralStatus && <p className="status-message">{referralStatus}</p>}
            </article>

            <article className="card" ref={openPositionsRef}>
              <h3>Otevřené pozice</h3>
              <div className="positions-list">
                {OPEN_POSITIONS.map((position) => (
                  <button key={position.id} type="button" className="position-row">
                    <span>
                      <span className="item-title">
                        {position.title}
                        {position.isNew ? <span className="status-pill info position-new-tag">Nové</span> : null}
                      </span>
                      <span className="position-subtitle">{position.location}</span>
                    </span>
                    <ChevronRight size={16} strokeWidth={1.9} />
                  </button>
                ))}
              </div>
            </article>

            <article className="card">
              <h3>Pomoc</h3>
              <p>HR: hr@orea.cz</p>
              <p>Obvyklá doba odpovědi: do 24 hodin</p>
            </article>

            <article className="card whistleblowing-card">
              <h3>Anonymní oznámení</h3>
              <p className="whistleblowing-intro">
                Chráněný kanál pro nahlášení neetického jednání v souladu se zákonem o ochraně
                oznamovatelů.
              </p>
              <button type="button" className="primary" onClick={submitWhistleblowing}>
                Podat oznámení
              </button>
              <p className="micro-label">Vaše identita zůstane chráněna.</p>
              {whistleStatus && <p className="status-message">{whistleStatus}</p>}
            </article>
          </section>
        )}
      </main>

      <nav className="bottom-tabs" aria-label="Main navigation">
        {tabButton('home', 'Domů', <Home size={18} strokeWidth={1.9} />)}
        {tabButton('messages', 'Zprávy', <Mail size={18} strokeWidth={1.9} />)}
        {tabButton('more', 'Více', <Ellipsis size={18} strokeWidth={1.9} />)}
      </nav>

      {showShiftCalendar && (
        <div className="sheet-backdrop" onClick={() => setShowShiftCalendar(false)}>
          <section
            className="shift-sheet shift-calendar-sheet"
            onClick={(event) => event.stopPropagation()}
            aria-label="Další směny"
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
            <p className="micro-label">Tečka označuje den s naplánovanou směnou.</p>
            <div className="button-row">
              <button type="button" className="secondary" onClick={() => setShowShiftCalendar(false)}>
                Zavřít
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
            aria-label="Detail směny"
          >
            <p className="micro-label">Detail směny</p>
            <h3>
              {selectedShift.date} · {selectedShift.time}
            </h3>
            <p>{selectedShift.location}</p>
            <p>Vedoucí směny: {selectedShift.manager}</p>
            <p>Na směně s vámi: {selectedShift.coworkers}</p>
            <p>Důležitá poznámka: {selectedShift.notes}</p>
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
                  Clock in
                </button>
              )}
              {shiftAttendanceStatus === 'on_shift' && (
                <button type="button" className="primary" onClick={openClockOutSheet}>
                  Clock-out
                </button>
              )}
              <button
                type="button"
                className="primary"
                onClick={() => setShowSwapForm((current) => !current)}
              >
                Potřebuji změnit tuto směnu
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => setShowShiftSheet(false)}
              >
                Zavřít
              </button>
            </div>
            {showSwapForm && (
              <form className="swap-form" onSubmit={submitSwapRequest}>
                <label>
                  Důvod změny směny
                  <select
                    value={swapReason}
                    onChange={(event) => setSwapReason(event.target.value)}
                  >
                    <option>Rodinné důvody</option>
                    <option>Zdravotní důvody</option>
                    <option>Naléhavá osobní situace</option>
                  </select>
                </label>
                <label>
                  Preference náhrady
                  <select
                    value={swapOption}
                    onChange={(event) => setSwapOption(event.target.value)}
                  >
                    <option>Mohu se domluvit na výměně</option>
                    <option>Prosím o pomoc s pokrytím směny</option>
                  </select>
                </label>
                <button type="submit" className="primary">
                  Odeslat žádost vedoucí
                </button>
              </form>
            )}
            {swapStatus === 'pending' && (
              <p className="status-message">Odesláno. Čeká na schválení vedoucí.</p>
            )}
          </section>
        </div>
      )}
      {showGeoClockInPrompt && (
        <div className="sheet-backdrop" onClick={() => setShowGeoClockInPrompt(false)}>
          <section
            className="shift-sheet geo-prompt-sheet"
            onClick={(event) => event.stopPropagation()}
            aria-label="Clock in potvrzení"
          >
            <p className="micro-label">Geolokace</p>
            <h3>Jste na místě směny</h3>
            <p>
              Detekovali jsme přítomnost na pracovišti. Chcete se nyní přihlásit na směnu pomocí
              Clock in?
            </p>
            <div className="button-row">
              <button type="button" className="primary" onClick={handleClockIn}>
                Clock in
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => setShowGeoClockInPrompt(false)}
              >
                Později
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
            aria-label="Clock-out formulář"
          >
            <p className="micro-label">Clock-out</p>
            <h3>Zvolte typ odchodu</h3>
            <form className="swap-form" onSubmit={submitClockOut}>
              <label>
                Typ odchodu
                <select
                  value={clockOutAction}
                  onChange={(event) => setClockOutAction(event.target.value)}
                >
                  <option value="pause">Přerušit směnu</option>
                  <option value="end">Ukončit směnu</option>
                </select>
              </label>
              <label>
                {clockOutAction === 'pause' ? 'Důvod přerušení (povinné)' : 'Poznámka k odchodu'}
                <input
                  type="text"
                  value={clockOutReason}
                  onChange={(event) => setClockOutReason(event.target.value)}
                  placeholder={
                    clockOutAction === 'pause'
                      ? 'Např. Odcházím na cigáro'
                      : 'Např. Směna dokončena'
                  }
                  required={clockOutAction === 'pause'}
                />
              </label>
              <label>
                Doplňující poznámka
                <input
                  type="text"
                  value={clockOutNote}
                  onChange={(event) => setClockOutNote(event.target.value)}
                  placeholder="Např. návrat za 10 minut / lékař"
                />
              </label>
              <div className="button-row">
                <button type="submit" className="primary">
                  Potvrdit Clock-out
                </button>
                <button type="button" className="secondary" onClick={() => setShowClockOutSheet(false)}>
                  Zrušit
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
            aria-label="Biometrické ověření"
          >
            <p className="micro-label">Ověření přístupu</p>
            <h3>
              {pendingBiometricAction.kind === 'external'
                ? pendingBiometricAction.system.label
                : pendingBiometricAction.label}
            </h3>
            <p>
              {pendingBiometricAction.kind === 'external'
                ? 'Pro otevření systému v nové kartě potvrďte svou totožnost biometrií (demo simulace).'
                : 'Pro stažení dokumentu potvrďte svou totožnost biometrií (demo simulace).'}
            </p>
            <p className="micro-label">
              {pendingBiometricAction.kind === 'external'
                ? 'Při přihlášení z desktopu byste obdrželi požadavek na schválení zde v aplikaci.'
                : 'Citlivé dokumenty jsou v produkci chráněny stejným druhým faktorem jako přístup k systémům.'}
            </p>
            <div className="button-row">
              <button type="button" className="primary" onClick={confirmBiometricAction}>
                Ověřit biometrií (demo)
              </button>
              <button type="button" className="secondary" onClick={closeBiometricGate}>
                Zrušit
              </button>
            </div>
          </section>
        </div>
      )}
      </div>
    </>
  )
}

export default App
