// Estado Inicial
const OPERADORAS = [
    "Trasmontano", "Amil", "SulAmérica", "Bradesco", "Vera Cruz", "Supermed",
    "Qualicorp", "Porto", "Hapvida", "Unihosp", "MedSênior", "Prevent Senior",
];

let state = {
    users: [
        { email: "admin@painel.com", senha: "1234", role: "Admin" },
        { email: "corretor@painel.com", senha: "1234", role: "Corretor" },
    ],
    currentUser: null,
    email: "",
    senha: "",
    selected: null, // Operadora selecionada para visualização
    query: "", // Termo de busca
    faqs: {},
    materiais: {},
};

const appContainer = document.getElementById('app-container');

// --- Funções de Lógica de Estado ---

function setState(newState) {
    state = { ...state, ...newState };
    render(); // Chama a função de renderização após qualquer alteração de estado
}

function handleLogin() {
    const user = state.users.find(u => u.email === state.email && u.senha === state.senha);
    if (user) {
        // Redefinir estado de input para o próximo login, mas manter o currentUser
        setState({ currentUser: user, email: "", senha: "" });
    } else {
        alert("Usuário ou senha incorretos");
    }
}

function handleLogout() {
    setState({
        currentUser: null,
        email: "",
        senha: "",
        selected: null,
        query: "",
    });
}

function addCorretor(newEmail, newSenha) {
    if (!newEmail || !newSenha) return alert("Preencha todos os campos.");
    const newUsers = [...state.users, { email: newEmail, senha: newSenha, role: "Corretor" }];
    setState({ users: newUsers });
}

function removeCorretor(userEmail) {
    const newUsers = state.users.filter(u => u.email !== userEmail);
    setState({ users: newUsers });
}

function addFaq(op, pergunta, resposta) {
    if (!pergunta || !resposta) return alert("Preencha todos os campos do FAQ.");
    const currentFaqs = state.faqs[op] || [];
    const newFaqs = { ...state.faqs, [op]: [...currentFaqs, { pergunta, resposta }] };
    setState({ faqs: newFaqs });
}

function removeFaq(op, idx) {
    const newOpFaqs = (state.faqs[op] || []).filter((_, i) => i !== idx);
    const newFaqs = { ...state.faqs, [op]: newOpFaqs };
    setState({ faqs: newFaqs });
}

function addMaterial(op, material) {
    if (!material) return alert("Preencha o campo de material.");
    const currentMateriais = state.materiais[op] || [];
    const newMateriais = { ...state.materiais, [op]: [...currentMateriais, material] };
    setState({ materiais: newMateriais });
}

function removeMaterial(op, idx) {
    const newOpMateriais = (state.materiais[op] || []).filter((_, i) => i !== idx);
    const newMateriais = { ...state.materiais, [op]: newOpMateriais };
    setState({ materiais: newMateriais });
}

// --- Funções de Renderização (Criando o HTML) ---

function renderLogin() {
    // Layout do login melhorado com logo placeholder
    return `
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
            <div class="bg-white p-8 rounded-2xl shadow-lg w-96 login-card">
                <div class="text-center mb-6">
                    <div class="text-4xl font-extrabold text-purple-600 mb-2">A<span class="text-yellow-400">B</span>C</div>
                    <h2 class="text-xl font-bold text-gray-700">Painel Affinity</h2>
                </div>
                <input type="email" id="login-email" placeholder="Email" class="w-full mb-3 input-login rounded" value="${state.email}">
                <input type="password" id="login-senha" placeholder="Senha" class="w-full mb-6 input-login rounded" value="${state.senha}">
                <button id="login-button" class="w-full bg-purple-600 text-white py-2 rounded font-medium hover:bg-purple-700 transition">Entrar</button>
                <div class="mt-4 text-center text-sm text-gray-500">
                    <p>Admin: admin@painel.com / 1234</p>
                    <p>Corretor: corretor@painel.com / 1234</p>
                </div>
            </div>
        </div>
    `;
}

function renderHero() {
    return `
        <header class="w-full bg-gradient-to-br text-white p-8 rounded-b-3xl shadow-lg"> 
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
                <div class="flex-1">
                    <h1 class="text-3xl md:text-4xl font-extrabold">Painel Affinity ABC</h1>
                    <p class="mt-2 text-sm md:text-base opacity-90">Atualizações mensais das operadoras — visual limpo e objetivo no estilo Supermed.</p>
                    <div class="mt-4 flex gap-2">
                        <input id="query-input" value="${state.query}" class="rounded-full px-4 py-2 text-gray-700 w-64" placeholder="Pesquisar operadora...">
                    </div>
                </div>
                <div class="flex-1 flex justify-end items-center gap-4">
                    <div class="text-right">
                        <div class="text-sm opacity-80">Última atualização</div>
                        <div class="font-bold text-lg">Setembro 2025</div>
                        <div class="mt-1 text-xs opacity-70">Acesso: ${state.currentUser.role}</div>
                    </div>
                    <button id="logout-button" class="px-4 py-2 bg-red-500 text-white rounded font-medium">Sair</button>
                </div>
            </div>
        </header>
    `;
}

