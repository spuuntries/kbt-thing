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
  Check,
  X,
  Minus,
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
  { id: 'differential' },
  { id: 'market_validation' },
  { id: 'business_model' },
  { id: 'bmc' },
  { id: 'credits' },
];

const farmerSlides = [
  { id: 'title_farmer' },
  { id: 'problem_farmer' },
  { id: 'solution_farmer' },
  { id: 'demo_farmer' },
  { id: 'value_farmer' },
  { id: 'credits' },
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

      case 'differential':
        return (
          <div className="h-full flex flex-col p-10 bg-white">
            <div className="flex items-start justify-between mb-6 shrink-0">
              <h2 className="text-5xl font-black text-stone-900 tracking-tighter leading-none">
                {t("the differential.", "diferensiasi.")}
              </h2>
              <span
                className="font-mono text-sm tracking-widest text-[#4a5d23] uppercase border border-[#4a5d23] px-3 py-1.5 shrink-0 whitespace-nowrap"
                style={{ lineHeight: 1 }}
              >
                {t("Competitive Landscape", "Lanskap Kompetitif")}
              </span>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              {/* Table */}
              <div className="flex-1 border border-stone-300 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex bg-stone-900 text-white shrink-0">
                  <div className="w-[18%] p-3 font-mono text-[9px] uppercase tracking-widest text-stone-400 leading-none flex items-center">
                    {t("Dimension", "Dimensi")}
                  </div>
                  <div className="w-[13.2%] p-3 font-mono text-[9px] uppercase tracking-widest text-stone-400 leading-none flex items-center border-l border-stone-700">
                    {t("Manual Scouting", "Inspeksi Manual")}
                  </div>
                  <div className="w-[13.2%] p-3 font-mono text-[9px] uppercase tracking-widest text-stone-400 leading-none flex items-center border-l border-stone-700">
                    {t("Multispectral Drones", "Drone Multispektral")}
                  </div>
                  <div className="w-[13.2%] p-3 font-mono text-[9px] uppercase tracking-widest text-stone-400 leading-none flex items-center border-l border-stone-700">
                    {t("Enterprise Platforms", "Platform Enterprise")}
                  </div>
                  <div className="w-[13.2%] p-3 font-mono text-[9px] uppercase tracking-widest text-stone-400 leading-none flex items-center border-l border-stone-700">
                    {t("Resistant Seedlings", "Bibit Toleran")}
                  </div>
                  <div className="w-[29.2%] p-3 font-mono text-[9px] uppercase tracking-widest text-[#c2d49a] leading-none flex items-center border-l border-[#5f7434] bg-[#4a5d23]">
                    basalbuddy.
                  </div>
                </div>

                {/* Rows */}
                {[
                  {
                    dim: t("Hardware Cost", "Biaya Perangkat"),
                    vals: [
                      { icon: 'check', label: t("None (foot patrol)", "Tidak ada (patroli kaki)"), sup: '1' },
                      { icon: 'x', label: t("$10k+ camera", "$10k+ kamera"), sup: '3' },
                      { icon: 'x', label: t("Custom fleet + sensors", "Armada + sensor"), sup: '4' },
                      { icon: 'minus', label: t("Seed cost only, but replanting needed", "Biaya bibit saja, tapi perlu tanam ulang"), sup: '6,7,8' },
                      { icon: 'check', label: t("Any consumer RGB drone", "Drone konsumen RGB apa pun") },
                    ],
                  },
                  {
                    dim: t("Detection Timing", "Waktu Deteksi"),
                    vals: [
                      { icon: 'x', label: t("Late-stage only (>70% dmg)", "Stadium akhir (>70% rusak)"), sup: '1,2' },
                      { icon: 'check', label: t("Early spectral anomalies", "Anomali spektral awal"), sup: '3' },
                      { icon: 'check', label: t("Early via NDVI/thermal", "Awal via NDVI/termal"), sup: '4' },
                      { icon: 'x', label: t("Prevention, not detection", "Pencegahan, bukan deteksi"), sup: '6,7,8' },
                      { icon: 'check', label: t("Early via AI-synthesized NIR", "Awal via NIR sintetis AI") },
                    ],
                  },
                  {
                    dim: t("Smallholder Access", "Akses Petani Kecil"),
                    vals: [
                      { icon: 'minus', label: t("Accessible but ineffective", "Terjangkau tapi tak efektif"), sup: '1' },
                      { icon: 'x', label: t("Priced out entirely", "Terlalu mahal"), sup: '3' },
                      { icon: 'x', label: t("Enterprise contracts only", "Kontrak enterprise saja"), sup: '4,5' },
                      { icon: 'minus', label: t("Available via replanting programs", "Tersedia via program peremajaan"), sup: '6,7,8' },
                      { icon: 'check', label: t("Rp 25k/ha pay-as-you-go", "Rp 25rb/ha bayar per pakai") },
                    ],
                  },
                  {
                    dim: t("Ganoderma Specificity", "Spesifisitas Ganoderma"),
                    vals: [
                      { icon: 'x', label: t("Subjective visual guess", "Tebakan visual subjektif"), sup: '2' },
                      { icon: 'minus', label: t("General stress, not disease-specific", "Stres umum, bukan spesifik"), sup: '3' },
                      { icon: 'minus', label: t("Tree counting & health index", "Hitung pohon & indeks"), sup: '5' },
                      { icon: 'minus', label: t("Tolerant, not immune (still gets BSR)", "Toleran, bukan kebal (tetap kena BSR)"), sup: '6,7,8' },
                      { icon: 'check', label: t("Trained on BSR canopy signatures", "Dilatih pada tanda kanopi BSR") },
                    ],
                  },
                  {
                    dim: t("Actionable Output", "Keluaran Aksi"),
                    vals: [
                      { icon: 'x', label: t("Mental notes / manual logs", "Catatan manual"), sup: '1' },
                      { icon: 'minus', label: t("Raw spectral maps (needs expert)", "Peta spektral (butuh ahli)"), sup: '3' },
                      { icon: 'check', label: t("Dashboard + analytics", "Dasbor + analitik"), sup: '4' },
                      { icon: 'x', label: t("No monitoring output", "Tanpa keluaran pemantauan"), sup: '6,7,8' },
                      { icon: 'check', label: t("Geo-tagged PDF + GeoTIFF", "PDF geo-tag + GeoTIFF") },
                    ],
                  },
                ].map((row, ri) => (
                  <div
                    key={ri}
                    className={`flex flex-1 min-h-0 ${
                      ri % 2 === 0 ? 'bg-white' : 'bg-[#f9f8f6]'
                    } border-t border-stone-200`}
                  >
                    <div className="w-[18%] p-3 flex items-center">
                      <span className="font-bold text-[11px] text-stone-900 leading-snug">
                        {row.dim}
                      </span>
                    </div>
                    {row.vals.map((cell, ci) => {
                      const isLast = ci === 4;
                      return (
                        <div
                          key={ci}
                          className={`${isLast ? 'w-[29.2%]' : 'w-[13.2%]'} p-3 flex items-start gap-2 border-l ${
                            isLast
                              ? 'border-[#d4dfc0] bg-[#f0f4e8]'
                              : 'border-stone-200'
                          }`}
                        >
                          <div className="shrink-0 mt-0.5">
                            {cell.icon === 'check' && (
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                isLast ? 'bg-[#4a5d23]' : 'bg-emerald-600'
                              }`}>
                                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                              </div>
                            )}
                            {cell.icon === 'x' && (
                              <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                                <X className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                              </div>
                            )}
                            {cell.icon === 'minus' && (
                              <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
                                <Minus className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          <span className={`text-[10px] leading-snug font-light ${
                            isLast ? 'text-stone-800 font-medium' : 'text-stone-600'
                          }`}>
                            {cell.label}
                            {cell.sup && (
                              <sup className="text-[7px] text-stone-400 ml-0.5 font-mono">{cell.sup}</sup>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Bottom callout */}
              <div className="mt-2 flex gap-4 shrink-0">
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-emerald-600" />
                    <span className="font-mono text-[9px] text-stone-500 uppercase tracking-widest leading-none">
                      {t("Advantage", "Keunggulan")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="font-mono text-[9px] text-stone-500 uppercase tracking-widest leading-none">
                      {t("Partial", "Sebagian")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="font-mono text-[9px] text-stone-500 uppercase tracking-widest leading-none">
                      {t("Disadvantage", "Kerugian")}
                    </span>
                  </div>
                </div>
                <div className="flex-1 bg-[#f4f1ea] border border-stone-300 px-4 py-2 flex items-center">
                  <span className="text-[10px] text-stone-700 font-light leading-snug">
                    {t(
                      "Every existing approach forces a tradeoff between detection accuracy and farmer accessibility, basalbuddy eliminates it.",
                      "Setiap pendekatan yang ada memaksa kompromi antara akurasi deteksi dan keterjangkauan petani, basalbuddy menghilangkannya."
                    )}
                  </span>
                </div>
              </div>

              {/* Footnote sources */}
              <div className="mt-1.5 shrink-0">
                <p className="text-[7px] text-stone-400 font-mono leading-relaxed tracking-wide">
                  <sup>1</sup> Liaghat et al., "Early Detection of Ganoderma in Oil Palm," J. Food, Agric. & Environ., 2014 &nbsp;
                  <sup>2</sup> Khaled et al., "Detection of BSR Disease in Oil Palm," Int. J. of Agric. & Biol., NIH/PMC &nbsp;
                  <sup>3</sup> Ahmadi et al., "Multispectral Remote Sensing for Disease Detection in Palms," IntechOpen, 2017 &nbsp;
                  <sup>4</sup> Terra Agri (prev. Avirtech), terra-drone.net &nbsp;
                  <sup>5</sup> Garuda Robotics, "Plantation 4.0," garuda.io &nbsp;
                  <sup>6</sup> Socfindo, "DxP MT Gano," socfindo.co.id, 2013 &nbsp;
                  <sup>7</sup> Golden Agri-Resources, "GAR Seeds," goldenagri.com.sg &nbsp;
                  <sup>8</sup> Astra Agro Lestari, "DxP AAL Nirmala/Lestari/Sejahtera MRG," astra-agro.co.id, 2025
                </p>
              </div>
            </div>
          </div>
        );

      case 'market_validation':
        return (
          <div className="h-full flex flex-col p-12 bg-white">
            <div className="flex items-start justify-between mb-8 shrink-0">
              <h2 className="text-5xl font-black text-stone-900 tracking-tighter leading-none">
                {t("voice of the farmers.", "suara para petani.")}
              </h2>
              <span
                className="font-mono text-sm tracking-widest text-[#8b5a2b] uppercase border border-[#8b5a2b] px-3 py-1.5 shrink-0 whitespace-nowrap"
                style={{ lineHeight: 1 }}
              >
                {t("Market Validation", "Validasi Pasar")}
              </span>
            </div>

            <div className="flex gap-8 flex-1 min-h-0">
              {/* Left Side: Survey Stats */}
              <div className="w-1/3 flex flex-col gap-6">
                <div className="bg-[#f4f1ea] p-6 border border-stone-300">
                  <div className="text-4xl font-black text-[#8b5a2b] mb-1">30</div>
                  <div className="text-sm font-mono text-stone-500 uppercase tracking-widest leading-none mb-4">
                    {t("Plantations Surveyed", "Perkebunan Disurvei")}
                  </div>
                  <p className="text-stone-600 font-light text-sm">
                    {t("Spanning from 2ha independent smallholders up to 28,000ha enterprise operators.", "Mencakup dari 2ha petani mandiri hingga 28.000ha kebun perusahaan.")}
                  </p>
                </div>
                
                <div className="bg-[#f4f1ea] p-6 border border-stone-300">
                  <div className="text-4xl font-black text-[#8b5a2b] mb-1">56%</div>
                  <div className="text-sm font-mono text-stone-500 uppercase tracking-widest leading-none mb-4">
                    {t("Ganoderma Infection", "Infeksi Ganoderma")}
                  </div>
                  <p className="text-stone-600 font-light text-sm">
                    {t("Over half have experienced catastrophic yield loss from Basal Stem Rot.", "Lebih dari setengahnya mengalami kehilangan hasil panen akibat Busuk Pangkal Batang.")}
                  </p>
                </div>

                <div className="bg-[#4a5d23] text-white p-6 border border-[#5f7434]">
                   <div className="text-4xl font-black text-[#c2d49a] mb-1">93%</div>
                   <div className="text-sm font-mono text-[#c2d49a] uppercase tracking-widest leading-none mb-4">
                     {t("Manual Inspection", "Inspeksi Manual")}
                   </div>
                   <p className="text-stone-200 font-light text-sm">
                     {t("Rely on walking the plot. By the time they see yellowing fronds, the tree is already dead.", "Mengandalkan patroli jalan kaki. Saat daun menguning, pohon sudah mati.")}
                   </p>
                </div>
              </div>

              {/* Right Side: Quotes & Findings */}
              <div className="w-2/3 flex flex-col gap-6">
                <div className="border-t-2 border-stone-900 pt-6 flex-1 flex flex-col">
                   <h3 className="text-2xl font-bold text-stone-900 tracking-tight mb-6">
                     {t("The Real Problem: Too Late to Save", "Masalah Sebenarnya: Terlambat Diselamatkan")}
                   </h3>
                   <div className="space-y-6 flex-1">
                     <div className="bg-stone-50 p-6 border-l-4 border-[#8b5a2b]">
                       <p className="text-stone-600 italic text-lg mb-4">
                         "{t("When do I realize the tree is sick? When the leaves wither or start yellowing... Sometimes the tree just breaks and falls suddenly.", "Kapan baru sadar kalau pohon sakit? Saat daun mulai layu atau menguning... Tau-tau patah pohonnya rubuh.")}"
                       </p>
                       <div className="text-sm font-mono text-stone-400 uppercase tracking-widest">
                         — {t("Surveyed Independent Farmers", "Petani Mandiri yang Disurvei")}
                       </div>
                     </div>
                     
                     <div className="bg-stone-50 p-6 border-l-4 border-[#4a5d23]">
                       <p className="text-stone-600 italic text-lg mb-4">
                         "{t("Walking to check trees is too slow on large plots. Drones can give biased data unless it specifically sees Ganoderma. If there's an effective and cheap method, it's great for saving the palms.", "Bukanlah hal yang sulit dalam mendeteksi ganoderma secara kasat mata, yang terpenting adalah cara mengobati dan deteksi dini... Jika ada metode dan solusi efektif serta murah tentu bagus untuk menyelamatkan sawit.")}"
                       </p>
                       <div className="text-sm font-mono text-stone-400 uppercase tracking-widest">
                         — {t("Estate Managers & Co-op Leads", "Manajer Kebun & Pengurus Koperasi")}
                       </div>
                     </div>
                     <div className="space-y-6"></div>
                   </div>

                   <div className="bg-stone-900 p-6 text-center mt-auto flex items-center justify-between">
                     <span className="text-xl font-medium text-white">{t("Interest in Early Detection Mapping", "Tertarik dengan Pemetaan Deteksi Dini")}</span>
                     <span className="text-3xl font-black text-[#c2d49a]">~83%</span>
                   </div>
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

      case 'bmc':
        return (
          <div className="h-full flex flex-col p-12 bg-white">
            <div className="flex items-start justify-between mb-8 shrink-0">
              <h2 className="text-5xl font-black text-stone-900 tracking-tighter leading-none">
                {t("business model canvas.", "kanvas model bisnis.")}
              </h2>
              <span
                className="font-mono text-sm tracking-widest text-[#8b5a2b] uppercase border border-[#8b5a2b] px-3 py-1.5 shrink-0 whitespace-nowrap"
                style={{ lineHeight: 1 }}
              >
                {t("Strategy", "Strategi")}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-4 min-h-0">
              {/* TOP ROW: 5 Columns */}
              <div className="flex-[2] flex gap-4 min-h-0">
                {/* Key Partners */}
                <div className="flex-1 bg-[#f4f1ea] border border-stone-300 p-4 flex flex-col overflow-hidden">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-stone-500 mb-3 shrink-0 leading-none">
                    {t("Key Partners", "Mitra Utama")}
                  </h3>
                  <ul className="text-sm text-stone-800 font-medium space-y-2 flex-1 overflow-hidden">
                    <li className="flex items-start gap-2"><span className="text-[#8b5a2b] mt-0.5">●</span> <span>{t("Local Cooperatives (KUD)", "Koperasi Unit Desa (KUD)")}</span></li>
                    <li className="flex items-start gap-2"><span className="text-[#8b5a2b] mt-0.5">●</span> <span>{t("Agritech Communities", "Komunitas Agritech")}</span></li>
                    <li className="flex items-start gap-2"><span className="text-[#8b5a2b] mt-0.5">●</span> <span>{t("Academic / Research Institutions", "Institusi Akademik / Riset")}</span></li>
                    <li className="flex items-start gap-2"><span className="text-[#8b5a2b] mt-0.5">●</span> <span>{t("Drone Communities", "Komunitas Drone")}</span></li>
                  </ul>
                </div>

                {/* Key Activities & Resources */}
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                  <div className="flex-1 bg-white border border-stone-300 p-4 flex flex-col overflow-hidden">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-2 shrink-0 leading-none">
                      {t("Key Activities", "Aktivitas Utama")}
                    </h3>
                    <ul className="text-xs text-stone-800 font-medium space-y-1.5 flex-1 overflow-hidden">
                      <li className="flex items-start gap-1.5"><span className="text-[#4a5d23] mt-0.5">●</span> <span>{t("AI/ML Model Fine-Tuning", "Penyempurnaan Model AI/ML")}</span></li>
                      <li className="flex items-start gap-1.5"><span className="text-[#4a5d23] mt-0.5">●</span> <span>{t("Cloud Platform Dev", "Pengembangan Platform Cloud")}</span></li>
                      <li className="flex items-start gap-1.5"><span className="text-[#4a5d23] mt-0.5">●</span> <span>{t("Heatmap Generation", "Generasi Heatmap")}</span></li>
                    </ul>
                  </div>
                  <div className="flex-1 bg-white border border-stone-300 p-4 flex flex-col overflow-hidden">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-2 shrink-0 leading-none">
                      {t("Key Resources", "Sumber Daya Utama")}
                    </h3>
                    <ul className="text-xs text-stone-800 font-medium space-y-1.5 flex-1 overflow-hidden">
                      <li className="flex items-start gap-1.5"><span className="text-[#4a5d23] mt-0.5">●</span> <span>{t("Proprietary CycleGAN", "Model CycleGAN Kepemilikan")}</span></li>
                      <li className="flex items-start gap-1.5"><span className="text-[#4a5d23] mt-0.5">●</span> <span>{t("Visual Datasets", "Dataset Visual")}</span></li>
                      <li className="flex items-start gap-1.5"><span className="text-[#4a5d23] mt-0.5">●</span> <span>{t("Compute Infrastructure", "Infrastruktur Komputasi")}</span></li>
                    </ul>
                  </div>
                </div>

                {/* Value Propositions */}
                <div className="flex-[1.2] bg-[#4a5d23] border border-[#5f7434] p-4 flex flex-col text-white overflow-hidden">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-[#a3b87a] mb-3 shrink-0 leading-none">
                    {t("Value Propositions", "Nilai Proporsi")}
                  </h3>
                  <div className="flex-1 flex flex-col justify-center space-y-6">
                    <div>
                      <div className="font-bold text-[#c2d49a] mb-0.5 text-sm">{t("Hardware Agnostic", "Tanpa Batasan Hardware")}</div>
                      <p className="text-[11px] text-stone-200 font-light leading-snug">{t("Accessible via any commercial consumer RGB drone. No need for $10k multispectral setups.", "Dapat diakses dengan drone RGB komersial biasa. Tidak butuh perangkat multispektral mahal.")}</p>
                    </div>
                    <div>
                      <div className="font-bold text-[#c2d49a] mb-0.5 text-sm">{t("Early Detection", "Deteksi Dini")}</div>
                      <p className="text-[11px] text-stone-200 font-light leading-snug">{t("Spot Ganoderma signs before visual symptoms to prevent devastating spread.", "Deteksi tanda awal Ganoderma sebelum gejala visual terlihat untuk mencegah penyebaran.")}</p>
                    </div>
                    <div>
                      <div className="font-bold text-[#c2d49a] mb-0.5 text-sm">{t("Bankable Data", "Data Terpercaya")}</div>
                      <p className="text-[11px] text-stone-200 font-light leading-snug">{t("Precise PDF reports directly aiding PSR replanting fund applications.", "Laporan PDF presisi langsung membantu pengajuan dana PSR.")}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Relationships & Channels */}
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                  <div className="flex-1 bg-white border border-stone-300 p-4 flex flex-col overflow-hidden">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-2 shrink-0 leading-none">
                      {t("Customer Relationships", "Hubungan Pelanggan")}
                    </h3>
                    <ul className="text-xs text-stone-800 font-medium space-y-1.5 flex-1 overflow-hidden">
                      <li className="flex items-start gap-1.5"><span className="text-[#8b5a2b] mt-0.5">●</span> <span>{t("Self-serve Portal", "Portal Mandiri")}</span></li>
                      <li className="flex items-start gap-1.5"><span className="text-[#8b5a2b] mt-0.5">●</span> <span>{t("KUD Dedicated Support", "Dukungan Khusus KUD")}</span></li>
                      <li className="flex items-start gap-1.5"><span className="text-[#8b5a2b] mt-0.5">●</span> <span>{t("B2B Enterprise Integration", "Integrasi B2B Perusahaan")}</span></li>
                    </ul>
                  </div>
                  <div className="flex-1 bg-white border border-stone-300 p-4 flex flex-col overflow-hidden">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-2 shrink-0 leading-none">
                      {t("Channels", "Saluran")}
                    </h3>
                    <ul className="text-xs text-stone-800 font-medium space-y-1.5 flex-1 overflow-hidden">
                      <li className="flex items-start gap-1.5"><span className="text-[#8b5a2b] mt-0.5">●</span> <span>{t("Co-op Direct Sales", "Penjualan Langsung Koperasi")}</span></li>
                      <li className="flex items-start gap-1.5"><span className="text-[#8b5a2b] mt-0.5">●</span> <span>{t("WhatsApp / Telegram Groups", "Grup WhatsApp / Telegram")}</span></li>
                      <li className="flex items-start gap-1.5"><span className="text-[#8b5a2b] mt-0.5">●</span> <span>{t("Agritech Expos", "Pameran Agritech")}</span></li>
                    </ul>
                  </div>
                </div>

                {/* Customer Segments */}
                <div className="flex-1 bg-[#f4f1ea] border border-stone-300 p-4 flex flex-col overflow-hidden">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-stone-500 mb-3 shrink-0 leading-none">
                    {t("Customer Segments", "Segmen Pelanggan")}
                  </h3>
                  <div className="space-y-3 flex-1 overflow-hidden">
                    <div>
                      <div className="font-bold text-stone-900 mb-0.5 text-sm">{t("Independent Farmers", "Petani Mandiri")}</div>
                      <p className="text-[11px] text-stone-600 leading-snug">{t("Smallholders (2-10ha) seeking ad-hoc low-cost inspections.", "Petani kecil (2-10ha) mencari inspeksi murah ad-hoc.")}</p>
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 mb-0.5 text-sm">{t("Palm Oil Cooperatives", "Koperasi Sawit (KUD)")}</div>
                      <p className="text-[11px] text-stone-600 leading-snug">{t("Groups managing 100-500ha needing centralized monitoring.", "Grup mengelola 100-500ha butuh pantauan terpusat.")}</p>
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 mb-0.5 text-sm">{t("Enterprise Estates", "Perkebunan Perusahaan")}</div>
                      <p className="text-[11px] text-stone-600 leading-snug">{t("Large operators (>5,000ha) needing API and automated pipelines.", "Operator besar (>5k ha) butuh otomatisasi.")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW: 2 Columns */}
              <div className="flex-1 flex gap-4 min-h-0">
                {/* Cost Structure */}
                <div className="flex-1 bg-white border border-stone-300 p-4 flex flex-col justify-center overflow-hidden">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-stone-500 mb-2 shrink-0 leading-none">
                    {t("Cost Structure", "Struktur Biaya")}
                  </h3>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="text-xl font-black text-stone-900 leading-none mb-1">
                        {t("Cloud & Compute", "Cloud & Komputasi")}
                      </div>
                      <div className="text-[11px] text-stone-600 font-light mt-1">
                        {t("GPU instances for CycleGAN inference and map storage.", "Instans GPU untuk inferensi CycleGAN dan data.")}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xl font-black text-stone-900 leading-none mb-1">
                        {t("R&D / Staff", "Riset & Staf")}
                      </div>
                      <div className="text-[11px] text-stone-600 font-light mt-1">
                        {t("Continuous dataset curation and platform engineering.", "Kurasi dataset konstan & rekayasa platform.")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Streams */}
                <div className="flex-1 bg-white border border-stone-300 p-4 flex flex-col justify-center overflow-hidden">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-stone-500 mb-2 shrink-0 leading-none">
                    {t("Revenue Streams", "Aliran Pendapatan")}
                  </h3>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="text-xl font-black text-[#4a5d23] leading-none mb-1">
                        {t("Subscription", "Langganan")}
                      </div>
                      <div className="text-[11px] text-stone-600 font-light mt-1">
                        {t("Rp 2.5m/mo per cooperative for up to 500ha combined coverage.", "Rp 2,5jt/bln per koperasi maks 500ha gabungan.")}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xl font-black text-[#4a5d23] leading-none mb-1">
                        {t("Pay-Per-Scan", "Bayar Per Pindai")}
                      </div>
                      <div className="text-[11px] text-stone-600 font-light mt-1">
                        {t("Rp 25k/ha for independent farmers generating ad-hoc PDF reports.", "Rp 25rb/ha u/ petani mandiri (laporan PDF ad-hoc).")}
                      </div>
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

      case 'credits':
        return (
          <div className="flex flex-col h-full justify-center items-center p-12 bg-stone-900">
            <h2 className="text-4xl font-black text-white tracking-tighter mb-16">
              {t("the team.", "tim kami.")}
            </h2>
            <div className="grid grid-cols-2 max-w-4xl w-full gap-8">
              {[
                { id: "5054231011", name: "Muhammad Farhan Arya Wicaksono" },
                { id: "5054231018", name: "Imam Muhammad Diponegoro" },
                { id: "5054231013", name: "Faiz Muhammad Kautsar" },
                { id: "5054231006", name: "Muhammad Naufal Arifin" }
              ].map((member) => (
                <div key={member.id} className="border border-stone-700 bg-stone-800 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-[#a3b87a] transition-all">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#4a5d23] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="font-mono text-sm tracking-widest text-[#a3b87a] mb-2">{member.id}</span>
                  <span className="text-xl font-bold text-stone-200">{member.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-16 flex items-center justify-center gap-3 opacity-50">
              <Leaf className="w-6 h-6 text-white" />
              <span className="font-black text-xl tracking-tighter text-white">basalbuddy.</span>
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