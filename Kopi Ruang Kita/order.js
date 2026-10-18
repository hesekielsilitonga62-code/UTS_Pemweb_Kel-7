// ============================================================
// ORDER.JS - KERANJANG, KODE PROMO & FORM ORDER KOPI RUANG KITA
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('orderForm');
  if (!form) return;

  // ---------- Elemen ----------
  const menuSelect = document.getElementById('orderMenuSelect');
  const addBtn = document.getElementById('orderAddBtn');
  const itemList = document.getElementById('orderItems');
  const emptyMsg = document.getElementById('orderEmpty');
  const itemsError = document.getElementById('orderItemsError');
  const successBox = document.getElementById('orderSuccess');
  const cartFab = document.getElementById('cartFab');
  const cartCount = document.getElementById('cartCount');

  const subtotalEl = document.getElementById('orderSubtotal');
  const diskonRow = document.getElementById('orderDiskonRow');
  const diskonEl = document.getElementById('orderDiskon');
  const bonusRow = document.getElementById('orderBonusRow');
  const bonusEl = document.getElementById('orderBonus');
  const totalEl = document.getElementById('orderTotal');

  const promoInput = document.getElementById('orderPromo');
  const promoBtn = document.getElementById('orderPromoBtn');
  const promoMsg = document.getElementById('orderPromoMsg');

  const fields = {
    nama: {
      el: document.getElementById('orderNama'),
      error: document.getElementById('orderNamaError'),
      validate: (v) => {
        if (v.trim() === '') return 'Nama wajib diisi.';
        if (v.trim().length < 3) return 'Nama minimal 3 karakter.';
        return '';
      },
    },
    hp: {
      el: document.getElementById('orderHp'),
      error: document.getElementById('orderHpError'),
      validate: (v) => {
        if (v.trim() === '') return 'Nomor HP wajib diisi.';
        const bersih = v.replace(/[\s-]/g, '');
        if (!/^(\+62|62|0)8\d{8,11}$/.test(bersih)) return 'Nomor HP tidak valid (contoh: 081234567890).';
        return '';
      },
    },
  };

  // ---------- Data menu: dibaca dari kartu di section Menu ----------
  const LABEL_KATEGORI = { coffee: 'Coffee', 'non-coffee': 'Non-Coffee', snack: 'Snack' };
  const menuData = {}; // { namaMenu: { price, category } }

  document.querySelectorAll('.menu-item').forEach((card) => {
    const name = card.getAttribute('data-name');
    const priceText = card.querySelector('.text-bold').textContent; // "Rp 28.000"
    const price = parseInt(priceText.replace(/\D/g, ''), 10);
    menuData[name] = { price, category: card.getAttribute('data-category') };
  });

  // Isi dropdown "Pilih menu" per kategori
  Object.keys(LABEL_KATEGORI).forEach((cat) => {
    const group = document.createElement('optgroup');
    group.label = LABEL_KATEGORI[cat];
    Object.keys(menuData)
      .filter((name) => menuData[name].category === cat)
      .forEach((name) => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name + ' - ' + rupiah(menuData[name].price);
        group.appendChild(opt);
      });
    menuSelect.appendChild(group);
  });

  // ---------- State ----------
  const cart = {};      // { namaMenu: jumlah }
  let kodeAktif = null; // kode promo yang sedang dipakai, contoh 'PAGI30'

  function rupiah(angka) {
    return 'Rp ' + String(angka).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function totalItem() {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }

  function subtotal() {
    return Object.keys(cart).reduce((sum, name) => sum + menuData[name].price * cart[name], 0);
  }

  function qtyKategori(kategori) {
    return Object.keys(cart)
      .filter((name) => menuData[name].category === kategori)
      .reduce((sum, name) => sum + cart[name], 0);
  }

  // ============================================================
  // KODE PROMO
  // Tiap kode punya: nama, syarat (teks), jam (opsional), dan hitung()
  // yang mengembalikan { diskon, bonus } atau null jika syarat belum terpenuhi.
  // ============================================================

  // false = jam promo tidak dicek (enak untuk demo/presentasi)
  // true  = promo hanya bisa dipakai pada jam yang tertulis di "jam"
  const CEK_JAM = false;

  const PROMO_CODES = {
    // Promo Ramai 2 Kopi: tiap 2 Kopsu Ruang Kita jadi Rp 30.000
    RAMAI2: {
      nama: 'Promo Ramai 2 Kopi',
      syarat: 'beli 2 Kopsu Ruang Kita (harga jadi Rp 30.000).',
      jam: [14, 16],
      jamTeks: 'pukul 14.00 - 16.00',
      hitung: () => {
        const paket = Math.floor((cart['Kopsu Ruang Kita'] || 0) / 2);
        if (paket === 0) return null;
        return { diskon: paket * (2 * menuData['Kopsu Ruang Kita'].price - 30000) };
      },
    },

    // Combo Teman Ngemil: tiap 2 minuman Non-Coffee, gratis 1 Butter Croissant
    NGEMIL: {
      nama: 'Combo Teman Ngemil',
      syarat: 'beli minimal 2 minuman Non-Coffee.',
      hitung: () => {
        const gratis = Math.floor(qtyKategori('non-coffee') / 2);
        if (gratis === 0) return null;
        return { diskon: 0, bonus: gratis + 'x Butter Croissant (gratis)' };
      },
    },

    // Morning Person: diskon 30% untuk semua menu Coffee
    PAGI30: {
      nama: 'Morning Person Diskon 30%',
      syarat: 'beli minimal 1 menu Coffee.',
      jam: [0, 11],
      jamTeks: 'sebelum pukul 11.00',
      hitung: () => {
        let subCoffee = 0;
        Object.keys(cart).forEach((name) => {
          if (menuData[name].category === 'coffee') subCoffee += menuData[name].price * cart[name];
        });
        if (subCoffee === 0) return null;
        return { diskon: Math.round(subCoffee * 0.3) };
      },
    },

    // Paket Bertiga: 3 Coffee + 3 Butter Croissant jadi Rp 75.000
    BERTIGA75: {
      nama: 'Paket Bertiga 75rb',
      syarat: 'beli 3 menu Coffee + 3 Butter Croissant (harga paket Rp 75.000).',
      hitung: () => {
        const hargaKopi = []; // harga tiap gelas, termurah dulu
        Object.keys(cart).forEach((name) => {
          if (menuData[name].category === 'coffee') {
            for (let i = 0; i < cart[name]; i++) hargaKopi.push(menuData[name].price);
          }
        });
        hargaKopi.sort((a, b) => a - b);

        const paket = Math.min(Math.floor(hargaKopi.length / 3), Math.floor((cart['Butter Croissant'] || 0) / 3));
        if (paket === 0) return null;

        const hargaNormal = hargaKopi.slice(0, paket * 3).reduce((a, b) => a + b, 0) +
          paket * 3 * menuData['Butter Croissant'].price;
        return { diskon: Math.max(0, hargaNormal - paket * 75000) };
      },
    },
  };

  function dalamJam(promo) {
    if (!CEK_JAM || !promo.jam) return true;
    const jam = new Date().getHours();
    return jam >= promo.jam[0] && jam < promo.jam[1];
  }

  // Hitung efek kode promo yang aktif terhadap isi keranjang saat ini
  function evaluasiPromo() {
    const kosong = { diskon: 0, bonus: '', ok: false, pesan: '' };
    if (!kodeAktif) return kosong;

    const promo = PROMO_CODES[kodeAktif];
    if (!dalamJam(promo)) {
      return { ...kosong, pesan: 'Kode ' + kodeAktif + ' hanya berlaku ' + promo.jamTeks + '.' };
    }
    const hasil = promo.hitung();
    if (!hasil) {
      return { ...kosong, pesan: 'Kode ' + kodeAktif + ' diterima, tapi syarat belum terpenuhi: ' + promo.syarat };
    }
    return {
      diskon: hasil.diskon,
      bonus: hasil.bonus || '',
      ok: true,
      pesan: 'Kode ' + kodeAktif + ' aktif (' + promo.nama + ').',
    };
  }

  function tampilPesanPromo(teks, ok) {
    promoMsg.textContent = teks;
    promoMsg.classList.toggle('hidden', teks === '');
    promoMsg.classList.toggle('text-green-800', ok);
    promoMsg.classList.toggle('text-red-700', !ok);
  }

  function resetPromo() {
    kodeAktif = null;
    promoInput.value = '';
    promoInput.disabled = false;
    promoBtn.textContent = 'Pakai';
    tampilPesanPromo('', true);
  }

  promoBtn.addEventListener('click', () => {
    // Kalau kode sedang aktif, tombol berfungsi sebagai "Hapus"
    if (kodeAktif) {
      resetPromo();
      render();
      return;
    }

    const kode = promoInput.value.trim().toUpperCase();
    if (kode === '') {
      tampilPesanPromo('Masukkan kode promo dulu.', false);
      return;
    }
    if (!PROMO_CODES[kode]) {
      tampilPesanPromo('Kode promo tidak dikenal.', false);
      return;
    }
    if (!dalamJam(PROMO_CODES[kode])) {
      tampilPesanPromo('Kode ' + kode + ' hanya berlaku ' + PROMO_CODES[kode].jamTeks + '.', false);
      return;
    }

    kodeAktif = kode;
    promoInput.value = kode;
    promoInput.disabled = true;
    promoBtn.textContent = 'Hapus';
    render();
  });

  // Enter di kolom kode promo = klik "Pakai" (bukan kirim form)
  promoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      promoBtn.click();
    }
  });

  // ---------- Aksi keranjang ----------
  function tambahItem(name) {
    if (!menuData[name]) return;
    cart[name] = (cart[name] || 0) + 1;
    itemsError.classList.add('hidden');
    successBox.classList.add('hidden');
    render();
  }

  function ubahJumlah(name, delta) {
    cart[name] = (cart[name] || 0) + delta;
    if (cart[name] <= 0) delete cart[name];
    render();
  }

  // ---------- Render ringkasan pesanan ----------
  function buatTombolQty(label, aksi, name) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.setAttribute('data-act', aksi);
    btn.setAttribute('data-name', name);
    btn.setAttribute('aria-label', (aksi === 'inc' ? 'Tambah ' : 'Kurangi ') + name);
    btn.className = 'flex h-7 w-7 items-center justify-center rounded-full border border-marun/40 transition hover:bg-marun hover:text-krem';
    return btn;
  }

  function render() {
    itemList.textContent = '';
    const names = Object.keys(cart);

    names.forEach((name) => {
      const li = document.createElement('li');
      li.className = 'flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-marun/10 py-3';

      const info = document.createElement('div');
      info.className = 'min-w-0 flex-1';
      const nameEl = document.createElement('p');
      nameEl.className = 'font-serif font-bold';
      nameEl.textContent = name;
      const priceEl = document.createElement('p');
      priceEl.className = 'text-sm text-marun/70';
      priceEl.textContent = rupiah(menuData[name].price);
      info.appendChild(nameEl);
      info.appendChild(priceEl);

      const qtyWrap = document.createElement('div');
      qtyWrap.className = 'flex items-center gap-2';
      const qtyEl = document.createElement('span');
      qtyEl.className = 'w-6 text-center';
      qtyEl.textContent = cart[name];
      qtyWrap.appendChild(buatTombolQty('-', 'dec', name));
      qtyWrap.appendChild(qtyEl);
      qtyWrap.appendChild(buatTombolQty('+', 'inc', name));

      const subEl = document.createElement('span');
      subEl.className = 'w-24 text-right font-bold text-bold';
      subEl.textContent = rupiah(menuData[name].price * cart[name]);

      li.appendChild(info);
      li.appendChild(qtyWrap);
      li.appendChild(subEl);
      itemList.appendChild(li);
    });

    emptyMsg.classList.toggle('hidden', names.length > 0);

    // Subtotal, diskon, bonus, total
    const promo = evaluasiPromo();
    const sub = subtotal();
    const total = Math.max(0, sub - promo.diskon);

    subtotalEl.textContent = rupiah(sub);
    diskonRow.classList.toggle('hidden', promo.diskon === 0);
    diskonEl.textContent = '-' + rupiah(promo.diskon);
    bonusRow.classList.toggle('hidden', promo.bonus === '');
    bonusEl.textContent = promo.bonus;
    totalEl.textContent = rupiah(total);

    if (kodeAktif) tampilPesanPromo(promo.pesan, promo.ok);

    // Tombol melayang "Pesanan (n)"
    cartCount.textContent = totalItem();
    cartFab.classList.toggle('hidden', totalItem() === 0);
  }

  // ---------- Event: tambah dari kartu menu ----------
  document.querySelectorAll('.menu-item .btn-pesan').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.closest('.menu-item').getAttribute('data-name');
      tambahItem(name);

      // Umpan balik singkat di tombol
      const teksAsli = btn.getAttribute('data-label') || btn.textContent;
      btn.setAttribute('data-label', teksAsli);
      btn.textContent = 'Ditambah \u2713';
      clearTimeout(btn._timer);
      btn._timer = setTimeout(() => { btn.textContent = teksAsli; }, 1000);
    });
  });

  // ---------- Event: tambah dari dropdown ----------
  addBtn.addEventListener('click', () => {
    if (menuSelect.value === '') return;
    tambahItem(menuSelect.value);
    menuSelect.value = '';
  });

  // ---------- Event: tombol + / - di ringkasan ----------
  itemList.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-act]');
    if (!btn) return;
    ubahJumlah(btn.getAttribute('data-name'), btn.getAttribute('data-act') === 'inc' ? 1 : -1);
  });

  // ---------- Validasi field ----------
  function showError(field, message) {
    field.error.textContent = message;
    field.error.classList.toggle('hidden', message === '');
    field.el.classList.toggle('border-red-600', message !== '');
    field.el.classList.toggle('border-marun/30', message === '');
  }

  Object.values(fields).forEach((field) => {
    field.el.addEventListener('blur', () => showError(field, field.validate(field.el.value)));
    field.el.addEventListener('input', () => {
      if (!field.error.classList.contains('hidden')) {
        showError(field, field.validate(field.el.value));
      }
    });
  });

  // ---------- Submit ----------
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    successBox.classList.add('hidden');

    let valid = true;
    Object.values(fields).forEach((field) => {
      const message = field.validate(field.el.value);
      showError(field, message);
      if (message !== '') valid = false;
    });

    if (totalItem() === 0) {
      itemsError.classList.remove('hidden');
      valid = false;
    }

    if (!valid) {
      const firstInvalid = Object.values(fields).find((f) => !f.error.classList.contains('hidden'));
      if (firstInvalid) firstInvalid.el.focus();
      return;
    }

    // Ringkasan konfirmasi (belum ada backend: hanya ditampilkan di halaman)
    const tipe = form.querySelector('input[name="tipe"]:checked').value;
    const catatan = document.getElementById('orderCatatan').value.trim();
    const kode = 'KRK-' + String(Math.floor(1000 + Math.random() * 9000));
    const promo = evaluasiPromo();
    const sub = subtotal();
    const total = Math.max(0, sub - promo.diskon);

    const baris = Object.keys(cart).map(
      (name) => cart[name] + 'x ' + name + ' - ' + rupiah(menuData[name].price * cart[name])
    );

    let teks = 'Terima kasih, ' + fields.nama.el.value.trim() + '! Pesananmu sudah kami catat.\n' +
      'Kode pesanan: ' + kode + ' (' + tipe + ')\n\n' +
      baris.join('\n') + '\n\nSubtotal: ' + rupiah(sub);
    if (promo.diskon > 0) teks += '\nKode promo ' + kodeAktif + ': -' + rupiah(promo.diskon);
    if (promo.bonus !== '') teks += '\nBonus: ' + promo.bonus;
    teks += '\nTotal: ' + rupiah(total);
    if (catatan !== '') teks += '\nCatatan: ' + catatan;

    successBox.textContent = teks;
    successBox.classList.remove('hidden');

    // Kosongkan form, keranjang, dan kode promo
    Object.keys(cart).forEach((name) => delete cart[name]);
    form.reset();
    resetPromo();
    render();
    successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  render();
});