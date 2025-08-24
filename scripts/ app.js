// Sistema de Gerenciamento de Dados para GEDUC
console.log('Sistema GEDUC carregado!');

class GEDUCDataManager {
    constructor() {
        this.dados = {
            colaboradores: [],
            atividades: [],
            escalas: {}
        };
        this.init();
    }

    async init() {
        console.log('Iniciando sistema...');
        await this.carregarDados();
        this.mostrarMensagem('Sistema pronto!', 'success');
    }

    async carregarDados() {
        try {
            // Tenta carregar do localStorage primeiro
            const dadosSalvos = localStorage.getItem('geduc-data');
            
            if (dadosSalvos) {
                this.dados = JSON.parse(dadosSalvos);
                console.log('Dados carregados do navegador');
            } else {
                // Carrega dos arquivos JSON iniciais
                console.log('Carregando dados iniciais...');
                const [colabs, ativs, escalas] = await Promise.all([
                    this.carregarArquivo('data/colaboradores.json'),
                    this.carregarArquivo('data/atividades.json'),
                    this.carregarArquivo('data/escalas.json')
                ]);
                
                this.dados = {
                    colaboradores: colabs,
                    atividades: ativs,
                    escalas: escalas
                };
                console.log('Dados iniciais carregados');
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    async carregarArquivo(caminho) {
        try {
            const response = await fetch(caminho);
            return await response.json();
        } catch (error) {
            console.warn('Erro ao carregar arquivo:', caminho, error);
            return [];
        }
    }

    mostrarMensagem(texto, tipo = 'info') {
        alert(`${tipo.toUpperCase()}: ${texto}`);
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    window.geducApp = new GEDUCDataManager();
});