/* =========================================================
   MARINE COLOSSUS - script.js
   JavaScript simples, partilhado pelas três páginas.
   Cada bloco começa por verificar se o elemento existe,
   por isso o mesmo ficheiro funciona em qualquer página.
   ========================================================= */


/* ---------- 1. MENU DO TELEMÓVEL (botão ☰) ---------- */
const botaoMenu = document.querySelector('.menu-botao');
const linksMenu = document.querySelector('.menu-links');

// "if" garante que só corre se estes elementos existirem na página
if (botaoMenu && linksMenu) {

  // Ao clicar em ☰, abre ou fecha o menu
  botaoMenu.addEventListener('click', function () {
    // toggle = acrescenta a classe se não existir, tira se existir
    const aberto = linksMenu.classList.toggle('aberto');
    // Informa os leitores de ecrã se o menu está aberto
    botaoMenu.setAttribute('aria-expanded', aberto);
  });

  // Ao clicar num link, o menu volta a fechar
  linksMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      linksMenu.classList.remove('aberto');
      botaoMenu.setAttribute('aria-expanded', false);
    });
  });
}


/* ---------- 2. SOMBRA NO MENU AO ROLAR + BOTÃO "VOLTAR AO TOPO" ---------- */
const menu = document.querySelector('.menu');
const botaoTopo = document.getElementById('botao-topo');

// Esta função corre sempre que o visitante rola a página
function aoRolar() {
  // scrollY = quantos píxeis a página já desceu
  if (menu) {
    // Acima de 50px acrescenta a sombra, abaixo tira
    menu.classList.toggle('com-sombra', window.scrollY > 50);
  }

  if (botaoTopo) {
    // "hidden" = escondido. Só mostra o botão depois de descer 300px
    botaoTopo.hidden = window.scrollY < 300;
  }
}

window.addEventListener('scroll', aoRolar);
aoRolar(); // corre uma vez ao abrir a página

// Ao clicar na seta, volta ao topo com animação suave
if (botaoTopo) {
  botaoTopo.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ---------- 3. CARTÕES A APARECER AO ROLAR ---------- */
const cartoes = document.querySelectorAll('.card');

// Se o navegador não suporta IntersectionObserver, os cartões ficam simplesmente visíveis
if (cartoes.length > 0 && 'IntersectionObserver' in window) {

  // O "observador" avisa quando um elemento entra no ecrã
  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        // Tira a classe "escondido": o CSS faz a animação
        entrada.target.classList.remove('escondido');
        // Já apareceu, não precisamos de observar mais
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.1 }); // 0.1 = quando 10% do cartão estiver visível

  cartoes.forEach(function (cartao) {
    cartao.classList.add('escondido');
    observador.observe(cartao);
  });
}


/* ---------- 4. ANO AUTOMÁTICO NO RODAPÉ ---------- */
const spanAno = document.getElementById('ano');
if (spanAno) {
  // new Date().getFullYear() devolve o ano atual (ex: 2026)
  spanAno.textContent = new Date().getFullYear();
}


/* ---------- 5. VALIDAÇÃO DO FORMULÁRIO ---------- */
const formulario = document.getElementById('form-contato');

if (formulario) {

  // Mostra (ou limpa) a mensagem de erro de um campo
  function mostrarErro(idDoCampo, mensagem) {
    const campo = document.getElementById(idDoCampo);
    // Procura o <p class="erro"> que pertence a este campo
    const textoErro = formulario.querySelector('[data-erro-de="' + idDoCampo + '"]');

    textoErro.textContent = mensagem;
    // Se há mensagem, pinta a borda de vermelho
    campo.classList.toggle('campo-invalido', mensagem !== '');
  }

  // Corre quando o visitante clica em "Enviar Mensagem"
  formulario.addEventListener('submit', function (evento) {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    let tudoCerto = true; // vira false se encontrarmos algum erro

    // Nome: não pode estar vazio
    if (nome === '') {
      mostrarErro('nome', 'Escreva o seu nome.');
      tudoCerto = false;
    } else {
      mostrarErro('nome', '');
    }

    // Email: tem de ter "@" e um ponto depois (verificação simples)
    if (!email.includes('@') || !email.includes('.')) {
      mostrarErro('email', 'Escreva um email válido, por exemplo nome@email.com.');
      tudoCerto = false;
    } else {
      mostrarErro('email', '');
    }

    // Mensagem: pelo menos 10 letras
    if (mensagem.length < 10) {
      mostrarErro('mensagem', 'A mensagem precisa de pelo menos 10 caracteres.');
      tudoCerto = false;
    } else {
      mostrarErro('mensagem', '');
    }

    // Se algo falhou, impede o envio. Se está tudo certo, o formulário segue para o FormSubmit.
    if (!tudoCerto) {
      evento.preventDefault();
    }
  });
}


/* ---------- 6. IMAGENS: CARREGAMENTO PREGUIÇOSO ---------- */
// "lazy" = a imagem só carrega quando o visitante está perto dela (página mais rápida)
document.querySelectorAll('img').forEach(function (imagem) {
  imagem.loading = 'lazy';
});
