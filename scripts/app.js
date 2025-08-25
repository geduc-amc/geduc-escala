// scripts/app.js
// ------------------------------------------------------------
// Sistema de Gerenciamento de Escalas para a GEDUC/AMC
// ------------------------------------------------------------
// Funcionalidades:
// - Cadastro ampliado de colaboradores e atividades
// - Validação de duplicidades (mesmo turno e entre turnos)
// - Marcação automática de HORA EXTRA (apenas no turno fora da origem)
// - Geração de mensagem de WhatsApp com asteriscos VISÍVEIS (\* ... \*)
// - UI mínima com botões Validar e WhatsApp por data
// - Persistência local via localStorage (chave versionada)

console.log('Sistema GEDUC carregado!');

// Chave versionada para evitar pegar dados antigos do navegador
const STORAGE_KEY = 'geduc-data-v2';

// Padrão de formatação WhatsApp (asteriscos VISÍVEIS)
const PADRAO_WHATSAPP = {
  titulo: "🚸 \\*ESCALA GEDUC\\* 🚦",
  mensagemFinal: "⚠️ _Desacelere. Seu bem maior é a vida._",
  separacaoNucleos: "\n\n",     // “duplo parágrafo”
  aposCompensacoes: "\n\n\n",   // “triplo parágrafo”
  negritoNucleo: true           // quando true, escreve \\*Núcleo\\* — Atividade
};

