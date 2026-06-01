let initialized = false;

export function initCTA() {
  if (initialized) return;
  initialized = true;

  const form = document.getElementById('contact-form') as HTMLFormElement;
  const feedback = document.getElementById('contact-feedback') as HTMLElement;
  const submitBtn = document.getElementById('contact-submit') as HTMLButtonElement;

  if (!form || !feedback || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset feedback
    feedback.textContent = '';
    feedback.className = 'cta__feedback';

    // Basic validation
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim();
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim();

    if (!name || !email || !message) {
      feedback.textContent = 'Veuillez remplir les champs obligatoires.';
      feedback.className = 'cta__feedback is-error';
      return;
    }

    const consent = (form.elements.namedItem('consent') as HTMLInputElement).checked;
    if (!consent) {
      feedback.textContent = 'Veuillez accepter la politique de confidentialité.';
      feedback.className = 'cta__feedback is-error';
      return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours…';

    try {
      const res = await fetch('https://admin.energon.cloud/api/collections/Contacts/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      feedback.textContent = 'Votre message a bien été envoyé, je vous réponds sous 24h.';
      feedback.className = 'cta__feedback is-success';
      form.reset();
    } catch {
      feedback.textContent = 'Une erreur est survenue. Réessayez ou contactez-moi par email.';
      feedback.className = 'cta__feedback is-error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Envoyer le message <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
  });
}
