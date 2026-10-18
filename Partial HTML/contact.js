document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("contactName");
  const emailInput = document.getElementById("contactEmail");
  const messageInput = document.getElementById("contactMessage");
  const feedback = document.getElementById("contactFeedback");
  const footerYear = document.getElementById("footerYear");
  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const mainNav = document.getElementById("mainNav");

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  if (mobileMenuButton && mainNav) {
    mobileMenuButton.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("is-open");
      mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        mobileMenuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (!contactForm) return;

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    // Hapus tanda error dari pemeriksaan sebelumnya.
    [nameInput, emailInput, messageInput].forEach(function (input) {
      input.removeAttribute("aria-invalid");
    });

    // Periksa seluruh field, sesuai ketentuan soal UTS.
    if (name === "" || email === "" || message === "") {
      if (name === "") nameInput.setAttribute("aria-invalid", "true");
      if (email === "") emailInput.setAttribute("aria-invalid", "true");
      if (message === "") messageInput.setAttribute("aria-invalid", "true");

      showFeedback("Semua kolom wajib diisi. Silakan periksa kembali.", false);

      const firstEmpty = [nameInput, emailInput, messageInput].find(function (input) {
        return input.value.trim() === "";
      });

      if (firstEmpty) firstEmpty.focus();
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      emailInput.setAttribute("aria-invalid", "true");
      showFeedback("Format email belum benar. Contoh: nama@email.com", false);
      emailInput.focus();
      return;
    }

    showFeedback(
      "Terima kasih, " + name + "! Formulir berhasil divalidasi.",
      true
    );

    contactForm.reset();
  });

  function showFeedback(message, isSuccess) {
    feedback.textContent = message;
    feedback.className = isSuccess
      ? "form-feedback success"
      : "form-feedback error";
  }
});
