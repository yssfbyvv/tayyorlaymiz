import {
  User,
  Lesson,
  MockExamData,
  ExamResult,
  CertificateData,
  ChatMessage,
  SiteSettings,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'te_users_v1',
  CURRENT_USER: 'te_current_user_v1',
  LESSONS: 'te_lessons_v1',
  MOCK_EXAM: 'te_mock_exam_v1',
  RESULTS: 'te_results_v1',
  CERTIFICATES: 'te_certificates_v1',
  CHAT: 'te_chat_v1',
  SETTINGS: 'te_settings_v1',
};

// Default Admin Credentials
export const ADMIN_CREDENTIALS = {
  username: 'bilolbekpr',
  password: 'bilolbekxds',
};

const INITIAL_ADMIN: User = {
  id: 'user_admin_001',
  firstName: 'Bilolbek',
  lastName: 'Yusufboyev',
  username: 'bilolbekpr',
  password: 'bilolbekxds',
  age: 23,
  role: 'admin',
  createdAt: '2026-01-01T00:00:00Z',
};

const INITIAL_STUDENT: User = {
  id: 'user_student_demo',
  firstName: 'Shaxzod',
  lastName: 'Karimov',
  username: 'shaxzod9',
  password: 'password123',
  age: 21,
  role: 'student',
  createdAt: '2026-02-15T10:00:00Z',
};

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'lesson_listening_01',
    skill: 'listening',
    title: 'IELTS Listening Band 9.0: Master Note Completion & Distractors',
    level: 'IELTS 9.0',
    description: "Listening bo'limida chalg'ituvchi (distractor) so'zlarni ajratish, 40/40 natijaga erishish va British/American talaffuz sirlari.",
    durationMinutes: 25,
    youtubeId: 'bA9y1g2M6z8',
    youtubeTitle: 'IELTS Listening 9.0 Strategy & Note-Taking System',
    summaryText: "IELTS Listening Section 1-4 da har doim sinovdan o'tgan formula mavjud. Tinglashdan oldin savollardagi kalit so'zlarni (keywords) belgilang va sinonimlarni taxmin qiling. Ko'p xatoliklar sonlar, harflar va 'distractor' (masalan: 'Actually, let me double check... no, it was 50') so'zlarda uchraydi.",
    slides: [
      {
        title: "1. Distractorlarni Tanib Olish",
        content: "Nutq so'zlovchi dastlab bitta ma'lumot beradi, so'ng 'however', 'actually', 'mind you' kabi so'zlar bilan fikrini o'zgartiradi. So'nggi aniqlashtirilgan javobni oling.",
        keyPoints: [
          "'Wait a second, my mistake...' iborasidan so'ng haqiqiy javob keladi.",
          "Sinonimlarni tinglang: savolda 'cost' bo'lsa, audioda 'fee' yoki 'fare' deyiladi.",
          "Grammatik to'g'rilik: agar bo'sh joydan oldin 'an' bo'lsa, so'z unli bilan boshlanishi shart."
        ],
        diagramType: 'flowchart'
      },
      {
        title: "2. Band 9 Listening Xaritasi",
        content: "Section 1 (Ijtimoiy dialog) -> Section 2 (Yakka nutq/Gid) -> Section 3 (Akademik muhokama) -> Section 4 (Universitet ma'ruzasi).",
        keyPoints: [
          "Section 1: Ismlar, raqamlar, pochta indekslari.",
          "Section 2: Xarita (Map labelling) yo'nalishlari: opposite, adjacent, roundabout.",
          "Section 3: 2-3 talaba va professor suhbati. Fikrlarning to'g'ri kelishi.",
          "Section 4: To'xtovsiz 10 ta savol. Signpost words (firstly, subsequently, in conclusion) ga e'tibor."
        ],
        diagramType: 'comparison'
      }
    ],
    practiceQuestions: [
      {
        id: 'lq1',
        type: 'multiple-choice',
        question: "Audioda 'The initial departure was scheduled at 3:15, but severe headwinds delayed us until 3:45' deyilsa, poezd soat nechada jo'nagan?",
        options: ["3:15", "3:45", "3:30", "Delayed indefinitely"],
        correctAnswer: "3:45",
        explanation: "'Initial departure' dastlabki reja bo'lgan, ammo 'delayed us until 3:45' haqiqiy jo'nash vaqtini bildiradi."
      },
      {
        id: 'lq2',
        type: 'text-gap',
        question: "Savolda 'Registration includes a complimentary _______ for all attendees' bo'lsa, 'complimentary' so'zining sinonimi qanday bo'lishi mumkin?",
        correctAnswer: "free",
        explanation: "Complimentary IELTS da deyarli har doim 'free' (bepul) so'zining akademik sinonimi sifatida tushadi."
      }
    ]
  },
  {
    id: 'lesson_reading_01',
    skill: 'reading',
    title: 'IELTS Reading: True/False/Not Given & Speed Skimming',
    level: 'IELTS 9.0',
    description: "Academic matnlarni 15 daqiqada tahlil qilish, NOT GIVEN bilan FALSE orasidagi nozik farqni topish uslubi.",
    durationMinutes: 30,
    youtubeId: 'w35FkG4gO04',
    youtubeTitle: 'Mastering True False Not Given in IELTS Reading',
    summaryText: "True/False/Not Given savollarida eng katta xato - o'z shaxsiy bilimingizga tayanishdir. Faqat va faqat matnda to'g'ridan-to'g'ri aytilgan faktlarni asos qilib oling. Agar matnda ma'lumot rad etilsa = FALSE, agar matnda umuman tilga olinmasa yoki tasdiqlashning imkoni bo'lmasa = NOT GIVEN.",
    slides: [
      {
        title: "1. TRUE vs FALSE vs NOT GIVEN Qoidasi",
        content: "TRUE: Matndagi fikr 100% mos keladi (sinonimlar orqali). FALSE: Matndagi fikrga teskari / ziddir. NOT GIVEN: Matnda bu haqda ma'lumot yo'q yoki to'liq xulosa chiqarib bo'lmaydi.",
        keyPoints: [
          "100% moslik = TRUE",
          "100% ziddiyat = FALSE",
          "Noma'lum / tasdiqlanmagan = NOT GIVEN",
          "Kvantifikatorlarga e'tibor: all, always, some, occasionally"
        ],
        diagramType: 'comparison'
      },
      {
        title: "2. Skimming & Scanning Texnikasi",
        content: "Butun matnni so'zma-so'z o'qimang. Birinchi navbatda har bir paragrafning birinchi (topic sentence) va oxirgi jumlalarini o'qing.",
        keyPoints: [
          "Skimming: Matnning umumiy g'oyasini 2 daqiqada tushunish.",
          "Scanning: Maxsus ismlar, yillar, foizlar va terminlarni qidirish.",
          "Savollar ketma-ketlikda (in order) keladi (Matching Headings bundan mustasno)."
        ],
        diagramType: 'flowchart'
      }
    ],
    practiceQuestions: [
      {
        id: 'rq1',
        type: 'true-false-not-given',
        question: "Matnda: 'Recent satellite imagery suggests water ice may exist in deep polar craters.' Savol: 'Scientists have definitively proven that vast oceans of water exist on the moon.'",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        correctAnswer: "FALSE",
        explanation: "Matnda 'may exist in deep craters' (ehtimol bor) deyilgan, savolda esa 'definitively proven vast oceans' (aniq isbotlangan ulkan okeanlar) deb bo'rttirilgan va zidlashtirilgan (FALSE)."
      },
      {
        id: 'rq2',
        type: 'true-false-not-given',
        question: "Matnda: 'Professor Davies published his groundbreaking findings in 2021.' Savol: 'Professor Davies won a Nobel prize for his publication.'",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        correctAnswer: "NOT GIVEN",
        explanation: "Matnda uning maqola chiqargani aytilgan, ammo Nobel mukofoti olgan yoki olmaganligi haqida hech qanday ma'lumot berilmagan (NOT GIVEN)."
      }
    ]
  },
  {
    id: 'lesson_writing_01',
    skill: 'writing',
    title: 'Writing Task 2: C2 Level Inversion & Cohesion for Band 9',
    level: 'C2 Mastery',
    description: "Insho yozishda 9.0 ball olish mezonlari: Task Response, Coherence & Cohesion, Lexical Resource va Grammatical Range & Accuracy.",
    durationMinutes: 35,
    youtubeId: '3U1yYnLqL18',
    youtubeTitle: 'IELTS Writing Task 2 - How to Write a Band 9 Essay',
    summaryText: "Band 9 essey yozish uchun murakkab grammatik tuzilmalar kerak: Inversion ('Not only did the government fail... but also...'), Conditionals ('Were the authorities to intervene...'), va Cleft sentences ('It is through rigorous academic training that individuals succeed').",
    slides: [
      {
        title: "1. 4 ta Asosiy Baholash Mezoni (Band Descriptors)",
        content: "Band 9 olish uchun barcha 4 mezon bo'yicha eng yuqori talablar bajarilishi zarur.",
        keyPoints: [
          "Task Response (25%): Barcha savollarga to'liq, chuqur asoslangan dalillar bilan javob berish.",
          "Coherence & Cohesion (25%): Mantiqiy oqim, tabiiy paragraflar, ortiqcha takrorlanmagan bog'lovchilar.",
          "Lexical Resource (25%): Kam uchraydigan akademik lug'at (rare lexical items), to'g'ri kollokatsiyalar.",
          "Grammatical Range & Accuracy (25%): Murakkab jumlalar (Inversion, Participle clauses, Passive voice), 100% bexato."
        ],
        diagramType: 'band9-criteria'
      },
      {
        title: "2. C2 Inversion Strukturasi Misollari",
        content: "Oddiy gaplarni C2 darajasidagi inversionga aylantirish san'ati.",
        keyPoints: [
          "Oddiy: If countries cooperate, climate change can be mitigated.",
          "C2 Inversion: 'Should nations foster genuine cooperation, climate change could be substantially mitigated.'",
          "Oddiy: Technology is not only convenient, it also alters human cognition.",
          "C2 Inversion: 'Not only is modern technology undeniably pervasive, but it also profoundly alters cognitive patterns.'"
        ],
        diagramType: 'comparison'
      }
    ],
    practiceQuestions: [
      {
        id: 'wq1',
        type: 'multiple-choice',
        question: "Qaysi jumla C2 darajasidagi eng to'g'ri Inversion tuzilishiga ega?",
        options: [
          "Rarely we have seen such rapid advancements in artificial intelligence.",
          "Rarely have we witnessed such unprecedented advancements in artificial intelligence.",
          "Rarely did we witnessed advancements in AI.",
          "We rarely have seen such AI advancements."
        ],
        correctAnswer: "Rarely have we witnessed such unprecedented advancements in artificial intelligence.",
        explanation: "'Rarely' bilan gap boshlanganda yordamchi fe'l egadan oldinga o'tadi: Rarely + have + we + witnessed..."
      }
    ]
  },
  {
    id: 'lesson_speaking_01',
    skill: 'speaking',
    title: 'Speaking Part 2 & 3: Idiomatic Mastery & Fluency Under Pressure',
    level: 'IELTS 9.0',
    description: "Speaking imtihonida to'xtovsiz, tabiiy va boy iboralar bilan ravon gapirish, 2 daqiqalik monolog va chuqur tahliliy javoblar.",
    durationMinutes: 20,
    youtubeId: 'qQjH88F_x3c',
    youtubeTitle: 'IELTS Speaking Band 9 Real Candidate Interview',
    summaryText: "IELTS Speaking da 9.0 ball olish uchun sun'iy yodlangan gaplarni aytish emas, balki tabiiy inglizcha intonatsiya, to'g'ri fozaviy fe'llar (phrasal verbs), idiomalardan joyida foydalanish va fikrlarni mantiqiy kengaytirish talab qilinadi.",
    slides: [
      {
        title: "1. Part 2 Cue Card: 1 Daqiqalik Strategiya",
        content: "1 daqiqa ichida gaplar emas, faqat kalit g'oyalar va C2 darajasidagi so'zlar/idiomalar ro'yxatini tuzing.",
        keyPoints: [
          "Kirish: 'I would like to recount an experience that left an indelible mark on me...'",
          "PPF Texnikasi: Past (O'tmish), Present (Hozir), Future (Kelajak) bo'yicha gapirish.",
          "Hissiyotlar: 'To put it succinctly, I was over the moon yet fraught with anxiety.'"
        ],
        diagramType: 'mindmap'
      },
      {
        title: "2. Part 3: Akademik Tahliliy Javoblar",
        content: "O'z shaxsiy hayotingizdan emas, balki jamiyat, falsafa, iqtisodiyot va global tendensiyalar prizmasidan javob bering.",
        keyPoints: [
          "Generalise: 'From a sociological perspective, one might argue that...'",
          "Speculate: 'It stands to reason that in decades to come...'",
          "Balance: 'While the prevailing consensus suggests X, there is a compelling counterargument for Y.'"
        ],
        diagramType: 'comparison'
      }
    ],
    practiceQuestions: [
      {
        id: 'sq1',
        type: 'multiple-choice',
        question: "Speaking Part 3 da 'Do you think reading books will decline?' savoliga qaysi javob C2/Band 9 darajasini ifodalaydi?",
        options: [
          "Yes, I think books are boring and TikTok is faster.",
          "While physical codices may witness a marginal downturn, the consumption of long-form analytical prose remains indispensable.",
          "I read books every single day and my sister also reads novels.",
          "Nobody reads anymore because smartphones are very cheap now."
        ],
        correctAnswer: "While physical codices may witness a marginal downturn, the consumption of long-form analytical prose remains indispensable.",
        explanation: "Bu javobda C2 darajadagi leksika ('physical codices', 'marginal downturn', 'analytical prose', 'indispensable') va balanslashgan akademik fikr mavjud."
      }
    ]
  },
  {
    id: 'lesson_grammar_01',
    skill: 'grammar',
    title: 'C2 Grammar: Cleft Sentences & Nominalisation Mastery',
    level: 'C2 Mastery',
    description: "Ingliz tili oliy grammatikasi: 'What struck me most was...', 'It was precisely because...' va fe'llarni sifatli otlarga aylantirish (nominalisation).",
    durationMinutes: 28,
    youtubeId: 'wPqY3c4x1gM',
    youtubeTitle: 'Advanced English C2 Grammar: Cleft Sentences',
    summaryText: "Cleft sentences (bo'lingan gaplar) nutqda alohida ta'kid (emphasis) berish uchun xizmat qiladi. Nominalisation esa matnni rasmiy va ilmiy qilib ko'rsatuvchi eng kuchli vositadir (masalan, 'The government decided to expand the airport' o'rniga 'The decision regarding the expansion of the airport...').",
    slides: [
      {
        title: "1. Cleft Sentences Turlari",
        content: "It-clefts va Wh-clefts orqali gapning markaziy urg'usini o'zgartirish.",
        keyPoints: [
          "It-cleft: 'It was John who solved the riddle.' (John aynan topgan odam)",
          "Wh-cleft: 'What we urgently require is substantial institutional backing.'",
          "All-cleft: 'All that remains is for the board to ratify the agreement.'"
        ],
        diagramType: 'flowchart'
      },
      {
        title: "2. Nominalisation: Ilmiy Matn Cho'qqisi",
        content: "Fe'l va sifatlarni ot birikmalariga aylantirish orqali matnning leksik zichligini oshirish.",
        keyPoints: [
          "Oddiy: The population grew rapidly so resources depleted.",
          "C2 Nominalised: 'Rapid demographic expansion precipitated an acute depletion of natural resources.'",
          "IELTS Writing Task 1 va Task 2 da yuqori ball kafolati."
        ],
        diagramType: 'comparison'
      }
    ],
    practiceQuestions: [
      {
        id: 'gq1',
        type: 'multiple-choice',
        question: "'We need greater discipline in our daily routine.' gapini Wh-cleft tuzilishiga aylantiring:",
        options: [
          "Greater discipline is needed by us every day.",
          "What we need is greater discipline in our daily routine.",
          "It is greater discipline that need us.",
          "We really need more discipline every day."
        ],
        correctAnswer: "What we need is greater discipline in our daily routine.",
        explanation: "Wh-cleft 'What + egat + fe'l + is/was + ta'kidlanayotgan qism' formulasi bo'yicha yasaladi."
      }
    ]
  }
];

