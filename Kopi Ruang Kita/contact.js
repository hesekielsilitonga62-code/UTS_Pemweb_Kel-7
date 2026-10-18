// ============================================================
// CONTACT.JS - VALIDASI FORM HUBUNGI KAMI
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    nama: {
      el: document.getElementById('nama'),
      error: document.getElementById('namaError'),
      validate: (v) => {
        if (v.trim() === '') return 'Nama wajib diisi.';
        if (v.trim().length < 3) return 'Nama minimal 3 karakter.';
        return '';
      },
    },
    email: {
      el: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: (v) => {
        if (v.trim() === '') return 'Email wajib diisi.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Format email tidak valid.';
        return '';
      },
    },
    pesan: {
      el: document.getElementById('pesan'),
      error: document.getElementById('pesanError'),
      validate: (v) => {
        if (v.trim() === '') return 'Pesan wajib diisi.';
        if (v.trim().length < 10) return 'Pesan minimal 10 karakter.';
        return '';
      },
    },
  };

  const successBox = document.getElementById('formSuccess');

  function showError(field, message) {
    field.error.textContent = message;
    field.error.classList.toggle('hidden', message === '');
    field.el.classList.toggle('border-red-400', message !== '');
    field.el.classList.toggle('border-krem/30', message === '');
  }

  // Validasi langsung saat user mengetik / pindah kolom
  Object.values(fields).forEach((field) => {
    field.el.addEventListener('blur', () => showError(field, field.validate(field.el.value)));
    field.el.addEventListener('input', () => {
      if (!field.error.classList.contains('hidden')) {
        showError(field, field.validate(field.el.value));
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    successBox.classList.add('hidden');

    let valid = true;
    Object.values(fields).forEach((field) => {
      const message = field.validate(field.el.value);
      showError(field, message);
      if (message !== '') valid = false;
    });

    if (!valid) {
      // Fokus ke kolom pertama yang salah
      const firstInvalid = Object.values(fields).find((f) => !f.error.classList.contains('hidden'));
      if (firstInvalid) firstInvalid.el.focus();
      return;
    }

    // Belum ada backend: pesan hanya ditampilkan sebagai konfirmasi di halaman
    const nama = fields.nama.el.value.trim();
    successBox.textContent = 'Terima kasih, ' + nama + '! Pesanmu sudah kami terima.';
    successBox.classList.remove('hidden');
    form.reset();
  });
});
