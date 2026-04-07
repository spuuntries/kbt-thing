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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showExport, setShowExport] = useState(false);

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
                Pitch Deck
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-center max-w-5xl">
              <h1 className="text-[7.5rem] font-black text-stone-900 tracking-tighter leading-none mb-6">
                basalbuddy.
              </h1>
              <p className="text-3xl text-stone-600 font-light max-w-4xl leading-snug">
                democratizing canopy health & early ganoderma detection for
                independent palm smallholders.
              </p>
            </div>
            <div className="shrink-0">
              <div className="w-full h-px bg-stone-300 mb-4 mt-8" />
              <div className="flex justify-between font-mono text-xs text-stone-500 uppercase tracking-widest leading-none">
                <span>Confidential</span>
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
                the crisis.
              </h2>
              <span
                className="font-mono text-sm tracking-widest text-[#8b5a2b] uppercase border border-[#8b5a2b] px-3 py-1.5 shrink-0 whitespace-nowrap"
                style={{ lineHeight: 1 }}
              >
                Problem Statement
              </span>
            </div>

            <div className="flex flex-col flex-1 min-h-0 gap-8">
              <div className="flex gap-12 flex-1 min-h-0">
                <div className="flex-1 border-t-2 border-stone-900 pt-6 flex flex-col">
                  <div className="text-[#8b5a2b] mb-4">
                    <Wind className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-stone-900 tracking-tight mb-4 shrink-0">
                    The Silent Killer
                  </h3>
                  <p className="text-stone-600 text-xl font-light leading-relaxed flex-1 overflow-hidden">
                    Ganoderma (Basal Stem Rot) ruins yields and lingers in soil.
                    By the time visual symptoms appear to the human eye, the tree
                    is already dead and infecting the surrounding plot.
                  </p>
                </div>
                <div className="flex-1 border-t-2 border-stone-900 pt-6 flex flex-col">
                  <div className="text-[#4a5d23] mb-4">
                    <Activity className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-stone-900 tracking-tight mb-4 shrink-0">
                    The Hardware Barrier
                  </h3>
                  <p className="text-stone-600 text-xl font-light leading-relaxed flex-1 overflow-hidden">
                    True multispectral drones cost upwards of $10,000.
                    Smallholder farmers—who own 41% of plantations—literally
                    cannot afford the hardware needed to detect stress early.
                  </p>
                </div>
              </div>

              <div className="bg-[#e8e4db] p-6 border border-stone-300 flex items-center justify-between shrink-0">
                <span className="font-mono text-base text-stone-500 uppercase tracking-widest leading-none">
                  Current Market Failure
                </span>
                <span className="text-2xl text-stone-800 font-medium leading-none">
                  Smallholders are priced out of precision agriculture.
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
                the approach.
              </h2>
              <span
                className="font-mono text-sm tracking-widest text-[#4a5d23] uppercase border border-[#4a5d23] px-3 py-1.5 shrink-0 whitespace-nowrap"
                style={{ lineHeight: 1 }}
              >
                Technical Pipeline
              </span>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
              <div className="flex-1 border border-stone-300 p-6 flex flex-col bg-white">
                <div className="text-[#8b5a2b] font-mono text-xl mb-6 border-b border-stone-200 pb-3 shrink-0">
                  01.
                </div>
                <Smartphone className="w-10 h-10 text-stone-800 mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-stone-900 tracking-tight mb-3 shrink-0">
                  RGB Acquisition
                </h4>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  Farmer flies any commercial consumer drone (e.g., DJI Mini). We
                  rely on any standard spatial resolution, upscaling when needed.
                </p>
                <div className="mt-auto font-mono text-xs text-stone-400 bg-stone-100 p-3 shrink-0 leading-relaxed">
                  // No radiometric calibration or IR-cut filter removals needed.
                </div>
              </div>

              <div className="flex-1 border border-stone-300 p-6 flex flex-col bg-[#f4f1ea]">
                <div className="text-[#8b5a2b] font-mono text-xl mb-6 border-b border-stone-300 pb-3 shrink-0">
                  02.
                </div>
                <Sprout className="w-10 h-10 text-stone-800 mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-stone-900 tracking-tight mb-3 shrink-0">
                  Spectral Approximation
                </h4>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  Pipeline uses a CycleGAN to approximate NIR/Red-Edge bands from
                  structural RGB cues, fed into a ViT for segmentation.
                </p>
                <div className="mt-auto font-mono text-xs text-[#8b5a2b] bg-[#e8e4db] p-3 shrink-0 leading-relaxed">
                  // This Image-to-image translation bridges the hardware gap.
                </div>
              </div>

              <div className="flex-1 border border-[#4a5d23] p-6 flex flex-col bg-[#4a5d23] text-stone-100">
                <div className="text-[#a3b87a] font-mono text-xl mb-6 border-b border-[#5f7434] pb-3 shrink-0">
                  03.
                </div>
                <ShieldCheck className="w-10 h-10 text-[#c2d49a] mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-white tracking-tight mb-3 shrink-0">
                  Geo-Registered Inference
                </h4>
                <p className="text-[#c2d49a] text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  Platform generates a segmented GeoTIFF heatmap, plotting exact
                  RTK coordinates of anomalous canopies.
                </p>
                <div className="mt-auto font-mono text-xs text-[#4a5d23] bg-[#c2d49a] p-3 shrink-0 leading-relaxed">
                  // Targeted culling minimizes collateral yield loss.
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
                commercialization.
              </h2>
            </div>

            <div className="flex gap-8 flex-1 min-h-0">
              {/* LEFT COLUMN */}
              <div className="w-[35%] flex flex-col gap-6 h-full">
                <div className="bg-white border border-stone-300 p-6 flex-1 flex flex-col relative overflow-hidden">
                  <h3 className="font-bold tracking-tight uppercase font-mono text-sm text-stone-800 mb-4 shrink-0">
                    Market Potential
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
                          Endemic
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
                    The Data Moat
                  </h3>
                  <p className="text-sm text-stone-400 font-light leading-relaxed">
                    Farmers receive bankable replanting data. Basalbuddy acquires
                    massive visual datasets to continuously fine-tune our base
                    models.
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="w-[65%] flex flex-col gap-6 h-full">
                <div className="bg-white border border-stone-300 p-6 flex-1 flex flex-col min-h-0">
                  <h3 className="font-bold tracking-tight uppercase font-mono text-sm text-stone-800 mb-6 shrink-0 leading-none">
                    Revenue Streams
                  </h3>
                  <div className="flex gap-6 flex-1 min-h-0">
                    <div className="flex-1 border-t-2 border-stone-300 pt-4 flex flex-col">
                      <div className="text-stone-500 text-[11px] uppercase tracking-widest font-mono mb-2 leading-none">
                        Independent
                      </div>
                      <div className="text-2xl font-black text-stone-900 leading-none mb-1">
                        Rp 25k
                      </div>
                      <div className="text-xs text-stone-500 font-mono mb-4 leading-none">
                        /ha /scan
                      </div>
                      <ul className="text-sm text-stone-600 space-y-2 font-light flex-1 overflow-hidden">
                        <li>Pay-as-you-go PDF reports</li>
                        <li>No hardware required, any RGB drone</li>
                      </ul>
                    </div>

                    <div className="flex-1 border-t-2 border-[#4a5d23] pt-4 flex flex-col bg-[#f9fafa] -mx-3 px-3 pb-3">
                      <div className="text-[#4a5d23] text-[11px] uppercase tracking-widest font-mono mb-2 flex justify-between items-center leading-none">
                        <span>Koperasi</span>
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
                        <li>Covers up to 500 hectares</li>
                        <li>Central management dashboard</li>
                        <li>PSR replanting data prep</li>
                      </ul>
                    </div>

                    <div className="flex-1 border-t-2 border-stone-300 pt-4 flex flex-col">
                      <div className="text-stone-500 text-[11px] uppercase tracking-widest font-mono mb-2 leading-none">
                        Enterprise
                      </div>
                      <div className="text-2xl font-black text-stone-900 leading-none mb-1">
                        Rp 150m
                      </div>
                      <div className="text-xs text-stone-500 font-mono mb-4 leading-none">
                        /year
                      </div>
                      <ul className="text-sm text-stone-600 space-y-2 font-light flex-1 overflow-hidden">
                        <li>Direct API system integration</li>
                        <li>Custom fine-tuned CV models</li>
                        <li>Continuous monitoring portal</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 shrink-0">
                  <div className="flex-1 bg-white border border-stone-300 p-5 flex items-start gap-4">
                    <Globe className="w-5 h-5 text-[#8b5a2b] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 leading-none">
                        Impact
                      </div>
                      <p className="text-sm text-stone-800 font-light leading-snug">
                        Optimizes yield for the lower-middle class, directly
                        reducing deforestation pressure.
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 bg-white border border-stone-300 p-5 flex items-start gap-4">
                    <TrendingUp className="w-5 h-5 text-[#4a5d23] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 mb-1.5 leading-none">
                        Financial
                      </div>
                      <p className="text-sm text-stone-800 font-light leading-snug">
                        Pure software play minimizes CAPEX. High margin scaling
                        via cloud inference.
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
                Farmer Briefing
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-center max-w-5xl">
              <h1 className="text-[7.5rem] font-black text-stone-900 tracking-tighter leading-none mb-6">
                basalbuddy.
              </h1>
              <p className="text-3xl text-stone-600 font-light max-w-4xl leading-snug">
                know which trees are sick before it's too late. protect your yield with simple drone flights.
              </p>
            </div>
            <div className="shrink-0">
              <div className="w-full h-px bg-stone-300 mb-4 mt-8" />
              <div className="flex justify-between font-mono text-xs text-stone-500 uppercase tracking-widest leading-none">
                <span>Farmer Facing</span>
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
                what's eating your yield?
              </h2>
              <span
                className="font-mono text-sm tracking-widest text-[#8b5a2b] uppercase border border-[#8b5a2b] px-3 py-1.5 shrink-0 whitespace-nowrap"
                style={{ lineHeight: 1 }}
              >
                The Threat
              </span>
            </div>

            <div className="flex flex-col flex-1 min-h-0 gap-8">
              <div className="flex gap-12 flex-1 min-h-0">
                <div className="flex-1 border-t-2 border-stone-900 pt-6 flex flex-col">
                  <div className="text-[#8b5a2b] mb-4">
                    <Activity className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-stone-900 tracking-tight mb-4 shrink-0">
                    The Silent Thief (Ganoderma)
                  </h3>
                  <p className="text-stone-600 text-xl font-light leading-relaxed flex-1 overflow-hidden">
                    Ganoderma spreads quietly underground. By the time you notice yellowing fronds or wilting, the tree is gone—and it's probably already infected its neighbors.
                  </p>
                </div>
                <div className="flex-1 border-t-2 border-stone-900 pt-6 flex flex-col">
                  <div className="text-[#4a5d23] mb-4">
                    <Wind className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-stone-900 tracking-tight mb-4 shrink-0">
                    Blind Guessing
                  </h3>
                  <p className="text-stone-600 text-xl font-light leading-relaxed flex-1 overflow-hidden">
                    Checking trees by foot on large plots is too slow, and specialized farm drones are too expensive for most independent smallholders to buy themselves.
                  </p>
                </div>
              </div>

              <div className="bg-[#e8e4db] p-6 border border-stone-300 flex items-center justify-between shrink-0">
                <span className="font-mono text-base text-stone-500 uppercase tracking-widest leading-none">
                  The Bottom Line
                </span>
                <span className="text-2xl text-stone-800 font-medium leading-none">
                  If you can't see the sickness early, you can't stop the spread.
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
                how we help.
              </h2>
              <span
                className="font-mono text-sm tracking-widest text-[#4a5d23] uppercase border border-[#4a5d23] px-3 py-1.5 shrink-0 whitespace-nowrap"
                style={{ lineHeight: 1 }}
              >
                Our Process
              </span>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
              <div className="flex-1 border border-stone-300 p-6 flex flex-col bg-white">
                <div className="text-[#8b5a2b] font-mono text-xl mb-6 border-b border-stone-200 pb-3 shrink-0">
                  01. Fly & Snap
                </div>
                <Smartphone className="w-10 h-10 text-stone-800 mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-stone-900 tracking-tight mb-3 shrink-0">
                  A Simple Drone Flight
                </h4>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  We (or you) fly a basic consumer drone over your plantation. It literally just records normal video and takes regular photos.
                </p>
                <div className="mt-auto font-mono text-xs text-stone-400 bg-stone-100 p-3 shrink-0 leading-relaxed">
                  No fancy, expensive multispectral cameras needed.
                </div>
              </div>

              <div className="flex-1 border border-stone-300 p-6 flex flex-col bg-[#f4f1ea]">
                <div className="text-[#8b5a2b] font-mono text-xl mb-6 border-b border-stone-300 pb-3 shrink-0">
                  02. We Analyze
                </div>
                <Activity className="w-10 h-10 text-stone-800 mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-stone-900 tracking-tight mb-3 shrink-0">
                  AI Detects Sickness
                </h4>
                <p className="text-stone-600 text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  Our system processes the images, using AI to &quot;look deeper&quot; and see early signs of canopy stress that the human eye misses.
                </p>
                <div className="mt-auto font-mono text-xs text-[#8b5a2b] bg-[#e8e4db] p-3 shrink-0 leading-relaxed">
                  Spotting the hidden visual cues of disease.
                </div>
              </div>

              <div className="flex-1 border border-[#4a5d23] p-6 flex flex-col bg-[#4a5d23] text-stone-100">
                <div className="text-[#a3b87a] font-mono text-xl mb-6 border-b border-[#5f7434] pb-3 shrink-0">
                  03. You Take Action
                </div>
                <ShieldCheck className="w-10 h-10 text-[#c2d49a] mb-4 shrink-0" />
                <h4 className="font-bold text-2xl text-white tracking-tight mb-3 shrink-0">
                  Get The Map
                </h4>
                <p className="text-[#c2d49a] text-lg font-light leading-relaxed mb-4 flex-1 overflow-hidden">
                  You receive a clear map pointing exactly to which trees are in trouble. Cull the sick palms immediately and save the healthy ones.
                </p>
                <div className="mt-auto font-mono text-xs text-[#4a5d23] bg-[#c2d49a] p-3 shrink-0 leading-relaxed">
                  Precise removal. Less spreading. Better harvest.
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
                see it in action.
              </h2>
              <span
                className="font-mono text-sm tracking-widest text-[#4a5d23] uppercase border border-[#4a5d23] px-3 py-1.5 shrink-0 whitespace-nowrap"
                style={{ lineHeight: 1 }}
              >
                Scan To Detection
              </span>
            </div>

            <div className="flex gap-4 flex-1 min-h-0">
              <div className="flex-1 flex flex-col gap-3">
                <div className="bg-[#f4f1ea] border border-stone-300 p-4 shrink-0">
                  <h4 className="font-bold text-lg text-stone-900 leading-none mb-1">
                    01. RGB Scan
                  </h4>
                  <p className="text-sm text-stone-600 font-light leading-snug">
                    Standard commercial drone imagery.
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
                    02. NIR Generation
                  </h4>
                  <p className="text-sm text-stone-600 font-light leading-snug">
                    AI synthesizes near-infrared data.
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
                    03. Detection
                  </h4>
                  <p className="text-sm text-[#c2d49a] font-light leading-snug">
                    Sick canopy flagged for removal.
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
                what it means for you.
              </h2>
            </div>

            <div className="flex gap-8 flex-1 min-h-0">
              {/* LEFT COLUMN */}
              <div className="w-[45%] flex flex-col gap-6 h-full border border-stone-300 bg-white p-8">
                <Leaf className="w-12 h-12 text-[#4a5d23] mb-2" />
                <h3 className="font-bold text-3xl text-stone-900 leading-tight mb-4">
                  Protecting Your Livelihood
                </h3>
                <p className="text-lg text-stone-600 font-light leading-relaxed mb-6">
                  Every tree you lose is money out of your pocket for years to come. By identifying sick trees early, you can surgically remove them and treat the surroundings, preventing the disease from jumping to your healthy, high-yield palms.
                </p>
                
                <div className="bg-[#f4f1ea] border-l-4 border-[#8b5a2b] p-4 mt-auto">
                  <h4 className="font-bold text-lg text-stone-800 mb-2">Be Replant-Ready</h4>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Our reports provide the exact data needed if you are applying for PSR (Peremajaan Sawit Rakyat) replanting funds. Hand them the map, prove the need, and get funded faster.
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="w-[55%] flex flex-col gap-6 h-full">
                <div className="bg-white border border-stone-300 p-6 flex-1 flex flex-col min-h-0">
                  <h3 className="font-bold tracking-tight uppercase font-mono text-sm text-stone-800 mb-6 shrink-0 leading-none">
                    How you can get started
                  </h3>
                  <div className="flex gap-6 flex-1 min-h-0">
                    <div className="flex-1 border-t-2 border-[#4a5d23] pt-4 flex flex-col bg-[#f9fafa] -mx-3 px-3 pb-3">
                      <div className="text-[#4a5d23] text-[11px] uppercase tracking-widest font-mono mb-2 flex justify-between items-center leading-none">
                        <span>Individual Farm</span>
                      </div>
                      <div className="text-2xl font-black text-stone-900 leading-none mb-1">
                        Rp 25k
                      </div>
                      <div className="text-xs text-stone-500 font-mono mb-4 leading-none">
                        /ha /scan
                      </div>
                      <ul className="text-sm text-stone-600 space-y-2 font-light flex-1 overflow-hidden">
                        <li>• Only pay when you need an inspection</li>
                        <li>• Fast turnaround for the PDF report</li>
                        <li>• No long-term commitment</li>
                      </ul>
                    </div>

                    <div className="flex-1 border-t-2 border-stone-300 pt-4 flex flex-col">
                      <div className="text-stone-500 text-[11px] uppercase tracking-widest font-mono mb-2 leading-none">
                        Through Your Koperasi
                      </div>
                      <div className="text-2xl font-black text-stone-900 leading-none mb-1">
                        Rp 2.5m
                      </div>
                      <div className="text-xs text-stone-500 font-mono mb-4 leading-none">
                        /month
                      </div>
                      <ul className="text-sm text-stone-600 space-y-2 font-light flex-1 overflow-hidden">
                        <li>• Up to 500 hectares covered together</li>
                        <li>• Greatly reduced cost per hectare</li>
                        <li>• Get regular monthly health checkups</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-stone-900 p-5 border border-stone-800 shrink-0 text-center">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-[#a3b87a] mb-2 leading-none">
                    Next Step
                  </h3>
                  <p className="text-sm text-stone-400 font-light leading-relaxed">
                    Chat with us today to schedule your first flight and see the health of your plot.
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
            Generating PDF…
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
                Investor
              </button>
              <button 
                onClick={() => { setAudience('farmer'); setCurrentSlide(0); }}
                className={`px-3 py-1 rounded text-[10px] transition-colors ${audience === 'farmer' ? 'bg-stone-700 text-white' : 'text-stone-400 hover:text-white'}`}
              >
                Farmer
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
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}