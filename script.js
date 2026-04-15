// ----------------- Step Toggle -----------------
function toggleStep(step) {
  const content = document.getElementById(`step${step}`);
  if (content) {
    content.style.display =
      content.style.display === "block" ? "none" : "block";
  }
}

// ----------------- Global State -----------------
let currentCrop = null;
let harvestComplete = false;
let growthWeek = 0;
let currentLanguage = 'te'; // Default language is Telugu

// ----------------- Chart Instances -----------------
let soilChartInstance,
  cropChartInstance,
  growthChartInstance,
  marketChartInstance;
let growthInterval = null;

// --- Translation Data ---
const translations = {
  te: {
    appTitle: "కేత్సాతి",
    tagline: "మట్టి నుండి మార్కెట్కు దశల వారీ మార్గదర్శకత్వం",
    home: "హోం",
    features: "ఫీచర్లు",
    contact: "సంప్రదించండి",
    aiAssistantTitle: "ఏఐ స్మార్ట్ ఫార్మింగ్ అసిస్టెంట్",
    welcome: "🌾కేత్సాతికి స్వాగతం",
    welcomeText: "మీ AI-ఆధారిత దశల వారీ వ్యవసాయ మార్గదర్శి-మట్టి తయారీ నుండి మార్కెట్ అమ్మకం వరకు.",
    getStarted: "🚀ప్రారంభించండి",
    aboutUsTitle: "కేత్సాతి గురించి",
    aboutUsText: "కేత్సాతి అనేది AI-ఆధారిత అంతర్దృష్టులతో రైతులకు సాధికారత కల్పించడానికి రూపొందించబడింది. మట్టి ఆరోగ్యాన్ని పర్యవేక్షించడం మరియు సరైన పంటలను ఎంచుకోవడం నుండి మార్కెట్లలో పంటకోత మరియు అమ్మకం వరకు, వ్యవసాయం యొక్క ప్రతి దశలో నిజ-సమయ హెచ్చరికలు మరియు సిఫార్సులతో మేము మీకు మార్గనిర్దేశం చేస్తాము.",
    feature1Title: "🤖ఏఐ అసిస్టెంట్",
    feature1Text: "పంటలు, తెగుళ్ళు లేదా మట్టి గురించి ఏదైనా అడగండి-మీ పొలానికి అనుగుణంగా తక్షణ తెలివైన సమాధానాలను పొందండి.",
    feature2Title: "📡స్మార్ట్ మానిటరింగ్",
    feature2Text: "రియల్ టైమ్ డేటా మరియు హెచ్చరికలతో మట్టి, వాతావరణం మరియు పంట పెరుగుదలను ట్రాక్ చేయండి.",
    feature3Title: "📊 మార్కెట్ అవగాహన",
    feature3Text: "మండి ధరలు, డిమాండ్ పోకడలు మరియు ప్రభుత్వ పథకాలతో మార్కెట్ అంతర్దృష్టి నవీకరించబడింది.",
    step1Title: "దశ 1: మట్టి పర్యవేక్షణ",
    step1Text1: "✅ శాటిలైట్ మరియు సెన్సార్లను ఉపయోగించి మట్టి సంతానోత్పత్తి, తేమ మరియు పిహెచ్ స్థాయిని తనిఖీ చేయండి.",
    step1Text2: "⚠️ ముందుజాగ్రత్తలుః అతిగా నీరు పెట్టడం మానుకోండి, నాటడానికి ముందు మట్టిని పరీక్షించండి.",
    step1ChartLabel: ["తేమ", "నత్రజని", "pH"],
    step1ChartDatasetLabel: "నేల ఆరోగ్యం",
    step2Title: "దశ 2: పంట ఎంపిక",
    step2Text1: "🌱 మట్టి మరియు సీజన్ ఆధారంగా, AI తగిన పంటలను సూచిస్తుంది.",
    step2Text2: "✅ ఉదాహరణకుః శీతాకాలంలో గోధుమలు, వర్షాకాలంలో వరి.",
    step2ChartLabel: ["గోధుమ", "బియ్యం", "మొక్కజొన్న"],
    step3Title: "దశ 3: నాటడం మార్గదర్శకం",
    step3Text1: "🪴విత్తనాల అంతరం, నీటి కేటాయింపు షెడ్యూల్, ఎరువుల కోసం దశల వారీ మార్గదర్శిని.",
    step3Text2: "⚠️ ముందు జాగ్రత్తలు:",
    step3List1: "ముందు జాగ్రత్తలు: ధృవీకరించబడిన విత్తనాలను మాత్రమే ఉపయోగించండి.",
    step3List2: "ప్రారంభ దశల్లో అధిక ఫలదీకరణం మానుకోండి.",
    step3List3: "చాలా లోతుగా నాటవద్దు; సిఫార్సు చేయబడిన లోతును నిర్వహించండి.",
    step4Title: "దశ 4: వృద్ధి పర్యవేక్షణ మరియు సమస్య హెచ్చరికలు",
    step4Text1: "📡 AI పంట పెరుగుదల, తెగుళ్ళు మరియు వ్యాధులను గుర్తిస్తుంది.",
    step4Text2: "✅హెచ్చరికలుః పోషక లోపం, తెగుళ్ళ దాడులు, వాతావరణ సమస్యలు.",
    step4ChartLabel: ["వారం 1", "వారం 2", "వారం 3", "వారం 4"],
    step4ChartDatasetLabel: "పంట వృద్ధి శాతం",
    step5Title: "దశ 5: పంటకోత",
    step5Text1: "🌾వాతావరణం మరియు పరిపక్వత ఆధారంగా కోతకు ఉత్తమ సమయాన్ని AI సూచిస్తుంది.",
    step5Text2: "⚠️జాగ్రత్తః వర్షాకాలంలో పంట కోతకు దూరంగా ఉండండి.",
    step6Title: "దశ 6: అమ్మకం మరియు అమ్మకం",
    step6Text1: "📊ప్రస్తుత మార్కెట్ ధరలు, ప్రభుత్వ పథకాలు మరియు డిమాండ్ పోకడలను చూడండి.",
    step6Text2: "✅ రైతులకు ఉత్తమ సమయంలో విక్రయించడానికి సహాయపడుతుంది.",
    step6ChartLabel: ["గోధుమ", "అన్నం", "మొక్కజొన్న", "పప్పుధాన్యాలు"],
    step6ChartDatasetLabel: "మార్కెట్ ధర (₹/kg)",
    chatbotHeader: "ఏఐ స్మార్ట్ అసిస్టెంట్",
    textInputPlaceholder: "మీ ప్రశ్నను టైప్ చేయండి...",
    botReply_whatCrop: (crop, week) => `🌾 ప్రస్తుతం పెరుగుతున్న పంట **${crop}**. ఇది **Week ${week}** లో పెరుగుతోంది.`,
    botReply_noCrop: "🌱 ప్రస్తుతానికి ఏ పంటను పండించడం లేదు. మీరు ప్రారంభించడానికి ఒకదాన్ని ఆర్డర్ చేయవచ్చు!",
    botReply_alreadyGrowing: (crop) => `⚠️ **${crop}** ఇప్పటికే పెరుగుతోంది. మళ్ళీ నాటాల్సిన అవసరం లేదు!`,
    botReply_sowComplete: (crop) => `👩‍🌾 సరే! మేము ఇప్పుడు నాటుతున్నాము **${crop}**. ప్రక్రియ ప్రారంభమైంది.`,
    botReply_greetings: ["నమస్కారం! ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?", "హాయ్! మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?", "వ్యవసాయం గురించి అడగండి", "పంటలు మరియు మట్టి గురించి మాట్లాడటానికి సిద్ధంగా ఉన్నారా?"],
    botReply_thanks: ["మీకు స్వాగతం! సాయం చేయడం ఆనందంగా ఉంది", "సమస్య లేదు, నేను సహాయం చేయగలిగినందుకు సంతోషంగా ఉంది!"],
    botReply_soil: ["🌱 నేల యొక్క pH విలువ 6-7 ఉంటే అది ఆరోగ్యంగా ఉంటుంది. అవసరమైతే కంపోస్ట్ ఉపయోగించండి.", "🪴మెరుగైన ఫలితాల కోసం ప్రతి సీజన్లో మట్టిని పరీక్షించండి.", "🌍 ఇసుక మట్టి త్వరగా పారుతుంది, బంకమట్టి మట్టి ఎక్కువ కాలం నీటిని కలిగి ఉంటుంది."],
    botReply_crop: ["🌾 ఉత్తమ పంటలుః శీతాకాలంలో గోధుమలు, వర్షాకాలంలో వరి.", "🌱మధ్యస్త వాతావరణంలో మొక్కజొన్న బాగా పెరుగుతుంది.", "🥔 బంగాళాదుంపలు చల్లని వాతావరణ వ్యవసాయానికి అనువైనవి."],
    botReply_pest: ["🐛 వేప పిచికారీ లేదా సేంద్రీయ తెగులు నియంత్రణ పద్ధతులను ఉపయోగించండి.", "🪳  తెగుళ్ళ పెంపకాన్ని నివారించడానికి పొలాన్ని శుభ్రంగా ఉంచండి."],
    botReply_whoAreYou: ["నేను వ్యవసాయం కోసం మీ AI సహాయకుడిని, పంట మరియు మట్టి ప్రశ్నలలో మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాను."],
    botReply_water: ["💧 క్రమం తప్పకుండా నీటిపారుదల నిర్వహించండి.", "🚿 బిందు సేద్యం నీటిని ఆదా చేస్తుంది మరియు దిగుబడిని పెంచుతుంది.", "🌊 పంటలకు అతిగా నీరు పోయడం మూలాలకు హాని కలిగిస్తుంది-మొదట తేమను తనిఖీ చేయండి."],
    botReply_harvest: ["🚜 పంటకోతకు 80% ధాన్యం పండినప్పుడు మరియు బంగారు రంగులో ఉన్నప్పుడు కోయండి.", "🌾 తేమ నష్టాన్ని నివారించడానికి తెల్లవారుజామున పంట కోయండి.", "🛒 కోసిన పంటలను పొడి, వెంటిలేషన్ ఉన్న ప్రదేశాలలో నిల్వ చేయండి."],
    botReply_weather: ["☀️ ఈ రోజు వాతావరణం బాగుంది. భారీ వర్షం పడితే నాటడం మానుకోండి.", "🌦️ మేఘావృత వాతావరణం మొక్కలను మార్పిడి చేయడానికి మంచిది.", "🌩️ తుఫానులు అంచనా-పొలంలో వదులుగా ఉన్న వస్తువులను భద్రపరచండి."],
    botReply_fertilizer: ["🧪 పెరుగుదల దశలో నత్రజని అధికంగా ఉండే ఎరువులను, మరియు పుష్పించే సమయంలో పొటాష్ ఉపయోగించండి.", "🌱 సేంద్రీయ ఎరువు సహజంగా నేల సారవంతం చేస్తుంది.", "💡 అధిక ఎరువులను నివారించండి-ఇది నేల ఆరోగ్యాన్ని తగ్గిస్తుంది."],
    botReply_price_wheat: ["గోధుమ ప్రస్తుత ధర కిలోగ్రాముకు ₹35 చుట్టూ ఉంది."],
    botReply_price_rice: ["బియ్యం సగటు ధర ప్రస్తుతం కిలోగ్రాముకు ₹36 ఉంది."],
    botReply_price_maize: ["మొక్కజొన్న ప్రస్తుత ధర సుమారుగా కిలోగ్రాముకు ₹20 ఉంది."],
    botReply_seed: ["🌾 మెరుగైన దిగుబడి కోసం ధృవీకరించబడిన విత్తనాలను ఉపయోగించండి.", "🌱 హైబ్రిడ్ విత్తనాలు వేగంగా పెరుగుతాయి, కానీ శ్రద్ధ అవసరం.", "🧑‍🌾 వ్యాధి నివారణకు నాటడానికి ముందు విత్తనాలను శుద్ధి చేయండి."],
    botReply_market: ["💰 పంటలు అమ్మే ముందు రోజువారీ మార్కెట్ ధరలను తనిఖీ చేయండి.", "📦 వినియోగదారులకు నేరుగా అమ్మడం లాభాన్ని పెంచుతుంది."],
    botReply_storage: ["🏠 ధాన్యాన్ని గాలి చొరబడని కంటైనర్లలో నిల్వ చేయండి.", "🛢️ పండ్లు మరియు కూరగాయలకు కోల్డ్ స్టోరేజ్ సహాయపడుతుంది.", "📦 తెగుళ్ళ దాడులను నివారించడానికి గిడ్డంగులను ఉపయోగించండి."],
    botReply_loan: ["💳 **కిసాన్ క్రెడిట్ కార్డ్ (KCC)** కోసం దరఖాస్తు చేయండి – తక్కువ వడ్డీతో రైతులకు సులభమైన రుణాలు.", "🏦 భద్రత కోసం **జాతీయీకరించిన బ్యాంకులు, సహకార బ్యాంకులు లేదా నాబార్డ్ పథకాల** నుండి రుణాలు తీసుకోండి."],
    botReply_scheme: ["🏛️ PM-Kisan రైతులకు ఆదాయ మద్దతును అందిస్తుంది.", "💸 కిసాన్ క్రెడిట్ కార్డ్ (KCC) తక్కువ వడ్డీ వ్యవసాయ రుణాలను అందిస్తుంది."],
    botReply_default: ["🤖 క్షమించండి, నేను సహాయం చేయలేను.", "🧑‍🌾 నేను ఇంకా నేర్చుకుంటున్నాను! మట్టి, పంటలు లేదా నీటిపారుదల గురించి అడగడానికి ప్రయత్నించండి."],
    task_landPrepareStatus1: "పొలం దున్నడం... దయచేసి వేచి ఉండండి.",
    task_landPrepareStatus2: "✅ పొలం నాటడానికి సిద్ధంగా ఉంది! ఇది సరిగ్గా దున్ని, చదును చేయబడింది.",
    task_pestControlNoCrop: "⚠️ దయచేసి మొదట పెరగడానికి ఒక పంటను ఎంచుకోండి.",
    task_pestControlDetected: (crop) => `⚠️ ${crop}పై తెగుళ్లు కనుగొనబడ్డాయి! సేంద్రీయ తెగులు నియంత్రణను వర్తింపజేస్తున్నాము.`,
    task_pestControlHealthy: (crop) => `✅ ${crop} పంటలు ఆరోగ్యంగా ఉన్నాయి! తెగుళ్లు లేదా వ్యాధులు కనుగొనబడలేదు.`,
    task_harvestNoCrop: "⚠️ పండించడానికి ఏ పంట లేదు.",
    task_harvestComplete: (crop) => `**${crop}** మొత్తం ఇప్పటికే కోయబడింది.`,
    task_harvesting: (crop) => `🚜 **${crop}** పంటకోత కొనసాగుతోంది...`,
    task_harvestingDone: (crop) => `🎉 **${crop}** పంటకోత పూర్తయింది! పంటలు నిల్వ చేయడానికి సిద్ధంగా ఉన్నాయి.`,
    task_growthWeek1: (crop) => `**Week 1:** ${crop} విత్తనాలు నాటుతున్నాము. 🌱`,
    task_growthMonitoring: (week, crop, growth) => `**Week ${week}:** ${crop} **${growth}%** వృద్ధిలో ఉంది. 📈`,
    task_growthFinal: (crop) => `**Final Stage:** ${crop} పూర్తిగా పెరిగింది మరియు పంటకోతకు సిద్ధంగా ఉంది! 🎉`,
    task_micFailed: "⚠️ మైక్ యాక్సెస్ విఫలమైంది. దయచేసి మైక్రోఫోన్ను అనుమతించండి.",
  },
  hi: {
    appTitle: "खेतसाती",
    tagline: "मिट्टी से बाजार तक चरण-दर-चरण मार्गदर्शन",
    home: "होम",
    features: "विशेषताएं",
    contact: "संपर्क",
    aiAssistantTitle: "एआई स्मार्ट फार्मिंग असिस्टेंट",
    welcome: "🌾 खेतसाती में आपका स्वागत है",
    welcomeText: "आपका एआई-संचालित चरण-दर-चरण कृषि मार्गदर्शक - मिट्टी की तैयारी से लेकर बाजार में बिक्री तक।",
    getStarted: "🚀शुरू करें",
    aboutUsTitle: "खेतसाती के बारे में",
    aboutUsText: "खेतसाती को एआई-संचालित अंतर्दृष्टि के साथ किसानों को सशक्त बनाने के लिए डिज़ाइन किया गया है। मिट्टी के स्वास्थ्य की निगरानी और सही फसलों का चयन करने से लेकर बाजारों में कटाई और बिक्री तक, हम आपको कृषि के हर चरण में वास्तविक समय अलर्ट और सिफारिशों के साथ मार्गदर्शन करते हैं।",
    feature1Title: "🤖एआई असिस्टेंट",
    feature1Text: "फसलों, कीटों, या मिट्टी के बारे में कुछ भी पूछें - अपने खेत के अनुसार त्वरित स्मार्ट उत्तर प्राप्त करें।",
    feature2Title: "📡स्मार्ट मॉनिटरिंग",
    feature2Text: "वास्तविक समय डेटा और अलर्ट के साथ मिट्टी, मौसम और फसल की वृद्धि को ट्रैक करें।",
    feature3Title: "📊 बाजार जागरूकता",
    feature3Text: "मंडी की कीमतों, मांग के रुझान और सरकारी योजनाओं के साथ बाजार की जानकारी अपडेट की गई।",
    step1Title: "चरण 1: मिट्टी की निगरानी",
    step1Text1: "✅ उपग्रह और सेंसर का उपयोग करके मिट्टी की उर्वरता, नमी और पीएच स्तर की जांच करें।",
    step1Text2: "⚠️ सावधानियां: अत्यधिक पानी देने से बचें, बुवाई से पहले मिट्टी का परीक्षण करें।",
    step1ChartLabel: ["नमी", "नाइट्रोजन", "pH"],
    step1ChartDatasetLabel: "मिट्टी का स्वास्थ्य",
    step2Title: "चरण 2: फसल का चयन",
    step2Text1: "🌱 मिट्टी और मौसम के आधार पर, एआई उपयुक्त फसलों की सिफारिश करता है।",
    step2Text2: "✅ उदाहरण: सर्दियों में गेहूं, मानसून में चावल।",
    step2ChartLabel: ["गेहूं", "चावल", "मक्का"],
    step3Title: "चरण 3: रोपण मार्गदर्शन",
    step3Text1: "🪴बीज की दूरी, पानी देने का कार्यक्रम, और उर्वरक के लिए चरण-दर-चरण मार्गदर्शक।",
    step3Text2: "⚠️ सावधानियां:",
    step3List1: "सावधानियां: केवल प्रमाणित बीजों का उपयोग करें।",
    step3List2: "प्रारंभिक चरणों में अत्यधिक उर्वरक से बचें।",
    step3List3: "बहुत गहराई में न बोएं; अनुशंसित गहराई बनाए रखें।",
    step4Title: "चरण 4: विकास की निगरानी और समस्या अलर्ट",
    step4Text1: "📡 एआई फसल की वृद्धि, कीटों और बीमारियों का पता लगाता है।",
    step4Text2: "✅ अलर्ट: पोषक तत्वों की कमी, कीट हमले, मौसम की समस्याएँ।",
    step4ChartLabel: ["सप्ताह 1", "सप्ताह 2", "सप्ताह 3", "सप्ताह 4"],
    step4ChartDatasetLabel: "फसल विकास %",
    step5Title: "चरण 5: कटाई",
    step5Text1: "🌾मौसम और परिपक्वता के आधार पर, एआई कटाई के लिए सबसे अच्छा समय सुझाता है।",
    step5Text2: "⚠️सावधानी: बारिश के मौसम में कटाई से बचें।",
    step6Title: "चरण 6: बिक्री और विपणन",
    step6Text1: "📊वर्तमान बाजार मूल्य, सरकारी योजनाओं और मांग के रुझान देखें।",
    step6Text2: "✅ किसानों को सबसे अच्छे समय पर बेचने में मदद करता है।",
    step6ChartLabel: ["गेहूं", "चावल", "मक्का", "दालें"],
    step6ChartDatasetLabel: "बाजार मूल्य (₹/kg)",
    chatbotHeader: "एआई स्मार्ट असिस्टेंट",
    textInputPlaceholder: "अपना प्रश्न टाइप करें...",
    botReply_whatCrop: (crop, week) => `🌾 वर्तमान में उग रही फसल **${crop}** है। यह **सप्ताह ${week}** में बढ़ रही है।`,
    botReply_noCrop: "🌱 अभी कोई फसल नहीं उगाई जा रही है। आप शुरू करने के लिए एक का ऑर्डर कर सकते हैं!",
    botReply_alreadyGrowing: (crop) => `⚠️ **${crop}** पहले से ही उग रही है। फिर से बोने की आवश्यकता नहीं है!`,
    botReply_sowComplete: (crop) => `👩‍🌾 ठीक है! अब हम बो रहे हैं **${crop}**। प्रक्रिया शुरू हो गई है।`,
    botReply_greetings: ["नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूँ?", "हाय! आप क्या जानना चाहते हैं?", "कृषि के बारे में पूछें", "फसलों और मिट्टी के बारे में बात करने के लिए तैयार हैं?"],
    botReply_thanks: ["आपका स्वागत है! मदद करके खुशी हुई", "कोई बात नहीं, मुझे मदद करने में खुशी है!"],
    botReply_soil: ["🌱 मिट्टी का पीएच मान 6-7 होने पर स्वस्थ होता है। यदि आवश्यक हो तो खाद का उपयोग करें।", "🪴बेहतर परिणामों के लिए हर मौसम में मिट्टी का परीक्षण करें।", "🌍 रेतीली मिट्टी जल्दी निकल जाती है, मिट्टी अधिक समय तक पानी रखती है।"],
    botReply_crop: ["🌾 सबसे अच्छी फसलें: सर्दियों में गेहूं, मानसून में चावल।", "🌱मक्का मध्यम मौसम में अच्छी तरह से बढ़ता है।", "🥔 आलू ठंडी जलवायु वाली खेती के लिए आदर्श हैं।"],
    botReply_pest: ["🐛 नीम का स्प्रे या जैविक कीट नियंत्रण विधियों का उपयोग करें।", "🪳  कीटों के प्रजनन को रोकने के लिए खेत को साफ रखें।"],
    botReply_whoAreYou: ["मैं कृषि के लिए आपका एआई सहायक हूँ, फसलों और मिट्टी के प्रश्नों में आपकी मदद करने के लिए यहाँ हूँ।"],
    botReply_water: ["💧 नियमित रूप से सिंचाई करें।", "🚿 ड्रिप सिंचाई पानी बचाती है और उपज बढ़ाती है।", "🌊 फसलों को अत्यधिक पानी देने से जड़ों को नुकसान हो सकता है-पहले नमी की जांच करें।"],
    botReply_harvest: ["🚜 80% अनाज परिपक्व और सुनहरा होने पर फसलों की कटाई करें।", "🌾 नमी के नुकसान से बचने के लिए सुबह-सुबह कटाई करें।", "🛒 कटी हुई फसलों को सूखे, हवादार स्थानों में स्टोर करें।"],
    botReply_weather: ["☀️ आज मौसम अच्छा लग रहा है। यदि भारी बारिश की उम्मीद है तो बुवाई से बचें।", "🌦️ बादल वाला मौसम रोपाई के लिए अच्छा है।", "🌩️ तूफान की भविष्यवाणी-खेत में ढीली चीजों को सुरक्षित करें।"],
    botReply_fertilizer: ["🧪 विकास के चरण के दौरान नाइट्रोजन युक्त उर्वरक का उपयोग करें, और फूल आने पर पोटाश का।", "🌱 जैविक खाद स्वाभाविक रूप से मिट्टी की उर्वरता में सुधार करती है।", "💡 अत्यधिक उर्वरक से बचें-यह मिट्टी के स्वास्थ्य को कम कर सकता है।"],
    botReply_price_wheat: ["गेहूं की वर्तमान कीमत ₹35 प्रति किलोग्राम के आसपास है।"],
    botReply_price_rice: ["चावल की औसत कीमत वर्तमान में लगभग ₹36 प्रति किलोग्राम है।"],
    botReply_price_maize: ["मक्का की वर्तमान कीमत लगभग ₹20 प्रति किलोग्राम है।"],
    botReply_seed: ["🌾 बेहतर उपज के लिए प्रमाणित बीजों का उपयोग करें।", "🌱 हाइब्रिड बीज तेजी से बढ़ते हैं लेकिन देखभाल की आवश्यकता होती है।", "🧑‍🌾 बीमारी को रोकने के लिए बोने से पहले बीजों का उपचार करें।"],
    botReply_market: ["💰 फसलें बेचने से पहले दैनिक बाजार कीमतों की जांच करें।", "📦 उपभोक्ताओं को सीधे बेचना लाभ बढ़ाता है।"],
    botReply_storage: ["🏠 अनाज को एयरटाइट कंटेनरों में स्टोर करें।", "🛢️ फलों और सब्जियों के लिए कोल्ड स्टोरेज मदद करता है।", "📦 कीटों के हमलों को रोकने के लिए गोदामों का उपयोग करें।"],
    botReply_loan: ["💳 **किसान क्रेडिट कार्ड (KCC)** के लिए आवेदन करें – किसानों के लिए कम ब्याज के साथ आसान ऋण।", "🏦 सुरक्षा के लिए **राष्ट्रीयकृत बैंकों, सहकारी बैंकों या नाबार्ड योजनाओं** से ऋण लें।"],
    botReply_scheme: ["🏛️ पीएम-किसान किसानों के लिए आय सहायता प्रदान करता है।", "💸 किसान क्रेडिट कार्ड (KCC) कम ब्याज वाले कृषि ऋण प्रदान करता है।"],
    botReply_default: ["🤖 क्षमा करें, मैं इसमें मदद नहीं कर सकता।", "🧑‍🌾 मैं अभी भी सीख रहा हूँ! मिट्टी, फसलों, या सिंचाई के बारे में पूछने का प्रयास करें।"],
    task_landPrepareStatus1: "खेत की जुताई हो रही है... कृपया प्रतीक्षा करें।",
    task_landPrepareStatus2: "✅ खेत बोने के लिए तैयार है! इसे ठीक से जोता और समतल किया गया है।",
    task_pestControlNoCrop: "⚠️ कृपया पहले उगाने के लिए एक फसल चुनें।",
    task_pestControlDetected: (crop) => `⚠️ ${crop} पर कीटों का पता चला! जैविक कीट नियंत्रण लागू कर रहे हैं।`,
    task_pestControlHealthy: (crop) => `✅ ${crop} की फसलें स्वस्थ हैं! कोई कीट या बीमारी नहीं पाई गई।`,
    task_harvestNoCrop: "⚠️ कटाई के लिए कोई फसल नहीं है।",
    task_harvestComplete: (crop) => `सभी **${crop}** की कटाई पहले ही हो चुकी है।`,
    task_harvesting: (crop) => `🚜 **${crop}** की कटाई प्रगति पर है...`,
    task_harvestingDone: (crop) => `🎉 **${crop}** की कटाई पूरी हो गई है! फसलें भंडारण के लिए तैयार हैं।`,
    task_growthWeek1: (crop) => `**सप्ताह 1:** ${crop} के बीज बो रहे हैं। 🌱`,
    task_growthMonitoring: (week, crop, growth) => `**सप्ताह ${week}:** ${crop} **${growth}%** विकास पर है। 📈`,
    task_growthFinal: (crop) => `**अंतिम चरण:** ${crop} पूरी तरह से उगा हुआ है और कटाई के लिए तैयार है! 🎉`,
    task_micFailed: "⚠️ माइक तक पहुंच विफल। कृपया माइक्रोफोन की अनुमति दें।",
  },
  en: {
    appTitle: "Ketsaathi",
    tagline: "Step-by-step guidance from soil to market",
    home: "Home",
    features: "Features",
    contact: "Contact",
    aiAssistantTitle: "AI Smart Farming Assistant",
    welcome: "🌾 Welcome to ketsaathi",
    welcomeText: "Your AI-powered, step-by-step farming guide—from soil preparation to market selling.",
    getStarted: "🚀Get Started",
    aboutUsTitle: "About ketsaathi",
    aboutUsText: "ketsaathi is designed to empower farmers with AI-driven insights. From monitoring soil health and choosing the right crops to harvesting and selling in markets, we guide you through every step of farming with real-time alerts and recommendations.",
    feature1Title: "🤖AI Assistant",
    feature1Text: "Ask anything about crops, pests, or soil—get instant, intelligent answers tailored to your farm.",
    feature2Title: "📡Smart Monitoring",
    feature2Text: "Track soil, weather, and crop growth with real-time data and alerts.",
    feature3Title: "📊 Market Awareness",
    feature3Text: "Updated market insights with mandi prices, demand trends, and government schemes.",
    step1Title: "Step 1: Soil Monitoring",
    step1Text1: "✅ Check soil fertility, moisture, and pH level using satellite and sensors.",
    step1Text2: "⚠️ Precautions: Avoid over-watering, test soil before planting.",
    step1ChartLabel: ["Moisture", "Nitrogen", "pH"],
    step1ChartDatasetLabel: "Soil Health",
    step2Title: "Step 2: Crop Selection",
    step2Text1: "🌱 Based on soil and season, AI recommends suitable crops.",
    step2Text2: "✅ Example: Wheat in winter, rice in monsoon.",
    step2ChartLabel: ["Wheat", "Rice", "Maize"],
    step3Title: "Step 3: Planting Guidance",
    step3Text1: "🪴Step-by-step guide for seed spacing, watering schedule, and fertilizer.",
    step3Text2: "⚠️ Precautions:",
    step3List1: "Use only certified seeds.",
    step3List2: "Avoid over-fertilization in initial stages.",
    step3List3: "Do not plant too deep; maintain recommended depth.",
    step4Title: "Step 4: Growth Monitoring & Problem Alerts",
    step4Text1: "📡 AI detects crop growth, pests, and diseases.",
    step4Text2: "✅ Alerts: Nutrient deficiency, pest attacks, weather issues.",
    step4ChartLabel: ["Week 1", "Week 2", "Week 3", "Week 4"],
    step4ChartDatasetLabel: "Crop Growth %",
    step5Title: "Step 5: Harvesting",
    step5Text1: "🌾Based on weather and maturity, AI suggests the best time for harvest.",
    step5Text2: "⚠️Caution: Avoid harvesting during rainy seasons.",
    step6Title: "Step 6: Market & Selling",
    step6Text1: "📊See current market prices, government schemes, and demand trends.",
    step6Text2: "✅ Helps farmers sell at the best time.",
    step6ChartLabel: ["Wheat", "Rice", "Maize", "Pulses"],
    step6ChartDatasetLabel: "Market Price (₹/kg)",
    chatbotHeader: "AI Smart Assistant",
    textInputPlaceholder: "Type your question...",
    botReply_whatCrop: (crop, week) => `🌾 The current crop is **${crop}**. It's growing in **Week ${week}**.`,
    botReply_noCrop: "🌱 There is currently no crop being grown. You can order one to start!",
    botReply_alreadyGrowing: (crop) => `⚠️ **${crop}** is already growing. No need to plant again!`,
    botReply_sowComplete: (crop) => `👩‍🌾 Okay! We are now sowing **${crop}**. The process has started.`,
    botReply_greetings: ["Hello! How can I help you today?", "Hi! What would you like to know?", "Ask about farming", "Ready to talk about crops and soil?"],
    botReply_thanks: ["You're welcome! Happy to help.", "No problem, glad I could assist!"],
    botReply_soil: ["🌱 Soil is healthy when its pH value is 6-7. Use compost if needed.", "🪴Test the soil every season for better results.", "🌍 Sandy soil drains quickly, clay soil holds water longer."],
    botReply_crop: ["🌾 Best crops: Wheat in winter, rice in monsoon.", "🌱Maize grows well in moderate weather.", "🥔 Potatoes are ideal for cool climate farming."],
    botReply_pest: ["🐛 Use neem spray or organic pest control methods.", "🪳 Keep the field clean to prevent pest breeding."],
    botReply_whoAreYou: ["I am your AI assistant for farming, here to help you with crop and soil questions."],
    botReply_water: ["💧 Maintain regular irrigation.", "🚿 Drip irrigation saves water and increases yield.", "🌊 Over-watering crops can harm the roots—check moisture first."],
    botReply_harvest: ["🚜 Harvest crops when 80% of grains are mature and golden.", "🌾 Harvest early morning to avoid moisture loss.", "🛒 Store harvested crops in dry, ventilated places."],
    botReply_weather: ["☀️ Weather looks good today. Avoid sowing if heavy rain is expected.", "🌦️ Cloudy weather is good for transplanting seedlings.", "🌩️ Storms predicted—secure loose items in the field."],
    botReply_fertilizer: ["🧪 Use nitrogen-rich fertilizer during growth stage, and potash at flowering.", "🌱 Organic manure improves soil fertility naturally.", "💡 Avoid excess fertilizer—it may reduce soil health."],
    botReply_price_wheat: ["The current price of wheat is around ₹35 per kg."],
    botReply_price_rice: ["The average price of rice is currently about ₹36 per kg."],
    botReply_price_maize: ["The current price of maize is approximately ₹20 per kg."],
    botReply_seed: ["🌾 Use certified seeds for better yield.", "🌱 Hybrid seeds grow faster but need care.", "🧑‍🌾 Treat seeds before sowing to prevent disease."],
    botReply_market: ["💰 Check daily market prices before selling crops.", "📦 Direct selling to consumers increases profit."],
    botReply_storage: ["🏠 Store grains in airtight containers.", "🛢️ Cold storage helps for fruits and vegetables.", "📦 Use warehouses to prevent pest attacks."],
    botReply_loan: ["💳 Apply for **Kisan Credit Card (KCC)** – easy loans for farmers with low interest.", "🏦 Take loans from **nationalized banks, co-operative banks, or NABARD schemes** for safety."],
    botReply_scheme: ["🏛️ PM-Kisan provides income support for farmers.", "💸 Kisan Credit Card (KCC) offers low-interest farm loans."],
    botReply_default: ["🤖 Sorry, I can't help with that.", "🧑‍🌾 I'm still learning! Try asking about soil, crops, or irrigation."],
    task_landPrepareStatus1: "Plowing the field... Please wait.",
    task_landPrepareStatus2: "✅ Land is ready for sowing! It's properly tilled and leveled.",
    task_pestControlNoCrop: "⚠️ Please select a crop to grow first.",
    task_pestControlDetected: (crop) => `⚠️ Pests detected on the ${crop}! Applying organic pest control.`,
    task_pestControlHealthy: (crop) => `✅ The ${crop} crops are healthy! No pests or diseases found.`,
    task_harvestNoCrop: "⚠️ There is no crop to harvest.",
    task_harvestComplete: (crop) => `All **${crop}** has already been harvested.`,
    task_harvesting: (crop) => `🚜 Harvesting **${crop}** in progress...`,
    task_harvestingDone: (crop) => `🎉 Harvesting of **${crop}** complete! The crops are ready for storage.`,
    task_growthWeek1: (crop) => `**Week 1:** Sowing the ${crop} seeds. 🌱`,
    task_growthMonitoring: (week, crop, growth) => `**Week ${week}:** ${crop} is at **${growth}%** growth. 📈`,
    task_growthFinal: (crop) => `**Final Stage:** ${crop} is fully grown and ready for harvest! 🎉`,
    task_micFailed: "⚠️ Mic access failed. Please allow microphone.",
  }
};

