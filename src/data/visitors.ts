/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Visitor, NightConfig } from '../types';

export const VISITORS_DATABASE: Record<string, Visitor> = {
  // --- NIGHT 1 ---
  kang_paket: {
    id: 'kang_paket',
    name: 'Kang Paket (Kurir)',
    role: 'courier',
    isBegal: false,
    secretIdentity: 'Kang Jaka (Kurir Paket Shicepat)',
    visualClues: {
      feet: 'Memakai sandal jepit karet Swallow biru usang, kaki menapak tegak di lantai semen teras.',
      hands: 'Membawa kotak kardus paket berukuran sedang dengan label oranye berbungkus plastik.',
      shroud: 'Tampak seperti pocong, tapi ternyata hanya mengenakan jas hujan plastik poncho tipis berwarna putih transparan.',
      face: 'Wajah mengenakan helm motor hitam full-face, tampak berkeringat dan lelah melihat handphone-nya.'
    },
    audioClue: '"Permisi paket!! Paket atas nama Mas Asep! Tolong cepat dibuka ya mas, kejar setoran target malam!"',
    scentClue: 'Aroma kardus basah karena rintik gerimis, bau asap knalpot motor, dan sisa oli rantai.',
    gossipWarning: 'Informasi kurir paket malam Shicepat sedang mengantar tumpukan sisa promo 5.5.',
    dialogues: {
      intro: '"Paket! Permisi! Ada paket COD nih!"',
      respondToQuestion: '"Ini paket ekspedisi dari Jakarta mas, tagihan COD nya dua puluh ribu rupiah. Buruan ya mas dingin banget di luar!"',
      onOpenSuccess: 'Kamu menerima paket berisi senter baru dengan charger baterai! Daya tahan baterai bertambah +50%!',
      onOpenFail: 'Kang Paket bingung melihatmu panik.'
    }
  },

  begal_pocong_1: {
    id: 'begal_pocong_1',
    name: 'Begal Pocong (Kasno)',
    role: 'begal',
    isBegal: true,
    secretIdentity: 'Kasno (Begal Buronan Curanmor)',
    visualClues: {
      feet: 'Menyembul sepatu kets merah menyala merek "Adidos" dari balik buntelan bawah ikat kain kafannya!',
      hands: 'Tangannya bebas bergerak di belakang punggung, memegang tangkai celurit logam yang mengilap tajam terpantul cahaya senter.',
      shroud: 'Kain kafan putih terlalu bersih berpola rapi, tampak seperti sprei kasur hotel murah yang sengaja disobek.',
      face: 'Bagian wajah terbuka lebar. Mengenakan topeng plastik badut murahan dengan mata melotot menyeramkan.'
    },
    audioClue: '"Punten mas... tolong saya... saya warga RT 5... motor saya dibegal di ujung jalan... tolong numpang telepon..." (Nadanya terdengar dibuat-buat bergetar menangis)',
    scentClue: 'Bau menyengat dari parfum isi ulang rasa stroberi manis murahan untuk menyamarkan bau keringat.',
    gossipWarning: 'Awas! Grup WA mendeteksi begal pocong pertama memakai sepatu olahraga merah hasil curian.',
    dialogues: {
      intro: '"Tolong... hiks... buka pintunya... saya korban begal..."',
      respondToQuestion: '"Saya Kasno mas, tinggal dekat jembatan gantung. Tolong buka mas, darah paha saya mengalir deras nih dikejar begal!"',
      onOpenSuccess: 'Pintu terbuka! Kasno seketika menyeringai lebar, mengeluarkan celurit besar dan menebas dadamu! Kamu tewas konyol karena iba salah sasaran.',
      onOpenFail: 'Begal pocong mendesis kesal, mengacungkan celurit ke jendela lalu melompat kabur ke kegelapan!'
    }
  },

  // --- NIGHT 2 ---
  mbah_darmo: {
    id: 'mbah_darmo',
    name: 'Mbah Darmo (Tetangga Sepuh)',
    role: 'neighbor',
    isBegal: false,
    secretIdentity: 'Mbah Darmo (Pensiunan guru PNS)',
    visualClues: {
      feet: 'Kaki keriput lansia yang telanjang tanpa alas kaki, kuku-kukunya berpasir basah seolah habis berjalan jauh.',
      hands: 'Tangan kirinya yang gemetaran memegang mangkuk keramik kecil, sementara tangan kanan berpegangan erat pada tongkat bambu usang.',
      shroud: 'Bukan kain kafan, melainkan selimut sarung tenun motif kotak-kotak hijau-hitam lusuh yang didekapkan ke leher karena kedinginan.',
      face: 'Wajah sangat keriput, pandangan mata sayu dan lamur, memakai peci rajut yang sudah kecokelatan berdebu.'
    },
    audioClue: '"Nuuun sewu le... ini Mbah Darmo... boleh minta air hangat sedikit untuk minum obat asam urat? Mbah kedinginan sekali, istri mbah sedang menginap di rumah anak..."',
    scentClue: 'Menyebarkan bau minyak angin kayu putih cap Kampak kuat dicampur balsem gosok.',
    gossipWarning: 'Mbah Darmo dilaporkan sering berjalan malam keliling mencari air hangat karena pikun kumat.',
    dialogues: {
      intro: '"Nuun sewu... ketuk ketuk..." (Suara knocking sangat pelan dan lambat)',
      respondToQuestion: '"Mbah Darmo le, rumah mbah di pojok dekat pohon beringin. Tolong ya le, dada mbah rasanya sesak ditiup angin badai."',
      onOpenSuccess: 'Kamu menyeduhkan air hangat hangat kuku. Mbah Darmo tersenyum tulus mendoakan keselamatanmu. Stress Level-mu menurun drastis sebesar -30%!',
      onOpenFail: 'Mbah Darmo perlahan berjalan pergi ke rumah tetangga lain dengan langkah gontai kecewa.'
    }
  },

  begal_pocong_2: {
    id: 'begal_pocong_2',
    name: 'Begal Pocong (Samin Gendut)',
    role: 'begal',
    isBegal: true,
    secretIdentity: 'Samin Gendut (Tukang Peras Sadis)',
    visualClues: {
      feet: 'Memakai sepatu bot karet kuning proyek berlumpur tebal yang menyembul kasar dari sobekan bawah kain.',
      hands: 'Meraba-raba gagang pintu dengan tangan kasar berbulu tebal, cincin batu akik giok besar tampak di jari manisnya.',
      shroud: 'Kain kafan dipasang asal-asalan, menyembul ujung kerah jaket kulit hitam tebal bercorak tengkorak dari sela leher.',
      face: 'Mata melotot beringas, separuh wajah dibungkus kaos kaki hitam bergaya ninja perampok.'
    },
    audioClue: '"Ronda malam mas!! Buka pintu! Ada pemeriksaan data warga pendatang baru dari pak RT! Cepat!" (Suara berat, nge-bass, ketus berwibawa palsu)',
    scentClue: 'Bau keringat kecut, asap rokok kretek filter tajam, dan alkohol murah pencuci luka.',
    gossipWarning: 'Laporan warga: Ada orang gemuk memakai sepatu bot proyek berlumpur keliling mendaku sebagai aparat siskamling.',
    dialogues: {
      intro: '"Ronda malam! Pemeriksaan kartu identitas!" (Knocking kasar sangat keras)',
      respondToQuestion: '"Jangan banyak tanya! Ini kewajiban kampung dari RT 04! Kalau menolak pintu saya dobrak sekarang juga!"',
      onOpenSuccess: 'Pintu terbuka! Samin langsung menerjang masuk, melilit lehermu dan menebas lehermu menggunakan celurit raksasa dari balik bajunya. Rumahmu habis dirampok!',
      onOpenFail: 'Samin meludah ke lantai teras, mengumpat kasar dengan sumpah serapah lalu berlari pergi.'
    }
  },

  // --- NIGHT 3 ---
  bu_rt: {
    id: 'bu_rt',
    name: 'Bu RT Astuti',
    role: 'neighbor',
    isBegal: false,
    secretIdentity: 'Bu RT Astuti (Ibu PKK galak)',
    visualClues: {
      feet: 'Memakai sandal karet syafari emak-emak berwarna pink muda mengkilap bergambar kelinci imut.',
      hands: 'Tangan kiri bertolak pinggang gagah, tangan kanan memegang wadah Tupperware hijau berisi donat gula sisa rapat PKK.',
      shroud: 'Mengenakan mukena putih katun berenda bunga mawar yang diikat kencang di kepala, tampak melambai ditiup angin malam bagai pocong sejati.',
      face: 'Wajah jutek cemberut mengenakan kacamata minus tebal, dengan beberapa rol rambut merah bergantungan di dahi.'
    },
    audioClue: '"Aseeep! Buka pintunya! Ini Bu RT! Suami saya nyuruh ngambil kentongan ronda kayu rajut yang kemarin kamu pinjam buat pajangan agustusan! Buruan ibu ngantuk!"',
    scentClue: 'Harum kue donat donat gula mentega segar, aroma deterjen pakaian molto floral.',
    gossipWarning: 'Bu RT sedang keliling menagih iuran keamanan bulanan yang nunggak dan alat kas ronda.',
    dialogues: {
      intro: '"Sep! Asep! Bangun kamu! Ibu tau kamu belum tidur!" (Ketukan khas pakai gantungan kunci besi berisik)',
      respondToQuestion: '"Ini Bu RT Tuti Astuti! Aduh ditanya-tanya lagi, cepetan dibuka, ini Donat rapot PKK ditaruh sini nanti dikerumuni semut!"',
      onOpenSuccess: 'Bu RT meletakkan donat lezat di mejamu dan mengambil kentongan. Donat memulihkan Stamina dan Mental! Stress Level -20%, Flashlight Battery +25%!',
      onOpenFail: 'Bu RT berteriak ngomel panjang lebar: "Awas kamu ya Asep! Besok iuran kebersihan tak naikkan dua kali lipat!"'
    }
  },

  begal_pocong_3: {
    id: 'begal_pocong_3',
    name: 'Begal Pocong (Jaka Bertato)',
    role: 'begal',
    isBegal: true,
    secretIdentity: 'Jaka Tato (Kriminal kelas teri bersenjata celurit)',
    visualClues: {
      feet: 'Memakai sandal gunung merek petualang yang bersih, berdiri dengan paha kokoh sejajar tegap.',
      hands: 'Lengan berbulu lebat penuh tato naga merah menyembul keluar dari simpul kain kafan, menggenggam celurit berkarat berpita merah.',
      shroud: 'Kain kafan penuh bercak noda kecokelatan abstrak (seperti noda kopi atau saos somay), kotor compang camping buatan.',
      face: 'Memakai kacamata hitam di tengah malam buta, menyeringai dengan gigi menguning di balik sobekan penutup muka.'
    },
    audioClue: '"Sep... Asep... pamanmu ini, Paman Joko dari desa seberang... paman dikejar anjing gila di jalan depan, tolong buka pintunya nak, paman gemetar ketakutan..."',
    scentClue: 'Bau menyengat bensin pertalite dari motor bebeknya yang diparkir lari di semak beringin.',
    gossipWarning: 'Hati-hati modus pura-pura mengaku sebagai paman dari luar kota yang kesasar dikejar anjing, ciri khasnya memakai kacamata hitam malam hari.',
    dialogues: {
      intro: '"Asep nak... buka nak... ini Paman Joko..."',
      respondToQuestion: '"Paman buru-buru Sep, anjing gilanya masih menggonggong di tikungan! Cepatlah nak dibuka pintunya!"',
      onOpenSuccess: 'Begitu engsel bergeser, Jaka Tato langsung tertawa setan, menyeretmu keluar dan menebaskan celurit maut berkali-kali ke tubuhmu!',
      onOpenFail: 'Jaka menggeram gusar: "Cih, bocah sialan, sudah pintar dia!" Ia menendang pot kembang hingga pecah lalu lari tunggang langgang.'
    }
  },

  // --- NIGHT 4 ---
  kang_ronda: {
    id: 'kang_ronda',
    name: 'Kang Ronda (Roni)',
    role: 'ronda',
    isBegal: false,
    secretIdentity: 'Roni (Sahabat karib pos kamling)',
    visualClues: {
      feet: 'Sandal jepit Swallow hijau andalan rakyat Indonesia, kaki berlumur lumpur sawah segar karena habis patroli melewati pematang.',
      hands: 'Membawa kantong plastik hitam besar mengepulkan asap wangi kacang rebus, serta kentongan kayu bambu di tangan kanan.',
      shroud: 'Membungkus rapat tubuhnya dengan selimut beludru tebal bergambar Doraemon biru cerah demi menangkal hawa dingin pegunungan.',
      face: 'Wajah bulat sumringah tersenyum lebar dengan kupluk abu-abu menutupi telinga. Tampak sangat ramah dan akrab.'
    },
    audioClue: '"Sep! Kumpul ronda yuk, mumpung sepi begal! Ini aku Roni. Aku bawa kacang godok hangat melimpah nih dari warung Bu Minah! Enak dimaem anget-anget!"',
    scentClue: 'Harum gurih manis kacang tanah rebus segar yang masih mengepul panas.',
    gossipWarning: 'Sahabatmu Roni berjanji mengantarkan stok logistik kacang rebus untuk siskamling.',
    dialogues: {
      intro: '"Sep! Asep! Ronda woy! Bobok mulu!" (Dipukul pelan memakai kentongan "thok thok thok")',
      respondToQuestion: '"Roni ganteng ini Sep! Teman kosmu dulu. Ayo buka, kacangnya keburu dingin, mubazir!"',
      onOpenSuccess: 'Roni masuk membawakan energi positif! Kamu makan kacang bersama. Memulihkan daya tahan! Flashlight Battery +40%, Stress Level di-reset menjadi 0%!',
      onOpenFail: 'Roni mendengus heran: "Wah turu beneran si Asep. Ya udah tak makan sendiri di pos ronda mumpung hangat."'
    }
  },

  begal_pocong_4: {
    id: 'begal_pocong_4',
    name: 'Begal Pocong (Dono Kedip)',
    role: 'begal',
    isBegal: true,
    secretIdentity: 'Dono Kedip (Pembunuh bayaran celurit begal)',
    visualClues: {
      feet: 'Kaki memakai gelang kaki rantai besi perak tebal, menggunakan selop kulit formal berwarna cokelat tua.',
      hands: 'Kedua tangan terikat rapi di depan dada mensimulasikan mayat asli, tapi jempolnya bebas memegang bilah sabit tajam (celurit) di dalam saku kerutan kafan.',
      shroud: 'Kain kafan penuh dengan tempelan stiker distrik kaos indie gantung yang belum dilepas di bagian punggung.',
      face: 'Mata kirinya berkedip-kedip liar (tikit kaku), memakai anting tindik magnet hitam di hidung bawah.'
    },
    audioClue: '"Nganu dek... ini tukang gali sumur langganan bapakmu... mau ngambil linggis bapakmu yang tertinggal di belakang gudang sore tadi..." (Gaya bicara gagap mencurigakan)',
    scentClue: 'Aroma tajam cat kayu pilox hitam (digunakan untuk mewarnai gagang celurit barunya) dan bau minyak rambut pomade melati.',
    gossipWarning: 'WASPADA! Begal bermata tikit/kedip sebelah berpura-pura menjadi tukang gali sumur mencari perkakas kerja bapak.',
    dialogues: {
      intro: '"Nganu dek... permisi..." (Ketukan tidak beraturan menggoyang engsel pintu)',
      respondToQuestion: '"Gali sumur dek, pak Dono. Yang benerin pompa air kemarin lho. Buruan dibuka ya dek, linggisnya mau dipakai buat gali kubur besok shubuh."',
      onOpenSuccess: 'Dono langsung mendobrak, menyabetkan celuritnya ke arah perutmu dengan gerakan sangat lincah! Kamu terkapar bersimbah darah.',
      onOpenFail: 'Dono mendengus kesal, merapikan simpul kain kafannya yang melar lalu mengendap-endap lewat kebun belakang.'
    }
  },

  // --- NIGHT 5 (Puncak Teror & Easter Eggs) ---
  pocong_asli: {
    id: 'pocong_asli',
    name: 'Misteri Pocong (Asli)',
    role: 'ghost',
    isBegal: false, // Wait, technically not a human begal, but opening the door to a REAL ghost is STILL a horror game over!
    secretIdentity: 'Arwah Gentayangan Korban Begal Celurit Masa Lalu',
    visualClues: {
      feet: 'Kaki melayang sekitar 30cm di atas teras ubin rumah, tidak menapak sama sekali dan TIDAK MEMILIKI BAYANGAN di bawah sinar senter.',
      hands: 'Kedua tangan terikat mati rapat di dalam lilitan kafan hitam usang lapuk berserat kuno.',
      shroud: 'Kain kafan basah, robek-robek parah berlumuran tanah kuburan cokelat pekat yang mengering berkabut tipis.',
      face: 'Wajah gosong hancur legam mengerikan, rongga mata gelap gulita tanpa bola mata, mengeluarkan tetesan cairan hitam kental berbau busuk.'
    },
    audioClue: '"Fsssshhhhh... kkeee-mmaaa-llliii-kkaannn... jjaann-tttuuunnggg-kkuuu..." (Suara desisan angin ghaib bergema mematikan di dalam kepalamu)',
    scentClue: 'Bau kapur barus yang menyengat ekstrem, bau tanah kubur basah pasca-hujan sela kubur, dan bau melati busuk.',
    gossipWarning: 'MITOS: Di malam puncak, arwah pocong gentayangan asli korban begal abad lalu akan mengetuk pintu mencari keadilan. JANGAN PERNAH Buka pintunya atau jiwamu direnggut!',
    dialogues: {
      intro: '"...Sssssshhh... hhh..." (Pintu tiba-tiba bergetar ditiup angin kencang tanpa suara ketukan tangan)',
      respondToQuestion: '"...Kkkkkaaaaffff-aaannnnnn... kkkkuuuuu dddiiiiimmm-aaaannnnaaaa..."',
      onOpenSuccess: 'Pintu terbuka! Sosok Pocong Asli melayang menerobos masuk dengan jeritan melengking tinggi! Wajah hancurnya menatap jiwamu hingga jantungmu copot seketika. Kamu mati ketakutan terikat arwah ghaib!',
      onOpenFail: 'Arwah pocong perlahan memudar menjadi asap hitam pekat, menyisakan butiran kapur barus wangi di atas keramik teras. Kamu berhasil menepis kutukan ghaib!'
    }
  }
};

