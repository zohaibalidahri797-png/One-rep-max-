// Global Navigation & Shared UI Interactions
document.addEventListener('DOMContentLoaded', () => {
  // Mobile drawer menu
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  if (mobileMenuToggle && mobileMenuDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenuDrawer.classList.toggle('hidden');
    });

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', () => {
        mobileMenuDrawer.classList.add('hidden');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    }

    // Close on link click inside drawer
    mobileMenuDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenuDrawer.classList.add('hidden');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header blur and background opacity on scroll
  const mainNav = document.getElementById('main-navbar');
  if (mainNav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        mainNav.classList.add('bg-[#0a0b0d]/90', 'backdrop-blur-md', 'border-b', 'border-white/10', 'shadow-2xl');
      } else {
        mainNav.classList.remove('bg-[#0a0b0d]/90', 'backdrop-blur-md', 'border-b', 'border-white/10', 'shadow-2xl');
      }
    }, { passive: true });
  }
});
