document.addEventListener('DOMContentLoaded', () => {
  // 1. THEME SWITCHER LOGIC (DARK / LIGHT MODE)
  const htmlEl = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const footerThemeToggle = document.getElementById('footer-theme-toggle');

  function toggleTheme() {
    if (htmlEl.classList.contains('dark')) {
      htmlEl.classList.remove('dark');
      localStorage.setItem('ihmadi_theme', 'light');
    } else {
      htmlEl.classList.add('dark');
      localStorage.setItem('ihmadi_theme', 'dark');
    }
  }

  // Load saved theme preference
  const savedTheme = localStorage.getItem('ihmadi_theme');
  if (savedTheme === 'light') {
    htmlEl.classList.remove('dark');
  } else {
    htmlEl.classList.add('dark');
  }

  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (footerThemeToggle) footerThemeToggle.addEventListener('click', toggleTheme);

  // 2. HERO SLIDER AUTOMATION
  const slideImgs = document.querySelectorAll('.hero-slide-img');
  let currentSlide = 0;

  if (slideImgs.length > 1) {
    setInterval(() => {
      slideImgs[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slideImgs.length;
      slideImgs[currentSlide].classList.add('active');
    }, 5000);
  }

  // 3. MOBILE DRAWER NAVIGATION
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileClose = document.getElementById('mobile-menu-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('translate-x-full');
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('translate-x-full');
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (mobileClose) mobileClose.addEventListener('click', closeDrawer);
  mobileNavLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // 4. FAQ ACCORDION LOGIC
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling;
      const icon = trigger.querySelector('i');
      const isHidden = content.classList.contains('hidden');

      // Close all other FAQs
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-trigger i').forEach(i => i.classList.remove('rotate-180'));

      if (isHidden) {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });

  // 5. FOSSIL STORE GALLERY FILTERING
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const fossilCards = document.querySelectorAll('.fossil-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      fossilCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. BOOKING MODAL & DRAWER LOGIC
  const bookingModal = document.getElementById('booking-modal');
  const openBookingBtns = document.querySelectorAll('.open-booking-modal');
  const closeBookingBtns = document.querySelectorAll('.close-booking-modal');
  const modalTourTypeSelect = document.getElementById('modal-tour-type');

  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tourPreset = btn.getAttribute('data-tour');
      if (tourPreset && modalTourTypeSelect) {
        modalTourTypeSelect.value = tourPreset;
      }
      if (bookingModal) {
        bookingModal.classList.add('modal-active');
        document.body.classList.add('modal-open');
      }
    });
  });

  closeBookingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (bookingModal) {
        bookingModal.classList.remove('modal-active');
        document.body.classList.remove('modal-open');
      }
    });
  });

  // 7. SPECIMEN DETAIL MODAL LOGIC
  const specimenModal = document.getElementById('specimen-modal');
  const openSpecimenBtns = document.querySelectorAll('.open-specimen-modal');
  const closeSpecimenBtn = document.getElementById('close-specimen-modal');
  const modalSpecimenImg = document.getElementById('modal-specimen-img');
  const modalSpecimenName = document.getElementById('modal-specimen-name');
  const modalSpecimenEra = document.getElementById('modal-specimen-era');
  const modalSpecimenLocation = document.getElementById('modal-specimen-location');
  const modalSpecimenDesc = document.getElementById('modal-specimen-desc');
  const modalSpecimenPrice = document.getElementById('modal-specimen-price');
  const orderSpecimenWhatsapp = document.getElementById('order-specimen-whatsapp');

  openSpecimenBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const dataRaw = btn.getAttribute('data-specimen');
      if (!dataRaw) return;
      const data = JSON.parse(dataRaw);

      if (modalSpecimenImg) modalSpecimenImg.src = data.img;
      if (modalSpecimenName) modalSpecimenName.textContent = data.name;
      if (modalSpecimenEra) modalSpecimenEra.textContent = data.era;
      if (modalSpecimenLocation) modalSpecimenLocation.textContent = data.location;
      if (modalSpecimenDesc) modalSpecimenDesc.textContent = data.desc;
      if (modalSpecimenPrice) modalSpecimenPrice.textContent = data.price;

      if (orderSpecimenWhatsapp) {
        const textMsg = encodeURIComponent(`Hello Mohand! I am interested in purchasing the specimen: ${data.name} (${data.price}) from the Ihmadi fossil store.`);
        orderSpecimenWhatsapp.onclick = () => {
          window.open(`https://wa.me/212666221593?text=${textMsg}`, '_blank');
        };
      }

      if (specimenModal) {
        specimenModal.classList.add('modal-active');
        document.body.classList.add('modal-open');
      }
    });
  });

  if (closeSpecimenBtn) {
    closeSpecimenBtn.addEventListener('click', () => {
      if (specimenModal) {
        specimenModal.classList.remove('modal-active');
        document.body.classList.remove('modal-open');
      }
    });
  }

  // 8. INTERACTIVE MAIN CONTACT FORM ("Send a message")
  const mainContactForm = document.getElementById('main-contact-form');
  const contactStatus = document.getElementById('contact-form-status');
  const contactSubmitBtn = document.getElementById('contact-submit-btn');

  if (mainContactForm) {
    mainContactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (contactSubmitBtn) {
        contactSubmitBtn.disabled = true;
        contactSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';
      }

      try {
        const formData = new FormData(mainContactForm);
        const response = await fetch(mainContactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          if (contactStatus) {
            contactStatus.classList.remove('hidden', 'bg-rose-500/20', 'text-rose-400');
            contactStatus.classList.add('bg-emerald-500/20', 'text-emerald-400', 'block');
            contactStatus.textContent = 'Thank you! Your message has been successfully sent to Mohand. We will respond shortly via email or WhatsApp.';
          }
          mainContactForm.reset();
        } else {
          throw new Error('Form submission failed.');
        }
      } catch (err) {
        if (contactStatus) {
          contactStatus.classList.remove('hidden', 'bg-emerald-500/20', 'text-emerald-400');
          contactStatus.classList.add('bg-rose-500/20', 'text-rose-400', 'block');
          contactStatus.textContent = 'Oops! There was a network issue submitting the form. Please click the WhatsApp button to message Mohand directly (+212 666-221593).';
        }
      } finally {
        if (contactSubmitBtn) {
          contactSubmitBtn.disabled = false;
          contactSubmitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
        }
      }
    });
  }

  // 9. BOOKING MODAL FORM HANDLER
  const bookingModalForm = document.getElementById('booking-modal-form');
  if (bookingModalForm) {
    bookingModalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = bookingModalForm.querySelector('button[type="submit"]');
      if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

      setTimeout(() => {
        alert('Thank you! Your expedition request has been sent to Mohand. We will contact you on WhatsApp/Email within 24 hours to confirm your dates.');
        bookingModalForm.reset();
        if (bookingModal) bookingModal.classList.remove('modal-active');
        document.body.classList.remove('modal-open');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>Submit Booking Request</span>';
      }, 1000);
    });
  }

  // Set current year in footer
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
});