export const INITIAL_MOCK_EXAM: MockExamData = {
  id: 'mock_exam_official_01',
  title: 'Cambridge Official IELTS 9.0 & C2 Proficiency Full Examination',
  timeLimitMinutes: 45,
  listeningPassage: {
    title: "Section 1 & 2: Architectural Restoration Project",
    description: "Tinglang va quyidagi 5 ta savolga javob bering. Diqqat bilan tinglang, audioda distractorlar mavjud.",
    youtubeId: 'I4l9H1wI7nQ',
    audioTranscript: `Speaker: Welcome to the Oxford Heritage Society. Today we are discussing the grand restoration of St. Jude's Cathedral. Initial estimates suggested the project would culminate in December 2026; however, due to advanced laser scaffolding, the council confirmed completion is anticipated in October 2026. The primary funding was provided by an anonymous private benefactor who contributed 4.2 million pounds, surpassing the municipal grant of 1.8 million. Visitors are strictly prohibited from entering the subterranean crypt during renovations, while the northern transept remains accessible on weekends.`,
    questions: [
      {
        id: 'mock_l1',
        type: 'multiple-choice',
        question: "When is the cathedral restoration expected to be finalized?",
        options: ["December 2026", "October 2026", "Summer 2027", "Late 2025"],
        correctAnswer: "October 2026",
        explanation: "Initial estimate was December 2026, but the speaker clarifies: 'however, due to advanced laser scaffolding, the council confirmed completion is anticipated in October 2026'."
      },
      {
        id: 'mock_l2',
        type: 'multiple-choice',
        question: "How much did the anonymous private benefactor donate?",
        options: ["1.8 million pounds", "4.2 million pounds", "6.0 million pounds", "2.4 million pounds"],
        correctAnswer: "4.2 million pounds",
        explanation: "The benefactor contributed 4.2 million pounds, whereas the municipal grant was 1.8 million."
      },
      {
        id: 'mock_l3',
        type: 'true-false-not-given',
        question: "The subterranean crypt is open to tourists on weekends during the renovation.",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        correctAnswer: "FALSE",
        explanation: "The speaker states: 'Visitors are strictly prohibited from entering the subterranean crypt', while it is the northern transept that is open on weekends."
      }
    ]
  },
  readingPassage: {
    title: "The Neurobiology of Bilingual Cognition: A C2 Analysis",
    passageText: `For centuries, pedagogical orthodoxy posited that early bilingualism constituted a cognitive impediment, supposedly overburdening the infant linguistic apparatus. Contemporary neuroimaging studies have thoroughly discredited this hypothesis. Far from encumbering neural development, the continuous mental suppression of one language while speaking another engenders superior executive functioning, fortified attentional control, and cognitive reserve.

Recent longitudinal research conducted at the Max Planck Institute demonstrated that lifelong polyglots display significantly delayed onset of neurodegenerative symptoms—by an average of four to five years compared to their monolingual counterparts. Interestingly, this does not signify that their brain pathology is less pronounced; rather, their neural architecture exhibits compensatory connectivity.

Crucially, the degree of executive advantage correlates not merely with passive bilingual exposure, but with the communicative demand placed upon the speaker. Individuals immersed in dual-language environments requiring swift conversational code-switching exhibit markedly greater prefrontal cortex activation than passive listeners.`,
    questions: [
      {
        id: 'mock_r1',
        type: 'true-false-not-given',
        question: "Historical pedagogical views considered multilingual upbringing detrimental to childhood linguistic progress.",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        correctAnswer: "TRUE",
        explanation: "Matnda: 'For centuries, pedagogical orthodoxy posited that early bilingualism constituted a cognitive impediment' (ko'p asrlar davomida erta ikki tillilik aqliy to'siq deb hisoblangan) deyilgan, bu to'liq mos keladi (TRUE)."
      },
      {
        id: 'mock_r2',
        type: 'true-false-not-given',
        question: "Polyglots suffer less underlying physical brain pathology when afflicted by neurodegenerative diseases.",
        options: ["TRUE", "FALSE", "NOT GIVEN"],
        correctAnswer: "FALSE",
        explanation: "Matnda aniq aytilgan: 'this does not signify that their brain pathology is less pronounced; rather, their neural architecture exhibits compensatory connectivity' (bu patologiya kamroq ekanligini bildirmaydi)."
      },
      {
        id: 'mock_r3',
        type: 'multiple-choice',
        question: "According to the passage, what factor most intensely activates the prefrontal cortex in bilingual individuals?",
        options: [
          "Passive exposure to foreign television broadcasts",
          "Active demand for frequent and rapid code-switching",
          "Studying grammar textbooks in seclusion",
          "Learning a third language before age ten"
        ],
        correctAnswer: "Active demand for frequent and rapid code-switching",
        explanation: "Matnda: 'Individuals immersed in dual-language environments requiring swift conversational code-switching exhibit markedly greater prefrontal cortex activation'."
      }
    ]
  },
  writingTasks: {
    task1Prompt: "The chart below shows global energy consumption (in Terawatt-hours) by fuel source in 2010 and projected figures for 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant (At least 150 words).",
    task1ChartTitle: "Global Energy Consumption by Source (TWh): 2010 vs 2025 (Projected)",
    task1ChartData: [
      { label: "Renewables (Solar/Wind)", year2010: 1200, year2025: 4800 },
      { label: "Nuclear Power", year2010: 2700, year2025: 3100 },
      { label: "Natural Gas", year2010: 3800, year2025: 4200 },
      { label: "Coal & Heavy Oils", year2010: 5600, year2025: 3900 },
    ],
    task1SampleBand9: `The comparative bar chart delineates global energy generation categorized across four distinct sources between 2010 and projections for 2025, quantified in Terawatt-hours (TWh).

Overall, it is palpably evident that renewable energy is poised for exponential growth, quadrupling over the fifteen-year period, while coal and heavy oils demonstrate a decisive contraction. Consequently, renewables are anticipated to eclipse both nuclear and fossil fuels by 2025.

In 2010, coal and heavy hydrocarbons commanded the apex of consumption at 5,600 TWh, comfortably outstripping natural gas at 3,800 TWh. In stark contrast, green energy represented a modest fraction, generating a mere 1,200 TWh.

By 2025, however, a seismic paradigm shift is projected. Renewables are set to surge dramatically to 4,800 TWh, surpassing coal, which will decline markedly to 3,900 TWh. Concurrently, natural gas will experience moderate upward momentum, reaching 4,200 TWh, while nuclear output will exhibit steady incremental growth to settle at 3,100 TWh.`,
    task2Prompt: "Some educational theorists argue that with the rapid advancement of Artificial Intelligence, university lecturers will become obsolete. To what extent do you agree or disagree? (Write at least 250 words, using C2 vocabulary and complex sentence structures).",
    task2SampleBand9: `The precipitous proliferation of artificial intelligence has sparked contentious discourse regarding the tenability of traditional academic roles. While proponents contend that algorithmic systems can impart curricula with unprecedented bespoke efficacy, I vehemently refute the assertion that tertiary educators will face obsolescence. Rather, human pedagogues serve an immutable function in cultivating critical inquiry, ethical discernment, and intellectual resilience.

Undeniably, autonomous platforms excel at informational dissemination and diagnostic assessments. Were the acquisition of knowledge merely a transactional ingestion of data, digital tutors would suffice. However, higher education transcends rote memorisation. It is through dialectical engagement and intellectual friction with professors that scholars learn to question prevailing orthodoxies. An algorithm, irrespective of computational sophistication, remains fundamentally incapable of replicating the serendipitous epiphany catalyzed by a human mentor.

Furthermore, academics embody ethical and emotional compasses for emerging researchers. In scientific and sociological domains fraught with moral ambiguity—ranging from bioethics to socioeconomic parity—students require empathetic guidance rather than cold statistical probabilities.

In conclusion, far from rendering educators redundant, generative intelligence should be harnessed as an ancillary diagnostic tool. The quintessential human connection at the heart of academia remains entirely irreplaceable.`
  },
  speakingPrompts: {
    part1: [
      "Could you tell me your full name and what you currently do?",
      "How frequently do you consume long-form literature in English?",
      "Do you believe learning foreign languages alters an individual's worldview?"
    ],
    part2Topic: "Describe a complex intellectual challenge or academic project you successfully resolved.",
    part2Points: [
      "What the challenge entailed and why it arose",
      "What resources or strategies you deployed",
      "The obstacles you encountered along the way",
      "And explain how this experience contributed to your personal development."
    ],
    part3: [
      "To what extent should governments prioritize funding for humanities versus technological research?",
      "In an era dominated by hyper-specialisation, is the 'Renaissance polymath' ideal still attainable?",
      "How does the linguistic structure of a native tongue shape cognitive reasoning?"
    ],
    sampleBand9Notes: "Band 9 speaking requires natural discourse markers: 'To contextualise this...', 'It stands to reason that...', 'Notwithstanding the obvious merits of X...'. Maintain impeccable cadence and avoid abrupt pauses."
  }
};

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg_01',
    userId: 'user_admin_001',
    username: 'bilolbekpr',
    fullName: 'Bilolbek (Admin & Mentor)',
    role: 'admin',
    text: "Assalomu alaykum! Tayyorlaymiz-English platformasiga xush kelibsiz! Bu yerda maqsadimiz har bir talabani C2 Mastery va IELTS Band 9.0 darajasiga olib chiqish. Har kuni yangi darslar va amaliyotlar yuklanib boriladi.",
    timestamp: '2026-03-01T08:00:00Z',
  },
  {
    id: 'msg_02',
    userId: 'user_student_demo',
    username: 'shaxzod9',
    fullName: 'Shaxzod Karimov',
    role: 'student',
    text: "Salom barchaga! Listening darsidagi distractorlar bo'yicha video juda zo'r tushuntirilibdi. Nazariy imtihonda 8.5 ball oldim, C2 darajasiga chiqish uchun Writing Task 2 ni yana qayta mashq qilmoqdaman!",
    timestamp: '2026-03-01T08:45:00Z',
  },
  {
    id: 'msg_03',
    userId: 'user_admin_001',
    username: 'bilolbekpr',
    fullName: 'Bilolbek (Admin & Mentor)',
    role: 'admin',
    text: "Barakalla Shaxzod! Writingda Inversion va Cleft sentences dan 2-3 marta o'rinli foydalansangiz, 9.0 ball kafolatlanadi. Nazariy imtihonni tamomlab sertifikatni yuklab olishingiz mumkin!",
    timestamp: '2026-03-01T09:10:00Z',
  }
];

