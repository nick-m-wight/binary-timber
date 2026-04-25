// Scroll-triggered reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Contact form — Web3Forms
// To activate: replace REPLACE_ME in index.html with your key from https://web3forms.com
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  formMessage.className = 'form-message';
  formMessage.textContent = '';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
    });
    const data = await res.json();

    if (data.success) {
      formMessage.textContent = '// Message received. We\'ll be in touch.';
      formMessage.classList.add('show');
      form.reset();
    } else {
      formMessage.textContent = '// Something went wrong. Please try again.';
      formMessage.classList.add('show', 'error');
    }
  } catch {
    formMessage.textContent = '// Network error. Please email us directly.';
    formMessage.classList.add('show', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
    setTimeout(() => {
      formMessage.className = 'form-message';
      formMessage.textContent = '';
    }, 6000);
  }
});