function renderOperadoraCard(name) {
    const faqCount = (state.faqs[name] || []).length;
    return `
        <div class="operadora-card bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition cursor-pointer flex flex-col justify-between" data-name="${name}">
            <div>
                <div class="text-sm text-gray-500">Operadora</div>
                <h3 class="text-lg font-semibold mt-1">${name}</h3>
            </div>
            <div class="mt-4 flex items-center justify-between">
                <div class="text-xs text-gray-400">Atualizações: ${faqCount}</div>
                <button class="view-operadora-button px-3 py-1 rounded-full text-sm font-medium border border-purple-600 text-purple-600" data-name="${name}">Ver</button>
            </div>
        </div>
    `;
}

function renderAdminUsers() {
    const corretores = state.users.filter(u => u.role === 'Corretor');
    return `
        <div class="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md">
            <h2 class="text-2xl font-bold mb-4">Gerenciamento de Corretores</h2>
            <div class="flex gap-2 mb-4">
                <input type="email" id="new-corretor-email" placeholder="Email" class="p-2 border rounded">
                <input type="text" id="new-corretor-senha" placeholder="Senha" class="p-2 border rounded">
                <button id="add-corretor-button" class="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition">Adicionar</button>
            </div>
            <ul class="space-y-2">
                ${corretores.map(u => `
                    <li class="flex justify-between items-center border p-2 rounded">
                        ${u.email}
                        <button class="remove-corretor-button text-xs text-red-500 hover:underline" data-email="${u.email}">Remover</button>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}

function renderOperadoraPage(name) {
    const is_admin = state.currentUser.role === 'Admin';
    const opFaqs = state.faqs[name] || [];
    const opMateriais = state.materiais[name] || [];

    return `
        <div class="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md">
            <button id="back-to-home" class="text-sm text-gray-500">← Voltar</button>
            <h2 class="text-2xl font-bold mt-2 mb-4">${name} - Operadora</h2>

            <div class="space-y-6">
                <section>
                    <h3 class="font-semibold text-purple-700 mb-2">FAQ</h3>
                    ${opFaqs.length > 0 ? opFaqs.map((faq, idx) => `
                        <div class="faq-item p-5 border rounded-xl shadow-sm hover:shadow-md transition mb-2">
                            <div class="font-semibold text-purple-700">Q: ${faq.pergunta}</div>
                            <div class="mt-1 text-gray-600">A: ${faq.resposta}</div>
                            ${is_admin ? `<button class="remove-faq-button mt-2 text-xs text-red-500 hover:underline" data-op="${name}" data-idx="${idx}">Remover</button>` : ''}
                        </div>
                    `).join('') : '<div class="text-gray-500">Nenhuma FAQ cadastrada.</div>'}

                    ${is_admin ? `
                        <div class="p-5 border rounded-xl shadow-sm bg-gray-50 mt-4">
                            <input type="text" id="new-faq-pergunta" placeholder="Pergunta" class="w-full p-3 border rounded mb-2">
                            <textarea placeholder="Resposta" id="new-faq-resposta" class="w-full p-3 border rounded mb-2"></textarea>
                            <button id="add-faq-button" data-op="${name}" class="px-5 py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-700 transition">Adicionar FAQ</button>
                        </div>
                    ` : ''}
                </section>

                <section>
                    <h3 class="font-semibold text-purple-700 mb-2">Materiais</h3>
                    ${opMateriais.length > 0 ? opMateriais.map((mat, idx) => `
                        <div class="p-4 border rounded-xl shadow-sm flex justify-between items-center mb-2">
                            <span class="text-gray-700 truncate">${mat}</span>
                            ${is_admin ? `<button class="remove-material-button text-xs text-red-500 hover:underline ml-2" data-op="${name}" data-idx="${idx}">Remover</button>` : ''}
                        </div>
                    `).join('') : '<div class="text-gray-500">Nenhum material cadastrado.</div>'}

                    ${is_admin ? `
                        <div class="p-5 border rounded-xl shadow-sm bg-gray-50 flex gap-2 mt-4">
                            <input type="text" id="new-material-input" placeholder="Adicionar material" class="flex-1 p-3 border rounded">
                            <button id="add-material-button" data-op="${name}" class="px-5 py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-700 transition">Adicionar</button>
                        </div>
                    ` : ''}
                </section>
            </div>
        </div>
    `;
}

// --- Função Principal de Renderização ---