// ----------------- Chart Data Templates -----------------
const chartData = {
  moisture: {
    wheat: [75, 80, 70, 65],
    rice: [90, 85, 95, 92],
    maize: [60, 65, 55, 60],
    pulses: [50, 55, 60, 58]
  },
  nitrogen: {
    wheat: [60, 55, 50, 45],
    rice: [70, 65, 60, 55],
    maize: [50, 45, 40, 35],
    pulses: [40, 45, 50, 48]
  },
  growth: {
    wheat: [10, 30, 60, 90],
    rice: [15, 40, 70, 95],
    maize: [5, 25, 50, 85],
    pulses: [8, 28, 55, 88]
  },
  marketPrice: {
    wheat: 25,
    rice: 32,
    maize: 18,
    pulses: 45
  }
};

// ----------------- Translation Logic -----------------
function setLanguage(lang) {
  currentLanguage = lang;
  document.querySelectorAll('[data-i18n-key]').forEach(element => {
    const key = element.getAttribute('data-i18n-key');
    element.innerHTML = translations[lang][key];
  });
  document.getElementById('textInput').placeholder = translations[lang].textInputPlaceholder;
  renderCharts();
}

// ----------------- Chart Creation and Update -----------------
function renderCharts() {
  // Destroy old instances if they exist
  if (soilChartInstance) soilChartInstance.destroy();
  if (cropChartInstance) cropChartInstance.destroy();
  if (growthChartInstance) growthChartInstance.destroy();
  if (marketChartInstance) marketChartInstance.destroy();

  const currentTrans = translations[currentLanguage];

  const soilCanvas = document.getElementById("soilChart");
  if (soilCanvas) {
    soilChartInstance = new Chart(soilCanvas, {
      type: "bar",
      data: {
        labels: currentTrans.step1ChartLabel,
        datasets: [{
          label: currentTrans.step1ChartDatasetLabel,
          data: [70, 50, 6.5],
          backgroundColor: ["#4caf50", "#81c784", "#c8e6c9"]
        }]
      }
    });
  }

  const cropCanvas = document.getElementById("cropChart");
  if (cropCanvas) {
    cropChartInstance = new Chart(cropCanvas, {
      type: "pie",
      data: {
        labels: currentTrans.step2ChartLabel,
        datasets: [{
          data: [40, 35, 25],
          backgroundColor: ["#ff9800", "#8bc34a", "#03a9f4"]
        }]
      }
    });
  }

  const growthCanvas = document.getElementById("growthChart");
  if (growthCanvas) {
    growthChartInstance = new Chart(growthCanvas, {
      type: "line",
      data: {
        labels: currentTrans.step4ChartLabel,
        datasets: [{
          label: currentTrans.step4ChartDatasetLabel,
          data: [10, 30, 60, 90],
          borderColor: "#4caf50",
          fill: false
        }]
      }
    });
  }

  const marketCanvas = document.getElementById("marketChart");
  if (marketCanvas) {
    marketChartInstance = new Chart(marketCanvas, {
      type: "bar",
      data: {
        labels: currentTrans.step6ChartLabel,
        datasets: [{
          label: currentTrans.step6ChartDatasetLabel,
          data: [25, 32, 18, 45],
          backgroundColor: ["#ff5722", "#8bc34a", "#03a9f4", "#9c27b0"]
        }]
      }
    });
  }
}

