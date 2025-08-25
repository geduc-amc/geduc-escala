// Sistema de Gerenciamento de Dados para GEDUC (versão aprimorada)
// Esta versão expande o cadastro de colaboradores, inclui validações de escala,
// marca hora extra automaticamente e gera mensagem formatada para WhatsApp.

console.log('Sistema GEDUC aprimorado carregado!');

class GEDUCDataManager {
    constructor() {
        // Cadastro detalhado de colaboradores.
        // Cada colaborador possui um id (slug), nome completo, vínculo,
        // turnoPadrao (array de turnos em que normalmente trabalha), licenca
        // (null ou tipo de licença), reducao (array de dias de redução de carga)
        // e orientadorViaLivre para terceirizados do Via Livre.
        this.dados = {
            colaboradores: [
                // Agentes administrativos
                { id: 'lucena', nome: 'Lucena', vinculo: 'Agente', turnoPadrao: ['manhã','tarde'], licenca: null, reducao: null },
                { id: 'c_cunha', nome: 'C. Cunha', vinculo: 'Agente', turnoPadrao: ['manhã','tarde'], licenca: null, reducao: null },
                { id: 'kariny', nome: 'Kariny', vinculo: 'Agente', turnoPadrao: ['manhã','tarde'], licenca: 'médica', reducao: null },
                { id: 'luana', nome: 'Luana', vinculo: 'Agente', turnoPadrao: ['manhã'], licenca: null, reducao: ['segunda','terça','quarta'] },
                { id: 'barreira', nome: 'Barreira', vinculo: 'Agente', turnoPadrao: ['manhã'], licenca: null, reducao: ['terça','quarta','quinta'] },
                // Agentes operacionais
                { id: 'luiz_mesquita', nome: 'Luiz Mesquita', vinculo: 'Agente', turnoPadrao: ['manhã'], licenca: null, reducao: null },
                { id: 'facanha', nome: 'Façanha', vinculo: 'Agente', turnoPadrao: ['manhã'], licenca: 'prêmio', reducao: null },
                { id: 'robson', nome: 'Robson', vinculo: 'Agente', turnoPadrao: ['manhã'], licenca: null, reducao: null },
                { id: 'wellington', nome: 'Wellington', vinculo: 'Agente', turnoPadrao: ['manhã'], licenca: null, reducao: null },
                { id: 'kelber', nome: 'Kelber', vinculo: 'Agente', turnoPadrao: ['manhã'], licenca: 'prêmio', reducao: null },
                { id: 'rafael', nome: 'Rafael', vinculo: 'Agente', turnoPadrao: ['manhã'], licenca: null, reducao: null },
                { id: 'heberfran', nome: 'Heberfran', vinculo: 'Agente', turnoPadrao: ['manhã'], licenca: null, reducao: null },
                { id: 'helder', nome: 'Helder', vinculo: 'Agente', turnoPadrao: ['manhã'], licenca: null, reducao: null },
                { id: 'ines', nome: 'Inês', vinculo: 'Agente', turnoPadrao: ['tarde'], licenca: null, reducao: null },
                { id: 'hellen', nome: 'Hellen', vinculo: 'Agente', turnoPadrao: ['tarde'], licenca: null, reducao: null },
                { id: 'ronalddy', nome: 'Ronalddy', vinculo: 'Agente', turnoPadrao: ['tarde'], licenca: null, reducao: null },
                // Comissionado
                { id: 'edmara', nome: 'Edmara', vinculo: 'Comissionado', turnoPadrao: ['manhã','tarde'], licenca: null, reducao: null },
                // Terceirizado administrativo
                { id: 'ana_cleide', nome: 'Ana Cleide', vinculo: 'Terceirizado', turnoPadrao: ['manhã','tarde'], licenca: null, reducao: null },
                // Orientadores Via Livre (manhã por padrão)
                { id: 'alberto', nome: 'Alberto', vinculo: 'Terceirizado', turnoPadrao: ['manhã'], licenca: null, reducao: null, orientadorViaLivre: true },
                { id: 'edson', nome: 'Edson', vinculo: 'Terceirizado', turnoPadrao: ['manhã'], licenca: null, reducao: null, orientadorViaLivre: true },
                { id: 'romario', nome: 'Romário', vinculo: 'Terceirizado', turnoPadrao: ['manhã'], licenca: null, reducao: null, orientadorViaLivre: true },
                { id: 'joao_rafael', nome: 'João Rafael', vinculo: 'Terceirizado', turnoPadrao: ['manhã'], licenca: null, reducao: null, orientadorViaLivre: true },
                { id: 'joao_victor', nome: 'João Victor', vinculo: 'Terceirizado', turnoPadrao: ['manhã'], licenca: null, reducao: null, orientadorViaLivre: true },
                { id: 'samoel', nome: 'Samoel', vinculo: 'Terceirizado', turnoPadrao: ['manhã'], licenca: null, reducao: null, orientadorViaLivre: true },
                { id: 'clemilson', nome: 'Clemilson', vinculo: 'Terceirizado', turnoPadrao: ['manhã'], licenca: null, reducao: null, orientadorViaLivre: true },
                { id: 'carlos_eduardo', nome: 'Carlos Eduardo', vinculo: 'Terceirizado', turnoPadrao: ['tarde'], licenca: null, reducao: null, orientadorViaLivre: true },
                { id: 'lidomar', nome: 'Lidomar', vinculo: 'Terceirizado', turnoPadrao: ['manhã'], licenca: null, reducao: null, orientadorViaLivre: true }
            ],
            // Atividades disponíveis. Estas representam diferentes núcleos e tarefas.
            atividades: [
                {
                    id: 'apoio_geduc',
                    nome: 'Apoio GEDUC',
                    nucleo: 'Apoio GEDUC',
                    horas: 4,
                    turnos: ['manhã','tarde'],
                    competencias: []
                },
                {
                    id: 'apoio_ceas',
                    nome: 'Apoio CEAS',
                    nucleo: 'Apoio CEAS',
                    horas: 4,
                    turnos: ['manhã','tarde'],
                    competencias: []
                },
                {
                    id: 'mover',
                    nome: 'Projeto MOVER',
                    nucleo: 'Projetos/Programas',
                    horas: 3,
                    turnos: ['manhã','tarde'],
                    competencias: ['coordenação','palestras']
                },
                {
                    id: 'campanha_via_livre',
                    nome: 'Campanha Externa – Via Livre',
                    nucleo: 'Campanhas/Comandos',
                    horas: 4,
                    turnos: ['manhã','tarde'],
                    competencias: ['campanhas','comandos']
                }
            ],
            // Escalas planejadas (por data). Cada data contém os turnos e as
            // atividades com suas equipes (coordenador, executor, apoio).
            escalas: {
                // Exemplo de escala existente para demonstração
                '2023-10-01': {
                    manha: {
                        mover: {
                            coordenador: ['luiz_mesquita'],
                            executor: ['heberfran'],
                            apoio: ['alberto','edson']
                        },
                        apoio_geduc: {
                            coordenador: ['lucena'],
                            executor: ['robson','wellington'],
                            apoio: ['joao_rafael','samoel']
                        }
                    },
                    tarde: {
                        apoio_ceas: {
                            coordenador: ['edmara'],
                            executor: ['ines','hellen'],
                            apoio: ['carlos_eduardo']
                        }
                    },
                    noite: {}
                }
            }
        };
        // Mapeamento para consulta rápida de colaboradores por id
        this.colabMap = new Map();
        this.dados.colaboradores.forEach(colab => {
            this.colabMap.set(colab.id, colab);
        });
        this.init();
    }