class GEDUCDataManager {
  constructor() {
    // Cadastro de colaboradores
    // turnoPadrao: usar 'manha' | 'tarde' | 'noite' (sem acento)
    this.dados = {
      colaboradores: [
        // Agentes administrativos
        { id: 'lucena',        nome: 'Lucena',        vinculo: 'Agente (Adm)',       turnoPadrao: ['manha','tarde'], licenca: null,      reducao: null },
        { id: 'c_cunha',       nome: 'C. Cunha',      vinculo: 'Agente (Adm)',       turnoPadrao: ['manha','tarde'], licenca: null,      reducao: null },
        { id: 'kariny',        nome: 'Kariny',        vinculo: 'Agente (Adm)',       turnoPadrao: ['manha','tarde'], licenca: 'médica',  reducao: null },
        { id: 'luana',         nome: 'Luana',         vinculo: 'Agente (Adm)',       turnoPadrao: ['manha'],         licenca: null,      reducao: ['segunda','terça','quarta'] },
        { id: 'barreira',      nome: 'Barreira',      vinculo: 'Agente (Adm)',       turnoPadrao: ['manha'],         licenca: null,      reducao: ['terça','quarta','quinta'] },

        // Agentes operacionais (manhã)
        { id: 'luiz_mesquita', nome: 'Luiz Mesquita', vinculo: 'Agente (Oper)',      turnoPadrao: ['manha'], licenca: null,     reducao: null },
        { id: 'facanha',       nome: 'Façanha',       vinculo: 'Agente (Oper)',      turnoPadrao: ['manha'], licenca: 'prêmio', reducao: null },
        { id: 'robson',        nome: 'Robson',        vinculo: 'Agente (Oper)',      turnoPadrao: ['manha'], licenca: null,     reducao: null },
        { id: 'wellington',    nome: 'Wellington',    vinculo: 'Agente (Oper)',      turnoPadrao: ['manha'], licenca: null,     reducao: null },
        { id: 'kelber',        nome: 'Kelber',        vinculo: 'Agente (Oper)',      turnoPadrao: ['manha'], licenca: 'prêmio', reducao: null },
        { id: 'rafael',        nome: 'Rafael',        vinculo: 'Agente (Oper)',      turnoPadrao: ['manha'], licenca: null,     reducao: null },
        { id: 'heberfran',     nome: 'Heberfran',     vinculo: 'Agente (Oper)',      turnoPadrao: ['manha'], licenca: null,     reducao: null },
        { id: 'helder',        nome: 'Helder',        vinculo: 'Agente (Oper)',      turnoPadrao: ['manha'], licenca: null,     reducao: null },

        // Agentes operacionais (tarde)
        { id: 'ines',          nome: 'Inês',          vinculo: 'Agente (Oper)',      turnoPadrao: ['tarde'], licenca: null,     reducao: null },
        { id: 'hellen',        nome: 'Hellen',        vinculo: 'Agente (Oper)',      turnoPadrao: ['tarde'], licenca: null,     reducao: null },
        { id: 'ronalddy',      nome: 'Ronalddy',      vinculo: 'Agente (Oper)',      turnoPadrao: ['tarde'], licenca: null,     reducao: null },

        // Comissionado
        { id: 'edmara',        nome: 'Edmara',        vinculo: 'Comissionado',       turnoPadrao: ['manha','tarde'], licenca: null, reducao: null },

        // Terceirizado administrativo
        { id: 'ana_cleide',    nome: 'Ana Cleide',    vinculo: 'Terceirizado (Adm)', turnoPadrao: ['manha','tarde'], licenca: null, reducao: null },

        // Orientadores Via Livre (manhã por padrão, exceto Carlos Eduardo à tarde)
        { id: 'alberto',       nome: 'Alberto',       vinculo: 'Terceirizado (Via Livre)', turnoPadrao: ['manha'], licenca: null, reducao: null, orientadorViaLivre: true },
        { id: 'edson',         nome: 'Edson',         vinculo: 'Terceirizado (Via Livre)', turnoPadrao: ['manha'], licenca: null, reducao: null, orientadorViaLivre: true },
        { id: 'romario',       nome: 'Romário',       vinculo: 'Terceirizado (Via Livre)', turnoPadrao: ['manha'], licenca: null, reducao: null, orientadorViaLivre: true },
        { id: 'joao_rafael',   nome: 'João Rafael',   vinculo: 'Terceirizado (Via Livre)', turnoPadrao: ['manha'], licenca: null, reducao: null, orientadorViaLivre: true },
        { id: 'joao_victor',   nome: 'João Victor',   vinculo: 'Terceirizado (Via Livre)', turnoPadrao: ['manha'], licenca: null, reducao: null, orientadorViaLivre: true },
        { id: 'samoel',        nome: 'Samoel',        vinculo: 'Terceirizado (Via Livre)', turnoPadrao: ['manha'], licenca: null, reducao: null, orientadorViaLivre: true },
        { id: 'clemilson',     nome: 'Clemilson',     vinculo: 'Terceirizado (Via Livre)', turnoPadrao: ['manha'], licenca: null, reducao: null, orientadorViaLivre: true },
        { id: 'carlos_eduardo',nome: 'Carlos Eduardo',vinculo: 'Terceirizado (Via Livre)', turnoPadrao: ['tarde'], licenca: null, reducao: null, orientadorViaLivre: true },
        { id: 'lidomar',       nome: 'Lidomar',       vinculo: 'Terceirizado (Via Livre)', turnoPadrao: ['manha'], licenca: null, reducao: null, orientadorViaLivre: true }
      ],

      // Catálogo de atividades / núcleos
      atividades: [
        { id: 'apoio_geduc',        nome: 'Apoio GEDUC',                  nucleo: 'Apoio GEDUC',                          horas: 4, turnos: ['manha','tarde'], competencias: [] },
        { id: 'apoio_ceas',         nome: 'Apoio CEAS',                   nucleo: 'Apoio CEAS',                           horas: 4, turnos: ['manha','tarde'], competencias: [] },
        { id: 'mover',              nome: 'Projeto MOVER',                nucleo: 'Projetos Educacionais e de Cidadania', horas: 3, turnos: ['manha','tarde'], competencias: ['coordenação','palestras'] },
        { id: 'campanha_via_livre', nome: 'Campanha Externa – Via Livre', nucleo: 'Comandos e Campanhas Educativas',      horas: 4, turnos: ['manha','tarde'], competencias: ['campanhas','comandos'] }
      ],

      // Escalas por data (exemplo preenchido com seções finais)
      escalas: {
        "2025-08-24": {
          manha: {
            mover: {
              coordenador: ['luiz_mesquita'],
              executor:    ['heberfran'],
              apoio:       ['alberto','edson']
            }
          },
          tarde: {
            apoio_geduc: {
              coordenador: ['lucena'],
              executor:    ['robson','wellington'],
              apoio:       ['joao_rafael','samoel']
            }
          },
          noite: {},
          compensacoes:          ["Carlos Eduardo (13:00–17:00)"],
          ferias:                ["Kelber", "Façanha"],
          aniversariantes:       ["Ana Cleide"],
          participacoesExternas: ["Curso DETRAN (2 vagas)"]
        }
      }
    };

    // Mapa rápido id -> colaborador
    this.colabMap = new Map();
    this.dados.colaboradores.forEach(c => this.colabMap.set(c.id, c));

    this.init();
  }

