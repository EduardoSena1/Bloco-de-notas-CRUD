
//  para menu
const modal = document.getElementById('modal');
const menuItem = document.querySelectorAll('.item-menu');
const notas = JSON.parse(localStorage.getItem("notas"));

// essa função é para o estido menu
function sessaoMenu() {
 
    menuItem.forEach(item => 
        item.classList.remove('marcado')
                    )

    this.classList.add('marcado')
}


menuItem.forEach((item)=>
    item.addEventListener('click', sessaoMenu)
)


// função para retrair menu
function toggleMenu() {
    var aside = document.querySelector('aside');
    aside.classList.toggle('retratil'); 
}

// modal que abre para escrever as coisas
function openModal() {
   
    document.getElementById('modal-overlay').style.display = 'block';
}

 // Definir cores das notas

function changeColor(color) {
    
    document.getElementById('notaContainer').style.backgroundColor = color;
    document.getElementById('novaNota').style.backgroundColor = color;
    const corSelecionada = color;
    

}

// Função que  abri o modal
function abrirModal() {
    var modalOverlay = document.getElementById('modal');
    if (modalOverlay) {
        modalOverlay.classList.remove('hidden');
    } else {
        console.error('Elemento modal não encontrado.');
    }
}

 // Função que fechar o modal

 function fecharModal() {
    var modalOverlay = document.getElementById('modal');
    if (modalOverlay) {
        modalOverlay.classList.add('hidden');
    } else {
        console.error('Elemento modal não encontrado.');
    }
   
}


// Parte para as operações crud com as notas
 
// Função para renderizar uma nova nota na tela
function renderizarNovaNota(id, texto, corBackground) {
    const main = document.querySelector('main');
    const nota = document.createElement('div');
    nota.classList.add('nota');
    nota.dataset.id = id;
    nota.dataset.favorita = 'false';
    nota.style.backgroundColor = corBackground;
    
    nota.innerHTML = `
        <div class="configuracao">
            <button class="favoritar"><i class="far fa-star"></i></button>
            <button class="editar" ><i class="fas fa-edit"></i></button>
            <button class="salvar" ><i class="fa-solid fa-floppy-disk"></i></button>
            <button class="deletar"><i class="fas fa-trash-alt "></i> </button>
        </div>
        <div class="main ${texto ? "" : "hidden"}">${texto}</div>
        <textarea class="${texto ? "hidden" : ""}">${texto}</textarea>
    `;

    const btnFavoritar = nota.querySelector('.favoritar');
    btnFavoritar.addEventListener('click', () => {
        favoritarNota(nota);
    });

    editarNota(nota);
    deletarNota(nota);

    const configuracao = nota.querySelector('.configuracao');
    const mainDiv = nota.querySelector('.main');
    const textarea = nota.querySelector('textarea');
    configuracao.style.backgroundColor = corBackground;
    mainDiv.style.backgroundColor = corBackground;
    textarea.style.backgroundColor = corBackground;

    main.appendChild(nota);
}

// Função para adicionar uma nova nota ao armazenamento local
function adicionarNotaLocalStorage(id, texto, corBackground) {
    const notas = JSON.parse(localStorage.getItem("notas")) || [];
    
    notas.push({
        id: id,
        texto: texto,
        favorita: false,
        dataHora: new Date().toISOString(),
        corBackground: corBackground
    });

    localStorage.setItem('notas', JSON.stringify(notas));
}

// Função principal para adicionar uma nova nota
function addNovaNota() {
    const novaNotaTextarea = document.getElementById('novaNota');
    const texto = novaNotaTextarea.value;
    const corBackground = getComputedStyle(document.getElementById('notaContainer')).getPropertyValue('background-color');
    const id = Date.now();

    renderizarNovaNota(id, texto, corBackground);
    adicionarNotaLocalStorage(id, texto, corBackground);

    fecharModal();
    location.reload();

    novaNotaTextarea.value = '';
}




// Função para favoritar uma nota
function favoritarNota(nota) {
    const idNota = parseInt(nota.dataset.id);
    const notas = JSON.parse(localStorage.getItem('notas')) || [];
    const notaIndex = notas.findIndex(nota => nota.id === idNota);

    if (notaIndex !== -1) {
        const isFavorita = notas[notaIndex].favorita;
        notas[notaIndex].favorita = !isFavorita;
        localStorage.setItem('notas', JSON.stringify(notas));

        // Atualize a aparência do botão de favoritar
        const btnFavoritar = nota.querySelector('.favoritar');
        btnFavoritar.innerHTML = `<i class="${isFavorita ? 'far' : 'fas'} fa-star"></i>`;
    } else {
        console.error('Nota não encontrada para favoritar:', idNota);
    }
}



//função de editar  as notas 

function editarNota(nota) {
    const btnEditar = nota.querySelector('.editar');
    const btnSalvar = nota.querySelector('.salvar');

//adiconei um escutador para saber se foi clicado
    btnEditar.addEventListener('click', () => {
        const mainContent = nota.querySelector('.main');
        const textarea = nota.querySelector('textarea');

        if (mainContent.classList.contains('hidden')) {
            // aqui eu distingi quando a nota ta sendo editada ou não usei o hidden para esconder o elemento
            mainContent.classList.remove('hidden');
            textarea.classList.add('hidden');
            textarea.value = mainContent.textContent;

        } else {

            mainContent.classList.add('hidden');
            textarea.classList.remove('hidden');
            mainContent.textContent = textarea.value;

        }
    });

    btnSalvar.addEventListener('click', () => {
        const mainContent = nota.querySelector('.main');
        const textarea = nota.querySelector('textarea');

        if (textarea.value !== mainContent.textContent) {
            const idNota = parseInt(nota.dataset.id);
            
            atualizarNotaNoLocalStorage(idNota, textarea.value);

            mainContent.classList.remove('hidden');
            textarea.classList.add('hidden');
            mainContent.textContent = textarea.value;
        }
    });
}