function updateCharts() {
  if (!currentCrop) {
    if (growthChartInstance) {
      growthChartInstance.data.datasets[0].data = [];
      growthChartInstance.data.datasets[0].label = translations[currentLanguage].step4ChartDatasetLabel;
      growthChartInstance.update();
    }
    return;
  }

  const cropName = currentCrop.toLowerCase();
  const newGrowthData = chartData.growth[cropName] || [10, 20, 30, 40];
  if (growthChartInstance) {
    growthChartInstance.data.datasets[0].data = newGrowthData;
    growthChartInstance.data.datasets[0].label = `${currentCrop} Growth %`;
    growthChartInstance.update();
  }

  const newSoilData = [
    (chartData.moisture[cropName] && chartData.moisture[cropName][0]) || 70,
    (chartData.nitrogen[cropName] && chartData.nitrogen[cropName][0]) || 50,
    6.5
  ];
  if (soilChartInstance) {
    soilChartInstance.data.datasets[0].data = newSoilData;
    soilChartInstance.update();
  }
}

// ----------------- Chatbot -----------------
const micButton = document.getElementById("micButton");
const sendButton = document.getElementById("sendButton");
const textInput = document.getElementById("textInput");
const chatBox = document.getElementById("chatBox");

function getBotReply(msg) {
  const lowerCaseMsg = msg.toLowerCase().trim();
  const currentTrans = translations[currentLanguage];

  const randomReply = (replies) =>
    replies[Math.floor(Math.random() * replies.length)];

  // **PRIORITY 1: SPECIFIC COMMANDS (must be first)**
  if (lowerCaseMsg.includes("ఏ పంట పండుతోంది") || lowerCaseMsg.includes("which crop is growing") || lowerCaseMsg.includes("कौन सी फसल उग रही है")) {
    return currentCrop ?
      currentTrans.botReply_whatCrop(currentCrop, growthWeek + 1) :
      currentTrans.botReply_noCrop;
  }

  const growMatch = lowerCaseMsg.match(/^(?:grow|plant|sow|నాటండి|బోए)\s(wheat|rice|maize|pulses|గోధుమ|బియ్యం|మొక్కజొన్న|దాల్|पल्स)$/);
  if (growMatch && growMatch[1]) {
    let cropToGrow = growMatch[1];
    if (cropToGrow === "గోధుమ" || cropToGrow === "wheat") cropToGrow = "wheat";
    else if (cropToGrow === "బియ్యం" || cropToGrow === "rice") cropToGrow = "rice";
    else if (cropToGrow === "మొక్కజొన్న" || cropToGrow === "maize") cropToGrow = "maize";
    else if (cropToGrow === "దాల్" || cropToGrow === "pulses" || cropToGrow === "पल्स") cropToGrow = "pulses";

    const capitalizedCrop = cropToGrow.charAt(0).toUpperCase() + cropToGrow.slice(1);

    if (currentCrop && capitalizedCrop === currentCrop) {
      return currentTrans.botReply_alreadyGrowing(capitalizedCrop);
    }

    currentCrop = capitalizedCrop;
    harvestComplete = false;
    updateCharts();
    startGrowthSimulation();

    return currentTrans.botReply_sowComplete(currentCrop);
  }

  // **PRIORITY 2: GENERAL KEYWORDS (after specific commands)**
  if (lowerCaseMsg.includes("thank you") || lowerCaseMsg.includes("thanks") || lowerCaseMsg.includes("ధన్యవాదాలు") || lowerCaseMsg.includes("धन्यवाद"))
    return randomReply(currentTrans.botReply_thanks);
  if (lowerCaseMsg.includes("hi") || lowerCaseMsg.includes("hello") || lowerCaseMsg.includes("hey") || lowerCaseMsg.includes("నమస్కారం") || lowerCaseMsg.includes("नमस्ते"))
    return randomReply(currentTrans.botReply_greetings);
  if (lowerCaseMsg.includes("soil") || lowerCaseMsg.includes("మట్టి") || lowerCaseMsg.includes("मिट्टी")) return randomReply(currentTrans.botReply_soil);
  if (lowerCaseMsg.includes("crop") || lowerCaseMsg.includes("పంట") || lowerCaseMsg.includes("फसल")) return randomReply(currentTrans.botReply_crop);
  if (lowerCaseMsg.includes("pest") || lowerCaseMsg.includes("తెగులు") || lowerCaseMsg.includes("कीट")) return randomReply(currentTrans.botReply_pest);
  if ((lowerCaseMsg.includes("who") && lowerCaseMsg.includes("you")) || (lowerCaseMsg.includes("మీరు") && lowerCaseMsg.includes("ఎవరు")) || (lowerCaseMsg.includes("आप") && lowerCaseMsg.includes("कौन")))
    return randomReply(currentTrans.botReply_whoAreYou);
  if (lowerCaseMsg.includes("water") || lowerCaseMsg.includes("irrigation") || lowerCaseMsg.includes("నీరు") || lowerCaseMsg.includes("पानी") || lowerCaseMsg.includes("सिंचाई"))
    return randomReply(currentTrans.botReply_water);
  if (lowerCaseMsg.includes("harvest") || lowerCaseMsg.includes("పంటకోత") || lowerCaseMsg.includes("कटाई")) return randomReply(currentTrans.botReply_harvest);
  if (lowerCaseMsg.includes("weather") || lowerCaseMsg.includes("వాతావరణం") || lowerCaseMsg.includes("मौसम")) return randomReply(currentTrans.botReply_weather);
  if (lowerCaseMsg.includes("fertilizer") || lowerCaseMsg.includes("manure") || lowerCaseMsg.includes("ఎరువులు") || lowerCaseMsg.includes("उर्वरक"))
    return randomReply(currentTrans.botReply_fertilizer);
  if ((lowerCaseMsg.includes("price") || lowerCaseMsg.includes("rate")) && (lowerCaseMsg.includes("wheat") || lowerCaseMsg.includes("గోధుమ") || lowerCaseMsg.includes("गेहूं")))
    return randomReply(currentTrans.botReply_price_wheat);
  if ((lowerCaseMsg.includes("price") || lowerCaseMsg.includes("rate")) && (lowerCaseMsg.includes("rice") || lowerCaseMsg.includes("బియ్యం") || lowerCaseMsg.includes("चावल")))
    return randomReply(currentTrans.botReply_price_rice);
  if ((lowerCaseMsg.includes("price") || lowerCaseMsg.includes("rate")) && (lowerCaseMsg.includes("maize") || lowerCaseMsg.includes("మొక్కజొన్న") || lowerCaseMsg.includes("मक्का")))
    return randomReply(currentTrans.botReply_price_maize);
  if (lowerCaseMsg.includes("seed") || lowerCaseMsg.includes("విత్తనాలు") || lowerCaseMsg.includes("बीज")) return randomReply(currentTrans.botReply_seed);
  if (lowerCaseMsg.includes("market") || lowerCaseMsg.includes("మార్కెట్") || lowerCaseMsg.includes("बाजार")) return randomReply(currentTrans.botReply_market);
  if (lowerCaseMsg.includes("store") || lowerCaseMsg.includes("storage") || lowerCaseMsg.includes("నిల్వ") || lowerCaseMsg.includes("भंडारण"))
    return randomReply(currentTrans.botReply_storage);
  if (lowerCaseMsg.includes("loan") || lowerCaseMsg.includes("credit") || lowerCaseMsg.includes("రుణం") || lowerCaseMsg.includes("ऋण"))
    return randomReply(currentTrans.botReply_loan);
  if (lowerCaseMsg.includes("scheme") || lowerCaseMsg.includes("government") || lowerCaseMsg.includes("పథకాలు") || lowerCaseMsg.includes("योजना"))
    return randomReply(currentTrans.botReply_scheme);

  // **DEFAULT REPLY**
  return randomReply(currentTrans.botReply_default);
}