  async init() {
    console.log('Iniciando sistema...');
    await this.carregarDados();

    // Ajusta HE e valida todas as datas
    Object.keys(this.dados.escalas).forEach(data => {
      this.marcarHoraExtra(this.dados.escalas[data]);
      const alertas = this.validarEscala(this.dados.escalas[data]);
      if (alertas.length) console.warn(`Alertas ${data}:`, alertas);
    });

    this.mostrarInterface();
    this.mostrarMensagem('Sistema GEDUC carregado com sucesso!', 'success');
  }

  async carregarDados() {
    try {
      // Se abrir com ?reset=1 na URL, limpa o armazenamento
      const params = new URLSearchParams(location.search);
      if (params.has('reset')) {
        localStorage.removeItem(STORAGE_KEY);
        console.log('LocalStorage resetado por ?reset=1');
      }

      const dadosSalvos = localStorage.getItem(STORAGE_KEY);
      if (dadosSalvos) {
        const d = JSON.parse(dadosSalvos);
        // Se a cópia salva for claramente "antiga" (poucos colaboradores), ignore
        if (!Array.isArray(d.colaboradores) || d.colaboradores.length < 10) {
          console.warn('Dados antigos detectados. Usando dados embutidos.');
          this.salvarDados(); // salva os atuais (embutidos/atualizados)
        } else {
          this.dados = d;
          console.log('Dados carregados do navegador (v2)');
        }
      } else {
        console.log('Sem dados no navegador. Usando dados embutidos.');
        this.salvarDados();
      }

      // Reconstrói o mapa de colaboradores
      this.colabMap = new Map();
      this.dados.colaboradores.forEach(c => this.colabMap.set(c.id, c));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.mostrarMensagem('Erro ao carregar dados. Usando dados locais.', 'error');
    }
  }

