// Shared manuscript for the PDF keepsake and the web edition.
// Editorial quotes are original synthesis, never attributed to a person.

export interface Photo {
  src: string;
  alt: string;
  focus?: string; // CSS object-position
}

export type Practical =
  | { kind: 'list'; label: string; numbered?: boolean; items: string[] }
  | { kind: 'swap'; label: string; pairs: { instead: string; try: string }[] }
  | { kind: 'pockets'; label: string; items: { title: string; text: string }[] }
  | { kind: 'prompt'; label: string; text: string };

export interface Article {
  id: string;
  runningHead: string;
  title: string;
  deck: string;
  paragraphs: string[];
  practical?: Practical;
  /** Insert the practical block after this many paragraphs (default: after all). */
  practicalAfter?: number;
  note?: { label: string; text: string };
}

export interface Chapter {
  id: string;
  number: string;
  label: string;
  title: string;
  theme: string;
  mapTitle: string;
  mapSummary: string;
  openerQuote: string;
  opener: Photo;
  articles: Article[];
  closingQuote: { text: string; tagline: string; body?: string; photo: Photo };
}

const photo = (name: string, alt: string, focus?: string): Photo => ({
  src: `assets/photos/${name}.jpg`,
  alt,
  focus,
});

export const book = {
  title: 'A Collection of Wisdom',
  subtitle: 'Little lessons on marriage, family, finances, and the beauty of growing together.',
  caption: 'Sebuah kumpulan pesan, refleksi, dan pembelajaran dari kebersamaan ibu-ibu Mayon.',
  coreMessage:
    'Kebijaksanaan bisa tumbuh dari obrolan sederhana: satu pengalaman menjadi pembelajaran, satu nasihat menjadi pengingat, dan kebersamaan membuatnya lebih bermakna.',
  coverPhoto: photo(
    'cover-tea-light',
    'Secangkir teh hangat dan bunga di atas buku terbuka, disinari cahaya pagi',
    '45% 50%',
  ),
  dedication: {
    lines: ['For the stories we share,', 'and the wisdom we carry.'],
    body: 'Untuk setiap cerita yang dibagikan dengan tulus, setiap pelajaran kecil yang kita temukan bersama, dan setiap langkah yang masih ingin kita tumbuhkan.',
  },
};

export const opening = {
  kicker: 'A Moment of Sharing',
  title: 'Every Story Holds a Little Wisdom.',
  photo: photo('sharing-cup-book', 'Tangan memegang secangkir kopi susu di samping buku terbuka', '50% 45%'),
  paragraphs: [
    'Dari setiap pertemuan, selalu ada cerita yang dapat kita bawa pulang. Lewat sesi berbagi bersama ibu-ibu Mayon, terkumpul beragam pengalaman, kesan, harapan, dan nasihat sederhana tentang kehidupan yang dijalani setiap hari.',
    'Ada pesan untuk terus menjaga kebersamaan, menghangatkan komunikasi dalam pernikahan, mengelola keuangan dengan lebih bijak, serta menemukan keseimbangan di antara keluarga, diri sendiri, dan tanggung jawab organisasi.',
    'Tidak semua pengalaman hadir sebagai jawaban yang sudah selesai. Ada pula cerita tentang hal-hal yang masih dipelajari. Justru di situlah nilainya: kita tidak harus memiliki hidup yang sempurna untuk dapat saling menguatkan.',
    'Buku kecil ini merangkumnya bersama sejumlah wawasan praktis pilihan, sebagai teman membaca, mengingat, dan bertumbuh.',
  ],
};

export const wisdomMap = {
  title: 'What We Learned Together',
  deck: 'Four themes, many little lessons.',
  center: 'Kebijaksanaan dalam Kebersamaan',
  centerWeb: 'Shared Wisdom',
  footnote:
    'Peta gagasan ini merangkum tema-tema yang muncul dalam sesi berbagi. Bukan hasil pengukuran statistik atau pemeringkatan pendapat.',
};

