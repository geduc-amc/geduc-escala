// Sistema de Gerenciamento de Dados para GEDUC
console.log('Sistema GEDUC carregado!');

class GEDUCDataManager {
    constructor() {
        this.dados = {
            colaboradores: [
                {
                    "id": "lucena",
                    "nome": "Lucena",
                    "vinculo": "Agente (Adm)",
                    "turnoPadrao": ["manhã", "tarde"],
                    "competencias": ["coordenação", "relatoria"],
                    "licenca": null,
                    "reducao": null
                },
                {
                    "id": "kariny",
                    "nome": "Kariny",
                    "vinculo": "Agente (Adm)",
                    "turnoPadrao": ["manhã", "tarde"],
                    "competencias": ["educação"],
                    "licenca": "médica",
                    "reducao": null
                }
            ],
            atividades: [
                {
                    "id": "mover",
                    "nome": "Projeto MOVER",
                    "nucleo": "Projetos/Programas",
                    "horas": 3,
                    "turnos": ["manhã", "tarde"],
                    "competencias": ["coordenação", "palestras"]
                },
                {
                    "id": "campanha_via_livre",
                    "nome": "Campanha Externa – Via Livre",
                    "nucleo": "Campanhas/Comandos",
                    "horas": 4,
                    "turnos": ["manhã", "tarde"],
                    "competencias": ["campanhas", "comandos"]
                }
            ],
            escalas: {
                "2023-10-01": {
                    "manhã": {
                        "mover": {
                            "coordenador": ["lucena"],
                            "executor": ["kariny"],
                            "apoio": []
                        }
                    },
                    "tarde": {},
                    "noite": {}
                }
            }
        };
        this.init();
    }

    async init() {
        console.log('Iniciando sistema...');
        await this.carregarDados();
        this.mostrarInterface();
        this.mostrarMensagem('Sistema GEDUC carregado com sucesso!', 'success');
    }

    async carregarDados() {
        try {
            // Tenta carregar do localStorage primeiro
            const dadosSalvos = localStorage.getItem('geduc-data');
            
            if (dadosSalvos) {
                this.dados = JSON.parse(dadosSalvos);
                console.log('Dados carregados do navegador');
            } else {
                // Usa os dados embutidos no código
                console.log('Usando dados embutidos');
                this.salvarDados();
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.mostrarMensagem('Erro ao carregar dados. Usando dados locais.', 'error');
        }
    }

    mostrarInterface() {
        // Remove a mensagem de carregamento
        const loadingElement = document.querySelector('.loading');
        if (loadingElement) {
            loadingElement.remove();
        }

        // Adiciona conteúdo real
        const cardBody = document.querySelector('.card-body');
        cardBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h4><i class="fas fa-users me-2"></i> Colaboradores</h4>
                    <p>Total: ${this.dados.colaboradores.length} colaboradores</p>
                    <ul class="list-group">
                        ${this.dados.colaboradores.map(colab => `
                            <li class="list-group-item">
                                <strong>${colab.nome}</strong> - ${colab.vinculo}
                                ${colab.licenca ? `<span class="badge bg-warning">Licença: ${colab.licenca}</span>` : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="col-md-6">
                    <h4><i class="fas fa-tasks me-2"></i> Atividades</h4>
                    <p>Total: ${this.dados.atividades.length} atividades</p>
                    <ul class="list-group">
                        ${this.dados.atividades.map(ativ => `
                            <li class="list-group-item">
                                <strong>${ativ.nome}</strong> - ${ativ.nucleo}
                                <span class="badge bg-primary">${ativ.horas}h</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            <div class="row mt-4">
                <div class="col-12">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        Sistema carregado com sucesso! Os dados estão sendo armazenados no seu navegador.
                    </div>
                    <button class="btn btn-primary" onclick="geducApp.mostrarMensagem('Funcionando!', 'success')">
                        <i class="fas fa-check me-2"></i>Testar Sistema
                    </button>
                </div>
            </div>
        `;
    }

    salvarDados() {
        try {
            localStorage.setItem('geduc-data', JSON.stringify(this.dados));
            console.log('Dados salvos no localStorage');
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
        }
    }

    mostrarMensagem(texto, tipo = 'info') {
        // Remove mensagens anteriores
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
        
        // Remove automaticamente após 3 segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    window.geducApp = new GEDUCDataManager();
});