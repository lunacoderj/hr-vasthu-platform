import { useLanguageStore, type LanguageCode } from '../store/language.store';

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {

    digitalLibrary: 'Digital Library',

    digitalLibrarySub: 'Immerse yourself in the ancient science of Vastu Shastra. Download our expertly curated guides to help you align your home and workspace for prosperity.',

    legacyOfExcellence: 'Legacy of Excellence',

    theSacredArchive: 'The Sacred Archive',

    awardsCertificationsMilestones: 'Awards · Certifications · Milestones',

    exploreJourney: 'Explore Journey',

    voiceOfVastuWisdom: 'Voice of Vastu Wisdom',

    speechesDesc1: 'Dr. Rao\'s powerful addresses have enlightened audiences across India and beyond, bridging the gap between ancient Vedic architecture and modern scientific understanding.',

    speechesDesc2: 'His captivating lectures transform complex cosmic geometry into practical, actionable knowledge that transforms homes and lives.',

    awardsHonors: 'Awards & Honors',

    awardsHonorsSub: 'International accolades recognizing decades of mastery in Vastu Science & Technology.',

    clientCertifications: 'Client Certifications',

    clientCertificationsSub: 'Official Vastu compliance certifications issued to homes and businesses across India.',

    lecturesSpeeches: 'Lectures & Speeches',

    home: 'Home',
    videos: 'Videos',
    shorts: 'Shorts',
    books: 'Books',
    blog: 'Blog',
    gallery: 'Gallery',
    about: 'About',
    contact: 'Contact',
    callNow: 'Call Now',
    bookConsultation: 'Book Consultation',
    whatsappChat: 'Chat on WhatsApp',
    directCall: 'Direct Call',
    scrollTop: 'Scroll to Top',
    directLine: 'Direct Line',
    emailAddress: 'Email Address',
    headquarters: 'Headquarters',
    consultationHours: 'Consultation Hours',
    sendViaWhatsApp: 'Send via WhatsApp',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    consultationType: 'Consultation Type',
    additionalDetails: 'Additional Details',
    sending: 'Sending...',
    messageSent: 'Message Sent!',
    redirectedToWhatsApp: 'Redirected to WhatsApp & logged to admin.',
    clientMessageMeta: 'Client reached through WhatsApp · Admin will be notified automatically',
    nepalAward: 'Nepal Sadbhavana Awardee',
    youtubeChannel: 'YouTube Channel',
    watchFreeLessons: 'Watch free Vastu lessons',
    directAccess: 'Direct Access',
    connectWithMaster: 'Connect With The Master',
    transformSpace: "Transform your living or workspace into a magnet for cosmic prosperity. Reach out to Dr. Kunchala Hanumantha Rao for an expert consultation.",
  },
  hi: {

    digitalLibrary: 'डिजिटल लाइब्रेरी',

    digitalLibrarySub: 'वास्तु शास्त्र के प्राचीन विज्ञान में खुद को डुबो दें। समृद्धि के लिए अपने घर और कार्यक्षेत्र को संरेखित करने में मदद करने के लिए हमारे विशेषज्ञ-क्यूरेटेड गाइड डाउनलोड करें।',

    legacyOfExcellence: 'उत्कृष्टता की विरासत',

    theSacredArchive: 'पवित्र पुरालेख',

    awardsCertificationsMilestones: 'पुरस्कार · प्रमाणपत्र · मील के पत्थर',

    exploreJourney: 'यात्रा का अन्वेषण करें',

    voiceOfVastuWisdom: 'वास्तु ज्ञान की आवाज',

    speechesDesc1: 'डॉ. राव के शक्तिशाली संबोधनों ने भारत और उसके बाहर के दर्शकों को प्रबुद्ध किया है, प्राचीन वैदिक वास्तुकला और आधुनिक वैज्ञानिक समझ के बीच की दूरी को पाटा है।',

    speechesDesc2: 'उनके मनोरम व्याख्यान जटिल ब्रह्मांडीय ज्यामिति को व्यावहारिक, कार्रवाई योग्य ज्ञान में बदल देते हैं जो घरों और जीवन को बदल देता है।',

    awardsHonors: 'पुरस्कार और सम्मान',

    awardsHonorsSub: 'वास्तु विज्ञान और प्रौद्योगिकी में दशकों की महारत को मान्यता देने वाले अंतर्राष्ट्रीय सम्मान।',

    clientCertifications: 'ग्राहक प्रमाणपत्र',

    clientCertificationsSub: 'भारत भर में घरों और व्यवसायों को जारी किए गए आधिकारिक वास्तु अनुपालन प्रमाणपत्र।',

    lecturesSpeeches: 'व्याख्यान और भाषण',

    home: 'होम',
    videos: 'वीडियो',
    shorts: 'शॉर्ट्स',
    books: 'पुस्तकें',
    blog: 'ब्लॉग',
    gallery: 'गैलरी',
    about: 'हमारे बारे में',
    contact: 'संपर्क करें',
    callNow: 'अभी कॉल करें',
    bookConsultation: 'परामर्श बुक करें',
    whatsappChat: 'व्हाट्सएप चैट',
    directCall: 'सीधा कॉल',
    scrollTop: 'ऊपर स्क्रॉल करें',
    directLine: 'डायरेक्ट लाइन',
    emailAddress: 'ईमेल पता',
    headquarters: 'मुख्यालय',
    consultationHours: 'परामर्श का समय',
    sendViaWhatsApp: 'व्हाट्सएप के जरिए भेजें',
    fullName: 'पूरा नाम',
    phoneNumber: 'फ़ोन नंबर',
    consultationType: 'परामर्श का प्रकार',
    additionalDetails: 'अतिरिक्त विवरण',
    sending: 'भेजा जा रहा है...',
    messageSent: 'संदेश भेजा गया!',
    redirectedToWhatsApp: 'व्हाट्सएप पर रिडायरेक्ट किया गया और एडमिन को सूचित किया गया।',
    clientMessageMeta: 'क्लाइंट व्हाट्सएप के माध्यम से पहुंचा · एडमिन को स्वचालित रूप से सूचित किया जाएगा',
    nepalAward: 'नेपाल सद्भावना पुरस्कार विजेता',
    youtubeChannel: 'यूट्यूब चैनल',
    watchFreeLessons: 'मुफ्त वास्तु पाठ देखें',
    directAccess: 'सीधी पहुँच',
    connectWithMaster: 'मास्टर से जुड़ें',
    transformSpace: "अपने रहने या काम करने की जगह को ब्रह्मांडीय समृद्धि के चुंबकीय केंद्र में बदलें। विशेषज्ञ परामर्श के लिए डॉ. कुंचाला हनुमंत राव से संपर्क करें।",
  },
  te: {

    digitalLibrary: 'డిజిటల్ లైబ్రరీ',

    digitalLibrarySub: 'వాస్తు శాస్త్రం యొక్క పురాతన శాస్త్రంలో మునిగిపోండి. మీ ఇల్లు మరియు కార్యస్థలాన్ని సమృద్ధి కోసం సమలేఖనం చేయడంలో సహాయపడటానికి మా నిపుణులచే నిర్వహించబడిన గైడ్‌లను డౌన్‌లోడ్ చేయండి.',

    legacyOfExcellence: 'ఉత్కృష్టమైన వారసత్వం',

    theSacredArchive: 'పవిత్ర ఆర్కైవ్',

    awardsCertificationsMilestones: 'అవార్డులు · ధృవపత్రాలు · మైలురాళ్ళు',

    exploreJourney: 'ప్రయాణాన్ని అన్వేషించండి',

    voiceOfVastuWisdom: 'వాస్తు జ్ఞాన స్వరం',

    speechesDesc1: 'డాక్టర్ రావు గారి శక్తివంతమైన ప్రసంగాలు భారతదేశం మరియు వెలుపల ఉన్న ప్రేక్షకులను జ్ఞానవంతం చేశాయి, పురాతన వేద నిర్మాణకళ మరియు ఆధునిక శాస్త్రీయ అవగాహన మధ్య అంతరాన్ని తగ్గించాయి.',

    speechesDesc2: 'ఆయన ఆకట్టుకునే ఉపన్యాసాలు సంక్లిష్టమైన విశ్వ జ్యామితిని ఆచరణాత్మకమైన, క్రియాశీలక జ్ఞానంగా మారుస్తాయి, ఇవి ఇళ్లను మరియు జీవితాలను మారుస్తాయి.',

    awardsHonors: 'అవార్డులు & గౌరవాలు',

    awardsHonorsSub: 'వాస్తు సైన్స్ & టెక్నాలజీలో దశాబ్దాల నైపుణ్యాన్ని గుర్తిస్తూ అంతర్జాతీయ పురస్కారాలు.',

    clientCertifications: 'క్లయింట్ ధృవీకరణ పత్రాలు',

    clientCertificationsSub: 'భారతదేశం అంతటా ఇళ్లు మరియు వ్యాపారాలకు జారీ చేయబడిన అధికారిక వాస్తు సమ్మతి ధృవీకరణ పత్రాలు.',

    lecturesSpeeches: 'ఉపన్యాసాలు & ప్రసంగాలు',

    home: 'హోమ్',
    videos: 'వీడియోలు',
    shorts: 'షార్ట్స్',
    books: 'పుస్తకాలు',
    blog: 'బ్లాగ్',
    gallery: 'గ్యాలరీ',
    about: 'మా గురించి',
    contact: 'సంప్రదించండి',
    callNow: 'కాల్ చేయండి',
    bookConsultation: 'కన్సల్టేషన్ బుక్ చేయండి',
    whatsappChat: 'వాట్సాప్ చాట్',
    directCall: 'డైరెక్ట్ కాల్',
    scrollTop: 'పైకి వెళ్ళండి',
    directLine: 'డైరెక్ట్ లైన్',
    emailAddress: 'ఈమెయిల్ చిరునామా',
    headquarters: 'ప్రధాన కార్యాలయం',
    consultationHours: 'కన్సల్టేషన్ వేళలు',
    sendViaWhatsApp: 'వాట్సాప్ ద్వారా పంపండి',
    fullName: 'పూర్తి పేరు',
    phoneNumber: 'ఫోన్ నంబర్',
    consultationType: 'కన్సల్టేషన్ రకం',
    additionalDetails: 'అదనపు వివరాలు',
    sending: 'పంపుతోంది...',
    messageSent: 'సందేశం పంపబడింది!',
    redirectedToWhatsApp: 'వాట్సాప్‌కు రీడైరెక్ట్ చేయబడింది & అడ్మిన్‌కు లాగ్ చేయబడింది.',
    clientMessageMeta: 'క్లయింట్ వాట్సాప్ ద్వారా చేరారు · అడ్మిన్‌కు స్వయంచాలకంగా తెలియజేయబడుతుంది',
    nepalAward: 'నేపాల్ సద్భావన అవార్డు గ్రహీత',
    youtubeChannel: 'యూట్యూబ్ ఛానెల్',
    watchFreeLessons: 'ఉచిత వాస్తు పాఠాలు చూడండి',
    directAccess: 'డైరెక్ట్ యాక్సెస్',
    connectWithMaster: 'గురువు గారితో సంప్రదించండి',
    transformSpace: "మీ నివాస లేదా కార్యస్థలాన్ని విశ్వసమృద్ధికి ఆకర్షణీయ కేంద్రంగా మార్చండి. నిపుణుల కన్సల్టేషన్ కోసం డాక్టర్ కుంచాల హనుమంతరావును సంప్రదించండి.",
  },
  ta: {

    digitalLibrary: 'டிஜிட்டல் நூலகம்',

    digitalLibrarySub: 'வாஸ்து சாஸ்திரத்தின் பழங்கால அறிவியலில் மூழ்கிவிடுங்கள். உங்கள் வீடு மற்றும் பணியிடத்தை செழிப்புடன் சீரமைக்க உதவும் எங்களின் நிபுணத்துவ வழிகாட்டிகளைப் பதிவிறக்கவும்.',

    legacyOfExcellence: 'சிறந்த பாரம்பரியம்',

    theSacredArchive: 'புனித காப்பகம்',

    awardsCertificationsMilestones: 'விருதுகள் · சான்றிதழ்கள் · மைல்கற்கள்',

    exploreJourney: 'பயணத்தை ஆராயுங்கள்',

    voiceOfVastuWisdom: 'வாஸ்து ஞானத்தின் குரல்',

    speechesDesc1: 'டாக்டர் ராவின் சக்திவாய்ந்த உரைகள் இந்தியா மற்றும் அதற்கு அப்பால் உள்ள பார்வையாளர்களுக்கு அறிவொளி ஊட்டியுள்ளன, பண்டைய வேத கட்டிடக்கலைக்கும் நவீன அறிவியல் புரிதலுக்கும் இடையிலான இடைவெளியைக் குறைத்துள்ளன.',

    speechesDesc2: 'அவரது வசீகரிக்கும் விரிவுரைகள் சிக்கலான பிரபஞ்ச வடிவவியலை நடைமுறை, செயல்படக்கூடிய அறிவாக மாற்றுகின்றன, அவை வீடுகளையும் வாழ்க்கையையும் மாற்றுகின்றன.',

    awardsHonors: 'விருதுகள் மற்றும் மரியாதைகள்',

    awardsHonorsSub: 'வாஸ்து அறிவியல் மற்றும் தொழில்நுட்பத்தில் பல தசாப்த கால தேர்ச்சியை அங்கீகரிக்கும் சர்வதேச பாராட்டுகள்.',

    clientCertifications: 'வாடிக்கையாளர் சான்றிதழ்கள்',

    clientCertificationsSub: 'இந்தியா முழுவதும் உள்ள வீடுகள் மற்றும் வணிகங்களுக்கு வழங்கப்படும் அதிகாரப்பூர்வ வாஸ்து இணக்க சான்றிதழ்கள்.',

    lecturesSpeeches: 'விரிவுரைகள் மற்றும் உரைகள்',

    home: 'முகப்பு',
    videos: 'வீடியோக்கள்',
    shorts: 'குறும்படங்கள்',
    books: 'புத்தகங்கள்',
    blog: 'வலைப்பதிவு',
    gallery: 'தொகுப்பு',
    about: 'எங்களைப் பற்றி',
    contact: 'தொடர்பு கொள்க',
    callNow: 'இப்போதே அழைக்கவும்',
    bookConsultation: 'ஆலோசனையை முன்பதிவு செய்க',
    whatsappChat: 'வாட்ஸ்அப் அரட்டை',
    directCall: 'நேரடி அழைப்பு',
    scrollTop: 'மேலே செல்லவும்',
    directLine: 'நேரடி எண்',
    emailAddress: 'மின்னஞ்சல் முகவரி',
    headquarters: 'தலைமையகம்',
    consultationHours: 'ஆலோசனை நேரம்',
    sendViaWhatsApp: 'வாட்ஸ்அப் மூலம் அனுப்பவும்',
    fullName: 'முழு பெயர்',
    phoneNumber: 'தொலைபேசி எண்',
    consultationType: 'ஆலோசனை வகை',
    additionalDetails: 'கூடுதல் விவரங்கள்',
    sending: 'அனுப்பப்படுகிறது...',
    messageSent: 'செய்தி அனுப்பப்பட்டது!',
    redirectedToWhatsApp: 'வாட்ஸ்அப்பிற்கு திருப்பி விடப்பட்டு நிர்வாகிக்கு தெரிவிக்கப்பட்டது.',
    clientMessageMeta: 'வாடிக்கையாளர் வாட்ஸ்அப் மூலம் தொடர்பு கொண்டுள்ளார் · நிர்வாகிக்கு தானாகவே தெரிவிக்கப்படும்',
    nepalAward: 'நேபாள சத்பாவனா விருது பெற்றவர்',
    youtubeChannel: 'யூடியூப் சேனல்',
    watchFreeLessons: 'இலவச வாஸ்து பாடங்களைப் பாருங்கள்',
    directAccess: 'நேரடி அணுகல்',
    connectWithMaster: 'மாஸ்டருடன் இணையுங்கள்',
    transformSpace: "உங்கள் வாழும் அல்லது பணிபுரியும் இடத்தை பிரபஞ்ச செழிப்பின் காந்தமாக மாற்றுங்கள். நிபுணத்துவ ஆலோசனைக்கு டாக்டர் குஞ்சால ஹனுமந்த ராவை அணுகவும்.",
  },
  kn: {

    digitalLibrary: 'ಡಿಜಿಟಲ್ ಗ್ರಂಥಾಲಯ',

    digitalLibrarySub: 'ವಾಸ್ತು ಶಾಸ್ತ್ರದ ಪುರಾತನ ವಿಜ್ಞಾನದಲ್ಲಿ ನಿಮ್ಮನ್ನು ನೀವು ತೊಡಗಿಸಿಕೊಳ್ಳಿ. ಸಮೃದ್ಧಿಗಾಗಿ ನಿಮ್ಮ ಮನೆ ಮತ್ತು ಕೆಲಸದ ಸ್ಥಳವನ್ನು ಜೋಡಿಸಲು ಸಹಾಯ ಮಾಡಲು ನಮ್ಮ ತಜ್ಞರು ಸಂಗ್ರಹಿಸಿದ ಮಾರ್ಗದರ್ಶಿಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.',

    legacyOfExcellence: 'ಶ್ರೇಷ್ಠತೆಯ ಪರಂಪರೆ',

    theSacredArchive: 'ಪವಿತ್ರ ದಾಖಲೆ',

    awardsCertificationsMilestones: 'ಪ್ರಶಸ್ತಿಗಳು · ಪ್ರಮಾಣಪತ್ರಗಳು · ಮೈಲಿಗಲ್ಲುಗಳು',

    exploreJourney: 'ಪ್ರಯಾಣವನ್ನು ಅನ್ವೇಷಿಸಿ',

    voiceOfVastuWisdom: 'ವಾಸ್ತು ಜ್ಞಾನದ ಧ್ವನಿ',

    speechesDesc1: 'ಡಾ. ರಾವ್ ಅವರ ಶಕ್ತಿಯುತ ಭಾಷಣಗಳು ಭಾರತ ಮತ್ತು ಅದರಾಚೆಗಿನ ಪ್ರೇಕ್ಷಕರಿಗೆ ಜ್ಞಾನೋದಯ ನೀಡಿವೆ, ಪ್ರಾಚೀನ ವೈದಿಕ ವಾಸ್ತುಶಿಲ್ಪ ಮತ್ತು ಆಧುನಿಕ ವೈಜ್ಞಾನಿಕ ತಿಳುವಳಿಕೆಯ ನಡುವಿನ ಅಂತರವನ್ನು ಕಡಿಮೆ ಮಾಡಿದೆ.',

    speechesDesc2: 'ಅವರ ಆಕರ್ಷಕ ಉಪನ್ಯಾಸಗಳು ಸಂಕೀರ್ಣವಾದ ಕಾಸ್ಮಿಕ್ ರೇಖಾಗಣಿತವನ್ನು ಪ್ರಾಯೋಗಿಕ, ಕ್ರಿಯಾಶೀಲ ಜ್ಞಾನವಾಗಿ ಪರಿವರ್ತಿಸುತ್ತವೆ, ಅದು ಮನೆಗಳನ್ನು ಮತ್ತು ಜೀವನವನ್ನು ಬದಲಾಯಿಸುತ್ತದೆ.',

    awardsHonors: 'ಪ್ರಶಸ್ತಿಗಳು ಮತ್ತು ಗೌರವಗಳು',

    awardsHonorsSub: 'ವಾಸ್ತು ವಿಜ್ಞಾನ ಮತ್ತು ತಂತ್ರಜ್ಞಾನದಲ್ಲಿ ದಶಕಗಳ ಪಾಂಡಿತ್ಯವನ್ನು ಗುರುತಿಸುವ ಅಂತರರಾಷ್ಟ್ರೀय ಪುರಸ್ಕಾರಗಳು.',

    clientCertifications: 'ಗ್ರಾಹಕರ ಪ್ರಮಾಣೀಕರಣಗಳು',

    clientCertificationsSub: 'ಭಾರತದಾದ್ಯಂತ ಮನೆಗಳು ಮತ್ತು ಉದ್ಯಮಗಳಿಗೆ ನೀಡಲಾದ ಅಧಿಕೃತ ವಾಸ್ತು ಅನುಸರಣೆ ಪ್ರಮಾಣಪತ್ರಗಳು.',

    lecturesSpeeches: 'ಉಪನ್ಯಾಸಗಳು ಮತ್ತು ಭಾಷಣಗಳು',

    home: 'ಮುಖಪುಟ',
    videos: 'ವಿಡಿಯೋಗಳು',
    shorts: 'ಶಾರ್ಟ್ಸ್',
    books: 'ಪುಸ್ತಕಗಳು',
    blog: 'ಬ್ಲಾಗ್',
    gallery: 'ಗ್ಯಾಲರಿ',
    about: 'ನಮ್ಮ ಬಗ್ಗೆ',
    contact: 'ಸಂಪರ್ಕಿಸಿ',
    callNow: 'ಕರೆ ಮಾಡಿ',
    bookConsultation: 'ಸಮಾಲೋಚನೆ ಕಾಯ್ದಿರಿಸಿ',
    whatsappChat: 'ವಾಟ್ಸಾಪ್ ಚಾಟ್',
    directCall: 'ನೇರ ಕರೆ',
    scrollTop: 'ಮೇಲಕ್ಕೆ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ',
    directLine: 'ನೇರ ಲೈನ್',
    emailAddress: 'ಇಮೇಲ್ ವಿಳಾಸ',
    headquarters: 'ಪ್ರಧಾನ ಕಛೇರಿ',
    consultationHours: 'ಸಮಾಲೋಚನೆಯ ಸಮಯ',
    sendViaWhatsApp: 'ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಕಳುಹಿಸಿ',
    fullName: 'ಪೂರ್ಣ ಹೆಸರು',
    phoneNumber: 'ಫೋನ್ ಸಂಖ್ಯೆ',
    consultationType: 'ಸಮಾಲೋಚನೆಯ ಪ್ರಕಾರ',
    additionalDetails: 'ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ',
    sending: 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
    messageSent: 'ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ!',
    redirectedToWhatsApp: 'ವಾಟ್ಸಾಪ್‌ಗೆ ಮರುನಿರ್ದೇಶಿಸಲಾಗಿದೆ ಮತ್ತು ನಿರ್ವಾಹಕರಿಗೆ ಲಾಗ್ ಮಾಡಲಾಗಿದೆ.',
    clientMessageMeta: 'ಕ್ಲೈಂಟ್ ವಾಟ್ಸಾಪ್ ಮೂಲಕ ತಲುಪಿದ್ದಾರೆ · ನಿರ್ವಾಹಕರಿಗೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ತಿಳಿಸಲಾಗುವುದು',
    nepalAward: 'ನೇಪಾಳ ಸದ್ಭಾವನಾ ಪ್ರಶಸ್ತಿ ಪುರಸ್ಕೃತರು',
    youtubeChannel: 'ಯೂಟ್ಯೂಬ್ ಚಾನೆಲ್',
    watchFreeLessons: 'ಉಚಿತ ವಾಸ್ತು ಪಾಠಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    directAccess: 'ನೇರ ಪ್ರವೇಶ',
    connectWithMaster: 'ಮಾಸ್ಟರ್ ಅವರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ',
    transformSpace: "ನಿಮ್ಮ ವಾಸದ ಅಥವಾ ಕೆಲಸದ ಸ್ಥಳವನ್ನು ಬ್ರಹ್ಮಾಂಡದ ಸಮೃದ್ಧಿಯ ಆಯಸ್ಕಾಂತವಾಗಿ ಬದಲಾಯಿಸಿ. ತಜ್ಞರ ಸಮಾಲೋಚನೆಗಾಗಿ ಡಾ. ಕುಂಚಾಲ ಹನುಮಂತರಾವ್ ಅವರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
  },
  ml: {

    digitalLibrary: 'ഡിജിറ്റൽ ലൈബ്രറി',

    digitalLibrarySub: 'വാസ്തു ശാസ്ത്രത്തിന്റെ പുരാതന ശാസ്ത്രത്തിൽ മുഴുകുക. നിങ്ങളുടെ വീടും ജോലിസ്ഥലവും അഭിവൃദ്ധിക്കായി വിന്യസിക്കാൻ സഹായിക്കുന്നതിന് ഞങ്ങളുടെ വിദഗ്ദ്ധർ തയ്യാറാക്കിയ ഗൈഡുകൾ ഡൗൺലോഡ് ചെയ്യുക.',

    legacyOfExcellence: 'മികവിന്റെ പൈതൃകം',

    theSacredArchive: 'വിശുദ്ധ ആർക്കൈവ്',

    awardsCertificationsMilestones: 'അവാർഡുകൾ · സർട്ടിഫിക്കേഷനുകൾ · നാഴികക്കല്ലുകൾ',

    exploreJourney: 'യാത്ര പര്യവേക്ഷണം ചെയ്യുക',

    voiceOfVastuWisdom: 'വാസ്തു ജ്ഞാനത്തിന്റെ ശബ്ദം',

    speechesDesc1: 'ഡോ. റാവുവിന്റെ ശക്തമായ പ്രഭാഷണങ്ങൾ ഇന്ത്യയിലും അതിനപ്പുറവുമുള്ള പ്രേക്ഷകരെ പ്രബുദ്ധരാക്കി, പുരാതന വൈദിക വാസ്തുവിദ്യയും ആധുനിക ശാസ്ത്രീയ ധാരണയും തമ്മിലുള്ള വ്യത്യാസം ഇല്ലാതാക്കി.',

    speechesDesc2: 'അദ്ദേഹത്തിന്റെ ആകർഷകമായ പ്രഭാഷണങ്ങൾ സങ്കീർണ്ണമായ പ്രപഞ്ച ജ്യാമിതിയെ പ്രായോഗികവും പ്രവർത്തനക്ഷമവുമായ അറിവുകളാക്കി മാറ്റുന്നു, അത് വീടുകളെയും ജീവിതങ്ങളെയും മാറ്റുന്നു.',

    awardsHonors: 'അവാർഡുകളും ബഹുമതികളും',

    awardsHonorsSub: 'വാസ്തു ശാസ്ത്രത്തിലും സാങ്കേതികവിദ്യയിലുമുള്ള പതിറ്റാണ്ടുകളുടെ വൈദഗ്ധ്യത്തിനുള്ള അന്താരാഷ്ട്ര അംഗീകാരങ്ങൾ.',

    clientCertifications: 'ക്ലയന്റ് സർട്ടിഫിക്കേഷനുകൾ',

    clientCertificationsSub: 'ഇന്ത്യയിലുടനീളമുള്ള വീടുകൾക്കും ബിസിനസുകൾക്കും നൽകുന്ന ഔദ്യോഗിക വാസ്തു സർട്ടിഫിക്കറ്റുകൾ.',

    lecturesSpeeches: 'പ്രഭാഷണങ്ങളും പ്രസംഗങ്ങളും',

    home: 'ഹോം',
    videos: 'വീഡിയോകൾ',
    shorts: 'ഷോർട്ട്സ്',
    books: 'പുസ്തകങ്ങൾ',
    blog: 'ബ്ലോഗ്',
    gallery: 'ഗാലറി',
    about: 'ഞങ്ങളെക്കുറിച്ച്',
    contact: 'ബന്ധപ്പെടുക',
    callNow: 'വിളിക്കുക',
    bookConsultation: 'ബുക്ക് ചെയ്യുക',
    whatsappChat: 'വാട്സ്ആപ്പ് ചാറ്റ്',
    directCall: 'ഡയറക്ട് കോൾ',
    scrollTop: 'മുകളിലേക്ക് പോവുക',
    directLine: 'ഡയറക്ട് ലൈൻ',
    emailAddress: 'ഇമെയിൽ വിലാസം',
    headquarters: 'ആസ്ഥാനം',
    consultationHours: 'കൺസൾട്ടേഷൻ സമയം',
    sendViaWhatsApp: 'വാട്സ്ആപ്പ് വഴി അയക്കുക',
    fullName: 'മുഴുവൻ പേര്',
    phoneNumber: 'ഫോൺ നമ്പർ',
    consultationType: 'കൺസൾട്ടേഷൻ തരം',
    additionalDetails: 'കൂടുതൽ വിവരങ്ങൾ',
    sending: 'അയച്ചുകൊണ്ടിരിക്കുന്നു...',
    messageSent: 'സന്ദേശം അയച്ചു!',
    redirectedToWhatsApp: 'വാട്സ്ആപ്പിലേക്ക് റീഡയറക്ട് ചെയ്തു, അഡ്മിന് വിവരങ്ങൾ കൈമാറി.',
    clientMessageMeta: 'ക്ലയന്റ് വാട്സ്ആപ്പ് വഴി ബന്ധപ്പെട്ടു · അഡ്മിനെ സ്വയമേവ അറിയിക്കും',
    nepalAward: 'നേപ്പാൾ സദ്ഭാവനാ അവാർഡ് ജേതാവ്',
    youtubeChannel: 'യൂട്യൂബ് ചാനൽ',
    watchFreeLessons: 'സൗജന്യ വാസ്തു ക്ലാസുകൾ കാണുക',
    directAccess: 'നേരിട്ടുള്ള പ്രവേശനം',
    connectWithMaster: 'ഗുരുവുമായി ബന്ധപ്പെടുക',
    transformSpace: "നിങ്ങളുടെ വീടോ ജോലിസ്ഥലമോ പ്രപഞ്ച സമൃദ്ധിയുടെ കേന്ദ്രമാക്കി മാറ്റുക. വിദഗ്ദ്ധ കൺസൾട്ടേഷനായി ഡോ. കുഞ്ചാല ഹനുമന്ത റാവുവിനെ ബന്ധപ്പെടുക.",
  },
  mr: {

    digitalLibrary: 'डिजिटल लायब्ररी',

    digitalLibrarySub: 'वास्तुशास्त्राच्या प्राचीन विज्ञानात स्वतःला मग्न करा. समृद्धीसाठी तुमचे घर आणि कामाची जागा संरेखित करण्यात मदत करण्यासाठी आमचे तज्ञ-क्यूरेट केलेले मार्गदर्शक डाउनलोड करा.',

    legacyOfExcellence: 'उत्कृष्टतेचा वारसा',

    theSacredArchive: 'पवित्र संग्रहण',

    awardsCertificationsMilestones: 'पुरस्कार · प्रमाणपत्रे · टप्पे',

    exploreJourney: 'प्रवास एक्सप्लोर करा',

    voiceOfVastuWisdom: 'वास्तु ज्ञानाचा आवाज',

    speechesDesc1: 'डॉ. राव यांच्या प्रभावी भाषणांनी भारत आणि परदेशातील प्रेक्षकांना प्रबुद्ध केले आहे, प्राचीन वैदिक वास्तुकला आणि आधुनिक वैज्ञानिक समज यातील अंतर कमी केले आहे.',

    speechesDesc2: 'त्यांचे मनमोहक व्याख्याने गुंतागुंतीच्या वैश्विक भूमितीला व्यावहारिक, कृतीयोग्य ज्ञानात बदलतात जे घरे आणि जीवन बदलतात.',

    awardsHonors: 'पुरस्कार आणि सन्मान',

    awardsHonorsSub: 'वास्तु विज्ञान आणि तंत्रज्ञानातील दशकांच्या कौशल्याची दखल घेणारे आंतरराष्ट्रीय सन्मान.',

    clientCertifications: 'ग्राहक प्रमाणपत्रे',

    clientCertificationsSub: 'भारतभरातील घरे आणि व्यवसायांना जारी केलेली अधिकृत वास्तु पालन प्रमाणपत्रे.',

    lecturesSpeeches: 'व्याख्याने आणि भाषणे',

    home: 'होम',
    videos: 'व्हिडीओ',
    shorts: 'शॉर्ट्स',
    books: 'पुस्तके',
    blog: 'ब्लॉग',
    gallery: 'गॅलरी',
    about: 'आमच्याबद्दल',
    contact: 'संपर्क साधा',
    callNow: 'कॉल करा',
    bookConsultation: 'सल्लामसलत बुक करा',
    whatsappChat: 'व्हाट्सएप चॅट',
    directCall: 'थेट कॉल',
    scrollTop: 'वर स्क्रोल करा',
    directLine: 'थेट संपर्क',
    emailAddress: 'ईमेल पत्ता',
    headquarters: 'मुख्यालय',
    consultationHours: 'सल्लामसलत वेळ',
    sendViaWhatsApp: 'व्हाट्सएप द्वारे पाठवा',
    fullName: 'पूर्ण नाव',
    phoneNumber: 'फोन नंबर',
    consultationType: 'सल्लामसलत प्रकार',
    additionalDetails: 'अतिरिक्त तपशील',
    sending: 'पाठवत आहे...',
    messageSent: 'संदेश पाठवला!',
    redirectedToWhatsApp: 'व्हाट्सएपवर रिडायरेक्ट केले आणि ॲडमिनला नोंदवले.',
    clientMessageMeta: 'ग्राहक व्हाट्सॲपद्वारे पोहोचले · ॲडमिनला स्वयंचलितपणे सूचित केले जाईल',
    nepalAward: 'नेपाळ सद्भावना पुरस्कार विजेते',
    youtubeChannel: 'यूट्यूब चॅनल',
    watchFreeLessons: 'मोफत वास्तु धडे पहा',
    directAccess: 'थेट प्रवेश',
    connectWithMaster: 'मास्टरशी संपर्क साधा',
    transformSpace: "तुमची राहण्याची किंवा कामाची जागा वैश्विक समृद्धीच्या चुंबकीय केंद्रात बदला. तज्ञ सल्ल्यासाठी डॉ. कुंचाला हनुमंत राव यांच्याशी संपर्क साधा.",
  },
  gu: {

    digitalLibrary: 'ડિજિટલ લાઇબ્રેરી',

    digitalLibrarySub: 'વાસ્તુશાસ્ત્રના પ્રાચીન વિજ્ઞાનમાં તમારી જાતને લીન કરો. સમૃદ્ધિ માટે તમારા ઘર અને કાર્યસ્થળને સંરેખિત કરવામાં મદદ કરવા માટે અમારા નિષ્ણાતો દ્વારા ક્યુરેટ કરાયેલ માર્ગદર્શિકાઓ ડાઉનલોડ કરો.',

    legacyOfExcellence: 'શ્રેષ્ઠતાનો વારસો',

    theSacredArchive: 'પવિત્ર આર્કાઇવ',

    awardsCertificationsMilestones: 'એવોર્ડ્સ · પ્રમાણપત્રો · સીમાચિહ્નો',

    exploreJourney: 'પ્રવાસનું અન્વેષણ કરો',

    voiceOfVastuWisdom: 'વાસ્તુ જ્ઞાનનો અવાજ',

    speechesDesc1: 'ડો. રાવના પ્રભાવશાળી સંબોધનોએ ભારત અને વિદેશમાં શ્રોતાઓને પ્રબુદ્ધ કર્યા છે, જે પ્રાચીન વૈદિક સ્થાપત્ય અને આધુનિક વૈજ્ઞાનિક સમજ વચ્ચેની કડી સમાન છે.',

    speechesDesc2: 'તેમના મનમોહક વ્યાખ્યાનો જટિલ બ્રહ્માંડીય ભૂમિતિને વ્યવહારુ, ઉપયોગી જ્ઞાનમાં પરિવર્તિત કરે છે જે ઘરો અને જીવનને બદલી નાખે છે.',

    awardsHonors: 'એવોર્ડ્સ અને સન્માન',

    awardsHonorsSub: 'વાસ્તુ વિજ્ઞાન અને ટેકનોલોજીમાં દાયકાઓની નિપુણતાને માન્યતા આપતા આંતરરાષ્ટ્રીય સન્માન.',

    clientCertifications: 'ગ્રાહક પ્રમાણપત્રો',

    clientCertificationsSub: 'સમગ્ર ભારતમાં ઘરો અને વ્યવસાયોને જારી કરાયેલ સત્તાવાર વાસ્તુ પાલન પ્રમાણપત્રો.',

    lecturesSpeeches: 'વ્યાખ્યાનો અને ભાષણો',

    home: 'હોમ',
    videos: 'વીડિયો',
    shorts: 'શોર્ટ્સ',
    books: 'પુસ્તકો',
    blog: 'બ્લોગ',
    gallery: 'ગેલેરી',
    about: 'અમારા વિશે',
    contact: 'સંપર્ક કરો',
    callNow: 'કોલ કરો',
    bookConsultation: 'પરામર્શ બુક કરો',
    whatsappChat: 'વોટ્સએપ ચેટ',
    directCall: 'સીધો કોલ',
    scrollTop: 'ઉપર સ્ક્રોલ કરો',
    directLine: 'ડાયરેક્ટ લાઇન',
    emailAddress: 'ઇમેઇલ સરનામું',
    headquarters: 'મુખ્ય મથક',
    consultationHours: 'પરામર્શ સમય',
    sendViaWhatsApp: 'વોટ્સએપ દ્વારા મોકલો',
    fullName: 'પૂરું નામ',
    phoneNumber: 'ફોન નંબર',
    consultationType: 'પરામર્શ પ્રકાર',
    additionalDetails: 'વધારાની વિગતો',
    sending: 'મોકલી રહ્યું છે...',
    messageSent: 'સંદેશો મોકલાઈ ગયો!',
    redirectedToWhatsApp: 'વોટ્સએપ પર રીડાયરેક્ટ કરવામાં આવ્યું અને એડમિનને જાણ કરી.',
    clientMessageMeta: 'ક્લાયંટ વોટ્સએપ દ્વારા પહોંચ્યા · એડમિનને આપમેળે સૂચિત કરવામાં આવશે',
    nepalAward: 'નેપાળ સદ્ભાવના એવોર્ડ વિજેતા',
    youtubeChannel: 'યૂટ્યૂબ ચેનલ',
    watchFreeLessons: 'મફત વાસ્તુ પાઠ જુઓ',
    directAccess: 'સીધો પ્રવેશ',
    connectWithMaster: 'માસ્ટર સાથે જોડાઓ',
    transformSpace: "તમારી રહેવાની કે કામ કરવાની જગ્યાને વૈશ્વિક સમૃદ્ધિના ચુંબકીય કેન્દ્રમાં બદલો. નિષ્ણાત પરામર્શ માટે ડૉ. કુંચાલા હનુમંત રાવનો સંપર્ક કરો.",
  },
  bn: {

    digitalLibrary: 'ডিজিটাল লাইব্রেরি',

    digitalLibrarySub: 'বাস্তুশাস্ত্রের প্রাচীন বিজ্ঞানে নিজেকে নিমজ্জিত করুন। আপনার বাড়ি এবং কর্মক্ষেত্রকে সমৃদ্ধির জন্য সাজাতে সাহায্য করার জন্য আমাদের বিশেষজ্ঞদের তৈরি নির্দেশিকা ডাউনলোড করুন।',

    legacyOfExcellence: 'শ্রেষ্ঠত্বের উত্তরাধিকার',

    theSacredArchive: 'পবিত্র সংরক্ষণাগার',

    awardsCertificationsMilestones: 'পুরস্কার · সার্টিফিকেশন · মাইলফলক',

    exploreJourney: 'অভিযাত্রা অন্বেষণ করুন',

    voiceOfVastuWisdom: 'বাস্তু জ্ঞানের কণ্ঠস্বর',

    speechesDesc1: 'ডঃ রাও-এর শক্তিশালী বক্তব্য ভারত ও বিদেশের শ্রোতাদের অনুপ্রাণিত করেছে, প্রাচীন বৈদিক স্থাপত্য এবং আধুনিক বৈজ্ঞানিক বোঝাপড়ার মধ্যে সেতু তৈরি করেছে।',

    speechesDesc2: 'তাঁর চিত্তাকর্ষক বক্তৃতাগুলি জটিল মহাজাগতিক জ্যামিতিকে ব্যবহারিক এবং কার্যকরী জ্ঞানে রূপান্তর করে যা ঘরবাড়ি ও জীবনকে বদলে দেয়।',

    awardsHonors: 'পুরস্কার ও সম্মান',

    awardsHonorsSub: 'বাস্তু বিজ্ঞান ও প্রযুক্তিতে কয়েক দশকের দক্ষতা অর্জনের আন্তর্জাতিক স্বীকৃতি।',

    clientCertifications: 'ক্লায়েন্ট সার্টিফিকেশন',

    clientCertificationsSub: 'সারা দেশে বাড়ি এবং ব্যবসার জন্য জারি করা অফিসিয়াল বাস্তু সম্মতি সার্টিফিকেট।',

    lecturesSpeeches: 'বক্তৃতা ও ভাষণ',

    home: 'হোম',
    videos: 'ভিডিও',
    shorts: 'শর্টস',
    books: 'বইপত্র',
    blog: 'ব্লগ',
    gallery: 'গ্যালারি',
    about: 'আমাদের সম্পর্কে',
    contact: 'যোগাযোগ',
    callNow: 'কল করুন',
    bookConsultation: 'পরামর্শ বুক করুন',
    whatsappChat: 'হোয়াটসঅ্যাপ চ্যাট',
    directCall: 'সরাসরি কল',
    scrollTop: 'উপরে যান',
    directLine: 'সরাসরি লাইন',
    emailAddress: 'ইমেল ঠিকানা',
    headquarters: 'প্রধান কার্যালয়',
    consultationHours: 'পরামর্শের সময়',
    sendViaWhatsApp: 'হোয়াটসঅ্যাপে পাঠান',
    fullName: 'সম্পূর্ণ নাম',
    phoneNumber: 'ফোন নম্বর',
    consultationType: 'পরামর্শের ধরন',
    additionalDetails: 'অতিরিক্ত বিবরণ',
    sending: 'পাঠানো হচ্ছে...',
    messageSent: 'বার্তা পাঠানো হয়েছে!',
    redirectedToWhatsApp: 'হোয়াটসঅ্যাপে রিডাইরেক্ট করা হয়েছে ও অ্যাডমিনকে জানানো হয়েছে।',
    clientMessageMeta: 'ক্লায়েন্ট হোয়াটসঅ্যাপের মাধ্যমে যোগাযোগ করেছেন · অ্যাডমিনকে স্বয়ংক্রিয়ভাবে জানানো হবে',
    nepalAward: 'নেপাল সদ্ভাবনা পুরস্কার প্রাপ্ত',
    youtubeChannel: 'ইউটিউব চ্যানেল',
    watchFreeLessons: 'বিনামূল্যে বাস্তু পাঠ দেখুন',
    directAccess: 'সরাসরি প্রবেশাধিকার',
    connectWithMaster: 'মাস্টারের সাথে যোগাযোগ করুন',
    transformSpace: "আপনার বাসস্থান বা কর্মক্ষেত্রকে মহাজাগতিক সমৃদ্ধির চুম্বকে পরিণত করুন। বিশেষজ্ঞের পরামর্শের জন্য ডঃ কুঞ্চালা হনুমন্ত রাও-এর সাথে যোগাযোগ করুন।",
  },
  pa: {

    digitalLibrary: 'ਡਿਜੀਟਲ ਲਾਇਬ੍ਰੇਰੀ',

    digitalLibrarySub: 'ਵਾਸਤੂ ਸ਼ਾਸਤਰ ਦੇ ਪ੍ਰਾਚੀਨ ਵਿਗਿਆਨ ਵਿੱਚ ਆਪਣੇ ਆਪ ਨੂੰ ਲੀਨ ਕਰੋ। ਖੁਸ਼ਹਾਲੀ ਲਈ ਆਪਣੇ ਘਰ ਅਤੇ ਕੰਮ ਵਾਲੀ ਥਾਂ ਨੂੰ ਇਕਸਾਰ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਨ ਲਈ ਸਾਡੇ ਮਾਹਰਾਂ ਦੁਆਰਾ ਤਿਆਰ ਕੀਤੇ ਮਾਰਗਦਰਸ਼ਕ ਡਾਊਨਲੋਡ ਕਰੋ।',

    legacyOfExcellence: 'ਸ਼ਾਨਦਾਰ ਵਿਰਾਸਤ',

    theSacredArchive: 'ਪਵਿੱਤਰ ਪੁਰਾਲੇਖ',

    awardsCertificationsMilestones: 'ਅਵਾਰਡ · ਸਰਟੀਫਿਕੇਟ · ਮੀਲ ਪੱਥਰ',

    exploreJourney: 'ਸਫ਼ਰ ਦੀ ਪੜਚੋਲ ਕਰੋ',

    voiceOfVastuWisdom: 'ਵਾਸਤੂ ਗਿਆਨ ਦੀ ਆਵਾਜ਼',

    speechesDesc1: 'ਡਾ. ਰਾਓ ਦੇ ਸ਼ਕਤੀਸ਼ਾਲੀ ਸੰਬੋਧਨਾਂ ਨੇ ਭਾਰਤ ਅਤੇ ਇਸ ਤੋਂ ਬਾਹਰ ਦੇ ਸਰੋਤਿਆਂ ਨੂੰ ਪ੍ਰਬੁੱਧ ਕੀਤਾ ਹੈ, ਪ੍ਰਾਚೀನ ਵੈਦਿਕ ਆਰਕੀਟੈਕਚਰ ਅਤੇ ਆਧੁਨिक ਵਿਗਿਆਨਕ ਸਮਝ ਦੇ ਵਿਚਕਾਰ ਪਾੜੇ ਨੂੰ ਪੂਰਿਆ ਹੈ।',

    speechesDesc2: 'ਉਨ੍ਹਾਂ ਦੇ ਦਿਲਚਸਪ ਲੈਕਚਰ ਗੁੰਝਲਦਾਰ ਬ੍ਰਹਿਮੰਡੀ ਜਿਓਮੈਟਰੀ ਨੂੰ ਵਿਹਾਰਕ, ਕਾਰਜਸ਼ੀਲ ਗਿਆਨ ਵਿੱਚ ਬਦਲਦੇ ਹਨ ਜੋ ਘਰਾਂ ਅਤੇ ਜੀਵਨ ਨੂੰ ਬਦਲਦਾ ਹੈ।',

    awardsHonors: 'ਅਵਾਰਡ ਅਤੇ ਸਨਮਾਨ',

    awardsHonorsSub: 'ਵਾਸਤੂ ਵਿਗਿਆਨ ਅਤੇ ਤਕਨਾਲੋਜੀ ਵਿੱਚ ਦਹਾਕਿਆਂ ਦੀ ਮੁਹਾਰਤ ਨੂੰ ਮਾਨਤਾ ਦੇਣ ਵਾਲੇ ਅੰਤਰਰਾਸ਼ਟਰੀ ਸਨਮਾਨ।',

    clientCertifications: 'ਕਲਾਇੰਟ ਸਰਟੀਫਿਕੇਟ',

    clientCertificationsSub: 'ਪੂਰੇ ਭਾਰਤ ਵਿੱਚ ਘਰਾਂ ਅਤੇ ਕਾਰੋਬਾਰਾਂ ਨੂੰ ਜਾਰੀ ਕੀਤੇ ਅਧਿਕਾਰਤ ਵਾਸਤੂ ਪਾਲਣਾ ਸਰਟੀਫਿਕੇਟ।',

    lecturesSpeeches: 'ਲੈਕਚਰ ਅਤੇ ਭਾਸ਼ਣ',

    home: 'ਹੋਮ',
    videos: 'ਵੀਡੀਓ',
    shorts: 'ਸ਼ਾਰਟਸ',
    books: 'ਕਿਤਾਬਾਂ',
    blog: 'ਬਲੌਗ',
    gallery: 'ਗੈਲਰੀ',
    about: 'ਸਾਡੇ ਬਾਰੇ',
    contact: 'ਸੰਪਰਕ ਕਰੋ',
    callNow: 'ਹੁਣੇ ਕਾਲ ਕਰੋ',
    bookConsultation: 'ਸਲਾਹ ਬੁੱਕ ਕਰੋ',
    whatsappChat: 'ਵ੍ਹਟਸਐਪ ਚੈਟ',
    directCall: 'ਸਿੱਧੀ ਕਾਲ',
    scrollTop: 'ਉੱਪਰ ਸਕ੍ਰੌਲ ਕਰੋ',
    directLine: 'ਸਿੱਧੀ ਲਾਈਨ',
    emailAddress: 'ਈਮੇਲ ਪਤਾ',
    headquarters: 'ਮੁੱਖ ਦਫਤਰ',
    consultationHours: 'ਸਲਾਹ ਦੇ ਘੰਟੇ',
    sendViaWhatsApp: 'ਵ੍ਹਟਸਐਪ ਰਾਹੀਂ ਭੇਜੋ',
    fullName: 'ਪੂਰਾ ਨਾਮ',
    phoneNumber: 'ਫ਼ੋਨ ਨੰਬਰ',
    consultationType: 'ਸਲਾਹ ਦੀ ਕਿਸਮ',
    additionalDetails: 'ਹੋਰ ਵੇਰਵੇ',
    sending: 'ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ...',
    messageSent: 'ਸੁਨੇਹਾ ਭੇਜਿਆ ਗਿਆ!',
    redirectedToWhatsApp: 'ਵ੍ਹਟਸਐਪ ਤੇ ਰੀਡਾਇਰੈਕਟ ਕੀਤਾ ਗਿਆ ਅਤੇ ਐਡਮਿਨ ਨੂੰ ਸੂਚਿਤ ਕੀਤਾ ਗਿਆ।',
    clientMessageMeta: 'ਕਲਾਇੰਟ ਵ੍ਹਟਸਐਪ ਰਾਹੀਂ ਪਹੁੰਚਿਆ · ਐਡਮਿਨ ਨੂੰ ਆਪਣੇ ਆਪ ਸੂਚਿਤ ਕੀਤਾ ਜਾਵੇਗਾ',
    nepalAward: 'ਨੇਪਾਲ ਸਦਭਾਵਨਾ ਅਵਾਰਡ ਵਿਜੇਤਾ',
    youtubeChannel: 'ਯੂਟਿਊਬ ਚੈਨਲ',
    watchFreeLessons: 'ਮੁਫਤ ਵਾਸਤੂ ਸਬਕ ਦੇਖੋ',
    directAccess: 'ਸਿੱਧੀ ਪਹੁੰਚ',
    connectWithMaster: 'ਮਾਸਟਰ ਨਾਲ ਜੁੜੋ',
    transformSpace: "ਆਪਣੇ ਰਹਿਣ ਜਾਂ ਕੰਮ ਕਰਨ ਵਾਲੀ ਥਾਂ ਨੂੰ ਬ੍ਰਹਿਮੰਡੀ ਖੁਸ਼ਹਾਲੀ ਦੇ ਚੁੰਬਕ ਵਿੱਚ ਬਦਲੋ। ਮਾਹਰ ਸਲਾਹ ਲਈ ਡਾ. ਕੁੰਚਾਲਾ ਹਨੁਮੰਤ ਰਾਓ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
  },
  ur: {

    digitalLibrary: 'ڈیجیٹل لائبریری',

    digitalLibrarySub: 'واستو شاستر کے قدیم علم میں اپنے آپ کو غرق کریں۔ خوشحالی کے لیے اپنے گھر اور کام کی جگہ کو ترتیب دینے میں مدد کے لیے ہمارے ماہرین کے تیار کردہ گائڈز ڈاؤن لوڈ کریں۔',

    legacyOfExcellence: 'امتیاز کی میراث',

    theSacredArchive: 'مقدس آرکائیو',

    awardsCertificationsMilestones: 'ایوارڈز · سرٹیفکیٹس · سنگ میل',

    exploreJourney: 'سفر دریافت کریں',

    voiceOfVastuWisdom: 'واستو دانش کی آواز',

    speechesDesc1: 'ڈاکٹر راؤ کے طاقتور خطابات نے ہندوستان اور اس سے باہر کے سامعین کو روشناس کرایا ہے، قدیم ویدک فن تعمیر اور جدید سائنسی فہم کے درمیان خلیج کو پاٹا ہے۔',

    speechesDesc2: 'ان کے دلکش لیکچر پیچیدہ کائناتی جیومیٹری کو عملی اور قابل عمل علم میں بدل دیتے ہیں جو گھروں اور زندگیوں کو بدل دیتا ہے۔',

    awardsHonors: 'ایوارڈز اور اعزازات',

    awardsHonorsSub: 'واستو سائنس اور ٹیکنالوجی میں دہائیوں کی مہارت کو تسلیم کرنے والے بین الاقوامی اعزازات۔',

    clientCertifications: 'کلائنٹ سرٹیفکیٹس',

    clientCertificationsSub: 'پورے ہندوستان میں گھروں اور کاروباروں کو جاری کیے گئے واستو کے مطابق ہونے کے سرٹیفکیٹ۔',

    lecturesSpeeches: 'لیکچرز اور تقاریر',

    home: 'ہوم',
    videos: 'ویڈیوز',
    shorts: 'شارٹس',
    books: 'کتابیں',
    blog: 'بلاگ',
    gallery: 'گیلری',
    about: 'ہمارے بارے میں',
    contact: 'رابطہ کریں',
    callNow: 'ابھی کال کریں',
    bookConsultation: 'مشورہ بک کریں',
    whatsappChat: 'واٹس ایپ چیٹ',
    directCall: 'براہ راست کال',
    scrollTop: 'اوپر جائیں',
    directLine: 'براہ راست لائن',
    emailAddress: 'ای میل ایڈریس',
    headquarters: 'ہیڈ کوارٹر',
    consultationHours: 'مشورے کے اوقات',
    sendViaWhatsApp: 'واٹس ایپ کے ذریعے بھیجیں',
    fullName: 'پورا نام',
    phoneNumber: 'فون نمبر',
    consultationType: 'مشورے کی قسم',
    additionalDetails: 'مزید تفصیلات',
    sending: 'بھیجا جا رہا ہے...',
    messageSent: 'پیغام بھیج دیا گیا!',
    redirectedToWhatsApp: 'واٹس ایپ پر بھیج دیا گیا اور ایڈمن کو مطلع کر دیا گیا۔',
    clientMessageMeta: 'کلائنٹ واٹس ایپ کے ذریعے پہنچا · ایڈمن کو خود بخود مطلع کر دیا جائے گا',
    nepalAward: 'نیپال سدبھاونا ایوارڈ یافتہ',
    youtubeChannel: 'یوٹیوب چینل',
    watchFreeLessons: 'مفت واستو اسباق دیکھیں',
    directAccess: 'براہ راست رسائی',
    connectWithMaster: 'ماسٹر سے رابطہ کریں',
    transformSpace: "اپنے رہنے یا کام کی جگہ کو کائناتی خوشحالی کے مقناطیس میں تبدیل کریں۔ ماہرانہ مشورے کے لیے ڈاکٹر کنچالا ہنومنت راؤ سے رابطہ کریں۔",
  },
  or: {

    digitalLibrary: 'ଡିଜିଟାଲ୍ ଲାଇବ୍ରେରୀ',

    digitalLibrarySub: 'ବାସ୍ତୁ ଶାସ୍ତ୍ରର ପ୍ରାଚୀନ ବିଜ୍ଞାନରେ ନିଜକୁ ନିମଜ୍ଜିତ କରନ୍ତୁ | ସମୃଦ୍ଧି ପାଇଁ ଆପଣଙ୍କ ଘର ଏବଂ କାର୍ଯ୍ୟକ୍ଷେତ୍ରକୁ ସଜାଡିବାରେ ସାହାଯ୍ୟ କରିବାକୁ ଆମ ବିଶେଷଜ୍ଞଙ୍କ ଦ୍ୱାରା ପ୍ରସ୍ତୁତ ଗାଇଡ୍ ଗୁଡିକ ଡାଉନଲୋଡ୍ କରନ୍ତୁ |',

    legacyOfExcellence: 'ଶ୍ରେଷ୍ଠତାର ସଂସ୍କୃତି',

    theSacredArchive: 'ପବିତ୍ର ଅଭିଲେଖାଗାର',

    awardsCertificationsMilestones: 'ପୁରସ୍କାର · ପ୍ରମାଣପତ୍ର · ମାଇଲଖୁଣ୍ଟ',

    exploreJourney: 'ଯାତ୍ରା ଅନୁସନ୍ଧାନ କରନ୍ତୁ',

    voiceOfVastuWisdom: 'ବାସ୍ତୁ ଜ୍ଞାନର ସ୍ୱର',

    speechesDesc1: 'ଡଃ ରାଓଙ୍କ ଶକ୍ତିଶାଳୀ ବକ୍ତବ୍ୟ ଭାରତ ଏବଂ ବିଦେଶର ଶ୍ରୋତାମାନଙ୍କୁ ପ୍ରେରିତ କରିଛି, ପ୍ରାଚୀନ ବୈଦିକ ସ୍ଥାପତ୍ୟ ଏବଂ ଆଧୁନିକ ବୈଜ୍ଞାନିକ ବୁଝାମଣା ମଧ୍ୟରେ ସେତୁ ସଦୃଶ ହୋଇଛି |',

    speechesDesc2: 'ତାଙ୍କର ମନୋମୁଗ୍ଧକର ବକ୍ତୃତାଗୁଡ଼ିକ ଜଟିଳ ବ୍ରହ୍ମାଣ୍ଡୀୟ ଜ୍ୟାମିତିକୁ ବ୍ୟବହାରିକ ଏବଂ କାର୍ଯ୍ୟକାରୀ ଜ୍ଞାନରେ ପରିଣତ କରେ ଯାହା ଘର ଏବଂ ଜୀବନକୁ ବଦଳାଇଥାଏ |',

    awardsHonors: 'ପୁରସ୍କାର ଏବଂ ସମ୍ମାନ',

    awardsHonorsSub: 'ବାସ୍ତୁ ବିଜ୍ଞାନ ଏବଂ ପ୍ରଯୁକ୍ତିବିଦ୍ୟାରେ ଦଶନ୍ଧିର ଦକ୍ଷତାକୁ ସ୍ୱୀକୃତି ଦେଇ ଆନ୍ତର୍ଜାତୀୟ ପ୍ରଶଂସା |',

    clientCertifications: 'ଗ୍ରାହକ ପ୍ରମାڻପତ୍ର',

    clientCertificationsSub: 'ସମଗ୍ର ଭାରତରେ ଘର ଏବଂ ବ୍ୟବସାୟ ପାଇଁ ଜାରି କରାଯାଇଥିବା ଆନୁଷ୍ଠାନିକ ବାସ୍ତୁ ପ୍ରମାଣପତ୍ର |',

    lecturesSpeeches: 'ବକ୍ତୃତା ଏବଂ ଭାଷଣ',

    home: 'ହୋମ୍',
    videos: 'ଭିଡିଓ',
    shorts: 'ସର୍ଟସ',
    books: 'ବହିପତ୍ର',
    blog: 'ବ୍ଲଗ୍',
    gallery: 'ଗ୍ୟାଲେରୀ',
    about: 'ଆମ ବିଷୟରେ',
    contact: 'ଯୋଗାଯୋଗ',
    callNow: 'କଲ୍ କରନ୍ତୁ',
    bookConsultation: 'ପରାମର୍ଶ ବୁକ୍ କରନ୍ତୁ',
    whatsappChat: 'ହ୍ୱାଟ୍ସଆପ୍ ଚାଟ୍',
    directCall: 'ସିଧାସଳଖ କଲ୍',
    scrollTop: 'ଉପରକୁ ଯାଆନ୍ତୁ',
    directLine: 'ସିଧାସଳଖ ଲାଇନ୍',
    emailAddress: 'ଇମେଲ୍ ଠିକଣା',
    headquarters: 'ମୁଖ୍ୟ କାର୍ଯ୍ୟାଳୟ',
    consultationHours: 'ପରାମର୍ଶ ସମୟ',
    sendViaWhatsApp: 'ହ୍ୱାଟ୍ସଆପ୍ ମାଧ୍ୟମରେ ପଠାନ୍ତୁ',
    fullName: 'ପୂରା ନାମ',
    phoneNumber: 'ଫୋନ୍ ନମ୍ବର',
    consultationType: 'ପରାମର୍ଶ ପ୍ରକାର',
    additionalDetails: 'ଅତିରିକ୍ତ ବିବରଣୀ',
    sending: 'ପଠାଯାଉଛି...',
    messageSent: 'ବାର୍ତ୍ତା ପଠାଗଲା!',
    redirectedToWhatsApp: 'ହ୍ୱାଟ୍ସଆପ୍ କୁ ପଠାଗଲା ଏବଂ ଆଡମିନ୍ ଙ୍କୁ ସୂଚିତ କରାଗଲା |',
    clientMessageMeta: 'କ୍ଲାଏଣ୍ଟ ହ୍ୱାଟ୍ସଆପ୍ ମାଧ୍ୟମରେ ଯୋଗାଯୋਗ କଲେ · ଆଡମିନ୍ ସ୍ୱୟଂଚାଳିତ ଭାବେ ସୂଚିତ ହେବେ',
    nepalAward: 'ନେପାଳ ସଦଭାବନା ପୁରସ୍କାର ପ୍ରାପ୍ତ',
    youtubeChannel: 'ୟୁଟ୍ୟୁବ୍ ଚ୍ୟାନେଲ୍',
    watchFreeLessons: 'ମାଗଣା ବାସ୍ତୁ ଶିକ୍ଷା ଦେଖନ୍ତୁ',
    directAccess: 'ସିଧାସଳଖ ପ୍ରବେଶ',
    connectWithMaster: 'ମାଷ୍ଟରଙ୍କ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ',
    transformSpace: "ଆପଣଙ୍କର ବାସସ୍ଥାନ ବା କାର୍ଯ୍ୟକ୍ଷେତ୍ରକୁ ମହାଜାଗତିକ ସମୃଦ୍ଧିର କେନ୍ଦ୍ରରେ ପରିଣତ କରନ୍ତୁ | ବିଶେଷଜ୍ଞ ପରାମર્ଶ ପାଇଁ ଡଃ କୁଞ୍ଚାଲା ହନୁମନ୍ତ ରାଓଙ୍କ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ |",
  },
};

export const useTranslation = () => {
  const { currentLanguage } = useLanguageStore();
  
  const t = (key: string): string => {
    const langDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
    return langDict[key] || TRANSLATIONS['en'][key] || key;
  };

  return { t, currentLanguage };
};
export default useTranslation;
