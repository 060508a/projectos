// ================================
// FUNCIONALIDADES DO MENU E FORMULÁRIO
// ================================

// Aguarda o DOM ser carregado antes de executar
document.addEventListener('DOMContentLoaded', () => {
    
    // ========================
    // DARK MODE / LIGHT MODE
    // ========================
    
    // Seleciona o botão de toggle de tema
    const themeToggle = document.getElementById('themeToggle');
    console.log('Theme toggle button:', themeToggle);
    
    // Carrega o tema salvo do localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    console.log('Saved theme:', savedTheme);
    
    // Aplica o tema salvo
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<span class="theme-icon">☀️</span>';
        }
    }
    
    // Ao clicar no botão de tema
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            console.log('Theme button clicked');
            e.preventDefault();
            
            // Alterna a classe dark-mode no body
            const isDarkMode = document.body.classList.toggle('dark-mode');
            console.log('Dark mode enabled:', isDarkMode);
            
            // Salva a preferência no localStorage
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            
            // Atualiza o ícone
            themeToggle.innerHTML = isDarkMode ? '<span class="theme-icon">☀️</span>' : '<span class="theme-icon">🌙</span>';
        });
    } else {
        console.error('Theme toggle button not found!');
    }
    
    // ========================
    // MENU HAMBÚRGUER
    // ========================
    
    // Seleciona o botão hambúrguer e o menu mobile
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    
    console.log('Hamburger:', hamburger);
    console.log('Mobile nav:', mobileNav);
    
    // Verifica se os elementos existem na página
    if (hamburger && mobileNav) {
        // Ao clicar no hambúrguer
        hamburger.addEventListener('click', () => {
            console.log('Hamburger clicked!');
            // Adiciona/remove a classe 'active' para alternar a animação
            hamburger.classList.toggle('active');
            console.log('Hamburger active class:', hamburger.classList.contains('active'));
            // Abre/fecha o menu lateral
            mobileNav.classList.toggle('open');
            console.log('Mobile nav open class:', mobileNav.classList.contains('open'));
        });
    } else {
        console.error('Hamburger or mobile nav not found!');
    }

    // ========================
    // FORMULÁRIO DE CADASTRO
    // ========================
    
    // Seleciona o formulário de cadastro
    const form = document.querySelector('#signupForm');
    
    // Verifica se o formulário existe na página
    if (form) {
        // Ao enviar o formulário
        form.addEventListener('submit', (e) => {
            // Previne o envio padrão do formulário
            e.preventDefault();
            // Exibe mensagem de sucesso simulado (protótipo)
            alert('Cadastro simulado! Nenhum dado foi salvo. (Protótipo para apresentação)');
            // Limpa todos os campos do formulário
            form.reset();
        });
    }
});


