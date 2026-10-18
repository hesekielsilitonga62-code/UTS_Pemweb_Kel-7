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