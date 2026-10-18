<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Cafe & Promo Menu</title>
  <!-- Google Fonts: Qwitcher Grypen & Noto Sans KR (fallback for JejuGothic) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Qwitcher+Grypen:wght@700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: { marun: '#3E000C', bgCream: '#FFECD1', goldBlur: '#B56A00' }
        }
      }
    }
  </script>
  <style>
    body { background-color: #FFECD1; color: #3E000C; font-family: 'Noto Sans KR', 'JejuGothic', sans-serif; }
    .font-qwitcher { font-family: 'Qwitcher Grypen', cursive; }
    .font-tnr { font-family: 'Times New Roman', Times, serif; }
    /* Ambient Glow Blur Element */
    .glow-blur {
      position: absolute; width: 320px; height: 320px; background: #B56A00;
      filter: blur(162px); opacity: 0.4; border-radius: 50%; pointer-events: none;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .btn-filter.active { background-color: #3E000C; color: #FFECD1; border-color: #3E000C; }
    .menu-item { transition: all 0.3s ease; }
    .menu-item.hidden-item { opacity: 0; transform: scale(0.92); position: absolute; pointer-events: none; visibility: hidden; }
  </style>
</head>
<body class="relative min-h-screen overflow-x-hidden p-4 sm:p-6 lg:p-10">

  <!-- Glow Background Effect (#B56A00 blur 162px) -->
  <div class="glow-blur -top-12 -left-12"></div>
  <div class="glow-blur top-1/2 -right-12"></div>

  <div class="max-w-5xl mx-auto relative z-10">
    <!-- Heading 1 with required fonts -->
    <header class="text-center my-6 sm:my-10">
      <h1 class="text-4xl sm:text-6xl text-marun leading-tight">
        <span class="font-qwitcher text-6xl sm:text-8xl text-goldBlur inline-block">R</span><span class="font-tnr">estoran</span>
        <span class="font-tnr">&amp;</span>
        <span class="font-qwitcher text-6xl sm:text-8xl text-goldBlur inline-block">T</span><span class="font-tnr">empat Kopi</span>
      </h1>
      <p class="mt-2 text-sm sm:text-base opacity-80 max-w-lg mx-auto">
        Nikmati pilihan kopi terbaik, sajian promo menarik, dan kehangatan tempat kami.
      </p>
    </header>

    <!-- PROMO CAROUSEL SECTION -->
    <section class="mb-10">
      <div id="promoCarousel" class="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-2xl p-1 scroll-smooth">
        <div onclick="openPromoModal('Promo Buy 1 Get 1', 'Dapatkan gratis 1 Cafe Latte setiap pembelian Espresso Signature khusus hari ini!')" class="snap-center shrink-0 w-full sm:w-[80%] md:w-[60%] h-44 bg-gradient-to-r from-marun to-[#67091B] text-bgCream rounded-2xl p-6 flex flex-col justify-between cursor-pointer shadow-lg hover:opacity-95 transition">
          <span class="bg-goldBlur/40 text-xs px-3 py-1 rounded-full w-max font-bold">PROMO SPESIAL</span>
          <div><h3 class="text-2xl font-bold font-tnr">Buy 1 Get 1 Coffee</h3><p class="text-xs opacity-80 mt-1">Klik untuk detail penawaran menarik ini &rarr;</p></div>
        </div>
        <div onclick="openPromoModal('Diskon 30% Snack Time', 'Diskon 30% untuk semua menu Snack setiap jam 14:00 - 17:00 WIB.')" class="snap-center shrink-0 w-full sm:w-[80%] md:w-[60%] h-44 bg-gradient-to-r from-[#67091B] to-marun text-bgCream rounded-2xl p-6 flex flex-col justify-between cursor-pointer shadow-lg hover:opacity-95 transition">
          <span class="bg-goldBlur/40 text-xs px-3 py-1 rounded-full w-max font-bold">HAPPY HOUR</span>
          <div><h3 class="text-2xl font-bold font-tnr">Diskon 30% Snack</h3><p class="text-xs opacity-80 mt-1">Klik untuk detail penawaran menarik ini &rarr;</p></div>
        </div>
        <div onclick="openPromoModal('Weekend Cashback', 'Cashback hingga 50% untuk transaksi pembayaran menggunakan E-Wallet pilihan!')" class="snap-center shrink-0 w-full sm:w-[80%] md:w-[60%] h-44 bg-gradient-to-r from-marun via-[#500312] to-marun text-bgCream rounded-2xl p-6 flex flex-col justify-between cursor-pointer shadow-lg hover:opacity-95 transition">
          <span class="bg-goldBlur/40 text-xs px-3 py-1 rounded-full w-max font-bold">WEEKEND DEAL</span>
          <div><h3 class="text-2xl font-bold font-tnr">Cashback 50%</h3><p class="text-xs opacity-80 mt-1">Klik untuk detail penawaran menarik ini &rarr;</p></div>
        </div>
      </div>

      <!-- Promo Dots Indicators (TIX ID Style) -->
      <div id="promoDots" class="flex justify-center items-center gap-2 mt-4">
        <button onclick="goToSlide(0)" class="dot h-2.5 w-7 bg-marun rounded-full transition-all duration-300"></button>
        <button onclick="goToSlide(1)" class="dot h-2.5 w-2.5 bg-marun/30 rounded-full transition-all duration-300"></button>
        <button onclick="goToSlide(2)" class="dot h-2.5 w-2.5 bg-marun/30 rounded-full transition-all duration-300"></button>
      </div>
    </section>

    <!-- FILTER BUTTONS SECTION -->
    <nav class="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
      <button onclick="filterMenu('All', this)" class="btn-filter active px-5 py-2 rounded-full border border-marun/30 text-xs sm:text-sm font-semibold transition">All</button>
      <button onclick="filterMenu('Coffee', this)" class="btn-filter px-5 py-2 rounded-full border border-marun/30 text-xs sm:text-sm font-semibold transition">Coffee</button>
      <button onclick="filterMenu('Non-Coffee', this)" class="btn-filter px-5 py-2 rounded-full border border-marun/30 text-xs sm:text-sm font-semibold transition">Non-Coffee</button>
      <button onclick="filterMenu('Snack', this)" class="btn-filter px-5 py-2 rounded-full border border-marun/30 text-xs sm:text-sm font-semibold transition">Snack</button>
    </nav>

    <!-- MENU ITEMS GRID -->
    <main id="menuGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Generated Dynamically by JS -->
    </main>
  </div>

  <!-- PROMO DETAIL MODAL -->
  <div id="promoModal" class="hidden fixed inset-0 z-50 bg-marun/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-bgCream border border-marun/20 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-fade-in">
      <h3 id="modalTitle" class="text-2xl font-bold font-tnr text-marun mb-2"></h3>
      <p id="modalDescription" class="text-sm opacity-85 leading-relaxed text-marun/90 mb-6"></p>
      <div class="flex justify-end">
        <button onclick="closePromoModal()" class="px-5 py-2 bg-marun text-bgCream text-xs font-semibold rounded-lg hover:opacity-90 transition">Tutup</button>
      </div>
    </div>
  </div>

  <script>
    // 1. Fungsi Pindah Slide saat Titik Indicator Diklik
    function goToSlide(index) {
      const carousel = document.getElementById('promoCarousel');
      if (carousel && carousel.children[index]) {
        carousel.scrollTo({
          left: carousel.children[index].offsetLeft,
          behavior: 'smooth'
        });
      }
    }

    // 2. Update Indikator Titik (Dots) Secara Otomatis Saat Banner Digeser
    document.addEventListener('DOMContentLoaded', () => {
      const carousel = document.getElementById('promoCarousel');
      if (carousel) {
        carousel.addEventListener('scroll', () => {
          const slideWidth = carousel.clientWidth;
          const activeIndex = Math.round(carousel.scrollLeft / slideWidth);
          const dots = document.querySelectorAll('#promoDots .dot');
          
          dots.forEach((dot, idx) => {
            if (idx === activeIndex) {
              dot.classList.remove('bg-marun/30', 'w-2.5');
              dot.classList.add('bg-marun', 'w-7'); // Titik aktif memanjang ala TIX ID
            } else {
              dot.classList.remove('bg-marun', 'w-7');
              dot.classList.add('bg-marun/30', 'w-2.5');
            }
          });
        });
      }
    });

    // 3. Fungsi Buka Modal Detail Promo
    function openPromoModal(title, description) {
      const modal = document.getElementById('promoModal');
      const modalTitle = document.getElementById('modalTitle');
      const modalDesc = document.getElementById('modalDescription');

      if (modal && modalTitle && modalDesc) {
        modalTitle.innerText = title;
        modalDesc.innerText = description;
        modal.classList.remove('hidden');
      }
    }

    // 4. Fungsi Tutup Modal Detail Promo
    function closePromoModal() {
      const modal = document.getElementById('promoModal');
      if (modal) {
        modal.classList.add('hidden');
      }
    }

    // 5. Menutup modal jika area di luar dialog diklik
    window.addEventListener('click', function(event) {
      const modal = document.getElementById('promoModal');
      if (event.target === modal) {
        closePromoModal();
      }
    });

    // 6. Data & Filter Menu Javascript Integration
    const menuData = [
      { id: 1, name: "Espresso Signature", cat: "Coffee", price: "Rp 22.000", desc: "Ekstraksi kopi arabika pilihan dengan karakter rasa pekat dan kaya.", img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=500&q=80" },
      { id: 2, name: "Creamy Cafe Latte", cat: "Coffee", price: "Rp 28.000", desc: "Perpaduan espresso dan susu segar lembut dengan sensasi gurih.", img: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=500&q=80" },
      { id: 3, name: "Matcha Kyoto Latte", cat: "Non-Coffee", price: "Rp 32.000", desc: "Matcha asli Kyoto dipadukan dengan susu creamy nikmat.", img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=500&q=80" },
      { id: 4, name: "Belgian Chocolate", cat: "Non-Coffee", price: "Rp 30.000", desc: "Minuman cokelat Belgia pekat dengan rasa manis seimbang.", img: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=500&q=80" },
      { id: 5, name: "Butter Croissant", cat: "Snack", price: "Rp 24.000", desc: "Pastry renyah dengan aroma mentega premium yang menggugah selera.", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80" },
      { id: 6, name: "Truffle Fries", cat: "Snack", price: "Rp 26.000", desc: "Kentang goreng renyah disajikan dengan aroma minyak truffle istimewa.", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80" }
    ];

    // Render Menu Items
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = menuData.map(item => `
      <div class="menu-item bg-[#FFECD1] rounded-2xl p-4 border border-marun/15 shadow-md flex flex-col justify-between" data-cat="${item.cat}">
        <div>
          <div class="h-40 rounded-xl overflow-hidden mb-3 bg-marun/5">
            <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/500x300/3E000C/FFECD1?text=${encodeURIComponent(item.name)}';">
          </div>
          <div class="flex justify-between items-start mb-1">
            <h3 class="font-tnr font-bold text-base text-marun">${item.name}</h3>
            <span class="text-xs font-bold bg-goldBlur/20 text-marun px-2 py-0.5 rounded-md">${item.price}</span>
          </div>
          <p class="text-xs opacity-80 leading-relaxed">${item.desc}</p>
        </div>
        <button class="mt-4 w-full py-2 rounded-lg border border-marun text-xs font-semibold hover:bg-marun hover:text-bgCream transition">Pesan</button>
      </div>
    `).join('');

    // Menu Filter Logic (filter.js)
    function filterMenu(category, btn) {
      document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.menu-item').forEach(el => {
        const itemCat = el.getAttribute('data-cat');
        if (category === 'All' || itemCat === category) {
          el.classList.remove('hidden-item');
        } else {
          el.classList.add('hidden-item');
        }
      });
    }
  </script>
</body>
</html>