export const chapters: Chapter[] = [
  {
    id: 'growing-together',
    number: '01',
    label: 'The Community',
    title: 'Growing Together',
    theme: 'Kebersamaan',
    mapTitle: 'Bertumbuh Bersama',
    mapSummary: 'kompak, saling mendukung, kegiatan bermakna',
    openerQuote:
      'Kebersamaan yang baik tidak harus selalu ramai. Ia terasa ketika setiap orang memiliki tempat untuk didengar, diterima, dan saling menguatkan.',
    opener: photo(
      'window-flowers',
      'Dua pot bunga putih dan teko porselen di ambang jendela yang terang',
      '50% 60%',
    ),
    articles: [
      {
        id: 'beauty-of-belonging',
        runningHead: 'The Heart of Togetherness',
        title: 'The Beauty of Belonging',
        deck: 'Rasa akrab yang terus dirawat.',
        paragraphs: [
          'Dalam pesan-pesan yang terkumpul, Mayon dikenang sebagai ruang yang menyenangkan, hangat, dan penuh rasa kekeluargaan. Kehadiran, arahan, dan dukungan membuat kegiatan terasa lebih ringan dijalani.',
          'Harapannya pun sederhana: hubungan yang sudah baik terus dirawat, rasa persaudaraan makin erat, dan setiap anggota merasa nyaman untuk ikut hadir. Kekompakan bukan berarti semua orang harus selalu sama. Kekompakan tumbuh dari saling menghargai keadaan dan tetap menjaga hubungan baik.',
        ],
        note: {
          label: 'Little Reminder',
          text: 'Solid bukan berarti selalu bersama; solid berarti tetap saling menjaga, meskipun kesibukan setiap orang berbeda.',
        },
      },
      {
        id: 'small-gatherings',
        runningHead: 'Small Things That Bring Us Closer',
        title: 'Small Gatherings, Lasting Meaning',
        deck: 'Kegiatan yang mendekatkan, bukan memberatkan.',
        paragraphs: [
          'Kebersamaan terasa lebih menyenangkan ketika kegiatan memberi ruang untuk berkenalan, berbagi kabar, dan mendapatkan manfaat nyata. Beberapa harapan yang muncul antara lain pertemuan yang lebih akrab, arisan yang semakin meriah, senam bersama, dan pengajian rutin.',
          'Namun ada pesan yang tidak kalah penting: waktu bersama keluarga dan kesibukan masing-masing juga perlu dihargai. Kegiatan yang ideal bukan yang paling padat, melainkan yang paling bermakna dan memungkinkan banyak anggota ikut dengan nyaman.',
        ],
        practical: {
          kind: 'list',
          label: 'Little Notes · Ide untuk Dicoba',
          numbered: true,
          items: [
            'Pertemuan sederhana yang memberi ruang obrolan, bukan hanya agenda.',
            'Jadwal dan durasi kegiatan yang mempertimbangkan keluarga dan pekerjaan.',
            'Kegiatan bergantian: sehat bersama, belajar bersama, dan saling berbagi.',
            'Budaya menyambut anggota baru dan menghubungi teman yang lama tidak hadir.',
          ],
        },
      },
    ],
    closingQuote: {
      text: 'Yang membuat sebuah komunitas berarti bukan banyaknya acara, melainkan rasa diterima yang tetap tinggal setelah acara selesai.',
      tagline: 'Growing together, one thoughtful moment at a time.',
      photo: photo('babys-breath', 'Rangkaian bunga baby’s breath dalam gelas kaca', '40% 50%'),
    },
  },
  {
    id: 'art-of-growing-together',
    number: '02',
    label: 'The Partnership',
    title: 'The Art of Growing Together',
    theme: 'Pernikahan',
    mapTitle: 'Merawat Hubungan',
    mapSummary: 'komunikasi, kepercayaan, waktu berdua',
    openerQuote: 'Cinta yang bertahan adalah cinta yang terus bersedia belajar.',
    opener: photo('hands-together', 'Dua tangan saling menggenggam, foto hitam putih', '55% 50%'),
    articles: [
      {
        id: 'trust',
        runningHead: 'Trust',
        title: 'Bukan Selalu Sepakat, tetapi Saling Percaya',
        deck: 'Tentang kejujuran, rasa aman, dan menjadi diri sendiri.',
        paragraphs: [
          'Hubungan yang hangat tidak lahir dari dua orang yang selalu berpikir sama. Ia tumbuh ketika keduanya merasa aman untuk jujur, dihargai ketika berbeda, dan tetap diperlakukan dengan lembut saat sedang lelah.',
          'Dalam pernikahan, kepercayaan dibangun dari hal-hal yang konsisten: menepati janji kecil, berbicara terbuka, menjaga rahasia yang dipercayakan, serta mengakui kesalahan tanpa saling menjatuhkan. Menjadi pasangan juga berarti memberi ruang bagi satu sama lain untuk terus belajar dan berkembang.',
        ],
        note: {
          label: 'Little Reminder',
          text: 'Rumah yang menenangkan bukan rumah tanpa perbedaan, melainkan rumah tempat kita bisa menjadi diri sendiri tanpa takut tidak didengar.',
        },
      },
      {
        id: 'talk-gently',
        runningHead: 'Words That Build Bridges',
        title: 'Let Us Talk, Gently',
        deck: 'Ketika cara berbicara sama pentingnya dengan isi pesan.',
        paragraphs: [
          'Banyak persoalan rumah tangga membesar bukan semata karena topiknya, melainkan karena waktu dan cara menyampaikannya. Kalimat yang dimulai dengan menyalahkan sering membuat pasangan sibuk membela diri, sebelum sempat memahami perasaan di baliknya.',
          'Cobalah memilih momen yang tenang, menyampaikan perasaan secara spesifik, dan memberi ruang untuk respons pasangan. Kita tidak harus sepakat dalam satu percakapan; terkadang langkah pertama adalah benar-benar saling mengerti.',
        ],
        practical: {
          kind: 'swap',
          label: 'In Practice · Coba Ganti Kalimatnya',
          pairs: [
            {
              instead: 'Kamu tidak pernah punya waktu buat aku.',
              try: 'Aku kangen waktu kita ngobrol berdua. Kapan kita bisa luangkan waktu tanpa gangguan?',
            },
            {
              instead: 'Kamu selalu membuat aku kesal.',
              try: 'Aku sedang kecewa dengan yang terjadi. Aku ingin kita bicarakan pelan-pelan.',
            },
          ],
        },
      },
      {
        id: 'through-the-distance',
        runningHead: 'Through the Distance',
        title: 'When Duty Takes You Apart',
        deck: 'Tetap dekat, meski harus berjauhan.',
        paragraphs: [
          'Dalam keluarga prajurit, rencana kadang berubah karena tugas. Ada masa ketika kebersamaan harus berganti menjadi pesan singkat, sambungan telepon, atau kerinduan yang disimpan sampai kesempatan bertemu berikutnya.',
          'Jarak memang tidak selalu mudah. Namun kedekatan dapat dirawat melalui komunikasi yang jujur, kepercayaan, kesepakatan kecil, dan doa yang terus menyertai. Tidak setiap hari harus sempurna. Sesekali kabar sederhana, perhatian kecil, atau saling mendengarkan sudah sangat berarti.',
        ],
        practical: {
          kind: 'list',
          label: 'Little Notes · Tetap Terhubung',
          items: [
            'Sepakati cara berkabar yang realistis di tengah jadwal tugas.',
            'Jangan menyimpulkan yang terburuk hanya karena balasan terlambat.',
            'Sisihkan waktu untuk berbagi cerita, bukan hanya mengurus keperluan.',
            'Izinkan diri merindukan, lelah, dan mencari dukungan ketika dibutuhkan.',
          ],
        },
      },
      {
        id: 'ordinary-days',
        runningHead: 'The Everyday Marriage',
        title: 'Love in the Ordinary Days',
        deck: 'Merawat hubungan di tengah rutinitas.',
        paragraphs: [
          'Pernikahan adalah perjalanan panjang yang berubah bersama tahap kehidupan. Ada masa penuh waktu berdua, ada masa sibuk mengurus rumah, anak, pekerjaan, dan keluarga besar. Di tengah semua itu, hubungan pasangan tetap perlu dirawat dengan sengaja.',
          'Terkadang caranya tidak rumit: berjalan sebentar berdua, makan tanpa layar, bertanya kabar dengan sungguh-sungguh, atau meminta maaf lebih dulu. Berkompromi bukan menghapus kebutuhan diri sendiri, melainkan mencari jalan yang menghormati keduanya.',
        ],
        practical: {
          kind: 'list',
          label: 'Three Questions to Keep Close',
          numbered: true,
          items: [
            'Hari ini, apa yang paling kamu butuhkan dariku?',
            'Apa yang bisa kita bagi agar beban terasa lebih ringan?',
            'Kapan terakhir kali kita benar-benar mendengarkan satu sama lain?',
          ],
        },
      },
    ],
    closingQuote: {
      text: 'Komunikasi yang baik bukan tentang siapa yang menang, melainkan bagaimana keduanya tetap merasa didengar.',
      tagline: 'A little more listening. A little less assuming.',
      photo: photo('cup-window-distance', 'Cangkir di dekat jendela berkabut di atas buku terbuka', '50% 55%'),
    },
  },
  {
    id: 'life-of-enough',
    number: '03',
    label: 'The Foundation',
    title: 'Building a Life of Enough',
    theme: 'Keuangan',
    mapTitle: 'Menata Hari Esok',
    mapSummary: 'prioritas, tabungan, ketahanan keuangan',
    openerQuote:
      'Ketenangan finansial sering dimulai dari keputusan-keputusan kecil yang dilakukan dengan konsisten.',
    opener: photo('journal-hands', 'Tangan menulis di sampul jurnal di atas meja marmer', '50% 60%'),
    articles: [
      {
        id: 'enough-mindset',
        runningHead: 'The Enough Mindset',
        title: 'Enough Is a Beautiful Thing',
        deck: 'Belajar membedakan yang dibutuhkan dan yang diinginkan.',
        paragraphs: [
          'Mengatur keuangan bukan selalu tentang menahan semua kesenangan. Ini tentang mengenali prioritas agar kebutuhan hari ini terpenuhi, tanggung jawab tidak terabaikan, dan hari esok tetap punya ruang untuk dipersiapkan.',
          'Beberapa pesan yang terkumpul berulang kali menekankan hal yang sederhana: dahulukan kebutuhan pokok, sesuaikan gaya hidup dengan kondisi, dan jangan biarkan pengeluaran selalu lebih besar daripada penghasilan.',
          'Tentu kemampuan tiap keluarga berbeda. Ketika anggaran terasa sempit, solusinya tidak cukup dengan menyuruh diri sendiri lebih hemat. Mencari cara meningkatkan keterampilan atau penghasilan juga dapat menjadi bagian dari rencana yang sehat, bila memungkinkan.',
        ],
        note: {
          label: 'Little Reminder',
          text: 'Sejahtera bukan sekadar terlihat mampu, tetapi memiliki cukup ruang untuk merasa aman dan membuat pilihan dengan tenang.',
        },
      },
      {
        id: 'four-pockets',
        runningHead: 'Four Pockets',
        title: 'Four Little Pockets',
        deck: 'Satu cara sederhana membuat uang lebih mudah dipahami.',
        paragraphs: [
          'Alih-alih mengingat setiap pengeluaran di kepala, coba pisahkan dana segera setelah menerima penghasilan. Tidak harus membuka empat rekening sungguhan; empat pos dalam catatan atau fitur kantong digital juga bisa.',
        ],
        practical: {
          kind: 'pockets',
          label: 'Empat Pos Sederhana',
          items: [
            { title: 'Kebutuhan Tetap', text: 'Tagihan, sekolah anak, cicilan yang sudah ada, dan kewajiban rutin.' },
            { title: 'Kebutuhan Harian', text: 'Makanan, transportasi, belanja rumah, kebutuhan yang berubah-ubah.' },
            {
              title: 'Tabungan & Perlindungan',
              text: 'Dana darurat, tujuan menabung, perlindungan kesehatan, investasi sesuai kesiapan dan profil risiko.',
            },
            {
              title: 'Kebahagiaan Kecil',
              text: 'Rekreasi, jajan, hadiah, dan kegiatan bersama keluarga dalam batas aman.',
            },
          ],
        },
        note: {
          label: 'Takeaway',
          text: 'Bukan besar kecilnya pos yang harus sama pada setiap keluarga. Yang penting setiap rupiah punya tujuan dan alokasinya sesuai kemampuan.',
        },
      },
      {
        id: 'financial-check-in',
        runningHead: 'A Financial Check-in',
        title: 'A Gentle Financial Check-in',
        deck: 'Mulai dari melihat keadaan apa adanya.',
        practicalAfter: 1,
        paragraphs: [
          'Coba duduk bersama pasangan, lalu jawab tiga pertanyaan:',
          'Sebagai titik awal, beberapa perencana keuangan memakai pedoman cicilan total sekitar 30% penghasilan dan target menabung sekitar 10% atau lebih. Itu panduan umum, bukan kewajiban yang cocok untuk semua keluarga. Jika penghasilan sedang terbatas, fokuslah lebih dulu pada kebutuhan dasar, perlindungan kesehatan, dan langkah kecil yang konsisten.',
        ],
        practical: {
          kind: 'list',
          label: 'Tiga Pertanyaan',
          items: [
            'Berapa kebutuhan wajib keluarga dalam satu bulan?',
            'Apakah ada cicilan atau utang yang mulai memberatkan?',
            'Berapa yang realistis dapat disisihkan untuk dana darurat atau tabungan?',
          ],
        },
        note: {
          label: 'Wisdom Note',
          text: 'Anggaran yang baik bukan yang paling rapi di atas kertas, melainkan yang masih dapat dijalankan pada hari-hari biasa.',
        },
      },
      {
        id: 'rainy-day',
        runningHead: 'Rainy Day',
        title: 'For a Rainy Day',
        deck: 'Menyiapkan dana darurat, perlahan tetapi pasti.',
        paragraphs: [
          'Kita tidak dapat mengatur semua hal yang akan terjadi: tugas mendadak, kebutuhan kesehatan, pekerjaan yang berubah, atau pengeluaran keluarga yang tidak direncanakan. Dana darurat membantu kita menghadapi kejutan tanpa langsung bergantung pada pinjaman.',
          'Tentukan target berdasarkan pengeluaran wajib, jumlah tanggungan, dan kepastian penghasilan. Banyak perencana keuangan menyarankan sasaran beberapa bulan biaya hidup, lalu menyesuaikannya dengan situasi keluarga. Mulai dari jumlah yang mungkin—bahkan kecil—dan simpan di tempat yang aman serta mudah diakses saat benar-benar diperlukan.',
        ],
        practical: {
          kind: 'list',
          label: 'Little Plan',
          numbered: true,
          items: [
            'Hitung pengeluaran esensial sebulan.',
            'Tentukan target bertahap sesuai tanggungan.',
            'Sisihkan otomatis jika memungkinkan.',
            'Gunakan hanya untuk kebutuhan darurat, kemudian isi kembali.',
          ],
        },
      },
      {
        id: 'money-conversation',
        runningHead: 'Two People, One Conversation',
        title: 'Money Is Also a Conversation',
        deck: 'Keuangan keluarga membutuhkan kerja sama.',
        paragraphs: [
          'Pernikahan menyatukan banyak keputusan: kebutuhan rumah tangga, membantu orang tua, rencana anak, tempat tinggal, hingga mimpi masing-masing. Pengaturan rekening boleh berbeda antarkeluarga, tetapi keterbukaan dan kesepakatan perlu menjadi kebiasaan bersama.',
          'Luangkan waktu khusus untuk berbicara tentang uang saat suasana tenang. Bicarakan angka tanpa saling mempermalukan; bedakan kesalahan yang perlu diperbaiki dengan pribadi yang tetap harus dihormati. Jika kondisi sedang berat, saling mencari solusi lebih menolong daripada saling menyalahkan.',
        ],
        practical: {
          kind: 'prompt',
          label: 'Prompt untuk Obrolan Berdua',
          text: 'Apa satu prioritas finansial yang ingin kita jaga bersama bulan ini?',
        },
      },
    ],
    closingQuote: {
      text: 'Uang yang dikelola dengan bijak bukan hanya membantu kita membeli sesuatu, tetapi juga menjaga ketenangan saat hidup berubah arah.',
      tagline: 'A calmer tomorrow begins with a thoughtful today.',
      photo: photo('book-golden-flower', 'Bunga kuning di atas buku tua yang terbuka', '50% 50%'),
    },
  },
  {
    id: 'grace-strength-service',
    number: '04',
    label: 'The Journey',
    title: 'Grace, Strength & Service',
    theme: 'Kehidupan Persit',
    mapTitle: 'Menjalani Peran',
    mapSummary: 'ikhlas, seimbang, menjaga diri dan keluarga',
    openerQuote: 'Menjalani banyak peran tidak berarti harus kehilangan diri sendiri.',
    opener: photo('dried-flowers-olive', 'Ranting bunga kering berwarna krem dengan latar hijau zaitun', '50% 40%'),
    articles: [
      {
        id: 'with-grace',
        runningHead: 'The Meaning of Service',
        title: 'With Grace, Not Perfection',
        deck: 'Pengabdian yang bertumbuh dari ketulusan.',
        paragraphs: [
          'Menjadi bagian dari Persit menghadirkan kesempatan untuk bertemu, belajar, dan saling menguatkan. Di dalamnya ada tanggung jawab yang perlu dipahami, ada kebersamaan yang dijaga, dan ada keluarga serta kehidupan pribadi yang juga membutuhkan perhatian.',
          'Banyak pesan menekankan nilai ikhlas, menghormati sesama, menjalankan kewajiban, serta memahami hak dan batasan diri. Mengemban peran dengan baik bukan berarti harus selalu hadir tanpa lelah atau mampu mengerjakan semuanya. Justru dengan batas yang sehat dan saling pengertian, kontribusi bisa lebih berkelanjutan.',
        ],
        note: {
          label: 'Little Reminder',
          text: 'Menjadi berarti bukan soal selalu sempurna, melainkan terus hadir dengan niat baik dan tetap menghargai kemampuan diri.',
        },
      },
      {
        id: 'strength-gentle',
        runningHead: 'Strong and Supported',
        title: 'Strength Can Be Gentle',
        deck: 'Kuat, namun tetap boleh membutuhkan dukungan.',
        paragraphs: [
          'Sebagai pasangan prajurit, kadang ada jadwal yang berubah, kepastian yang tertunda, dan masa ketika tanggung jawab rumah terasa lebih banyak dipegang sendiri. Keteguhan dapat tumbuh dari doa, persiapan, komunikasi, dan jaringan pertemanan yang saling membantu.',
          'Namun kuat bukan berarti memendam semuanya. Meminta bantuan, beristirahat, mengakui sedang lelah, dan meluangkan waktu untuk berkembang juga bagian dari menjaga keluarga. Ketika seseorang merasa didukung, ia lebih mampu memberi dukungan bagi orang lain.',
        ],
        practical: {
          kind: 'list',
          label: 'Three Little Reminders',
          items: [
            'Jaga komunikasi dan rasa percaya dengan pasangan.',
            'Bangun persaudaraan, bukan kompetisi, dengan sesama anggota.',
            'Rawat kesehatan, ruang pribadi, dan kesempatan belajar.',
          ],
        },
      },
      {
        id: 'community-that-cares',
        runningHead: 'A Community with Room to Breathe',
        title: 'A Community That Cares',
        deck: 'Kegiatan yang bermanfaat, ruang yang ramah.',
        paragraphs: [
          'Kegiatan komunitas bisa menjadi tempat belajar, bergerak, berdoa, dan membangun pertemanan. Harapan seperti senam bersama, pengajian, pertemuan yang semakin akrab, dan kesempatan saling mengenal patut dirawat.',
          'Pada saat yang sama, anggota memiliki kondisi yang berbeda-beda. Ada yang bekerja, mengurus anak kecil, mendampingi keluarga, atau menjalani masa berjauhan dengan pasangan. Kepekaan terhadap waktu dan kemampuan tiap keluarga membantu kegiatan terasa lebih inklusif.',
        ],
        practical: {
          kind: 'list',
          label: 'Wisdom Notes',
          items: [
            'Rencanakan acara yang punya tujuan dan manfaat jelas.',
            'Beri informasi jadwal sedini mungkin.',
            'Sediakan ruang bagi anggota untuk berpendapat dan saling membantu.',
            'Hargai kontribusi yang tidak selalu terlihat di depan.',
          ],
        },
      },
    ],
    closingQuote: {
      text: 'Rame ing gawe, sepi ing pamrih.',
      tagline: 'From our sharing',
      body: 'Bekerja dengan sungguh-sungguh, tanpa menggantungkan makna pengabdian pada pujian atau imbalan. Sebuah pengingat untuk berkontribusi dengan tulus, sekaligus tetap menjaga diri, keluarga, dan sesama.',
      photo: photo('vase-dried-flowers', 'Bunga kering dalam vas keramik putih', '50% 40%'),
    },
  },
];

