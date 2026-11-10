import React, { useState } from 'react';
import { CertificateData, User } from '../types';
import { StorageService } from '../services/storage';
import {
  Award,
  Printer,
  Search,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  ArrowRight
} from 'lucide-react';

interface CertificateViewProps {
  initialCertificate?: CertificateData | null;
  currentUser: User | null;
  onOpenExam: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  initialCertificate,
  currentUser,
  onOpenExam,
}) => {
  const [cert, setCert] = useState<CertificateData | null>(initialCertificate || null);
  const [searchSerial, setSearchSerial] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  // If initial certificate not set, check if current user has any certificates
  React.useEffect(() => {
    if (!cert && currentUser) {
      const allCerts = StorageService.getCertificates();
      const userCert = allCerts.find((c) => c.userId === currentUser.id);
      if (userCert) {
        setCert(userCert);
      }
    }
  }, [cert, currentUser]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    if (!searchSerial.trim()) return;

    const found = StorageService.getCertificateById(searchSerial.trim());
    if (found) {
      setCert(found);
    } else {
      setSearchError("Bunday seriya raqamli sertifikat topilmadi. Qaytadan tekshiring.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Demo certificate if user has not completed exam yet but wants to preview what it looks like
  const handlePreviewSample = () => {
    setCert({
      id: 'CERT_SAMPLE',
      serialNumber: `TE-2026-998812`,
      userId: currentUser?.id || 'sample_user',
      fullName: currentUser ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : "Bilolbek Yusufboyev",
      overallBand: 9.0,
      cefrLevel: 'C2',
      listeningBand: 9.0,
      readingBand: 9.0,
      writingBand: 8.5,
      speakingBand: 9.0,
      issueDate: '10 November 2026',
      verificationHash: 'SHA256_9F88A1209B',
    });
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Top Controls & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Verifikatsiya & Haqiqiylik Tekshiruvi</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display mt-0.5">
              Tayyorlaymiz-English Rasmiy Sertifikatlari
            </h1>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                value={searchSerial}
                onChange={(e) => setSearchSerial(e.target.value)}
                placeholder="Seriya raqami: TE-2026-..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 font-mono"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Tekshirish
            </button>
          </form>
        </div>

        {searchError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs text-center">
            {searchError}
          </div>
        )}

        {/* Certificate Rendering Area */}
        {cert ? (
          <div className="space-y-6">
            
            {/* Action Bar Above Certificate */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ushbu sertifikat rasmiy ro'yxatdan o'tgan va tasdiqlangan</span>
              </div>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>PDF / Chop Etish</span>
              </button>
            </div>

            {/* Official Printable Certificate */}
            <div
              id="printable-certificate"
              className="relative bg-white border-8 border-double border-slate-300 p-8 sm:p-14 rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto text-slate-900"
              style={{
                backgroundImage: 'radial-gradient(#f1f5f9 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            >
              {/* Outer decorative borders */}
              <div className="absolute inset-2 border border-amber-600/30 pointer-events-none rounded-xl" />
              <div className="absolute inset-3 border border-slate-200 pointer-events-none rounded-lg" />

              {/* Certificate Header */}
              <div className="relative text-center space-y-3 mb-8">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-md">
                    <Award className="w-7 h-7" />
                  </div>
                </div>

                <span className="text-xs uppercase tracking-[0.25em] font-semibold text-amber-800 block">
                  Tayyorlaymiz-English Academy of Language Excellence
                </span>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight uppercase">
                  Certificate of Proficiency
                </h2>

                <p className="text-xs text-slate-500 italic max-w-md mx-auto">
                  This official credential verifies that the candidate named below has undergone comprehensive academic evaluation and achieved mastery according to the CEFR framework.
                </p>
              </div>

              {/* Candidate Name Section */}
              <div className="relative text-center my-6 py-4 border-y border-slate-200">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  This is proudly presented to
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-wide underline decoration-amber-400/60 decoration-2 underline-offset-8">
                  {cert.fullName}
                </h3>
                <span className="text-xs text-slate-500 mt-2 block font-medium">
                  for outstanding English language competence at level <strong className="text-amber-800">{cert.cefrLevel} (Mastery)</strong>
                </span>
              </div>

              {/* Scores Matrix & Gold Seal */}
              <div className="relative grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-8">
                
                {/* 4 Skills Breakdown */}
                <div className="sm:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Listening</span>
                    <span className="text-lg font-bold text-slate-900 tabular-nums">
                      {cert.listeningBand.toFixed(1)}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Reading</span>
                    <span className="text-lg font-bold text-slate-900 tabular-nums">
                      {cert.readingBand.toFixed(1)}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Writing</span>
                    <span className="text-lg font-bold text-slate-900 tabular-nums">
                      {cert.writingBand.toFixed(1)}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Speaking</span>
                    <span className="text-lg font-bold text-slate-900 tabular-nums">
                      {cert.speakingBand.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Overall Band Pill */}
                <div className="sm:col-span-4 flex items-center justify-center">
                  <div className="p-4 bg-slate-900 text-white rounded-2xl text-center shadow-lg w-full">
                    <span className="text-[10px] text-amber-300 uppercase tracking-widest font-semibold block">
                      OVERALL IELTS BAND
                    </span>
                    <span className="text-4xl font-black text-amber-400 font-display tabular-nums">
                      {cert.overallBand.toFixed(1)}
                    </span>
                    <span className="text-[11px] text-slate-300 block mt-0.5">
                      CEFR Grade: {cert.cefrLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Verification & Signatures */}
              <div className="relative pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
                
                {/* Gold Seal Image */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden shadow-md shrink-0 border border-amber-300">
                    <img
                      src="/src/assets/images/certificate_seal_gold_1794322273403.jpg"
                      alt="Proficiency Gold Seal"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-slate-900 block">British Academic Standard</span>
                    <span className="text-[11px] text-slate-500 font-mono">Serial: {cert.serialNumber}</span>
                    <span className="text-[11px] text-slate-500 block">Date: {cert.issueDate}</span>
                  </div>
                </div>

                {/* QR Code and Verification Seal */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg border border-slate-200">
                    <QrCode className="w-10 h-10 text-slate-800" />
                  </div>
                  <div className="text-left font-mono text-[10px] text-slate-500">
                    <span>VERIFIED DIGITAL CREDENTIAL</span>
                    <br />
                    <span>ID: {cert.id}</span>
                    <br />
                    <span>Hash: {cert.verificationHash}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <Award className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Sizda hali tasdiqlangan sertifikat mavjud emas
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Sertifikat olish uchun to'liq Nazariy Imtihonni topshiring yoki namunaviy sertifikat ko'rinishini tekshiring.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenExam}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                <span>Nazariy Imtihonni Topshirish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handlePreviewSample}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Namunani ko'rish (Sample Preview)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