function addMessage(sender, message) {
  const msgDiv = document.createElement("div");
  msgDiv.className = sender === "user" ? "user-msg" : "bot-msg";
  msgDiv.innerHTML = message;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  if (sender === "bot") speakResponse(message);
}

function speakResponse(message) {
  const synth = window.speechSynthesis;
  if (synth) {
    const utterance = new SpeechSynthesisUtterance(
      message.replace(/\*\*/g, "")
    );
    utterance.lang = currentLanguage + (currentLanguage === 'hi' ? '-IN' : (currentLanguage === 'te' ? '-IN' : '-US'));
    synth.speak(utterance);
  }
}

// ----------------- Farming Task Simulations -----------------
function prepareLand() {
  const statusElement = document.getElementById("land-status");
  if (!statusElement) return;

  statusElement.innerText = translations[currentLanguage].task_landPrepareStatus1;
  statusElement.style.color = "black";

  setTimeout(() => {
    statusElement.innerText = translations[currentLanguage].task_landPrepareStatus2;
    statusElement.style.color = "green";
  }, 3000);
}

function checkAndControlPests() {
  const controlStatus = document.getElementById("control-status");
  if (!controlStatus) return;
  const currentTrans = translations[currentLanguage];

  if (!currentCrop) {
    controlStatus.innerText = currentTrans.task_pestControlNoCrop;
    controlStatus.style.color = "red";
    return;
  }

  const hasPests = Math.random() > 0.7;
  controlStatus.style.color = "black";

  if (hasPests) {
    controlStatus.innerText = currentTrans.task_pestControlDetected(currentCrop);
    controlStatus.style.color = "red";
  } else {
    controlStatus.innerText = currentTrans.task_pestControlHealthy(currentCrop);
    controlStatus.style.color = "green";
  }
}

