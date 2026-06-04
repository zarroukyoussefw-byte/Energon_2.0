export function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.animate-section').forEach(el => el.classList.add('visible'));
    return;
  }

  const sections = document.querySelectorAll('.animate-section');
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        el.style.willChange = 'opacity, transform';
        
        // Force reflow
        void el.offsetHeight;
        
        el.classList.add('visible');
        obs.unobserve(el);

        // Remove will-change after transition (500ms)
        setTimeout(() => {
          el.style.willChange = 'auto';
        }, 500);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(s => observer.observe(s));
}