    async init() {
        console.log('Iniciando sistema aprimorado...');
        // Carrega dados do localStorage, se existirem
        await this.carregarDados();
        // Marca hora extra em todas as escalas carregadas
        Object.keys(this.dados.escalas).forEach(data => {
            this.marcarHoraExtra(this.dados.escalas[data]);
        });
        // Gera validações na inicialização
        Object.keys(this.dados.escalas).forEach(data => {
            const alertas = this.validarEscala(this.dados.escalas[data]);
            if (alertas.length > 0) {
                console.warn(`Alertas para ${data}:`, alertas);
            }
        });
        // Exibe interface inicial mínima
        this.mostrarInterface();
        this.mostrarMensagem('Sistema GEDUC aprimorado carregado com sucesso!', 'success');
    }

    async carregarDados() {
        try {
            const dadosSalvos = localStorage.getItem('geduc-data-aprimorado');
            if (dadosSalvos) {
                this.dados = JSON.parse(dadosSalvos);
                // Reconstroi o mapa de colaboradores
                this.colabMap.clear();
                this.dados.colaboradores.forEach(colab => this.colabMap.set(colab.id, colab));
                console.log('Dados aprimorados carregados do navegador');
            } else {
                console.log('Usando dados aprimorados embutidos');
                this.salvarDados();
            }
        } catch (error) {
            console.error('Erro ao carregar dados aprimorados:', error);
            this.mostrarMensagem('Erro ao carregar dados. Usando dados locais.', 'error');
        }
    }