export const explore = {
  title: 'A Little More to Explore',
  deck: 'For the curious heart and the thoughtful mind.',
  photo: photo('book-coffee-soft', 'Buku terbuka dan secangkir kopi di atas selimut lembut', '60% 50%'),
  paragraphs: [
    'Setiap perjalanan memiliki pertanyaan yang berbeda. Ada yang sedang belajar membangun komunikasi, ada yang ingin menata keuangan, ada pula yang sedang berusaha lebih tenang menghadapi perubahan hidup.',
    'Untuk yang ingin mendalami tema-tema tersebut, berikut tujuh percakapan pilihan. Tidak perlu ditonton sekaligus. Pilih satu topik yang paling dekat dengan kebutuhan saat ini, lalu bawa satu hal baik ke dalam keseharian.',
  ],
  disclaimer:
    'Judul dan thumbnail adalah materi rujukan dari kanal masing-masing. Buku ini tidak berafiliasi dengan, ataupun disponsori oleh, kanal maupun pembicara.',
  closingLine:
    'Satu percakapan mungkin tidak mengubah segalanya. Tetapi satu pelajaran kecil dapat mengubah cara kita menjalani hari berikutnya.',
};

export const reflection = {
  title: 'A Moment to Reflect',
  deck: 'Three little questions to carry home.',
  questions: [
    'Kebiasaan kecil apa yang ingin aku rawat dalam keluargaku?',
    'Pesan mana yang paling terasa dekat dengan keadaanku hari ini?',
    'Bagaimana aku dapat membuat kebersamaan di komunitas lebih hangat, tanpa melupakan kebutuhan diri dan keluarga?',
  ],
};