// Função para deletar uma nota
function deletarNota(nota) {
    const btnDeletar = nota.querySelector('.deletar');
    btnDeletar.addEventListener('click', () => {
        nota.remove();
        deletarNotaDoLocalStorage(nota.dataset.id);
    });
}
// Função para atualizar uma nota no armazenamento local
function atualizarNotaNoLocalStorage(id, novoTexto) {
    const notas = JSON.parse(localStorage.getItem('notas')) || [];


    const notaIndex = notas.findIndex(nota => nota.id === id);

    
    if (notaIndex !== -1) {
        notas[notaIndex].texto = novoTexto;

       
        localStorage.setItem('notas', JSON.stringify(notas));

        console.log('Nota atualizada com sucesso:', notas[notaIndex]);
    } else {
        console.error('Nota não encontrada para atualização:', id);
    }
}


// Função para deletar uma nota do storageLocal

function deletarNotaDoLocalStorage(id) {
    let notas = JSON.parse(localStorage.getItem('notas')) || [];
  
    notas = notas.filter(nota => nota.id !== parseInt(id));
 
    localStorage.setItem('notas', JSON.stringify(notas));
}
 
// Função para renderizar as notas com base na seção ativa do menu
function renderizarNotas() {
    const secaoAtivaElemento = document.querySelector('.item-menu.ativado a');

    if (secaoAtivaElemento) {
        const secaoAtiva = secaoAtivaElemento.id;

        if (secaoAtiva === "menu-notas") {
            renderizarTodasNotas();
        } else if (secaoAtiva === "menu-recentes") {
            renderizarNotasRecentes();
        } else if (secaoAtiva === "menu-favoritas") {
            renderizarNotasFavoritas();
        }
    } else {
        console.error("Nenhuma seção ativa encontrada.");
    }
}


// Função para renderizar todas as notas
function renderizarTodasNotas() {
    const notas = JSON.parse(localStorage.getItem("notas")) || [];
    const notasContainer = document.getElementById("notas");
    notasContainer.innerHTML = "";

    notas.forEach(nota => {
        const notaElement = criarNotaElemento(nota);
        notasContainer.appendChild(notaElement);
    });
}

// Função para renderizar as 5 notas mais recentes
function renderizarNotasRecentes() {
    const notas = JSON.parse(localStorage.getItem("notas")) || [];
    const notasOrdenadas = notas.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora)).slice(0, 5);
    const notasContainer = document.getElementById("notas");
    notasContainer.innerHTML = "";

    notasOrdenadas.forEach(nota => {
        const notaElement = criarNotaElemento(nota);
        notasContainer.appendChild(notaElement);
    });
}

// Função para renderizar apenas as notas favoritas
function renderizarNotasFavoritas() {
    const notas = JSON.parse(localStorage.getItem("notas")) || [];
    const notasFavoritas = notas.filter(nota => nota.favorita);
    const notasContainer = document.getElementById("notas");
    notasContainer.innerHTML = "";

    notasFavoritas.forEach(nota => {
        const notaElement = criarNotaElemento(nota);
        notasContainer.appendChild(notaElement);
    });
}

// Função auxiliar para criar elemento de nota
function criarNotaElemento(nota) {
    const notaElement = document.createElement("div");
    notaElement.classList.add("nota");
    notaElement.dataset.id = nota.id;
    notaElement.dataset.favorita = nota.favorita;
    notaElement.style.backgroundColor = nota.corBackground;

    notaElement.innerHTML = `
        <div class="configuracao">
            <button class="favoritar"><i class="${nota.favorita ? 'fas' : 'far'} fa-star"></i></button>
            <button class="editar" ><i class="fas fa-edit"></i></button>
            <button class="salvar" ><i class="fa-solid fa-floppy-disk"></i></button>
            <button class="deletar"><i class="fas fa-trash-alt"></i></button>
        </div>
        <div class="main">${nota.texto}</div>
        <textarea class="hidden">${nota.texto}</textarea>
    `;

    const configuracao = notaElement.querySelector('.configuracao');
    const mainDiv = notaElement.querySelector('.main');
    const textarea = notaElement.querySelector('textarea');
    configuracao.style.backgroundColor = nota.corBackground;
    mainDiv.style.backgroundColor = nota.corBackground;
    textarea.style.backgroundColor = nota.corBackground;

    configuracao.addEventListener('click', (event) => {
        const btn = event.target.closest('button');
        if (!btn) return;
        
        if (btn.classList.contains('favoritar')) {
            favoritarNota(notaElement);
        } else if (btn.classList.contains('editar')) {
            editarNota(notaElement);
        } else if (btn.classList.contains('salvar')) {
            salvarNotaEditada(notaElement);
        } else if (btn.classList.contains('deletar')) {
            deletarNota(notaElement);
        }
    });

    return notaElement;
}




// Função para marcar a seção ativa do menu  para as funções de listagem funcionarem
function selectLink() {
   
    menuItem.forEach(item => item.classList.remove('ativado'));
   
    this.classList.add('ativado');
  
    renderizarNotas();
}

menuItem.forEach(item => item.addEventListener('click', selectLink));

renderizarNotas();

// isso é tudo