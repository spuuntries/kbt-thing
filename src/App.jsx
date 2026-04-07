import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Leaf,
  Activity,
  Sprout,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  Globe,
  Wind,
  Download,
  Loader2,
} from 'lucide-react';
import { domToJpeg } from 'modern-screenshot';
import rgbPic from './assets/rgb-pic.png';
import nirTranslation from './assets/nir-translation.png';
import sickLocated from './assets/sick-located.png';
import yesGanoderma from './assets/yes-ganoderma.png';
import noGanoderma from './assets/no-ganoderma.png';

const investorSlides = [
  { id: 'title' },
  { id: 'problem' },
  { id: 'solution' },
  { id: 'business_model' },
];

const farmerSlides = [
  { id: 'title_farmer' },
  { id: 'problem_farmer' },
  { id: 'solution_farmer' },
  { id: 'demo_farmer' },
  { id: 'value_farmer' },
];

export default function App() {
  const [audience, setAudience] = useState('investor');
  const [language, setLanguage] = useState('en');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const t = (en, ind) => language === 'id' ? ind : en;

  const slides = audience === 'investor' ? investorSlides : farmerSlides;

  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Only jsPDF needed now — no html2canvas
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const newScale = Math.min(width / 1200, height / 675);
        setScale(newScale * 0.95);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1));
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));

  const handleExportPDF = useCallback(async () => {
    if (!window.jspdf) {
      console.warn('jsPDF is still loading. Please try again in a moment.');
      return;
    }
    setIsExporting(true);
    setShowExport(true);
    // Let React flush the export container into the DOM
    await new Promise((r) => setTimeout(r, 600));

    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1200, 675],
        hotfixes: ['px_scaling'],
      });

      const slideEls = document.querySelectorAll('.pdf-slide');

      for (let i = 0; i < slideEls.length; i++) {
        const dataUrl = await domToJpeg(slideEls[i], {
          width: 1200,
          height: 675,
          scale: 2,
          quality: 95,
          backgroundColor: '#fdfdfc',
        });

        if (i > 0) pdf.addPage([1200, 675], 'landscape');
        pdf.addImage(dataUrl, 'PNG', 0, 0, 1200, 675);
      }

      pdf.save('basalbuddy-pitch.pdf');
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setShowExport(false);
      setIsExporting(false);
    }
  }, []);

  const renderSlideContent = (id) => {
    switch (id) {
      case 'title':
        return (
          <div className="flex flex-col h-full justify-between p-12">
            <div className="flex items-center gap-4 shrink-0">
              <Leaf className="w-8 h-8 text-[#4a5d23]" />
              <span className="font-mono text-sm tracking-widest text-[#4a5d23] uppercase leading-none mt-1">
                {t("Pitch Deck", "Presentasi")}
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-center max-w-5xl">
              <h1 className="text-[7.5rem] font-black text-stone-900 tracking-tighter leading-none mb-6">
                basalbuddy.
              </h1>
              <p className="text-3xl text-stone-600 font-light max-w-4xl leading-snug">
                {t(
                  "democratizing canopy health & early ganoderma detection for independent palm smallholders.",
                  "kesehatan kanopi & deteksi dini ganoderma untuk petani sawit."
                )}
              </p>
            </div>
            <div className="shrink-0">
              <div className="w-full h-px bg-stone-300 mb-4 mt-8" />
              <div className="flex justify-between font-mono text-xs text-stone-500 uppercase tracking-widest leading-none">
                <span>{t("Confidential", "Rahasia")}</span>
                <span>2026</span>
              </div>
            </div>
          </div>
        );

      case 'problem':
        return (
          <div className="h-full flex flex-col p-12 bg-[#f4f1ea]">
            <div className="flex items-start justify-between mb-8 shrink-0">
              <h2 className="text-5xl font-black text-stone-900 tracking-tighter leading-none">
                {t("the crisis.", "krisis.")}
              </h2>
              <span
                className="font-mono text-sm tracking-widest text-[#8b5a2b] uppercase border border-[#8b5a2b] px-3 py-1.5 shrink-0 whitespace-nowrap"
                style={{ lineHeight: 1 }}
              >
                {t("Problem Statement", "Pernyataan Masalah")}
              </span>
            </div>

            <div className="flex flex-col flex-1 min-h-0 gap-8">
              <div className="flex gap-12 flex-1 min-h-0">
                <div className="flex-1 border-t-2 border-stone-900 pt-6 flex flex-col">
                  <div className="text-[#8b5a2b] mb-4">
                    <Wind className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-stone-900 tracking-tight mb-4 shrink-0">
                    {t("The Silent Killer", "Pembunuh Senyap")}
                  </h3>
                  <p className="text-stone-600 text-xl font-light leading-relaxed mb-6">
                    {t(
                      "Ganoderma (Basal Stem Rot) ruins yields and lingers in soil. By the time visual symptoms appear to the human eye, the tree is already dead and infecting the surrounding plot.",
                      "Ganoderma (Busuk Pangkal Batang) menghancurkan hasil panen dan bertahan di tanah. Pada saat gejala sudah terlihat, pohon tersebut sudah mati dan menulari area sekitarnya."
                    )}
                  </p>
                  <div className="flex-1 min-h-[160px] border border-stone-300 overflow-hidden relative">
                    <img src={yesGanoderma} alt="With Ganoderma" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-[#8b5a2b] text-white px-2 py-1 text-xs font-mono uppercase tracking-wider">
                      {t("Late Stage (Sick)", "Stadium Akhir (Sakit)")}
                    </div>
                  </div>
                </div>
                <div className="flex-1 border-t-2 border-stone-900 pt-6 flex flex-col">
                  <div className="text-[#4a5d23] mb-4">
                    <Activity className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-stone-900 tracking-tight mb-4 shrink-0">
                    {t("The Hardware Barrier", "Kendala Perangkat Keras")}
                  </h3>
                  <p className="text-stone-600 text-xl font-light leading-relaxed mb-6">
                    {t(
                      "True multispectral drones cost upwards of $10,000. Smallholder farmers—who own 41% of plantations—literally cannot afford the hardware needed to detect stress early.",
                      "Drone multispektral yang harganya lebih dari $10.000. Petani kecil—yang memiliki 41% perkebunan—tidak mampu membeli perangkat keras untuk mendeteksi masalah sejak dini."
                    )}
                  </p>
                  <div className="flex-1 min-h-[160px] border border-stone-300 overflow-hidden relative">
                    <img src={noGanoderma} alt="No Ganoderma" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-[#4a5d23] text-white px-2 py-1 text-xs font-mono uppercase tracking-wider">
                      {t("Healthy Canopy", "Kanopi Sehat")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#e8e4db] p-6 border border-stone-300 flex items-center justify-between shrink-0">
                <span className="font-mono text-base text-stone-500 uppercase tracking-widest leading-none">
                  {t("Current Market Failure", "Kegagalan Pasar Saat Ini")}
                </span>
                <span className="text-2xl text-stone-800 font-medium leading-none">
                  {t("Smallholders are priced out of precision agriculture.", "Petani kecil terpinggirkan dari pertanian presisi karena biaya.")}
                </span>
              </div>
            </div>
          </div>
        );

      case 'solution':
        return (
          <div className="h-full flex flex-col p-12">
            <div className="flex items-start justify-between mb-8 shrink-0">
              <h2 className="text-5xl font-black text-stone-900 tracking-tighter leading-none">
                {t("the approach.", "pendekatan.")}
              </h2>
              <span
                className="font-mono text-sm tracking-widest text-[#4a5d23] uppercase border border-[#4a5d23] px-3 py-1.5 shrink-0 whitespace-nowrap"
                style={{ lineHeight: 1 }}
              >
                {t("Technical Pipeline", "Alur Teknis")}
              </span>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
              <div className="flex-1 border border-stone-300 p-6 flex flex-col bg-white">
                <div className="text-[#8b5a2b] font-mono text-xl mb-6 border-b border-stone-200 pb-3 shrink-0">
                  01.
                </div>
                <Smartphone className="w-10 h-10 text-stone-800 mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-stone-900 tracking-tight mb-3 shrink-0">
                  {t("RGB Acquisition", "Akuisisi RGB")}
                </h4>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  {t(
                    "Farmer flies any commercial consumer drone (e.g., DJI Mini). We rely on any standard spatial resolution, upscaling when needed.",
                    "Petani menerbangkan drone konsumen komersial apa pun (misalnya, DJI Mini). Kami mengandalkan resolusi spasial standar apa pun, melakukan peningkatan resolusi jika diperlukan."
                  )}
                </p>
                <div className="mt-auto font-mono text-xs text-stone-400 bg-stone-100 p-3 shrink-0 leading-relaxed">
                  {t("// No radiometric calibration or IR-cut filter removals needed.", "// Tidak perlu kalibrasi radiometrik atau filter IR-cut.")}
                </div>
              </div>

              <div className="flex-1 border border-stone-300 p-6 flex flex-col bg-[#f4f1ea]">
                <div className="text-[#8b5a2b] font-mono text-xl mb-6 border-b border-stone-300 pb-3 shrink-0">
                  02.
                </div>
                <Sprout className="w-10 h-10 text-stone-800 mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-stone-900 tracking-tight mb-3 shrink-0">
                  {t("Spectral Approximation", "Aproksimasi Spektral")}
                </h4>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  {t(
                    "Pipeline uses a CycleGAN to approximate NIR/Red-Edge bands from structural RGB cues, fed into a ViT for segmentation.",
                    "Alur kerja menggunakan CycleGAN untuk memperkirakan pita NIR/Red-Edge dari petunjuk RGB struktural, yang dimasukkan ke ViT untuk segmentasi."
                  )}
                </p>
                <div className="mt-auto font-mono text-xs text-[#8b5a2b] bg-[#e8e4db] p-3 shrink-0 leading-relaxed">
                  {t("// This Image-to-image translation bridges the hardware gap.", "// Terjemahan gambar ini menjembatani kendala perangkat keras.")}
                </div>
              </div>

              <div className="flex-1 border border-[#4a5d23] p-6 flex flex-col bg-[#4a5d23] text-stone-100">
                <div className="text-[#a3b87a] font-mono text-xl mb-6 border-b border-[#5f7434] pb-3 shrink-0">
                  03.
                </div>
                <ShieldCheck className="w-10 h-10 text-[#c2d49a] mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-white tracking-tight mb-3 shrink-0">
                  {t("Geo-Registered Inference", "Inferensi Terdaftar Geo")}
                </h4>
                <p className="text-[#c2d49a] text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  {t(
                    "Platform generates a segmented GeoTIFF heatmap, plotting exact RTK coordinates of anomalous canopies.",
                    "Platform menghasilkan heatmap GeoTIFF yang disegmentasi, memetakan koordinat RTK persis dari kanopi yang tidak normal."
                  )}
                </p>
                <div className="mt-auto font-mono text-xs text-[#4a5d23] bg-[#c2d49a] p-3 shrink-0 leading-relaxed">
                  {t("// Targeted culling minimizes collateral yield loss.", "// Penebangan yang ditargetkan meminimalkan hilangnya hasil.")}
                </div>
              </div>
            </div>
          </div>
        );

      case 'business_model':
        return (
          <div className="h-full flex flex-col p-12 bg-[#f4f1ea]">
            <div className="flex items-start justify-between mb-8 shrink-0">
              <h2 className="text-5xl font-black text-stone-900 tracking-tighter leading-none">
                {t("commercialization.", "komersialisasi.")}
              </h2>
            </div>

            <div className="flex gap-8 flex-1 min-h-0">
              {/* LEFT COLUMN */}
              <div className="w-[35%] flex flex-col gap-6 h-full">
                <div className="bg-white border border-stone-300 p-6 flex-1 flex flex-col relative overflow-hidden">
                  <h3 className="font-bold tracking-tight uppercase font-mono text-sm text-stone-800 mb-4 shrink-0">
                    {t("Market Potential", "Potensi Pasar")}
                  </h3>

                  <div
                    className="relative w-full flex-1"
                    style={{ minHeight: 195 }}
                  >
                    {/* TAM — outermost */}
                    <div
                      className="absolute bottom-0 left-0 right-0 mx-auto rounded-t-full border-t-2 border-x-2 border-stone-300 bg-stone-100 flex flex-col items-center overflow-hidden"
                      style={{ width: 280, height: 190 }}
                    >
                      <div className="pt-4 text-center">
                        <div className="text-stone-500 font-mono text-[10px] uppercase tracking-widest leading-none">
                          Indonesia
                        </div>
                        <div className="text-stone-800 font-black text-2xl leading-none mt-1.5">
                          Rp 840B
                        </div>
                        <div className="text-stone-500 text-[10px] uppercase tracking-wider leading-none mt-1">
                          TAM
                        </div>
                      </div>
                    </div>

                    {/* SAM — middle */}
                    <div
                      className="absolute bottom-0 left-0 right-0 mx-auto rounded-t-full border-t-2 border-x-2 border-[#8b5a2b] bg-[#e6d5c3] flex flex-col items-center overflow-hidden"
                      style={{ width: 195, height: 115, zIndex: 10 }}
                    >
                      <div className="pt-3 text-center">
                        <div className="text-[#8b5a2b] font-mono text-[9px] uppercase tracking-widest leading-none">
                          {t("Endemic", "Endemik")}
                        </div>
                        <div className="text-stone-900 font-black text-xl leading-none mt-1.5">
                          Rp 130B
                        </div>
                        <div className="text-[#8b5a2b] text-[9px] uppercase tracking-wider leading-none mt-1">
                          SAM
                        </div>
                      </div>
                    </div>

                    {/* SOM — innermost */}
                    <div
                      className="absolute bottom-0 left-0 right-0 mx-auto rounded-t-full border-t-2 border-x-2 border-[#2c3815] bg-[#4a5d23] flex flex-col items-center justify-center overflow-hidden"
                      style={{ width: 115, height: 50, zIndex: 20 }}
                    >
                      <div className="text-[#c2d49a] font-mono text-[8px] uppercase tracking-widest leading-none">
                        SOM
                      </div>
                      <div className="text-white font-black text-sm leading-none mt-0.5">
                        Rp 6.5B
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-stone-900 p-5 border border-stone-800 shrink-0">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-[#a3b87a] mb-2 leading-none">
                    {t("The Data Moat", "Parit Data")}
                  </h3>
                  <p className="text-sm text-stone-400 font-light leading-relaxed">
                    {t(
                      "Farmers receive bankable replanting data. Basalbuddy acquires massive visual datasets to continuously fine-tune our base models.",
                      "Petani menerima data peremajaan yang bankable. Basalbuddy memperoleh kumpulan data visual besar untuk terus menyempurnakan model dasar kami."
                    )}
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="w-[65%] flex flex-col gap-6 h-full">
                <div className="bg-white border border-stone-300 p-6 flex-1 flex flex-col min-h-0">
                  <h3 className="font-bold tracking-tight uppercase font-mono text-sm text-stone-800 mb-6 shrink-0 leading-none">
                    {t("Revenue Streams", "Aliran Pendapatan")}
                  </h3>
                  <div className="flex gap-6 flex-1 min-h-0">
                    <div className="flex-1 border-t-2 border-stone-300 pt-4 flex flex-col">
                      <div className="text-stone-500 text-[11px] uppercase tracking-widest font-mono mb-2 leading-none">
                        {t("Independent", "Mandiri")}
                      </div>
                      <div className="text-2xl font-black text-stone-900 leading-none mb-1">
                        Rp 25k
                      </div>
                      <div className="text-xs text-stone-500 font-mono mb-4 leading-none">
                        /ha /scan
                      </div>
                      <ul className="text-sm text-stone-600 space-y-2 font-light flex-1 overflow-hidden">
                        <li>{t("Pay-as-you-go PDF reports", "Laporan PDF prabayar")}</li>
                        <li>{t("No hardware required, any RGB drone", "Tanpa perangkat keras khusus, drone RGB apa pun")}</li>
                      </ul>
                    </div>

                    <div className="flex-1 border-t-2 border-[#4a5d23] pt-4 flex flex-col bg-[#f9fafa] -mx-3 px-3 pb-3">
                      <div className="text-[#4a5d23] text-[11px] uppercase tracking-widest font-mono mb-2 flex justify-between items-center leading-none">
                        <span>{t("Cooperative", "Koperasi")}</span>
                        <span
                          className="bg-[#4a5d23] text-white px-1 py-0.5 text-[9px] font-mono uppercase"
                          style={{ lineHeight: 1 }}
                        >
                          TARGET
                        </span>
                      </div>
                      <div className="text-2xl font-black text-stone-900 leading-none mb-1">
                        Rp 2.5m
                      </div>
                      <div className="text-xs text-stone-500 font-mono mb-4 leading-none">
                        /month
                      </div>
                      <ul className="text-sm text-stone-600 space-y-2 font-light flex-1 overflow-hidden">
                        <li>{t("Covers up to 500 hectares", "Mencakup hingga 500 hektar")}</li>
                        <li>{t("Central management dashboard", "Dasbor manajemen pusat")}</li>
                        <li>{t("PSR replanting data prep", "Persiapan data peremajaan PSR")}</li>
                      </ul>
                    </div>

                    <div className="flex-1 border-t-2 border-stone-300 pt-4 flex flex-col">
                      <div className="text-stone-500 text-[11px] uppercase tracking-widest font-mono mb-2 leading-none">
                        {t("Enterprise", "Perusahaan")}
                      </div>
                      <div className="text-2xl font-black text-stone-900 leading-none mb-1">
                        Rp 150m
                      </div>
                      <div className="text-xs text-stone-500 font-mono mb-4 leading-none">
                        /year
                      </div>
                      <ul className="text-sm text-stone-600 space-y-2 font-light flex-1 overflow-hidden">
                        <li>{t("Direct API system integration", "Integrasi sistem API langsung")}</li>
                        <li>{t("Custom fine-tuned CV models", "Model CV khusus yang di-fine-tune")}</li>
                        <li>{t("Continuous monitoring portal", "Portal pemantauan berkelanjutan")}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 shrink-0">
                  <div className="flex-1 bg-white border border-stone-300 p-5 flex items-start gap-4">
                    <Globe className="w-5 h-5 text-[#8b5a2b] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 leading-none">
                        {t("Impact", "Dampak")}
                      </div>
                      <p className="text-sm text-stone-800 font-light leading-snug">
                        {t(
                          "Optimizes yield for the lower-middle class, directly reducing deforestation pressure.",
                          "Mengoptimalkan hasil untuk kelas menengah ke bawah, secara langsung mengurangi tekanan deforestasi."
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 bg-white border border-stone-300 p-5 flex items-start gap-4">
                    <TrendingUp className="w-5 h-5 text-[#4a5d23] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 leading-none">
                        {t("Financial", "Keuangan")}
                      </div>
                      <p className="text-sm text-stone-800 font-light leading-snug">
                        {t(
                          "Pure software play minimizes CAPEX. High margin scaling via cloud inference.",
                          "Berbasis perangkat lunak meminimalkan CAPEX. Skalabilitas margin tinggi melalui inferensi cloud."
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'title_farmer':
        return (
          <div className="flex flex-col h-full justify-between p-12">
            <div className="flex items-center gap-4 shrink-0">
              <Sprout className="w-8 h-8 text-[#4a5d23]" />
              <span className="font-mono text-sm tracking-widest text-[#4a5d23] uppercase leading-none mt-1">
                {t("Farmer Briefing", "")}
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-center max-w-5xl">
              <h1 className="text-[7.5rem] font-black text-stone-900 tracking-tighter leading-none mb-6">
                basalbuddy.
              </h1>
              <p className="text-3xl text-stone-600 font-light max-w-4xl leading-snug">
                {t("know which trees are sick before it's too late. protect your yield with simple drone flights.", "ketahui pohon mana yang sakit sebelum telat. lindungi panen dengan penerbangan drone sederhana.")}
              </p>
            </div>
            <div className="shrink-0">
              <div className="w-full h-px bg-stone-300 mb-4 mt-8" />
              <div className="flex justify-between font-mono text-xs text-stone-500 uppercase tracking-widest leading-none">
                <span>{t("Farmer Facing", "Untuk Petani")}</span>
                <span>2026</span>
              </div>
            </div>
          </div>
        );

      case 'problem_farmer':
        return (
          <div className="h-full flex flex-col p-12 bg-[#f4f1ea]">
            <div className="flex items-start justify-between mb-8 shrink-0">
              <h2 className="text-5xl font-black text-stone-900 tracking-tighter leading-none">
                {t("what's eating your yield?", "apa yang menggerogoti hasil Anda?")}
              </h2>
              <span
                className="font-mono text-sm tracking-widest text-[#8b5a2b] uppercase border border-[#8b5a2b] px-3 py-1.5 shrink-0 whitespace-nowrap"
                style={{ lineHeight: 1 }}
              >
                {t("The Threat", "Ancaman")}
              </span>
            </div>

            <div className="flex flex-col flex-1 min-h-0 gap-8">
              <div className="flex gap-12 flex-1 min-h-0">
                <div className="flex-1 border-t-2 border-stone-900 pt-6 flex flex-col">
                  <div className="text-[#8b5a2b] mb-4">
                    <Activity className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-stone-900 tracking-tight mb-4 shrink-0">
                    {t("The Silent Thief (Ganoderma)", "Pencuri Tersembunyi (Ganoderma)")}
                  </h3>
                  <p className="text-stone-600 text-xl font-light leading-relaxed mb-6">
                    {t("Ganoderma spreads quietly underground. By the time you notice yellowing fronds or wilting, the tree is gone—and it's probably already infected its neighbors.", "Ganoderma menyebar diam-diam di bawah tanah. Saat Anda melihat pelepah menguning atau layu, pohonnya sudah mati—dan kemungkinan sudah menulari sekitarnya.")}
                  </p>
                  <div className="flex-1 min-h-[160px] border border-stone-300 overflow-hidden relative">
                    <img src={yesGanoderma} alt="With Ganoderma" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-[#8b5a2b] text-white px-2 py-1 text-xs font-mono uppercase tracking-wider">
                      {t("Infected Palm", "Sawit Terinfeksi")}
                    </div>
                  </div>
                </div>
                <div className="flex-1 border-t-2 border-stone-900 pt-6 flex flex-col">
                  <div className="text-[#4a5d23] mb-4">
                    <Wind className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-stone-900 tracking-tight mb-4 shrink-0">
                    {t("Blind Guessing", "Menebak Buta")}
                  </h3>
                  <p className="text-stone-600 text-xl font-light leading-relaxed mb-6">
                    {t("Checking trees by foot on large plots is too slow, and specialized farm drones are too expensive for most independent smallholders to buy themselves.", "Memeriksa pohon di lahan luas sangat lambat, dan drone perkebunan khusus sangat mahal untuk dibeli mayoritas petani mandiri.")}
                  </p>
                  <div className="flex-1 min-h-[160px] border border-stone-300 overflow-hidden relative">
                    <img src={noGanoderma} alt="No Ganoderma" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-[#4a5d23] text-white px-2 py-1 text-xs font-mono uppercase tracking-wider">
                      {t("Healthy Palm", "Sawit Sehat")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#e8e4db] p-6 border border-stone-300 flex items-center justify-between shrink-0">
                <span className="font-mono text-base text-stone-500 uppercase tracking-widest leading-none">
                  {t("The Bottom Line", "Intinya")}
                </span>
                <span className="text-2xl text-stone-800 font-medium leading-none">
                  {t("If you can't see the sickness early, you can't stop the spread.", "Apabila tak dideteksi dini, penyebarannya tak dapat dihentikan.")}
                </span>
              </div>
            </div>
          </div>
        );

      case 'solution_farmer':
        return (
          <div className="h-full flex flex-col p-12">
            <div className="flex items-start justify-between mb-8 shrink-0">
              <h2 className="text-5xl font-black text-stone-900 tracking-tighter leading-none">
                {t("how we help.", "bagaimana kami bantu.")}
              </h2>
              <span
                className="font-mono text-sm tracking-widest text-[#4a5d23] uppercase border border-[#4a5d23] px-3 py-1.5 shrink-0 whitespace-nowrap"
                style={{ lineHeight: 1 }}
              >
                {t("Our Process", "Proses Kami")}
              </span>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
              <div className="flex-1 border border-stone-300 p-6 flex flex-col bg-white">
                <div className="text-[#8b5a2b] font-mono text-xl mb-6 border-b border-stone-200 pb-3 shrink-0">
                  {t("01. Fly & Snap", "01. Terbangkan & Potret")}
                </div>
                <Smartphone className="w-10 h-10 text-stone-800 mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-stone-900 tracking-tight mb-3 shrink-0">
                  {t("A Simple Drone Flight", "Penerbangan Drone Sederhana")}
                </h4>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  {t("We (or you) fly a basic consumer drone over your plantation. It literally just records normal video and takes regular photos.", "Kami (atau Anda) menerbangkan drone biasa di kebun Anda. Cukup merekam video normal dan jepret foto standar.")}
                </p>
                <div className="mt-auto font-mono text-xs text-stone-400 bg-stone-100 p-3 shrink-0 leading-relaxed">
                  {t("No fancy, expensive multispectral cameras needed.", "Tanpa butuh kamera super mahal.")}
                </div>
              </div>

              <div className="flex-1 border border-stone-300 p-6 flex flex-col bg-[#f4f1ea]">
                <div className="text-[#8b5a2b] font-mono text-xl mb-6 border-b border-stone-300 pb-3 shrink-0">
                  {t("02. We Analyze", "02. Kami Analisis")}
                </div>
                <Activity className="w-10 h-10 text-stone-800 mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-stone-900 tracking-tight mb-3 shrink-0">
                  {t("AI Detects Sickness", "AI Mencari Penyakit")}
                </h4>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  {t('Our system processes the images, using AI to "look deeper" and see early signs of canopy stress that the human eye misses.', 'Sistem kami memproses gambar, menggunakan AI untuk "melihat lebih dalam" dan menemukan tanda awal stres kanopi yang tak terlihat mata.')}
                </p>
                <div className="mt-auto font-mono text-xs text-[#8b5a2b] bg-[#e8e4db] p-3 shrink-0 leading-relaxed">
                  {t("Spotting the hidden visual cues of disease.", "Baca petunjuk visual penyakit yang tersembunyi.")}
                </div>
              </div>

              <div className="flex-1 border border-[#4a5d23] p-6 flex flex-col bg-[#4a5d23] text-stone-100">
                <div className="text-[#a3b87a] font-mono text-xl mb-6 border-b border-[#5f7434] pb-3 shrink-0">
                  {t("03. You Take Action", "03. Anda Bertindak")}
                </div>
                <ShieldCheck className="w-10 h-10 text-[#c2d49a] mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-white tracking-tight mb-3 shrink-0">
                  {t("Get The Map", "Dapatkan Peta")}
                </h4>
                <p className="text-[#c2d49a] text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  {t("You receive a clear map pointing exactly to which trees are in trouble. Cull the sick palms immediately and save the healthy ones.", "Anda terima peta jelas yang tunjukkan pasti letak pohon sakit. Tebang yang stres, amankan pohon yang sehat.")}
                </p>
                <div className="mt-auto font-mono text-xs text-[#4a5d23] bg-[#c2d49a] p-3 shrink-0 leading-relaxed">
                  {t("Precise removal. Less spreading. Better harvest.", "Tebang persis. Minim penyebaran. Panen lebih melimpah.")}
                </div>
              </div>
            </div>
          </div>
        );

      case 'demo_farmer':
        return (
          <div className="h-full flex flex-col p-12">
            <div className="flex items-start justify-between mb-8 shrink-0">
              <h2 className="text-5xl font-black text-stone-900 tracking-tighter leading-none">
                {t("see it in action.", "lihat cara kerjanya.")}
              </h2>
              <span
                className="font-mono text-sm tracking-widest text-[#4a5d23] uppercase border border-[#4a5d23] px-3 py-1.5 shrink-0 whitespace-nowrap"
                style={{ lineHeight: 1 }}
              >
                {t("Scan To Detection", "Pemindaian Hingga Deteksi")}
              </span>
            </div>

            <div className="flex gap-4 flex-1 min-h-0">
              <div className="flex-1 flex flex-col gap-3">
                <div className="bg-[#f4f1ea] border border-stone-300 p-4 shrink-0">
                  <h4 className="font-bold text-lg text-stone-900 leading-none mb-1">
                    {t("01. RGB Scan", "01. Pemindaian RGB")}
                  </h4>
                  <p className="text-sm text-stone-600 font-light leading-snug">
                    {t("Standard commercial drone imagery.", "Citra drone komersial standar.")}
                  </p>
                </div>
                <div className="flex-1 border border-stone-300 overflow-hidden relative bg-stone-100 flex items-center justify-center p-2">
                  <img
                    src={rgbPic}
                    alt="RGB scan"
                    className="w-full h-full object-cover shadow-sm bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center text-stone-300 pt-16">
                <ArrowRight className="w-8 h-8" />
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <div className="bg-[#f4f1ea] border border-stone-300 p-4 shrink-0">
                  <h4 className="font-bold text-lg text-stone-900 leading-none mb-1">
                    {t("02. NIR Generation", "02. Generasi NIR")}
                  </h4>
                  <p className="text-sm text-stone-600 font-light leading-snug">
                    {t("AI synthesizes near-infrared data.", "AI memproses data simulasi inframerah-dekat.")}
                  </p>
                </div>
                <div className="flex-1 border border-stone-300 overflow-hidden relative bg-stone-100 flex items-center justify-center p-2">
                  <img
                    src={nirTranslation}
                    alt="NIR translation"
                    className="w-full h-full object-cover shadow-sm bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center text-stone-300 pt-16">
                <ArrowRight className="w-8 h-8" />
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <div className="bg-[#4a5d23] border border-[#5f7434] p-4 shrink-0">
                  <h4 className="font-bold text-lg text-white leading-none mb-1">
                    {t("03. Detection", "03. Deteksi")}
                  </h4>
                  <p className="text-sm text-[#c2d49a] font-light leading-snug">
                    {t("Sick canopy flagged for removal.", "Kanopi sakit ditandai untuk penebangan.")}
                  </p>
                </div>
                <div className="flex-1 border border-[#4a5d23] overflow-hidden relative bg-stone-900 flex items-center justify-center p-2">
                  <img
                    src={sickLocated}
                    alt="Sick plant located"
                    className="w-full h-full object-cover shadow-sm bg-stone-800"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'value_farmer':
        return (
          <div className="h-full flex flex-col p-12 bg-[#f4f1ea]">
            <div className="flex items-start justify-between mb-8 shrink-0">
              <h2 className="text-5xl font-black text-stone-900 tracking-tighter leading-none">
                {t("what it means for you.", "apa artinya untuk Anda.")}
              </h2>
            </div>

            <div className="flex gap-8 flex-1 min-h-0">
              {/* LEFT COLUMN */}
              <div className="w-[45%] flex flex-col gap-6 h-full border border-stone-300 bg-white p-8">
                <Leaf className="w-12 h-12 text-[#4a5d23] mb-2" />
                <h3 className="font-bold text-3xl text-stone-900 leading-tight mb-4">
                  {t("Protecting Your Livelihood", "Melindungi Mata Pencaharian Anda")}
                </h3>
                <p className="text-lg text-stone-600 font-light leading-relaxed mb-6">
                  {t("Every tree you lose is money out of your pocket for years to come. By identifying sick trees early, you can surgically remove them and treat the surroundings, preventing the disease from jumping to your healthy, high-yield palms.", "Setiap pohon mati berarti kerugian di masa mendatang. Dengan deteksi sakit awal, Anda dapat usir penyakit dari lingkungan dan mencegahnya menyebar ke sawit yang sehat.")}
                </p>
                
                <div className="bg-[#f4f1ea] border-l-4 border-[#8b5a2b] p-4 mt-auto">
                  <h4 className="font-bold text-lg text-stone-800 mb-2">{t("Be Replant-Ready", "Siap Peremajaan (PSR)")}</h4>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {t("Our reports provide the exact data needed if you are applying for PSR (Peremajaan Sawit Rakyat) replanting funds. Hand them the map, prove the need, and get funded faster.", "Laporan kami membantu permohonan pendanaan PSR (Peremajaan Sawit Rakyat). Serahkan petanya, buktikan masalah, dan dapatkan pendanaan lebih cepat.")}
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="w-[55%] flex flex-col gap-6 h-full">
                <div className="bg-white border border-stone-300 p-6 flex-1 flex flex-col min-h-0">
                  <h3 className="font-bold tracking-tight uppercase font-mono text-sm text-stone-800 mb-6 shrink-0 leading-none">
                    {t("How you can get started", "Cara memulai pakai")}
                  </h3>
                  <div className="flex gap-6 flex-1 min-h-0">
                    <div className="flex-1 border-t-2 border-[#4a5d23] pt-4 flex flex-col bg-[#f9fafa] -mx-3 px-3 pb-3">
                      <div className="text-[#4a5d23] text-[11px] uppercase tracking-widest font-mono mb-2 flex justify-between items-center leading-none">
                        <span>{t("Individual Farm", "Lahan Pribadi")}</span>
                      </div>
                      <div className="text-2xl font-black text-stone-900 leading-none mb-1">
                        Rp 25k
                      </div>
                      <div className="text-xs text-stone-500 font-mono mb-4 leading-none">
                        /ha /scan
                      </div>
                      <ul className="text-sm text-stone-600 space-y-2 font-light flex-1 overflow-hidden">
                        <li>{t("• Only pay when you need an inspection", "• Bayar kalau mau inspeksi saja")}</li>
                        <li>{t("• Fast turnaround for the PDF report", "• Penyelesaian cepat buat laporan PDF")}</li>
                        <li>{t("• No long-term commitment", "• Tanpa ikatan jangka panjang")}</li>
                      </ul>
                    </div>

                    <div className="flex-1 border-t-2 border-stone-300 pt-4 flex flex-col">
                      <div className="text-stone-500 text-[11px] uppercase tracking-widest font-mono mb-2 leading-none">
                        {t("Through Your Koperasi", "Melalui Koperasi Anda")}
                      </div>
                      <div className="text-2xl font-black text-stone-900 leading-none mb-1">
                        Rp 2.5m
                      </div>
                      <div className="text-xs text-stone-500 font-mono mb-4 leading-none">
                        /month
                      </div>
                      <ul className="text-sm text-stone-600 space-y-2 font-light flex-1 overflow-hidden">
                        <li>{t("• Up to 500 hectares covered together", "• Boleh daftar sampai 500 hektar bersama")}</li>
                        <li>{t("• Greatly reduced cost per hectare", "• Harga jauh lebih terjangkau per hektar")}</li>
                        <li>{t("• Get regular monthly health checkups", "• Terima pemeriksaan rutin bulanan")}</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-stone-900 p-5 border border-stone-800 shrink-0 text-center">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-[#a3b87a] mb-2 leading-none">
                    {t("Next Step", "Langkah Selanjutnya")}
                  </h3>
                  <p className="text-sm text-stone-400 font-light leading-relaxed">
                    {t("Chat with us today to schedule your first flight and see the health of your plot.", "Mari ngobrol dengan kami sekarang buat atur jadwal survey awal dari plot Anda.")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Slide missing</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#1c1b1a] font-sans selection:bg-[#4a5d23] selection:text-white overflow-hidden">
      {/* Export overlay */}
      {showExport && (
        <div className="fixed inset-0 z-[9999] bg-[#1c1b1a] flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 text-[#c2d49a] animate-spin" />
          <span className="text-[#c2d49a] font-mono text-sm uppercase tracking-widest">
            {t('Generating PDF…', 'Menyiapkan PDF…')}
          </span>
        </div>
      )}

      {/* Hidden export container — rendered at native 1200×675 for capture */}
      {showExport && (
        <div
          id="pdf-export-container"
          className="fixed top-0 left-0 z-[9998]"
          style={{ width: 1200 }}
        >
          <style>{`#pdf-export-container * { animation: none !important; transition: none !important; }`}</style>
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="pdf-slide"
              style={{
                width: 1200,
                height: 675,
                overflow: 'hidden',
                background: '#fdfdfc',
              }}
            >
              {renderSlideContent(slide.id)}
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 w-full shadow-2xl relative flex flex-col bg-stone-900">
        <div
          ref={containerRef}
          className="flex-1 overflow-hidden relative flex items-center justify-center bg-[#151413]"
        >
          <div
            className="bg-[#fdfdfc] shadow-2xl overflow-hidden shrink-0"
            style={{
              width: 1200,
              height: 675,
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            {renderSlideContent(slides[currentSlide].id)}
          </div>
        </div>

        <div className="h-16 bg-stone-900 border-t border-stone-800 flex items-center justify-between px-8 shrink-0">
          <div className="font-mono text-xs text-stone-400 uppercase tracking-widest flex items-center gap-4">
            <span>Basalbuddy</span>
            <div className="flex bg-stone-800 rounded p-1">
              <button 
                onClick={() => { setAudience('investor'); setCurrentSlide(0); }}
                className={`px-3 py-1 rounded text-[10px] transition-colors ${audience === 'investor' ? 'bg-stone-700 text-white' : 'text-stone-400 hover:text-white'}`}
              >
                {t('Investor', 'Investor')}
              </button>
              <button 
                onClick={() => { setAudience('farmer'); setCurrentSlide(0); }}
                className={`px-3 py-1 rounded text-[10px] transition-colors ${audience === 'farmer' ? 'bg-stone-700 text-white' : 'text-stone-400 hover:text-white'}`}
              >
                {t('Farmer', 'Petani')}
              </button>
            </div>
            <div className="flex bg-stone-800 rounded p-1">
              <button 
                onClick={() => { setLanguage('en'); }}
                className={`px-3 py-1 rounded text-[10px] transition-colors ${language === 'en' ? 'bg-stone-700 text-white' : 'text-stone-400 hover:text-white'}`}
              >
                EN
              </button>
              <button 
                onClick={() => { setLanguage('id'); }}
                className={`px-3 py-1 rounded text-[10px] transition-colors ${language === 'id' ? 'bg-stone-700 text-white' : 'text-stone-400 hover:text-white'}`}
              >
                ID
              </button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="text-stone-400 hover:text-white disabled:opacity-20 disabled:hover:text-stone-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-[2px] transition-all duration-300 ${
                    idx === currentSlide
                      ? 'bg-[#c2d49a] w-8'
                      : 'bg-stone-700 w-4'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="text-stone-400 hover:text-white disabled:opacity-20 disabled:hover:text-stone-400 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="font-mono text-xs text-stone-400 uppercase tracking-widest">
              {String(currentSlide + 1).padStart(2, '0')} /{' '}
              {String(slides.length).padStart(2, '0')}
            </div>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-2 text-stone-400 hover:text-[#c2d49a] transition-colors border-l border-stone-800 pl-6 disabled:opacity-50 disabled:hover:text-stone-400"
            >
              <Download className="w-4 h-4" />
              <span className="font-mono text-xs uppercase tracking-widest pt-1">
                {isExporting ? t('Exporting...', 'Mengekspor...') : t('Export PDF', 'Ekspor PDF')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}