function applyAnimations() {
  try {
    document.body.classList.add("fade-in");
    setTimeout(() => {
      const elementos = document.querySelectorAll(".slide-in");
      elementos.forEach((el, i) => {
        setTimeout(() => { el.classList.add("active"); }, i * 200);
      });
    }, 500);
  } catch (e) {
    // Fallback: garante visibilidade se algo quebrar
    document.body.style.opacity = '1';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyAnimations);
} else {
  // DOM já carregado: aplica imediatamente
  applyAnimations();
}
