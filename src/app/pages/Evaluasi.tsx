import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MissionTest } from '../components/MissionTest';

// Halaman Evaluasi = Posttest (soal sama dengan pretest)
export default function Evaluasi() {
  return (
    <div>
      <Header />
      <div className="pt-16">
        <MissionTest mode="posttest" />
      </div>
      <Footer />
    </div>
  );
}