// Helper Functions
export const StorageService = {
  // Current User
  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // Users
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!data) {
        const initial = [INITIAL_ADMIN, INITIAL_STUDENT];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initial));
        return initial;
      }
      const users: User[] = JSON.parse(data);
      // Ensure admin exists
      if (!users.some(u => u.username === ADMIN_CREDENTIALS.username)) {
        users.push(INITIAL_ADMIN);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }
      return users;
    } catch {
      return [INITIAL_ADMIN, INITIAL_STUDENT];
    }
  },

  registerUser(user: { firstName: string; lastName: string; username: string; age: number; password?: string }): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanUsername = user.username.trim().toLowerCase();

    if (!cleanUsername) {
      return { success: false, error: "Username kiritilishi shart!" };
    }

    // Check uniqueness
    const exists = users.some(u => u.username.toLowerCase() === cleanUsername);
    if (exists) {
      return { success: false, error: "Ushbu username band! Iltimos boshqa username tanlang." };
    }

    const newUser: User = {
      id: 'usr_' + Date.now(),
      firstName: user.firstName.trim() || 'Foydalanuvchi',
      lastName: user.lastName.trim() || '',
      username: cleanUsername,
      age: Number(user.age) || 18,
      password: user.password || '',
      role: cleanUsername === ADMIN_CREDENTIALS.username ? 'admin' : 'student',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser);

    return { success: true, user: newUser };
  },

  loginUser(username: string, password?: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanUsername = username.trim().toLowerCase();

    // Check special admin login
    if (cleanUsername === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      let admin = users.find(u => u.username === ADMIN_CREDENTIALS.username);
      if (!admin) {
        admin = INITIAL_ADMIN;
        users.push(admin);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }
      this.setCurrentUser(admin);
      return { success: true, user: admin };
    }

    const found = users.find(u => u.username.toLowerCase() === cleanUsername);
    if (!found) {
      return { success: false, error: "Bunday foydalanuvchi topilmadi. Iltimos ro'yxatdan o'ting." };
    }

    if (found.password && found.password !== password) {
      return { success: false, error: "Parol noto'g'ri kiritildi!" };
    }

    this.setCurrentUser(found);
    return { success: true, user: found };
  },

  // Lessons
  getLessons(): Lesson[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LESSONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(INITIAL_LESSONS));
        return INITIAL_LESSONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_LESSONS;
    }
  },

  saveLesson(lesson: Lesson): void {
    const lessons = this.getLessons();
    const idx = lessons.findIndex(l => l.id === lesson.id);
    if (idx >= 0) {
      lessons[idx] = lesson;
    } else {
      lessons.unshift(lesson);
    }
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
  },

  deleteLesson(lessonId: string): void {
    const lessons = this.getLessons().filter(l => l.id !== lessonId);
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
  },

  resetLessons(): void {
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(INITIAL_LESSONS));
  },

  // Mock Exam
  getMockExam(): MockExamData {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOCK_EXAM);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.MOCK_EXAM, JSON.stringify(INITIAL_MOCK_EXAM));
        return INITIAL_MOCK_EXAM;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MOCK_EXAM;
    }
  },

  saveMockExam(exam: MockExamData): void {
    localStorage.setItem(STORAGE_KEYS.MOCK_EXAM, JSON.stringify(exam));
  },

  // Chat
  getChatMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(INITIAL_CHAT));
        return INITIAL_CHAT;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CHAT;
    }
  },

  sendChatMessage(message: { userId: string; username: string; fullName: string; role: 'admin' | 'student'; text: string }): ChatMessage {
    const messages = this.getChatMessages();
    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      userId: message.userId,
      username: message.username,
      fullName: message.fullName,
      role: message.role,
      text: message.text.trim(),
      timestamp: new Date().toISOString(),
    };
    messages.push(newMsg);
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(messages));
    return newMsg;
  },

  deleteChatMessage(messageId: string): void {
    const messages = this.getChatMessages().filter(m => m.id !== messageId);
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(messages));
  },

  clearAllChat(): void {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify([]));
  },

  deleteUser(userId: string): void {
    const users = this.getUsers().filter(u => u.id !== userId);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  // Site Settings (Hero headline, badge, subtitle, etc.)
  getSiteSettings(): SiteSettings {
    const defaults: SiteSettings = {
      siteName: "Tayyorlaymiz-English",
      heroBadge: "O'zbekistondagi Eng Yuqori Natijali Dastur",
      heroTitle: "English C2 & IELTS Band 9.0 Darajasiga Tayyorlaymiz",
      heroDescription: "Noldan boshlab yoki C1 dan C2 darajaga ko'tariling. Har bir mavzuga doir interaktiv video darslar, tushuntirish diagrammalari, Cambridge formati bo'yicha to'liq nazariy imtihon va rasmiy sertifikat.",
      heroImageUrl: "/src/assets/images/hero_tayyorlaymiz_ielts_1794322273039.jpg",
    };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...defaults, ...JSON.parse(data) } : defaults;
    } catch {
      return defaults;
    }
  },

  saveSiteSettings(settings: SiteSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Exam Submissions & Results
  getExamResults(): ExamResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESULTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveExamResult(result: ExamResult): void {
    const list = this.getExamResults();
    list.unshift(result);
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(list));
  },

  // Certificates
  getCertificates(): CertificateData[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCertificate(cert: CertificateData): void {
    const certs = this.getCertificates();
    const idx = certs.findIndex(c => c.id === cert.id);
    if (idx >= 0) {
      certs[idx] = cert;
    } else {
      certs.unshift(cert);
    }
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certs));
  },

  getCertificateById(id: string): CertificateData | null {
    const certs = this.getCertificates();
    return certs.find(c => c.id === id || c.serialNumber === id) || null;
  }
};