    mostrarInterface() {
        // Para simplicidade, atualiza apenas um elemento com resumo dos dados
        const container = document.getElementById('geduc-aprimorado');
        if (!container) return;
        container.innerHTML = `
            <h4><i class="fas fa-users me-2"></i>Colaboradores (${this.dados.colaboradores.length})</h4>
            <ul class="list-group mb-3">
                ${this.dados.colaboradores.map(c => `
                    <li class="list-group-item">
                        <strong>${c.nome}</strong> - ${c.vinculo}
                        ${c.licenca ? `<span class="badge bg-warning ms-2">Licença: ${c.licenca}</span>` : ''}
                        ${c.reducao ? `<span class="badge bg-info ms-2">Redução: ${c.reducao.join(', ')}</span>` : ''}
                        ${c.orientadorViaLivre ? `<span class="badge bg-secondary ms-2">Via Livre</span>` : ''}
                    </li>
                `).join('')}
            </ul>
            <h4><i class="fas fa-calendar-day me-2"></i>Escalas</h4>
            <ul class="list-group">
                ${Object.keys(this.dados.escalas).map(data => `<li class="list-group-item">${data} - <button class="btn btn-sm btn-outline-primary" onclick="geducApp.gerarEEnviarWhatsApp('${data}')">WhatsApp</button></li>`).join('')}
            </ul>
        `;
    }

    salvarDados() {
        try {
            localStorage.setItem('geduc-data-aprimorado', JSON.stringify(this.dados));
            console.log('Dados aprimorados salvos no localStorage');
        } catch (error) {
            console.error('Erro ao salvar dados aprimorados:', error);
        }
    }

    mostrarMensagem(texto, tipo = 'info') {
        // Remove mensagens antigas
        const alertasAntigos = document.querySelectorAll('.alert-floating');
        alertasAntigos.forEach(alerta => alerta.remove());
        const alerta = document.createElement('div');
        alerta.className = `alert alert-${tipo} alert-floating position-fixed top-0 end-0 m-3`;
        alerta.style.zIndex = '1050';
        alerta.style.minWidth = '300px';
        alerta.innerHTML = `
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : tipo === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2"></i>
            ${texto}
        `;
        document.body.appendChild(alerta);
        setTimeout(() => alerta.remove(), 4000);
    }

    /**
     * Marca hora extra para colaboradores escalados fora de seu turno padrão.
     * Adiciona um asterisco (*) antes do id do colaborador quando o turno do
     * agendamento não estiver listado em turnoPadrao.
     * @param {Object} escalaDia Estrutura de escala para um dia específico.
     */
    marcarHoraExtra(escalaDia) {
        ['manha','tarde','noite'].forEach(turno => {
            const tarefas = escalaDia[turno] || {};
            Object.values(tarefas).forEach(atividade => {
                ['coordenador','executor','apoio'].forEach(campo => {
                    if (Array.isArray(atividade[campo])) {
                        atividade[campo] = atividade[campo].map(id => {
                            const colab = this.colabMap.get(id.replace(/^\*/,''));
                            if (!colab) return id;
                            if (!colab.turnoPadrao.includes(turno)) {
                                return `*${id.replace(/^\*/,'')}`;
                            }
                            return id;
                        });
                    }
                });
            });
        });
    }

