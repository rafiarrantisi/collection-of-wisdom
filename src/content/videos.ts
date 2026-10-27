// Single source of truth for the seven curated episodes.
// Titles and channel names were checked against YouTube oEmbed on 2026-10-27.

export type VideoCategory = 'keuangan' | 'pernikahan' | 'komunikasi' | 'refleksi';

export interface Video {
  key: string; // A–G, the order used in the book
  id: string; // exact YouTube video ID
  title: string;
  channel: string;
  speakers: string;
  category: VideoCategory;
  group: string; // editorial group heading in the book
  synopsis: string;
  takeaways: [string, string]; // printed in the book
  learn: string[]; // expanded "What you'll learn" on the web
}

export const youtubeUrl = (id: string) => `https://youtu.be/${id}`;
export const thumbPath = (id: string) => `assets/thumbs/${id}.jpg`;

export const categoryLabels: Record<VideoCategory, string> = {
  keuangan: 'Keuangan',
  pernikahan: 'Pernikahan',
  komunikasi: 'Komunikasi',
  refleksi: 'Refleksi',
};

export const videos: Video[] = [
  {
    key: 'A',
    id: 'jGc668FpPRQ',
    title:
      'Cara Atur Gaji Biar Ngga Miskin: Dana Darurat, Investasi, Cicilan & Pensiun | Ligwina Hananto. E92',
    channel: 'Rory Asyari · Room for Improvement',
    speakers: 'Ligwina Hananto',
    category: 'keuangan',
    group: 'Financial Foundations',
    synopsis:
      'Percakapan tentang cara menata gaji: dari perlindungan dan dana darurat, mengelola cicilan, sampai menyiapkan masa pensiun.',
    takeaways: [
      'Dahulukan perlindungan dan keuangan yang sehat sebelum mengejar investasi.',
      'Bagi uang berdasarkan kebutuhan, dan siapkan dana darurat sesuai kondisi.',
    ],
    learn: [
      'Mampu menghasilkan uang belum tentu sama dengan mampu mengelolanya.',
      'Periksa kesehatan keuangan: arus kas, cicilan, dan tabungan.',
      'Sisihkan tujuan di awal, baru atur gaya hidup dari yang tersisa.',
      'Investasi dipilih sesuai tujuan dan waktu, setelah memahami risikonya.',
    ],
  },
  {
    key: 'B',
    id: 'AVKtZwYAD9g',
    title: 'Biar Keuangan Beres..',
    channel: 'Raditya Dika',
    speakers: 'Prita Hapsari Ghozie',
    category: 'keuangan',
    group: 'Financial Foundations',
    synopsis:
      'Obrolan santai tentang prioritas pengeluaran, kebiasaan keuangan, dan memilih cara menganggarkan yang cocok dengan kondisi.',
    takeaways: [
      'Pisahkan pos kebutuhan tetap, kebutuhan harian, keinginan, dan tabungan.',
      'Kenali kebiasaan keuangan diri, lalu pilih sistem anggaran yang realistis.',
    ],
    learn: [
      'Urutkan prioritas: yang wajib, yang sebaiknya, yang boleh, yang menyenangkan.',
      'Kebocoran bisa datang dari biaya tetap yang terlalu besar, bukan hanya jajan.',
      'Metode anggaran adalah pilihan sesuai penghasilan dan tanggungan.',
      'Dalam pernikahan, yang terpenting keterbukaan dan kesepakatan.',
    ],
  },
  {
    key: 'C',
    id: 'SgK0Okc0M2k',
    title: '#1 PAKAR KELUARGA: Kenapa Banyak Wanita Menyesal Setelah Menikah? | SUARA BERKELAS #156',
    channel: 'Suara Berkelas',
    speakers: 'Rani Anggraini Dewi',
    category: 'pernikahan',
    group: 'The Art of Understanding',
    synopsis:
      'Pembahasan tentang pernikahan sebagai pilihan dewasa, kerja sama yang setara, dan menjaga kedekatan di tengah kesibukan.',
    takeaways: [
      'Lihat pernikahan sebagai kerja sama dua pribadi yang sama-sama berkembang.',
      'Rawat koneksi pasangan di tengah rutinitas keluarga dan pekerjaan.',
    ],
    learn: [
      'Menikah sebaiknya pilihan sadar, bukan karena tekanan usia atau status.',
      'Kerja sama yang setara dalam tanggung jawab, seperti pilot dan co-pilot.',
      'Pasangan dapat saling mendukung pertumbuhan diri masing-masing.',
      'Waktu berkualitas berdua menjaga agar tidak perlahan menjauh.',
    ],
  },
  {
    key: 'D',
    id: 'eV497nxN8W4',
    title: 'Belajar Bicara Sampaikan Isi Pikiran dan Perasaan ke Pasangan Tanpa Bikin Emosi!',
    channel: 'The Sinathrya',
    speakers: 'Darius Sinathrya & Donna Agnesia',
    category: 'komunikasi',
    group: 'The Art of Understanding',
    synopsis:
      'Cerita sepasang suami istri tentang menyampaikan isi hati dengan tenang, memilih waktu, dan membangun rasa aman untuk bicara.',
    takeaways: [
      'Pilih waktu yang tepat dan pakai kalimat yang menjelaskan perasaan.',
      'Bangun rasa aman agar keduanya berani bicara sekaligus mendengar.',
    ],
    learn: [
      'Hindari membahas hal sensitif saat pasangan sedang sangat lelah.',
      'Jangan mengkritik pasangan di depan anak atau orang lain.',
      '“Aku merasa…” lebih mudah didengar daripada “Kamu selalu…”.',
      'Arahkan diskusi pada solusi: apa yang bisa kita lakukan setelah ini?',
    ],
  },
  {
    key: 'E',
    id: 'kf3f-l2n4-k',
    title: '#momscorner 15 Ust. Felix Siaw | Menikah adalah IBADAH Seumur Hidup',
    channel: 'Nikita Willy Official · Moms Corner',
    speakers: 'Ustaz Felix Siaw',
    category: 'pernikahan',
    group: 'Love, Values & Everyday Life',
    synopsis:
      'Perbincangan tentang nilai spiritual pernikahan: ketenangan, cinta, kasih sayang, dan tujuan yang dijalani bersama.',
    takeaways: [
      'Pernikahan mengajak pasangan menjaga visi dan tujuan bersama.',
      'Kasih sayang dan tanggung jawab perlu dijalani dalam keseharian.',
    ],
    learn: [
      'Sakinah, mawaddah, dan rahmah sebagai ajakan merawat ketenangan dan kasih sayang.',
      'Tanggung jawab dalam rumah tangga dijalani dengan belas kasih.',
      'Tidak semua kehidupan pribadi perlu dibagikan di media sosial.',
      'Saat berselisih, kembali pada niat baik dan nilai bersama.',
    ],
  },
  {
    key: 'F',
    id: 'ulTiWbGB24E',
    title: 'Kalau Mau Bahagia, Suami Istri Harus Nonton Ini! Tips Dari @draisahdahlan',
    channel: 'Helmy Yahya Bicara',
    speakers: 'dr. Aisyah Dahlan',
    category: 'komunikasi',
    group: 'Love, Values & Everyday Life',
    synopsis:
      'Berbagi pengalaman tentang ritme komunikasi pasangan: memilih waktu, memberi jeda, dan saling menghargai.',
    takeaways: [
      'Kepekaan pada waktu dan keadaan pasangan membantu percakapan.',
      'Tidak semua persoalan perlu dibahas saat salah satu sedang sangat lelah.',
    ],
    learn: [
      'Setiap orang bisa punya kebutuhan dan gaya komunikasi yang berbeda.',
      'Saling memberi jeda sejenak bila dibutuhkan, misalnya selepas bekerja.',
      'Bangun kesepakatan dan jaga martabat masing-masing.',
    ],
  },
  {
    key: 'G',
    id: 'VSkAS9x-23E',
    title: 'Kalau Hidup Lagi Berantakan, Mungkin 4 Pesan Penting Ini yang Kamu Butuhin. E104',
    channel: 'Rory Asyari · Room for Improvement',
    speakers: 'Analisa Widyaningrum, Henry Manampiring, Gobin Vasdev, Vina Nugroho',
    category: 'refleksi',
    group: 'Growing Within',
    synopsis:
      'Kompilasi empat percakapan tentang kelelahan, hal-hal yang bisa kita kendalikan, mengelola emosi, dan berdamai dengan masa lalu.',
    takeaways: [
      'Fokus pada pikiran, perkataan, dan tindakan yang bisa kita usahakan.',
      'Mengelola emosi dan memahami pengalaman masa lalu adalah proses, bukan tuntutan untuk segera sempurna.',
    ],
    learn: [
      'Bedakan keputusan yang matang dari reaksi menghindar karena emosi.',
      'Hasil dan respons orang lain tidak sepenuhnya di tangan kita.',
      'Menyadari emosi dan bernapas lebih pelan dapat membantu menenangkan diri.',
      'Pemulihan butuh penerimaan, proses, dan belas kasih pada diri sendiri.',
    ],
  },
];