export const NIGHTS_CONFIG: NightConfig[] = [
  {
    nightNumber: 1,
    title: "Malam Pertama: Ketukan Misterius",
    subtitle: "Dosis Awal Teror",
    description: "Desas-desus begal ber-cosplay pocong sedang mengincar rumah warga sekitar yang sendirian di malam hari. Selalu periksa detail kaki, tangan, pakaian, dan wangi mereka lewat lubang intip pintu!",
    whatsappClues: [
      "⚠️ PERINGATAN RT 04: Warga harap waspada teror begal cosplay pocong bawa celurit! Ciri begal pertama kabarnya pakai SEPATU KETS MERAH merek olahraga.",
      "📦 INFO KURIR: Paket promo kiriman malam masih berjalan aman, kurir memakai JAS HUJAN plastik putih transparan."
    ],
    visitorList: ['kang_paket', 'begal_pocong_1']
  },
  {
    nightNumber: 2,
    title: "Malam Kedua: Siskamling Palsu",
    subtitle: "Modus Operandi Baru",
    description: "Begal pocong kini mencoba menyamar sebagai petugas keamanan ronda atau siskamling untuk memeras korban. Selalu periksa kecocokan identitas mereka!",
    whatsappClues: [
      "⚠️ WA WARGA: Info dari ronda semalam, ada begal bertubuh besar menyamar jadi siskamling tandingan! Dia pakai SEPATU BOT KARET PROYEK berwarna kuning penuh lumpur.",
      "👴 INFO SOSIAL: Mbah Darmo pikunnya gemar kumat, suka keliling bawa TONGKAT BAMBU dan MANGKUK minta air hangat untuk asam urat dimalam hari."
    ],
    visitorList: ['mbah_darmo', 'begal_pocong_2']
  },
  {
    nightNumber: 3,
    title: "Malam Ketiga: Kerabat Bayangan",
    subtitle: "Kelabu di bawah Derai Hujan",
    description: "Hujan gerimis mempersempit pandangan. Para pelaku kriminal mulai memakai trik emosional seperti mengaku sebagai kerabat dekat yang kecopetan.",
    whatsappClues: [
      "⚠️ INFO WARNING: Begal pocong modus baru mengaku sebagai Paman Joko dari luar kota yang dikejar anjing gila! Ciri fisiknya pakai KACAMATA HITAM di malam badai dan lengannya BERTATO naga merah.",
      "👵 INFO WARGA: Bu RT Tuti Astuti sedang mencari donat sisa rapat PKK dan kentongan kayu suaminya yang belum dibalikin warga."
    ],
    visitorList: ['begal_pocong_3', 'bu_rt']
  },
  {
    nightNumber: 4,
    title: "Malam Keempat: Siasat Larut Malam",
    subtitle: "Ujian Logika",
    description: "Hampir subuh, suasana semakin tegang. Senter kamu mulai kehabisan baterai. Begal semakin agresif mengetuk pintu dengan alasan yang berbelit-belit.",
    whatsappClues: [
      "⚠️ WARNING GRUP: Begal bermata KEDIP-KEDIP SEBELAH mencoba memeras rumah berpura-pura menjadi TUKANG GALI SUMUR langganan bapak untuk pinjam linggis.",
      "🚨 RONDA AMAN: Roni sahabatmu malam ini dijadwalkan membawa KACANG REBUS hangat keliling pos ronda."
    ],
    visitorList: ['kang_ronda', 'begal_pocong_4']
  },
  {
    nightNumber: 5,
    title: "Malam Terakhir: Puncak Kegelapan",
    subtitle: "Kombinasi Teror Ghaib & Nyata",
    description: "Malam Jumat Kliwon. Bukan hanya begal bercelurit yang berkeliaran, tapi kabut ghaib memanggil entitas mengerikan yang sesungguhnya. Percayalah pada insting dan hidungmu (bau kapur barus)!",
    whatsappClues: [
      "👻 MITOS LOKAL: Jika tercium bau KAPUR BARUS pekat dicampur bunga MELATI BUSUK, dan bayangan di senter MELAYANG tak menapak tanah, JANGAN pernah buka pintu! Itu Pocong arwah asli korban begal masa lalu!",
      "📢 GRUP HARAPAN: Bertahanlah sampai jam 05:00 Pagi, adzan subuh akan menyelamatkanmu dari seluruh teror malam ini!"
    ],
    visitorList: ['begal_pocong_3', 'pocong_asli', 'begal_pocong_1', 'kang_paket']
  }
];
