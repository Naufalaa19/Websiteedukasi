import type { Article, ArticleSection } from './articles';

// Foto klinis asli dari Wikimedia Commons (lisensi terbuka: CC0 / CC BY / CC BY-SA / Public Domain)
const wm = (file: string, w = 1000) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${w}`;

type Pic = { f: string; alt: string; cap: string };

const P: Record<string, Pic> = {
  calcAnterior: { f: 'MandibularAnteriorCalculus.JPG', alt: 'Karang gigi pada sisi dalam gigi depan bawah', cap: 'Kondisi klinis: karang gigi (kalkulus) menumpuk di sisi lidah gigi depan rahang bawah.' },
  calc3: { f: 'Calculus-3.jpg', alt: 'Karang gigi kuning kecokelatan', cap: 'Karang gigi yang sudah mengeras berwarna kuning–cokelat di leher gigi dan tepi gusi.' },
  calcDental: { f: 'Dental_Calculus.jpg', alt: 'Kalkulus gigi', cap: 'Endapan kalkulus supragingiva tebal. Hanya bisa dilepas dengan scaling oleh dokter gigi.' },
  scalerUse: { f: 'Dental_instrument_to_remove_Calculus_5.JPG', alt: 'Instrumen scaler', cap: 'Instrumen (scaler) yang dipakai dokter gigi untuk melepas karang gigi.' },
  plaqueAfter: { f: 'Post_plaque_disclosing.jpg', alt: 'Plak gigi diwarnai dengan disclosing', cap: 'Plak yang diwarnai larutan disclosing: bagian berwarna adalah plak yang masih tertinggal setelah menyikat gigi.' },
  plaqueTab: { f: 'Plaque_Disclosing_Tablets.jpg', alt: 'Tablet disclosing plak', cap: 'Tablet disclosing untuk memeriksa kebersihan sikat gigi di rumah.' },
  cariesMolar: { f: 'Dental_Caries_Lower_Left_First_Molar_01.jpg', alt: 'Karies pada gigi molar pertama bawah', cap: 'Kondisi klinis: lubang karies pada permukaan kunyah gigi geraham pertama bawah.' },
  cariesCavity: { f: 'Dental_Caries_Cavity_2.JPG', alt: 'Kavitas karies gigi', cap: 'Kavitas karies yang sudah berwarna cokelat kehitaman: tanda kerusakan sudah mencapai dentin.' },
  caries4: { f: 'Dental_Caries_4.jpg', alt: 'Karies gigi', cap: 'Karies pada gigi, tampak perubahan warna dan kerusakan struktur email.' },
  caries1: { f: 'Dental_Caries_.jpg', alt: 'Gigi berlubang', cap: 'Gigi berlubang yang dibiarkan akan meluas ke dalam dan menimbulkan nyeri.' },
  sealant: { f: 'Sealant_tooth.jpg', alt: 'Sealant pada gigi geraham', cap: 'Sealant (pelapis fissure) pada gigi geraham untuk mencegah karies di alur gigi.' },
  gingivitis: { f: 'Gingivitis.jpg', alt: 'Gingivitis', cap: 'Gingivitis: tepi gusi tampak merah, bengkak, dan mengilap.' },
  gingBefore: { f: 'Gingivitis-before.JPG', alt: 'Gingivitis sebelum perawatan', cap: 'Sebelum perawatan: gusi merah dan bengkak disertai plak di tepi gusi.' },
  gingAfter: { f: 'Gingivitis-after.JPG', alt: 'Gusi sehat setelah perawatan', cap: 'Setelah perawatan dan menyikat gigi teratur: gusi kembali merah muda dan kencang.' },
  gingBA2: { f: 'Gingivitis_before_and_after-2.jpg', alt: 'Gingivitis sebelum dan sesudah', cap: 'Perbandingan klinis gusi sebelum dan sesudah pembersihan karang gigi.' },
  gingBA3: { f: 'Gingivitis-before-and-after-3.jpg', alt: 'Gusi sebelum dan sesudah scaling', cap: 'Gusi sebelum (kiri) dan sesudah (kanan) scaling dan kebersihan mulut yang baik.' },
  recession: { f: 'Black_triangles_large.jpg', alt: 'Ruang segitiga hitam antar gigi', cap: 'Gusi yang turun membuat ruang interdental terbuka, akar gigi lebih mudah terpapar dan terasa ngilu.' },
  perioSevere: { f: 'Periodontitis_Cr%C3%B3nica_Severa.JPG', alt: 'Periodontitis kronis berat', cap: 'Periodontitis kronis berat: gusi turun, karang gigi banyak, gigi mulai goyang.' },
  paro1: { f: 'Paro1.JPG', alt: 'Periodontitis', cap: 'Periodontitis: peradangan gusi yang telah merusak jaringan penyangga gigi.' },
  perio01: { f: 'Periodontitis_01.jpg', alt: 'Periodontitis', cap: 'Gambaran klinis periodontitis dengan kehilangan perlekatan gusi.' },
  migration: { f: 'Zahnwanderung_wegen_Periodontitis_OK_03.JPG', alt: 'Gigi bergeser akibat periodontitis', cap: 'Gigi depan bergeser dan renggang akibat hilangnya tulang penyangga.' },
  abscess: { f: 'Abces_parulique.jpg', alt: 'Abses gigi', cap: 'Abses (nanah) di gusi: infeksi gigi yang perlu segera ditangani dokter gigi.' },
  scaling: { f: 'Tooth_scaling_9301.JPG', alt: 'Prosedur scaling gigi', cap: 'Prosedur scaling: pembersihan karang gigi dengan alat ultrasonik di klinik.' },
  girlSmile: { f: 'Smiling_young_girl_with_deciduous_teeth.jpg', alt: 'Anak dengan gigi susu', cap: 'Gigi susu yang sehat membantu anak mengunyah, berbicara, dan menjaga ruang bagi gigi tetap.' },
  dentistKid: { f: 'Dentist_in_Mexico_attending_a_child.jpg', alt: 'Dokter gigi memeriksa anak', cap: 'Pemeriksaan gigi anak di klinik: ramah, singkat, dan tidak menakutkan.' },
  pedDentist: { f: 'Pediatric_dentist_is_Army_%E2%80%98brat%E2%80%99_at_heart_(5153731).jpg', alt: 'Dokter gigi anak', cap: 'Dokter gigi anak memeriksa gigi susu dalam suasana klinik yang nyaman.' },
  clinic: { f: 'Dentist_using_dental_equipment_on_patient_in_clinic_during_routine_check-up.jpg', alt: 'Pemeriksaan rutin di klinik gigi', cap: 'Pemeriksaan rutin di klinik gigi, sebaiknya setiap 6 bulan sekali.' },
  childBrush: { f: 'Nepali_child_brushing_his_teeth.jpg', alt: 'Anak menyikat gigi', cap: 'Anak menyikat gigi: orang tua perlu mendampingi hingga usia sekitar 8 tahun.' },
  babyBrush: { f: "Brushing_a_Baby's_Mouth_with_a_Soft_Silicon_Brush.jpg", alt: 'Membersihkan mulut bayi', cap: 'Membersihkan gusi dan gigi bayi dengan sikat silikon lembut.' },
  bottle: { f: 'Nursing_bottle_caries.jpg', alt: 'Karies botol pada gigi depan atas', cap: 'Kondisi klinis karies botol: gigi depan atas keropos dan menghitam akibat susu botol saat tidur.' },
  tongue: { f: 'Langue_saburrale.jpg', alt: 'Lidah berselaput', cap: 'Lidah berselaput putih kekuningan (tongue coating): sumber utama bau mulut.' },
  tonsil: { f: 'Tonsil-Stones-Cure.jpg', alt: 'Batu amandel', cap: 'Batu amandel (tonsilolith) juga dapat menyebabkan bau mulut.' },
  tongueClean: { f: 'Wooshy_Tongue_Cleaner.jpg', alt: 'Pembersih lidah', cap: 'Pembersih lidah (tongue scraper) membantu mengurangi selaput penyebab bau mulut.' },
  aphthous: { f: 'Aphthous_ulcer.jpg', alt: 'Sariawan', cap: 'Sariawan (ulkus aftosa): luka bulat dengan dasar putih kekuningan dan tepi kemerahan.' },
  aphthous2: { f: 'Aphthous_stomatitis.jpg', alt: 'Stomatitis aftosa', cap: 'Stomatitis aftosa rekuren pada mukosa mulut.' },
  aphthousLip: { f: 'Aphthous_ulcers_on_lip.jpg', alt: 'Sariawan di bibir bagian dalam', cap: 'Sariawan di mukosa bibir bagian dalam, lokasi yang paling sering terkena.' },
  aphthousLabial: { f: 'Aphthous_stomatitis_on_the_labial_mucosa.jpg', alt: 'Sariawan di mukosa labial', cap: 'Ulkus aftosa pada mukosa labial dengan halo kemerahan di sekelilingnya.' },
  fluorosis: { f: 'Dental_fluorosis.jpg', alt: 'Fluorosis gigi', cap: 'Fluorosis gigi: bercak putih/cokelat akibat kelebihan fluoride saat gigi terbentuk.' },
};

type Plan = { hero: string; extra: string[] };

const plans: Record<string, Plan> = {
  'karang-gigi': { hero: 'calcAnterior', extra: ['calc3', 'calcDental', 'plaqueAfter', 'scalerUse'] },
  'karies-gigi': { hero: 'cariesMolar', extra: ['cariesCavity', 'caries4', 'caries1', 'sealant'] },
  gingivitis: { hero: 'gingivitis', extra: ['gingBefore', 'gingAfter', 'gingBA2', 'plaqueAfter'] },
  'gigi-sensitif': { hero: 'recession', extra: ['cariesCavity', 'caries4', 'fluorosis'] },
  periodontitis: { hero: 'perioSevere', extra: ['paro1', 'perio01', 'migration', 'abscess'] },
  'scaling-gigi': { hero: 'scaling', extra: ['calc3', 'scalerUse', 'gingBA3', 'gingAfter'] },
  'gigi-anak': { hero: 'girlSmile', extra: ['bottle', 'cariesCavity', 'dentistKid', 'sealant', 'childBrush'] },
  'bau-mulut': { hero: 'tongue', extra: ['tonsil', 'tongueClean', 'plaqueAfter', 'calcDental'] },
  sariawan: { hero: 'aphthous', extra: ['aphthous2', 'aphthousLip', 'aphthousLabial'] },
  'nutrisi-gigi': { hero: 'cariesCavity', extra: ['caries4', 'bottle', 'fluorosis'] },
  'teknik-sikat-gigi': { hero: 'plaqueAfter', extra: ['plaqueTab', 'gingBefore', 'childBrush', 'gingAfter'] },
  'gigi-bayi': { hero: 'babyBrush', extra: ['bottle', 'girlSmile', 'dentistKid'] },
  'karies-botol': { hero: 'bottle', extra: ['caries1', 'cariesCavity', 'pedDentist'] },
  'kunjungan-pertama-dokter': { hero: 'dentistKid', extra: ['pedDentist', 'clinic', 'sealant'] },
  'ibu-hamil-gigi': { hero: 'gingBefore', extra: ['gingBA2', 'clinic', 'calc3'] },
  'tumbuh-gigi-anak': { hero: 'girlSmile', extra: ['childBrush', 'sealant', 'bottle'] },
  'gigi-anak-sekolah': { hero: 'cariesMolar', extra: ['sealant', 'childBrush', 'pedDentist', 'plaqueAfter'] },
  'nutrisi-gigi-anak': { hero: 'bottle', extra: ['caries4', 'fluorosis', 'childBrush'] },
};

const toSection = (p: Pic): ArticleSection => ({
  type: 'image',
  imageUrl: wm(p.f),
  imageAlt: p.alt,
  imageCaption: `${p.cap} (Foto: Wikimedia Commons, lisensi terbuka)`,
});

export function enrichArticles(list: Article[]): Article[] {
  return list.map((a) => {
    const plan = plans[a.id];
    if (!plan) return a;
    const extras = plan.extra.map((k) => toSection(P[k]));
    const content: ArticleSection[] = [];
    let headingSeen = 0;
    let used = 0;
    for (const s of a.content) {
      if (s.type === 'heading') {
        headingSeen++;
        // sisipkan galeri klinis sebelum heading ke-2, ke-3, dst.
        if (headingSeen >= 2 && used < extras.length) content.push(extras[used++]);
      }
      if (s.type === 'sources' && used < extras.length) {
        while (used < extras.length) content.push(extras[used++]);
      }
      content.push(s);
    }
    while (used < extras.length) content.push(extras[used++]);
    return { ...a, image: wm(P[plan.hero].f, 1200), content };
  });
}