    /**
     * Valida uma escala identificando colaboradores escalados mais de uma vez
     * no mesmo turno. Retorna um array de mensagens de alerta.
     * @param {Object} escalaDia
     * @returns {string[]}
     */
    validarEscala(escalaDia) {
        const alertas = [];
        const contagem = { manha: {}, tarde: {}, noite: {} };
        ['manha','tarde','noite'].forEach(turno => {
            const tarefas = escalaDia[turno] || {};
            Object.values(tarefas).forEach(atividade => {
                ['coordenador','executor','apoio'].forEach(campo => {
                    const lista = atividade[campo];
                    if (Array.isArray(lista)) {
                        lista.forEach(id => {
                            const cleanId = id.replace(/^\*/,'');
                            contagem[turno][cleanId] = (contagem[turno][cleanId] || 0) + 1;
                        });
                    }
                });
            });
        });
        Object.keys(contagem).forEach(turno => {
            Object.keys(contagem[turno]).forEach(id => {
                if (contagem[turno][id] > 1) {
                    const nome = this.colabMap.get(id)?.nome || id;
                    alertas.push(`Duplicidade: ${nome} escalado ${contagem[turno][id]} vezes no turno ${turno}`);
                }
            });
        });
        return alertas;
    }

    /**
     * Converte uma escala diária em mensagem formatada para WhatsApp. A mensagem
     * utiliza a formatação recomendada pela GEDUC com asteriscos visíveis.
     * @param {string} dataISO Data no formato ISO (yyyy-mm-dd).
     * @returns {string} Mensagem pronta para copiar e colar no WhatsApp.
     */
    gerarMensagemWhatsApp(dataISO) {
        const escalaDia = this.dados.escalas[dataISO];
        if (!escalaDia) {
            return 'Nenhuma escala encontrada para esta data.';
        }
        // Garantir marcação de hora extra
        this.marcarHoraExtra(escalaDia);
        const partes = [];
        partes.push('🚸 *ESCALA GEDUC* 🚦');
        partes.push(`📅 ${dataISO.split('-').reverse().join('/')}`);
        ['manha','tarde','noite'].forEach(turno => {
            const tarefas = escalaDia[turno];
            const titulo = turno === 'manha' ? 'MANHÃ' : turno === 'tarde' ? 'TARDE' : 'NOITE';
            partes.push(`\n*==== ${titulo} ====*\`);
            if (!tarefas || Object.keys(tarefas).length === 0) {
                partes.push('_Nenhuma atividade escalada_');
                return;
            }
            Object.keys(tarefas).forEach(atividadeId => {
                const atividade = tarefas[atividadeId];
                const atividadeNome = this.dados.atividades.find(a => a.id === atividadeId)?.nome || atividadeId;
                partes.push(`*${atividadeNome}:*`);
                ['coordenador','executor','apoio'].forEach(campo => {
                    const lista = atividade[campo];
                    if (Array.isArray(lista) && lista.length > 0) {
                        const nomes = lista.map(id => {
                            const cleanId = id.replace(/^\*/,'');
                            const colab = this.colabMap.get(cleanId);
                            const nome = colab?.nome || cleanId;
                            return id.startsWith('*') ? `*${nome}*` : nome;
                        }).join(', ');
                        const label = campo.charAt(0).toUpperCase() + campo.slice(1);
                        partes.push(`${label}: ${nomes}`);
                    }
                });
            });
        });
        partes.push('\n⚠️ _Desacelere. Seu bem maior é a vida._');
        return partes.join('\n');
    }

    /**
     * Gera a mensagem do WhatsApp e a mostra ao usuário em uma janela modal
     * simples. Esta função também pode ser adaptada para copiar
     * automaticamente a mensagem para a área de transferência.
     * @param {string} dataISO
     */
    gerarEEnviarWhatsApp(dataISO) {
        const mensagem = this.gerarMensagemWhatsApp(dataISO);
        // Exibe em um prompt para fácil cópia
        window.prompt('Copie a mensagem da escala para WhatsApp:', mensagem);
    }
}

// Inicializa o sistema aprimorado quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    window.geducApp = new GEDUCDataManager();
});