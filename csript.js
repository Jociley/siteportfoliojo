// Ano no rodapé


// Corrigir ano no rodapé (se existir elemento)
const anoSpan = document.getElementById('2025');
if (anoSpan) anoSpan.textContent = new Date().getFullYear();

// Botão "voltar ao topo"

// Botão "voltar ao topo" corrigido
document.addEventListener('DOMContentLoaded', () => {
  const toTop = document.getElementById('toTop');
  if (!toTop) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) toTop.classList.add('visivel');
    else toTop.classList.remove('visivel');
  });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

// Formulário (simulação)
const form = document.getElementById('form-contato');
const statusEl = document.getElementById('msg-status');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const dados = new FormData(form);
  const nome = dados.get('nome');
  statusEl.textContent = 'Enviando...';
  setTimeout(() => {
    statusEl.textContent = `Obrigada(o), ${Jociley}! Recebi sua mensagem.`;
    form.reset();
  }, 800);
});