function harvestCrops() {
  const harvestStatus = document.getElementById("harvest-status");
  if (!harvestStatus) return;
  const currentTrans = translations[currentLanguage];

  if (!currentCrop) {
    harvestStatus.innerText = currentTrans.task_harvestNoCrop;
    harvestStatus.style.color = "red";
    return;
  }

  if (harvestComplete) {
    harvestStatus.innerText = currentTrans.task_harvestComplete(currentCrop);
    harvestStatus.style.color = "green";
    return;
  }

  harvestStatus.innerText = currentTrans.task_harvesting(currentCrop);
  harvestStatus.style.color = "black";

  setTimeout(() => {
    harvestStatus.innerText = currentTrans.task_harvestingDone(currentCrop);
    harvestStatus.style.color = "green";
    harvestComplete = true;
    if (growthInterval) {
      clearInterval(growthInterval);
    }
  }, 2500);
}

// ----------------- Growth Simulation & Monitoring -----------------
function startGrowthSimulation() {
  growthWeek = 0;
  const monitoringStatus = document.getElementById("monitoring-status");
  if (!monitoringStatus) return;
  const currentTrans = translations[currentLanguage];

  if (growthInterval) {
    clearInterval(growthInterval);
  }

  const cropName = currentCrop.toLowerCase();
  const growthData = chartData.growth[cropName] || [10, 20, 30, 40];

  if (growthChartInstance) {
    growthChartInstance.data.datasets[0].data = [growthData[0]];
    growthChartInstance.update();
  }

  monitoringStatus.innerHTML = currentTrans.task_growthWeek1(currentCrop);

  growthInterval = setInterval(() => {
    growthWeek++;
    if (growthWeek < growthData.length) {
      if (growthChartInstance) {
        growthChartInstance.data.datasets[0].data.push(growthData[growthWeek]);
        growthChartInstance.update();
      }
      monitoringStatus.innerHTML = currentTrans.task_growthMonitoring(growthWeek + 1, currentCrop, growthData[growthWeek]);
    } else {
      clearInterval(growthInterval);
      monitoringStatus.innerHTML = currentTrans.task_growthFinal(currentCrop);
    }
  }, 1000);
}


// ----------------- Chatbot Toggle -----------------
function toggleChatbot() {
  const chatbot = document.getElementById("chatbotWindow");
  chatbot.classList.toggle("hidden");
}

// ----------------- Event Listeners -----------------
document.addEventListener("DOMContentLoaded", () => {
  setLanguage('te'); // Set default language on load
});

if (sendButton) {
  sendButton.addEventListener("click", () => {
    const query = textInput.value.trim();
    if (!query) return;
    addMessage("user", query);
    const reply = getBotReply(query);
    addMessage("bot", reply);
    textInput.value = "";
  });
}

if (textInput) {
  textInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendButton.click();
    }
  });
}

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition && micButton) {
  const recognition = new SpeechRecognition();
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    addMessage("user", speechResult);
    const reply = getBotReply(speechResult);
    addMessage("bot", reply);
  };

  recognition.onerror = () =>
    addMessage("bot", translations[currentLanguage].task_micFailed);
  micButton.addEventListener("click", () => {
    recognition.lang = currentLanguage === 'te' ? 'te-IN' : (currentLanguage === 'hi' ? 'hi-IN' : 'en-US');
    recognition.start();
  });
} else if (micButton) {
  micButton.disabled = true;
  micButton.innerText = "Mic ❌";
}