  salvarDados() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.dados));
      console.log('Dados salvos no localStorage (v2)');
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }

  mostrarMensagem(texto, tipo = 'info') {
    document.querySelectorAll('.alert-floating').forEach(a => a.remove());
    const el = document.createElement('div');
    el.className = `alert alert-${tipo} alert-floating position-fixed top-0 end-0 m-3`;
    el.style.zIndex = '1050';
    el.style.minWidth = '300px';
    el.innerHTML = `
      <i class="fas ${tipo==='success'?'fa-check-circle':tipo==='error'?'fa-exclamation-circle':'fa-info-circle'} me-2"></i>
      ${texto}
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }

  // Marca hora extra: adiciona '*' no id quando o turno não é de origem
  marcarHoraExtra(escalaDia) {
    ['manha','tarde','noite'].forEach(turno => {
      const tarefas = escalaDia[turno] || {};
      Object.values(tarefas).forEach(atividade => {
        ['coordenador','executor','apoio'].forEach(campo => {
          if (!Array.isArray(atividade[campo])) return;
          atividade[campo] = atividade[campo].map(id => {
            const clean = id.replace(/^\*/,'');
            const colab = this.colabMap.get(clean);
            if (!colab) return id;
            const foraDoOrigem = !colab.turnoPadrao.includes(turno);
            // marca '*' apenas no turno fora da origem
            return foraDoOrigem ? `*${clean}` : clean;
          });
        });
      });
    });
  }

  // Validação: duplicidade no mesmo turno e entre turnos (sem HE)
  validarEscala(escalaDia) {
    const alertas = [];
    const contagemTurno = { manha: {}, tarde: {}, noite: {} };
    const presencasDia = new Map(); // id -> Set(turnos)

    const acumular = (turno, lista) => {
      if (!Array.isArray(lista)) return;
      lista.forEach(id => {
        const clean = id.replace(/^\*/,'');
        contagemTurno[turno][clean] = (contagemTurno[turno][clean] || 0) + 1;
        const set = presencasDia.get(clean) || new Set();
        set.add(turno);
        presencasDia.set(clean, set);
      });
    };

    ['manha','tarde','noite'].forEach(turno => {
      const tarefas = escalaDia[turno] || {};
      Object.values(tarefas).forEach(atividade => {
        acumular(turno, atividade.coordenador);
        acumular(turno, atividade.executor);
        acumular(turno, atividade.apoio);
      });
    });

    // 1) duplicidade no mesmo turno
    Object.keys(contagemTurno).forEach(turno => {
      Object.keys(contagemTurno[turno]).forEach(id => {
        if (contagemTurno[turno][id] > 1) {
          const nome = this.colabMap.get(id)?.nome || id;
          alertas.push(`Duplicidade: ${nome} aparece ${contagemTurno[turno][id]}x no turno ${turno}`);
        }
      });
    });

    // 2) mesma pessoa em mais de um turno sem HE
    presencasDia.forEach((turnosSet, id) => {
      if (turnosSet.size <= 1) return;

      // Verifica se ao menos um registro dessa pessoa traz '*' (HE) em algum turno
      let temHE = false;
      ['manha','tarde','noite'].forEach(turno => {
        const tarefas = escalaDia[turno] || {};
        Object.values(tarefas).forEach(atividade => {
          ['coordenador','executor','apoio'].forEach(campo => {
            const lista = atividade[campo];
            if (Array.isArray(lista) && lista.some(x => x === `*${id}`)) {
              temHE = true;
            }
          });
        });
      });

      if (!temHE) {
        const nome = this.colabMap.get(id)?.nome || id;
        alertas.push(`Atenção: ${nome} está em mais de um turno no dia sem confirmação de hora extra.`);
      }
    });

    // 3) alerta simples de subdimensionamento (<2 pessoas) por atividade/turno
    ['manha','tarde'].forEach(turno => {
      const tarefas = escalaDia[turno] || {};
      Object.entries(tarefas).forEach(([atividadeId, atividade]) => {
        const total = ['coordenador','executor','apoio']
          .map(c => Array.isArray(atividade[c]) ? atividade[c].length : 0)
          .reduce((a,b) => a+b, 0);
        if (total < 2) {
          const nomeAtv = this.dados.atividades.find(a => a.id === atividadeId)?.nome || atividadeId;
          alertas.push(`Subdimensionamento: ${nomeAtv} (${turno.toUpperCase()}) com efetivo < 2.`);
        }
      });
    });

    return alertas;
  }

  // Utilitário: obtém nome por id (com '*' tratado)
  getNome(idComOuSemAsterisco) {
    const clean = idComOuSemAsterisco.replace(/^\*/,'');
    return this.colabMap.get(clean)?.nome || clean;
  }

  // Mensagem WhatsApp (asteriscos VISÍVEIS e seções finais)
  gerarMensagemWhatsApp(dataISO) {
    const d = this.dados.escalas[dataISO];
    if (!d) return 'Nenhuma escala encontrada para esta data.';

    // garantir marcação de HE conforme regras
    this.marcarHoraExtra(d);

    const p = [];
    p.push(PADRAO_WHATSAPP.titulo);
    p.push(`📅 ${dataISO.split('-').reverse().join('/')}`);

    const blocoTurno = (turno, rotulo) => {
      p.push(`\n\\*==== ${rotulo} ====\\*`);
      const tarefas = d[turno];
      if (!tarefas || Object.keys(tarefas).length === 0) {
        p.push('_Nenhuma atividade escalada_');
        return;
      }

      Object.keys(tarefas).forEach(atividadeId => {
        const atividade = tarefas[atividadeId];
        const meta = this.dados.atividades.find(a => a.id === atividadeId);
        const atividadeNome = meta?.nome || atividadeId;
        const nucleo = meta?.nucleo || 'Atividade';

        const titulo = PADRAO_WHATSAPP.negritoNucleo
          ? `\\*${nucleo}\\* — ${atividadeNome}`
          : `${nucleo} — ${atividadeNome}`;
        p.push(titulo);

        const linha = (label, lista) => {
          if (!Array.isArray(lista) || !lista.length) return;
          const nomes = lista.map(id => {
            const isHE = id.startsWith('*');
            const nome = this.getNome(id);
            return isHE ? `\\*${nome}\\*` : nome; // asterisco VISÍVEL para HE
          }).join(', ');
          p.push(`${label}: ${nomes}`);
        };

        linha('Coordenador', atividade.coordenador);
        linha('Executor',    atividade.executor);
        linha('Apoio',       atividade.apoio);

        p.push(PADRAO_WHATSAPP.separacaoNucleos.trim());
      });
    };

    blocoTurno('manha', 'MANHÃ');
    blocoTurno('tarde', 'TARDE');
    blocoTurno('noite', 'NOITE');

    // Seções finais (se houver)
    const addLista = (titulo, arr) => {
      if (Array.isArray(arr) && arr.length) {
        p.push('');
        p.push(`\\*${titulo}\\*`);
        arr.forEach(x => p.push(`- ${x}`));
      }
    };
    addLista('Participações externas', d.participacoesExternas);
    addLista('Compensações',           d.compensacoes);
    addLista('Férias',                 d.ferias);
    addLista('Aniversariantes do dia', d.aniversariantes);

    p.push(PADRAO_WHATSAPP.aposCompensacoes.trim());
    p.push(PADRAO_WHATSAPP.mensagemFinal);

    // evita múltiplas linhas em branco
    return p.join('\n').replace(/\n{3,}/g, '\n\n');
  }

  // UI mínima (lista Colaboradores + Datas com Validar/WhatsApp)
  mostrarInterface() {
    const container = document.getElementById('geduc-app');
    if (!container) return;

    container.innerHTML = `
      <div class="row mb-4">
        <div class="col-md-6">
          <h4><i class="fas fa-users me-2"></i>Colaboradores</h4>
          <p>Total: ${this.dados.colaboradores.length} colaboradores</p>
          <ul class="list-group mb-3">
            ${this.dados.colaboradores.map(c => `
              <li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto">
                  <div class="fw-bold">${c.nome}</div>
                  ${c.vinculo}
                </div>
                <span>
                  ${c.licenca ? `<span class="badge bg-warning me-1">Licença: ${c.licenca}</span>` : ''}
                  ${c.reducao ? `<span class="badge bg-info me-1">Redução: ${c.reducao.join(', ')}</span>` : ''}
                  ${c.orientadorViaLivre ? `<span class="badge bg-secondary">Via Livre</span>` : ''}
                </span>
              </li>
            `).join('')}
          </ul>
        </div>
        <div class="col-md-6">
          <h4><i class="fas fa-calendar-day me-2"></i>Escalas</h4>
          <p>Total: ${Object.keys(this.dados.escalas).length} dias agendados</p>
          <ul class="list-group">
            ${Object.keys(this.dados.escalas).map(data => `
              <li class="list-group-item d-flex justify-content-between align-items-center">
                ${data.split('-').reverse().join('/')}
                <span class="btn-group">
                  <button class="btn btn-sm btn-outline-secondary" onclick="(function(){
                    const a = geducApp.validarEscala(geducApp.dados.escalas['${data}']);
                    alert(a.length ? a.join('\\n') : 'Sem alertas para esta data.');
                  })()">
                    <i class="fas fa-clipboard-check me-1"></i>Validar
                  </button>
                  <button class="btn btn-sm btn-outline-primary" onclick="geducApp.gerarEEnviarWhatsApp('${data}')">
                    <i class="fab fa-whatsapp me-1"></i>WhatsApp
                  </button>
                </span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  // Exibe prompt com a mensagem pronta para copiar
  gerarEEnviarWhatsApp(dataISO) {
    const mensagem = this.gerarMensagemWhatsApp(dataISO);
    window.prompt('Copie a mensagem da escala para WhatsApp:', mensagem);
  }
}

// Inicializa
document.addEventListener('DOMContentLoaded', () => {
  window.geducApp = new GEDUCDataManager();
});
