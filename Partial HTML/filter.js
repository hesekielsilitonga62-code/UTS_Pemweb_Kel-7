// ============================================================
// FILTER.JS - LOGIKA FILTER MENU KOPI RUANG KITA
// ============================================================

function filterMenu(category) {
  // 1. Ambil semua elemen menu berdasarkan class 'menu-item'
  const menuItems = document.querySelectorAll('.menu-item');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // 2. Tampilkan atau Sembunyikan Item Menu
  menuItems.forEach((item) => {
    const itemCategory = item.getAttribute('data-category');

    if (category === 'all' || itemCategory === category) {
      // Tampilkan elemen (Kompatibel dengan Tailwind & Plain CSS)
      item.style.display = '';
      item.classList.remove('hidden');
    } else {
      // Sembunyikan elemen
      item.style.display = 'none';
      item.classList.add('hidden');
    }
  });

  // 3. Update Status Tombol Aktif
  filterButtons.forEach((btn) => {
    const btnCategory = btn.getAttribute('data-category');
    if (btnCategory === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Inisialisasi Event Listener saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedCategory = button.getAttribute('data-category');
      filterMenu(selectedCategory);
    });
  });
});
