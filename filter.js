/**
 * Interactive Cafe & Promo Menu - filter.js
 * Berisi seluruh logika manipulasi DOM, carousel, modal, dan filter menu.
 */

// 1. Fungsi Pindah Slide saat Titik Indicator (Dots) Diklik
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

  // Render menu saat halaman dimuat
  renderMenu(menuData);
});

// 3. Fungsi Buka & Tutup Modal Detail Promo
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

function closePromoModal() {
  const modal = document.getElementById('promoModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Menutup modal jika area di luar dialog diklik
window.addEventListener('click', function(event) {
  const modal = document.getElementById('promoModal');
  if (event.target === modal) {
    closePromoModal();
  }
});

// 4. Data Menu
const menuData = [
  { id: 1, name: "Espresso Signature", cat: "Coffee", price: "Rp 22.000", desc: "Ekstraksi kopi arabika pilihan dengan karakter rasa pekat dan kaya.", img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "Creamy Cafe Latte", cat: "Coffee", price: "Rp 28.000", desc: "Perpaduan espresso dan susu segar lembut dengan sensasi gurih.", img: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=500&q=80" },
  { id: 3, name: "Matcha Kyoto Latte", cat: "Non-Coffee", price: "Rp 32.000", desc: "Matcha asli Kyoto dipadukan dengan susu creamy nikmat.", img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=500&q=80" },
  { id: 4, name: "Belgian Chocolate", cat: "Non-Coffee", price: "Rp 30.000", desc: "Minuman cokelat Belgia pekat dengan rasa manis seimbang.", img: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=500&q=80" },
  { id: 5, name: "Butter Croissant", cat: "Snack", price: "Rp 24.000", desc: "Pastry renyah dengan aroma mentega premium yang menggugah selera.", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80" },
  { id: 6, name: "Truffle Fries", cat: "Snack", price: "Rp 26.000", desc: "Kentang goreng renyah disajikan dengan aroma minyak truffle istimewa.", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80" }
];

// 5. Fungsi Render Menu (Memastikan kartu menggunakan kelas 'menu-item' dan atribut 'data-category')
function renderMenu(data) {
  const menuGrid = document.getElementById('menuGrid');
  if (!menuGrid) return;

  menuGrid.innerHTML = data.map(item => `
    <div class="menu-item bg-[#FFECD1] rounded-2xl p-4 border border-marun/15 shadow-md flex flex-col justify-between transition-all duration-300" data-category="${item.cat}">
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
}

// 6. Fungsi Filter Menu Sesuai Kategori
function filterMenu(category, btn) {
  // Update tombol aktif
  document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  // Filter elemen kartu menu berdasarkan atribut 'data-category'
  document.querySelectorAll('.menu-item').forEach(el => {
    const itemCat = el.getAttribute('data-category');
    if (category === 'All' || itemCat === category) {
      el.classList.remove('hidden-item');
      el.style.display = "flex"; // Memastikan elemen kembali tampil normal
    } else {
      el.classList.add('hidden-item');
      el.style.display = "none"; // Menyembunyikan elemen secara instan
    }
  });
}