export const closing = {
  title: 'A Note to Carry Home',
  deck: 'Wisdom to Carry, Love to Remember.',
  photo: photo('soft-dried-grass', 'Bunga rumput kering yang lembut dalam cahaya pucat', '50% 40%'),
  paragraphs: [
    'Tidak ada keluarga, perjalanan hidup, atau komunitas yang selalu berjalan tanpa tantangan. Ada masa ketika kita merasa cukup yakin, dan ada masa ketika kita masih mencari cara terbaik untuk melangkah.',
    'Semoga kumpulan kecil ini menjadi pengingat bahwa kita dapat terus belajar: menyampaikan perasaan dengan lebih baik, menggunakan rezeki dengan lebih bijak, menjaga orang-orang yang kita sayangi, dan memberi tempat bagi satu sama lain untuk bertumbuh.',
    'Terima kasih untuk setiap cerita, kejujuran, harapan, dan kebersamaan yang telah dibagikan. Semoga yang baik terus kita rawat, dan yang belum mudah dapat kita hadapi bersama—pelan-pelan, dengan hati yang lapang.',
  ],
  signoff: 'With warmth, gratitude, and a little more wisdom.',
};

export const sources = {
  title: 'Behind These Pages',
  paragraphs: [
    'Disusun sebagai rangkuman editorial dari berbagai catatan tertulis dalam sesi berbagi ibu-ibu Mayon, diperkaya dengan gagasan praktis dari tujuh percakapan video yang tercantum pada bagian “A Little More to Explore”. Tulisan-tulisan reflektif dalam buku ini merupakan sintesis, bukan kutipan langsung yang diatribusikan kepada individu tertentu.',
  ],
  disclaimer:
    'Catatan: Saran terkait pernikahan, keuangan, dan kehidupan organisasi dalam buku ini merupakan bahan refleksi umum, bukan pengganti pendampingan profesional atau aturan resmi organisasi. Konteks setiap keluarga berbeda.',
  photoCredit:
    'Foto: koleksi CC0 dari StockSnap, rawpixel, dan WordPress Photos. Huruf: Cormorant Garamond & DM Sans (SIL Open Font License).',
};

export const backCover = {
  lines: ['The little things we learn together', 'become the things we carry forward.'],
};