function render() {
    let htmlContent = '';

    if (!state.currentUser) {
        htmlContent = renderLogin();
    } else {
        htmlContent = renderHero();

        htmlContent += '<main class="max-w-7xl mx-auto main-content">';

        if (!state.selected) {
            // Visão Geral das Operadoras
            if (state.currentUser.role === 'Admin') {
                htmlContent += renderAdminUsers();
            }

            const filtered = OPERADORAS.filter(o => o.toLowerCase().includes(state.query.toLowerCase()));

            htmlContent += '<section class="grid md:grid-cols-3 gap-6 mt-6">';
            if (filtered.length > 0) {
                htmlContent += filtered.map(renderOperadoraCard).join('');
            } else {
                htmlContent += '<div class="md:col-span-3 p-6 text-center text-gray-400">Nenhuma operadora encontrada.</div>';
            }
            htmlContent += '</section>';

        } else {
            // Página da Operadora Específica
            htmlContent += renderOperadoraPage(state.selected);
        }

        htmlContent += '</main>';
    }

    appContainer.innerHTML = htmlContent;
    attachEventListeners(); // Re-anexa os ouvintes de evento
}

// --- Gerenciamento de Eventos (Anexando a lógica ao DOM) ---

function attachEventListeners() {
    if (!state.currentUser) {
        // Eventos da Tela de Login (CORREÇÃO DE TRAVAMENTO AQUI)
        const emailInput = document.getElementById('login-email');
        const senhaInput = document.getElementById('login-senha');

        // *SOMENTE* ATUALIZA O ESTADO NA VARIÁVEL, SEM CHAMAR RENDER()
        emailInput.addEventListener('input', (e) => state.email = e.target.value);
        senhaInput.addEventListener('input', (e) => state.senha = e.target.value);
        
        document.getElementById('login-button').addEventListener('click', handleLogin);
        
        // Adiciona Enter Keypress
        // É necessário reanexar o evento 'keydown' a cada renderização da tela de login, por isso é colocado aqui.
        document.addEventListener('keydown', function handleEnterKey(e) {
            if (e.key === 'Enter' && document.getElementById('login-button')) {
                handleLogin();
                // Remove o listener após o clique para não causar conflito
                document.removeEventListener('keydown', handleEnterKey); 
            }
        });
        
    } else {
        // Eventos Globais (Header)
        document.getElementById('logout-button').addEventListener('click', handleLogout);
        
        // Pesquisa: Deve renderizar a cada tecla para filtrar a lista
        document.getElementById('query-input').addEventListener('input', (e) => setState({ query: e.target.value }));

        if (!state.selected) {
            // Eventos da Tela Principal
            document.querySelectorAll('.view-operadora-button').forEach(button => {
                button.addEventListener('click', (e) => setState({ selected: e.target.dataset.name }));
            });
            
            document.querySelectorAll('.operadora-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'BUTTON') {
                        setState({ selected: card.dataset.name });
                    }
                });
            });

            // Eventos de Admin
            if (state.currentUser.role === 'Admin') {
                const newCorretorEmail = document.getElementById('new-corretor-email');
                const newCorretorSenha = document.getElementById('new-corretor-senha');

                document.getElementById('add-corretor-button').addEventListener('click', () => {
                    // Pega o valor na hora do clique e chama render
                    addCorretor(newCorretorEmail.value, newCorretorSenha.value);
                    // Limpa os campos *após* a adição
                    newCorretorEmail.value = '';
                    newCorretorSenha.value = '';
                });

                document.querySelectorAll('.remove-corretor-button').forEach(button => {
                    button.addEventListener('click', (e) => removeCorretor(e.target.dataset.email));
                });
            }

        } else {
            // Eventos da Página da Operadora
            document.getElementById('back-to-home').addEventListener('click', () => setState({ selected: null }));

            if (state.currentUser.role === 'Admin') {
                // FAQ
                const newFaqPergunta = document.getElementById('new-faq-pergunta');
                const newFaqResposta = document.getElementById('new-faq-resposta');

                document.getElementById('add-faq-button').addEventListener('click', (e) => {
                    const op = e.target.dataset.op;
                    addFaq(op, newFaqPergunta.value, newFaqResposta.value);
                });
                document.querySelectorAll('.remove-faq-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        removeFaq(e.target.dataset.op, parseInt(e.target.dataset.idx));
                    });
                });

                // Materiais
                const newMaterialInput = document.getElementById('new-material-input');

                document.getElementById('add-material-button').addEventListener('click', (e) => {
                    const op = e.target.dataset.op;
                    addMaterial(op, newMaterialInput.value);
                });
                document.querySelectorAll('.remove-material-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        removeMaterial(e.target.dataset.op, parseInt(e.target.dataset.idx));
                    });
                });
            }
        }
    }
}

// Inicia a aplicação
render();