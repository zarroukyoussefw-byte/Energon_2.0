export function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.animate-section').forEach(el => el.classList.add('visible'));
    return;
  }

  const sections = document.querySelectorAll('.animate-section');
  
  const observer = new IntersectionObserver((entries, obs) => {
    let delayCount = 1;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        el.style.willChange = 'opacity, transform';
        el.style.transitionDelay = `${delayCount * 100}ms`;
        
        // Force reflow
        void el.offsetHeight;
        
        el.classList.add('visible');
        obs.unobserve(el);

        // Remove will-change after transition (800ms) + delay
        setTimeout(() => {
          el.style.willChange = 'auto';
          el.style.transitionDelay = '';
        }, 800 + (delayCount * 100));
        
        delayCount++;
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(s => observer.observe(s));
}
