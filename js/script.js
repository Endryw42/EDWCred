// --- NAVEGAÇÃO SPA E MOBILE ---
function switchTab(tabId) {
    const sections = document.querySelectorAll('main > section');
    sections.forEach(sec => sec.classList.add('hidden'));

    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));

    const target = document.getElementById(tabId);
    if (target) {
        target.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    links.forEach(link => {
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(tabId)) {
            link.classList.add('active');
        }
    });
}

function toggleMenu() {
    const nav = document.getElementById('navMenu');
    const btnCta = document.getElementById('mobile-cta-btn');
    
    nav.classList.toggle('active');
    
    if(nav.classList.contains('active')) {
        btnCta.style.display = 'block';
    } else {
        btnCta.style.display = 'none';
    }
}

function fecharMenuMobile() {
    const nav = document.getElementById('navMenu');
    if (nav.classList.contains('active')) {
        nav.classList.remove('active');
    }
}

// --- WHATSAPP RANDOMICO ---
const numerosWhatsApp = [
    "5548988739675"
];

function getRandomNumber() {
    return numerosWhatsApp[Math.floor(Math.random() * numerosWhatsApp.length)];
}

function abrirWhatsApp(msg) {
    const numero = getRandomNumber();
    const link = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
    window.open(link, '_blank');
}

// --- LÓGICA SIMULADOR CLT ---
const valoresTabela = {
    6: 132.95,
    12: 220.39,
    24: 316.85,
    36: 380.00,
    48: 495.89
};

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const cltSalario = document.getElementById("clt-salario");
const cltParcelas = document.getElementById("clt-parcelas");
const cltParcelaInput = document.getElementById("clt-parcela-input");
const cltResultadoBox = document.getElementById("clt-resultado");
const resMargem = document.getElementById("res-margem");
const resValorTotal = document.getElementById("res-valor-total");

let margemMaximaGlobal = 0;

function atualizarSimulacaoCLT() {
    const bruto = parseFloat(cltSalario.value);
    
    if (isNaN(bruto) || bruto <= 0) {
        cltResultadoBox.style.display = "none";
        resValorTotal.innerText = "R$ 0,00";
        return;
    }

    const margemLivre = bruto * 0.29815;
    margemMaximaGlobal = margemLivre * 0.70;

    resMargem.innerText = formatarMoeda(margemMaximaGlobal);
    cltResultadoBox.style.display = "block";

    if (document.activeElement !== cltParcelaInput) {
        cltParcelaInput.value = margemMaximaGlobal.toFixed(2);
    }

    calcularValorTotal();
}

function calcularValorTotal() {
    const parcelas = parseInt(cltParcelas.value);
    let valorParcela = parseFloat(cltParcelaInput.value);

    if (!parcelas || isNaN(valorParcela) || valorParcela <= 0) {
        resValorTotal.innerText = "R$ 0,00";
        return;
    }

    if (valorParcela > margemMaximaGlobal) {
        cltParcelaInput.value = margemMaximaGlobal.toFixed(2);
        valorParcela = margemMaximaGlobal;
        cltParcelaInput.style.border = "2px solid red";
        setTimeout(() => {
            cltParcelaInput.style.border = "2px solid #eee"; 
        }, 1000);
    } else {
        cltParcelaInput.style.border = "2px solid #eee";
    }

    if (valoresTabela[parcelas]) {
        const fator = valoresTabela[parcelas] / 32.09;
        let valorLiberado = valorParcela * fator;
        
        // AVISO DE MÍNIMO
        if (valorLiberado < 500) {
            resValorTotal.innerHTML = `
                <div style="color: #ff3333; font-size: 1.1rem; margin-bottom: 5px; line-height: 1.2; font-weight: 600;">
                    <i class="fas fa-exclamation-circle"></i> Valor abaixo do mínimo (R$ 500)
                </div>
                <span style="color: #4caf50;">${formatarMoeda(valorLiberado)}</span>
            `;
        } else {
            resValorTotal.innerHTML = formatarMoeda(valorLiberado);
            resValorTotal.style.color = "#4caf50";
        }
        
    } else {
        resValorTotal.innerText = "R$ 0,00";
    }
}

function solicitarCLT() {
    const bruto = cltSalario.value;
    const parcelas = cltParcelas.value;
    
    let valorTexto = resValorTotal.innerText;
    if(valorTexto.includes("Valor abaixo")) {
        const partes = valorTexto.split(")");
        if(partes[1]) valorTexto = partes[1].trim();
    }

    // AQUI: Se os campos estiverem vazios, mostra alerta e para.
    // Se preencher, o código segue e chama o WhatsApp.
    if(!bruto || !parcelas) {
        alert("Por favor, preencha o Salário e selecione o Prazo antes de solicitar.");
        return;
    }
    abrirWhatsApp(`Olá! Fiz uma simulação CLT no site.\nSalário Bruto: R$ ${bruto}\nPrazo: ${parcelas}x\nValor Estimado: ${valorTexto}\nGostaria de prosseguir com a análise.`);
}

if(cltSalario) {
    cltSalario.addEventListener("input", atualizarSimulacaoCLT);
    cltSalario.addEventListener("blur", function() {
        if (this.value) {
            const val = parseFloat(this.value);
            if (!isNaN(val)) this.value = val.toFixed(2);
        }
    });
}
if(cltParcelas) cltParcelas.addEventListener("change", calcularValorTotal);
if(cltParcelaInput) {
    cltParcelaInput.addEventListener("input", calcularValorTotal);
    cltParcelaInput.addEventListener("change", calcularValorTotal);
}

// --- CARROSSEL AUTOMÁTICO INSS ---
let slideIndex = 0;
function showSlides() {
    const slides = document.getElementsByClassName("carousel-slide");
    if(slides.length === 0) return;
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].classList.add('active');
    setTimeout(showSlides, 4000); 
}

// --- CARROSSEL AUTOMÁTICO SIAPE (NOVO) ---
let slideIndexSiape = 0;
function showSlidesSiape() {
    const slides = document.getElementsByClassName("carousel-slide-siape");
    if(slides.length === 0) return;
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }
    slideIndexSiape++;
    if (slideIndexSiape > slides.length) {slideIndexSiape = 1}
    slides[slideIndexSiape-1].classList.add('active');
    setTimeout(showSlidesSiape, 4000); 
}

// --- FAQ TOGGLE ---
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });
});

// --- CONTROLE DE COOKIES / LGPD ---
function verificarCookies() {
    const consentimento = localStorage.getItem('edw_cookie_consent');
    const banner = document.getElementById('cookie-banner');
    
    if (!consentimento && banner) {
        banner.style.display = 'flex';
    }
}

function aceitarCookies() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.style.display = 'none';
        localStorage.setItem('edw_cookie_consent', 'true');
    }
}

// --- INICIALIZAÇÃO GERAL ---
document.addEventListener('DOMContentLoaded', function() {
    showSlides();      // Inicia INSS
    showSlidesSiape(); // Inicia SIAPE
    verificarCookies();
});