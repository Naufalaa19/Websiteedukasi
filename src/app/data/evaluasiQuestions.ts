export const questions = [
  { no: 1,  text: 'Kebersihan gigi dan mulut dapat mempengaruhi kesehatan gigi.' },
  { no: 2,  text: 'Menggosok gigi hanya cukup 1 kali sehari pada waktu mandi pagi.' },
  { no: 3,  text: 'Pasta gigi menggunakan floured.' },
  { no: 4,  text: 'Sebelum tidur sebaiknya gosok gigi.' },
  { no: 5,  text: 'Anak-anak boleh mememakai sikat gigi orang dewasa.' },
  { no: 6,  text: 'Sikat gigi yang baik adalah yang tangkainya lurus dan kepala sikatnya kecil sehingga bisa masuk kedalam mulut dengan mudah.' },
  { no: 7,  text: 'Menggosok gigi dilakukan sesudah makan dan sebelum tidur.' },
  { no: 8,  text: 'Sikat gigi yang baik adalah sikat yang bulunya yang halus dan rata.' },
  { no: 9,  text: 'Menyikat gigi tidak perlu terlalu kuat agar gusi tidak mudah berdarah.' },
  { no: 10, text: 'Menyikat gigi cukup pada bagian gigi depan saja.' },
  { no: 11, text: 'Karies adalah penyakit gigi berlubang.' },
  { no: 12, text: 'Makan buah-buahan dan sayur-sayuran yang bergizi tidak terlalu penting untuk kesehatan gigi dan mulut.' },
  { no: 13, text: 'Gigi yang kotor dan yang tidak di bersihkan akan menyebabkan gigi berlubang.' },
  { no: 14, text: 'Makan yang manis dan lengket menyebabkan gigi berlubang.' },
  { no: 15, text: 'Gigi berlubang hanya disebabkan oleh bakteri saja.' },
  { no: 16, text: 'Coklat dan permen adalah makanan yang merusak gigi.' },
  { no: 17, text: 'Sehabis minum dan makan-makanan yang manis sebaiknya langsung berkumur dengan air putih.' },
  { no: 18, text: 'Mengurangi makan-makanan yang manis dapat mengurangi terjadinya gigi berlubang.' },
  { no: 19, text: 'Minimal 6 bulan 1 Kali perlu kedokter gigi untuk kontrol gigi.' },
  { no: 20, text: 'Tidak perlu kedokter gigi bila gigi tidak sakit.' },
  { no: 21, text: 'Kita boleh mencabut sendiri gigi anak anak yang sudah goyang.' },
  { no: 22, text: 'Jika ada gigi yang berlubang sebaiknaya pergi ke dokter gigi untuk dilakukan perawatan tambal gigi.' },
  { no: 23, text: 'Kotoran di sekeliling gigi yang sudah keras tidak perlu dihilangkan karena akan membuat gigi menjadi kuat.' },
  { no: 24, text: 'Gigi anak tidak perlu dirawat atau pun di tambal karena akan diganti dengan gigi yang baru.' },
  { no: 25, text: 'Setiap gigi yang berlubang harus di cabut.' },
  { no: 26, text: 'Gigi berlubang dapat ditularkan oleh orang lain.' },
  { no: 27, text: 'Menggunakan tusuk gigi dapat merusak struktur gigi.' },
  { no: 28, text: 'Gigi berlubang akan sembuh sendiri tanpa ditambal.' },
  { no: 29, text: 'Gigi akan ngilu saat minum/kumur kumur dengan air dingin/es.' },
  { no: 30, text: 'Jika belum timbul rasa sakit gigi tidak perlu diobati.' },
  { no: 31, text: 'Boleh bertukar sikat gigi dengan orang lain/keluarga.' },
  { no: 32, text: 'Gigi dicabut ketika sakit.' },
  { no: 33, text: 'Membersihkan gigi dengan megunakan sikat gigi dan pasta gigi.' },
  { no: 34, text: 'Gigi yang berlubang akan terasa sakit apabila makan makanan yang panas dan dingin pada saat bersamaan.' },
  { no: 35, text: 'Menyikat gigi di seluruh permukaan gigi.' },
  { no: 36, text: 'Sikat gigi yang baik memiliki warna dan bentuk yang menarik.' },
  { no: 37, text: 'Sakit gigi disebabkan oleh malas menggosok gigi.' },
  { no: 38, text: 'Gusi merah, bengkak dan mudah berdarah karena terlalu keras menyikat gigi.' },
  { no: 39, text: 'Gigi yang sehat adalah gigi yang kuat dan tidak berlubang.' },
  { no: 40, text: 'Merokok mempengaruhi kesehatan gigi dan mulut.' },
];

export const answerKey: Record<number, 'B' | 'S'> = {
  1:'B', 2:'S', 3:'B', 4:'B', 5:'S', 6:'B', 7:'B', 8:'B', 9:'B', 10:'S',
  11:'B', 12:'S', 13:'B', 14:'B', 15:'S', 16:'B', 17:'B', 18:'B', 19:'B', 20:'S',
  21:'S', 22:'B', 23:'S', 24:'S', 25:'S', 26:'S', 27:'B', 28:'S', 29:'S', 30:'S',
  31:'S', 32:'S', 33:'B', 34:'B', 35:'B', 36:'S', 37:'B', 38:'B', 39:'B', 40:'B',
};

export function getCategory(score: number) {
  if (score >= 36) return { label: 'Sangat Baik', emoji: '🏆' };
  if (score >= 28) return { label: 'Baik', emoji: '👍' };
  if (score >= 20) return { label: 'Cukup', emoji: '📚' };
  return { label: 'Perlu Ditingkatkan', emoji: '💪' };
}
