import { useState, useEffect, useCallback } from 'react'
import {
  ShieldCheck,
  Shield,
  Link as LinkIcon,
  Heart,
  ChevronRight,
  ArrowLeft,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  MessageSquare,
  HelpCircle,
  Phone,
  X,
  BookOpen,
  MessageCircle,
  DollarSign,
  Lock,
  LifeBuoy,
  Wind,
  Lightbulb,
} from 'lucide-react'

import VerificarLink from './VerificarLink'
import BoasVindas from './BoasVindas'
import Cadastro from './Cadastro'

/* ═══════════════════════════════════════════════
   CLAREZA DIGITAL — Assistente de Segurança Digital
   Projeto acadêmico IHC — IFPE Campus Belo Jardim
   Alunos: Liedson Ramos e Adonnys
   Orientador: Prof. Rogério Araújo
   ═══════════════════════════════════════════════ */

const ClarezaDigital = () => {
  // ── Estados principais ──
  const [tela, setTela] = useState('splash')
  const [temConta, setTemConta] = useState(false)
  const [pixPasso, setPixPasso] = useState(1)
  const [pixRespostas, setPixRespostas] = useState({})
  const [pixValor, setPixValor] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [link, setLink] = useState('')
  const [resultado, setResultado] = useState(null)
  const [analisando, setAnalisando] = useState(false)
  const [telaAnterior, setTelaAnterior] = useState(null)
  const [mostrarEmpatia, setMostrarEmpatia] = useState(false)
  const [textoEmpatia, setTextoEmpatia] = useState('')
  const [animKey, setAnimKey] = useState(0)
  const [tutorialCopiarPasso, setTutorialCopiarPasso] = useState(0)
  const [dicaAtual, setDicaAtual] = useState(0)
  const [dicasConcluido, setDicasConcluido] = useState(false)
  const [descricaoLivre, setDescricaoLivre] = useState('')
  const [resultadoAnaliseLivre, setResultadoAnaliseLivre] = useState(null)
  const [linkAutoAnalisarTexto, setLinkAutoAnalisarTexto] = useState('')

  // ── Verificar se o usuário já criou conta (localStorage) ──
  useEffect(() => {
    const contaCriada = localStorage.getItem('clareza_digital_conta')
    if (contaCriada) setTemConta(true)
  }, [])

  // ── Função de entrada (splash → menu ou cadastro) ──
  const handleEntrar = useCallback(() => {
    if (temConta) {
      setAnimKey(prev => prev + 1)
      setTela('menu')
    } else {
      setAnimKey(prev => prev + 1)
      setTela('cadastro')
    }
  }, [temConta])

  const handleConcluirCadastro = useCallback(() => {
    setTemConta(true)
    setAnimKey(prev => prev + 1)
    setTela('menu')
  }, [])

  // ── Funções de navegação ──
  const irParaTela = useCallback((nomeTela) => {
    setAnimKey(prev => prev + 1)
    setTela(nomeTela)
    // Reset de estados por tela
    if (nomeTela === 'pix') {
      setPixPasso(1)
      setPixRespostas({})
      setPixValor('')
      setResultado(null)
    }
    if (nomeTela === 'mensagem') {
      setMensagem('')
      setResultado(null)
      setTutorialCopiarPasso(0)
    }
    if (nomeTela === 'link') {
      setLink('')
      setResultado(null)
    }
    if (nomeTela === 'menu') {
      setDescricaoLivre('')
      setResultadoAnaliseLivre(null)
      setLinkAutoAnalisarTexto('')
    }
    if (nomeTela === 'dicas') {
      setDicaAtual(0)
      setDicasConcluido(false)
    }
    setAnalisando(false)
    setMostrarEmpatia(false)
  }, [])

  const processarDescricaoLivre = () => {
    if (!descricaoLivre.trim()) return

    const texto = descricaoLivre.toLowerCase()

    // ── Cenário A: Mensagem suspeita — analisa diretamente sem redirecionar ──
    const palavrasMensagem = ['mensagem', 'whatsapp', 'sms', 'email', 'e-mail', 'conversa', 'texto', 'telegram', 'instagram', 'facebook', 'estranha']
    if (palavrasMensagem.some(p => texto.includes(p))) {
      const res = calcularResultadoMensagem(descricaoLivre)
      setResultadoAnaliseLivre({
        tipo: 'mensagem',
        nivel: res.nivel,
        sinais: res.sinais,
        textoOriginal: descricaoLivre,
      })
      irParaTela('analise-livre')
      return
    }

    // ── Cenário B: PIX suspeito — analisa diretamente sem redirecionar ──
    const palavrasPix = ['pix', 'pagamento', 'dinheiro', 'transferência', 'depósito', 'valor', 'cobrança', 'pagar']
    if (palavrasPix.some(p => texto.includes(p))) {
      const temPressa = ['urgente', 'agora', 'rápido', 'bloque', 'já', 'imediato', 'socorr'].some(p => texto.includes(p))
      const naoConhece = ['desconhecido', 'não conheço', 'estranh', 'número novo', 'número diferente'].some(p => texto.includes(p))
      let nivelPix = 'atencao'
      if (temPressa && naoConhece) nivelPix = 'alto'
      else if (temPressa || naoConhece) nivelPix = 'atencao'
      setResultadoAnaliseLivre({
        tipo: 'pix',
        nivel: nivelPix,
        temPressa,
      })
      irParaTela('analise-livre')
      return
    }

    // ── Cenário C: Link suspeito — analisa diretamente sem redirecionar ──
    const palavrasLink = ['link', 'site', 'clique', 'clicar', 'endereço', 'url', 'página', 'atualização', 'acessar']
    if (palavrasLink.some(p => texto.includes(p))) {
      const altissmoRisco = ['bit.ly', 'tinyurl', 'senha', 'codigo', 'cpf', 'confirme', 'bloqueado', 'urgente', 'ganhou', 'premio', 'banco-', 'bradesco-', 'itau-']
      const medioRisco = ['gratis', 'free', 'clique', 'acesse', 'cadastro', 'oferta', 'desconto', 'verificar']
      const achouAlto = altissmoRisco.filter(p => texto.includes(p))
      const achouMedio = medioRisco.filter(p => texto.includes(p))
      setResultadoAnaliseLivre({
        tipo: 'link',
        nivel: achouAlto.length > 0 ? 'alto' : achouMedio.length > 0 ? 'medio' : 'seguro',
        palavras: achouAlto.length > 0 ? achouAlto : achouMedio,
      })
      irParaTela('analise-livre')
      return
    }

    // ── Cenário D: Situação não classificada — orientações por tipo ──
    let orientacao = {
      icone: 'geral',
      titulo: 'Entendemos sua dúvida',
      subtitulo: 'Mesmo sem identificar o tipo exato, aqui estão orientações importantes:',
      passos: [
        { texto: 'Não compartilhe senhas com ninguém, por nenhum motivo.' },
        { texto: 'Não envie dinheiro sem confirmar pessoalmente com a pessoa.' },
        { texto: 'Não forneça documentos ou fotos do seu cartão.' },
        { texto: 'Quando em dúvida, desligue e ligue de volta pelo número que você já tem.' },
      ],
      alerta: 'Procure ajuda de uma pessoa de confiança antes de tomar qualquer decisão.',
    }

    if (texto.includes('ligação') || texto.includes('telefonou') || texto.includes('telefonema') || texto.includes('ligou') || texto.includes('ligan')) {
      orientacao = {
        icone: 'ligacao',
        titulo: 'Golpe por ligação telefônica',
        subtitulo: 'Esse é um dos golpes mais comuns. Veja o que fazer:',
        passos: [
          { texto: 'Desligue imediatamente se pedirem senha, código ou dinheiro.' },
          { texto: 'Nunca forneça código que chegou no seu celular por SMS.' },
          { texto: 'Ligue de volta pelo número oficial do banco (atrás do cartão).' },
          { texto: 'Bancos reais nunca pedem sua senha por telefone.' },
        ],
        alerta: 'Se já forneceu informações, entre em contato com o banco imediatamente.',
      }
    } else if (texto.includes('familiar') || texto.includes('filho') || texto.includes('filha') || texto.includes('mãe') || texto.includes('pai') || texto.includes('neto') || texto.includes('neta') || texto.includes('irmão') || texto.includes('irmã') || texto.includes('parente') || texto.includes('se passando')) {
      orientacao = {
        icone: 'familiar',
        titulo: 'Alguém se passando por familiar',
        subtitulo: 'Esse golpe é muito comum. Veja como se proteger:',
        passos: [
          { texto: 'Não envie dinheiro antes de ligar para o familiar pelo número antigo que você já tem salvo.' },
          { texto: 'Faça uma pergunta que só o familiar verdadeiro saberia responder.' },
          { texto: 'Desconfie se pedirem sigilo ou urgência.' },
          { texto: 'O número pode ser falso mesmo que pareça real.' },
        ],
        alerta: 'Na dúvida, espere. Nenhuma emergência real exige que você pague antes de confirmar.',
      }
    } else if (texto.includes('código') || texto.includes('confirmar') || texto.includes('confirmação') || texto.includes('código de verificação') || texto.includes('token')) {
      orientacao = {
        icone: 'codigo',
        titulo: 'Pedido de código de confirmação',
        subtitulo: 'Nunca compartilhe códigos. Veja o porquê:',
        passos: [
          { texto: 'Códigos enviados por SMS ou aplicativo são pessoais e secretos.' },
          { texto: 'Nenhuma empresa, banco ou familiar precisa do seu código.' },
          { texto: 'Quem pede código quer acessar sua conta sem você perceber.' },
          { texto: 'Se já enviou um código, troque sua senha imediatamente.' },
        ],
        alerta: 'Se já compartilhou um código, entre em contato com o banco ou serviço agora mesmo.',
      }
    } else if (texto.includes('acesso remoto') || texto.includes('teamviewer') || texto.includes('anydesk') || texto.includes('controle') || texto.includes('compartilh') || texto.includes('tela') || texto.includes('instalou') || texto.includes('instalar')) {
      orientacao = {
        icone: 'remoto',
        titulo: 'Tentativa de acesso remoto',
        subtitulo: 'Isso é muito perigoso. Aja agora:',
        passos: [
          { texto: 'Desligue o Wi-Fi ou os dados do celular agora.' },
          { texto: 'Desinstale qualquer aplicativo que tenha instalado por pedido de estranhos.' },
          { texto: 'Troque as senhas de todos os aplicativos financeiros.' },
          { texto: 'Avise seu banco imediatamente.' },
        ],
        alerta: 'Se alguém ainda tiver acesso ao seu celular, desligue o aparelho agora e procure ajuda presencial.',
      }
    } else if (texto.includes('prêmio') || texto.includes('ganhei') || texto.includes('sorteio') || texto.includes('contemplad') || texto.includes('ganhou') || texto.includes('parabéns') || texto.includes('selecionad')) {
      orientacao = {
        icone: 'premio',
        titulo: 'Golpe do prêmio ou sorteio falso',
        subtitulo: 'Se você não participou de nada, desconfie muito:',
        passos: [
          { texto: 'Ninguém ganha prêmio de sorteio que não participou.' },
          { texto: 'Não pague nenhuma taxa para receber um prêmio — isso é golpe.' },
          { texto: 'Não forneça dados pessoais ou bancários.' },
          { texto: 'Ignore e apague a mensagem.' },
        ],
        alerta: 'Prêmios que pedem pagamento antecipado são sempre golpe, sem exceção.',
      }
    }

    setResultadoAnaliseLivre({
      tipo: 'orientacao',
      orientacao,
    })
    irParaTela('analise-livre')
  }

  const calcularResultadoMensagem = (texto) => {
    const textoLower = texto.toLowerCase()
    const palavrasAltoRisco = [
      'urgente', 'bloqueado', 'sua conta', 'clique aqui', 'acesse',
      'confirme seus dados', 'promoção', 'ganhou', 'prêmio', 'banco',
      'cpf', 'senha', 'código', 'pix liberado', 'transferência',
      'suspiro', 'atualizar cadastro', 'dados bancários', 'cartão',
      'desbloqueio', 'liberação'
    ]
    const palavrasMedioRisco = [
      'link', 'cadastro', 'verifique', 'atenção', 'acesso',
      'atualize', 'clique', 'baixe'
    ]

    const sinaisAlto = palavrasAltoRisco.filter(p => textoLower.includes(p))
    const sinaisMedio = palavrasMedioRisco.filter(p => textoLower.includes(p))

    if (sinaisAlto.length > 0) {
      return {
        nivel: 'alto',
        sinais: sinaisAlto.map(s => {
          const mapa = {
            'urgente': 'Usa a palavra "urgente" para te pressionar',
            'bloqueado': 'Diz que algo está bloqueado para causar medo',
            'sua conta': 'Menciona "sua conta" para parecer real',
            'clique aqui': 'Pede para você clicar em algo',
            'acesse': 'Pede para você acessar um endereço',
            'confirme seus dados': 'Pede para confirmar dados pessoais',
            'promoção': 'Usa promoção para te atrair',
            'ganhou': 'Diz que você ganhou algo (provavelmente falso)',
            'prêmio': 'Fala sobre prêmio (golpe muito comum)',
            'banco': 'Menciona banco (bancos reais não mandam esse tipo de mensagem)',
            'cpf': 'Pede número de documento',
            'senha': 'Pede sua senha (NUNCA compartilhe!)',
            'código': 'Pede um código (golpistas usam isso)',
            'pix liberado': 'Fala sobre PIX liberado (golpe comum)',
            'transferência': 'Menciona transferência de dinheiro',
            'suspiro': 'Contém padrão suspeito',
            'atualizar cadastro': 'Pede para atualizar cadastro',
            'dados bancários': 'Pede dados bancários',
            'cartão': 'Menciona cartão (cuidado!)',
            'desbloqueio': 'Fala sobre desbloquear algo',
            'liberação': 'Fala sobre liberação'
          }
          return mapa[s] || `Contém a palavra suspeita "${s}"`
        })
      }
    } else if (sinaisMedio.length > 0) {
      return {
        nivel: 'medio',
        sinais: sinaisMedio.map(s => {
          const mapa = {
            'link': 'Contém um endereço para clicar',
            'cadastro': 'Fala sobre cadastro',
            'verifique': 'Pede para verificar algo',
            'atenção': 'Tenta chamar sua atenção',
            'acesso': 'Menciona acesso a algo',
            'atualize': 'Pede para atualizar algo',
            'clique': 'Pede para clicar em algo',
            'baixe': 'Pede para baixar algo'
          }
          return mapa[s] || `Contém "${s}"`
        })
      }
    } else {
      return { nivel: 'seguro', sinais: [] }
    }
  }

  // ── Lógica de análise de mensagem ──
  const analisarMensagem = useCallback(() => {
    setAnalisando(true)
    setTimeout(() => {
      setResultado(calcularResultadoMensagem(mensagem))
      setAnalisando(false)
    }, 1500)
  }, [mensagem])

  // ── Lógica de análise de link movida para VerificarLink ──

  // ── Cálculo de risco do PIX ──
  const calcularRiscoPix = useCallback(() => {
    const { conhece, pressa } = pixRespostas
    if (conhece === 'nao' && pressa === 'sim') return 'alto'
    if (conhece === 'nao' || conhece === 'duvida' || pressa === 'sim') return 'medio'
    return 'seguro'
  }, [pixRespostas])

  // ── Mostrar empatia antes do resultado ──
  const mostrarEmpatiaAntes = useCallback((texto, callback) => {
    setTextoEmpatia(texto)
    setMostrarEmpatia(true)
    setTimeout(() => {
      setMostrarEmpatia(false)
      callback()
    }, 1200)
  }, [])

  // ════════════════════════════════════
  //  COMPONENTES AUXILIARES
  // ════════════════════════════════════

  // Cabeçalho com botão voltar
  const Cabecalho = ({ onVoltar }) => (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onVoltar || (() => irParaTela('menu'))}
        aria-label="Voltar ao menu principal"
        className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-[#1A4A8A] font-semibold hover:bg-[#1A4A8A]/10 transition-colors"
        style={{ fontSize: '16px', minHeight: '44px' }}
      >
        <ArrowLeft size={20} aria-hidden="true" />
        <span>Voltar</span>
      </button>
    </div>
  )

  // Rodapé
  const Rodape = ({ style }) => (
    <footer className="w-full flex items-center justify-center gap-1 px-4 pb-6" style={{ color: '#9CA3AF', paddingTop: '16px', marginTop: '32px', ...style }}>
      <Shield size={12} aria-hidden="true" className="shrink-0" />
      <span className="font-medium uppercase whitespace-nowrap overflow-visible" style={{ fontSize: '11px', letterSpacing: '0.3px' }}>
        CLAREZA DIGITAL — SEU ASSISTENTE DE SEGURANÇA
      </span>
    </footer>
  )

  // Tela de empatia intermediária
  const TelaEmpatia = () => (
    <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
      <Heart size={48} className="text-[#2563EB] mb-6 animate-pulse-soft" aria-hidden="true" />
      <p className="text-center font-semibold" style={{ fontSize: '20px', color: '#1C1C1E', lineHeight: '1.6' }}>
        {textoEmpatia}
      </p>
    </div>
  )

  // Spinner de análise
  const SpinnerAnalise = ({ texto }) => (
    <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
      <Loader2 size={56} className="text-[#2563EB] animate-spin-slow mb-6" aria-hidden="true" />
      <p className="text-center font-semibold" style={{ fontSize: '18px', color: '#1C1C1E', lineHeight: '1.6' }}>
        {texto}
      </p>
    </div>
  )

  // Mensagem final de parabéns
  const MensagemFinal = () => (
    <div className="flex items-center gap-2 justify-center mt-6 animate-slideUp" style={{ animationDelay: '200ms' }}>
      <Heart size={20} className="text-[#16A34A]" fill="#16A34A" aria-hidden="true" />
      <p className="font-medium text-center" style={{ fontSize: '16px', color: '#1D6F42', lineHeight: '1.6' }}>
        Você fez a escolha certa. Parabéns por cuidar da sua segurança.
      </p>
    </div>
  )

  // ════════════════════════════════════
  //  TELA 0 — SPLASH (não utilizado — app inicia no menu)
  // ════════════════════════════════════
  const renderSplash = () => null

  // ════════════════════════════════════
  //  TELA 1 — MENU PRINCIPAL (redesign centrado no usuário)
  // ════════════════════════════════════
  const renderMenu = () => (
    <div
      className="animate-fadeIn"
      style={{
        backgroundColor: '#F8FAF9',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── 1. IDENTIDADE DO SISTEMA (discreta, topo esquerdo) ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '16px 20px 0',
        }}
      >
        <ShieldCheck size={20} style={{ color: '#16A34A' }} aria-hidden="true" />
        <span
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            letterSpacing: '-0.2px',
          }}
        >
          Clareza Digital
        </span>
      </div>

      {/* ── 2. TÍTULO PRINCIPAL ── */}
      <div style={{ padding: '16px 20px 4px' }}>
        <h1
          style={{
            fontSize: '26px',
            fontWeight: '800',
            color: '#00451f',
            lineHeight: '1.15',
            margin: '0 0 4px',
            letterSpacing: '-0.5px',
          }}
        >
          O que aconteceu?
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: '#4B5563',
            lineHeight: '1.4',
            margin: 0,
            fontWeight: '500',
          }}
        >
          Escolha uma situação abaixo.
        </p>
      </div>

      {/* ── 3. FUNCIONALIDADES PRINCIPAIS (cartões verticais) ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '10px 20px',
        }}
      >
        {/* Card 1 — Mensagem suspeita */}
        <button
          onClick={() => irParaTela('mensagem')}
          aria-label="Recebeu uma mensagem suspeita?"
          id="btn-mensagem-suspeita"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '14px 16px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #e5e7eb',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            textAlign: 'left',
            minHeight: '56px',
            transition: 'box-shadow 200ms ease, border-color 200ms ease, transform 150ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(74,144,226,0.15)'; e.currentTarget.style.borderColor = '#93bbf0' }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#e5e7eb' }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MessageCircle size={22} style={{ color: '#4a90e2' }} fill="#4a90e2" aria-hidden="true" />
          </div>
          <span
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#111827',
              lineHeight: '1.3',
              flex: 1,
            }}
          >
            Recebeu uma mensagem suspeita?
          </span>
          <ChevronRight size={18} style={{ color: '#9CA3AF', flexShrink: 0 }} aria-hidden="true" />
        </button>

        {/* Card 2 — Pedido de PIX */}
        <button
          onClick={() => irParaTela('pix')}
          aria-label="Recebeu um pedido de PIX?"
          id="btn-pedido-pix"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '14px 16px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #e5e7eb',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            textAlign: 'left',
            minHeight: '56px',
            transition: 'box-shadow 200ms ease, border-color 200ms ease, transform 150ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(34,197,94,0.15)'; e.currentTarget.style.borderColor = '#86efac' }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#e5e7eb' }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              backgroundColor: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DollarSign size={22} style={{ color: '#16a34a' }} aria-hidden="true" />
          </div>
          <span
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#111827',
              lineHeight: '1.3',
              flex: 1,
            }}
          >
            Recebeu um pedido de PIX?
          </span>
          <ChevronRight size={18} style={{ color: '#9CA3AF', flexShrink: 0 }} aria-hidden="true" />
        </button>

        {/* Card 3 — Recebi algo para clicar */}
        <button
          onClick={() => irParaTela('link')}
          aria-label="Recebeu algo para clicar?"
          id="btn-link-desconhecido"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '14px 16px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #e5e7eb',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            textAlign: 'left',
            minHeight: '56px',
            transition: 'box-shadow 200ms ease, border-color 200ms ease, transform 150ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(245,157,35,0.15)'; e.currentTarget.style.borderColor = '#fdba74' }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#e5e7eb' }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              backgroundColor: '#fff7ed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <LinkIcon size={22} style={{ color: '#ea580c' }} aria-hidden="true" />
          </div>
          <span
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#111827',
              lineHeight: '1.3',
              flex: 1,
            }}
          >
            Recebeu algo para clicar?
          </span>
          <ChevronRight size={18} style={{ color: '#9CA3AF', flexShrink: 0 }} aria-hidden="true" />
        </button>
        {/* Card 4 — Outra situação */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid #e5e7eb',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            padding: '14px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                backgroundColor: '#f5f3ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <HelpCircle size={22} style={{ color: '#7e5ce6' }} aria-hidden="true" />
            </div>
            <label
              htmlFor="campo-descricao-livre"
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#111827',
                lineHeight: '1.3',
                flex: 1,
              }}
            >
              Outra situação
            </label>
          </div>
          <textarea
            id="campo-descricao-livre"
            value={descricaoLivre}
            onChange={e => setDescricaoLivre(e.target.value)}
            placeholder="Descreva o que aconteceu..."
            rows={2}
            style={{
              width: '100%',
              fontSize: '15px',
              color: '#1C1C1E',
              backgroundColor: '#F9FAFB',
              border: '1.5px solid #D1D5DB',
              borderRadius: '12px',
              padding: '10px 14px',
              resize: 'none',
              lineHeight: '1.45',
              outline: 'none',
              transition: 'border-color 200ms ease',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#16A34A'}
            onBlur={e => e.currentTarget.style.borderColor = '#D1D5DB'}
          />
          {descricaoLivre.trim().length > 0 && (
            <button
              onClick={processarDescricaoLivre}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '14px',
                backgroundColor: '#16A34A',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              Analisar situação
            </button>
          )}
        </div>
      </div>

      {/* ── 5. RECURSOS SECUNDÁRIOS: Dicas rápidas ── */}
      <div style={{ padding: '12px 20px 16px', marginTop: 'auto' }}>
        <button
          id="btn-dicas-seguranca"
          onClick={() => irParaTela('dicas')}
          aria-label="Ver dicas rápidas de segurança"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            backgroundColor: '#e8f4e7',
            border: 'none',
            borderRadius: '14px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'box-shadow 200ms ease',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,69,31,0.12)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
          <BookOpen size={20} style={{ color: '#00451f', flexShrink: 0 }} aria-hidden="true" />
          <span
            style={{
              flex: 1,
              fontSize: '14px',
              fontWeight: '600',
              color: '#00451f',
              lineHeight: '1.3',
            }}
          >
            Dicas rápidas de segurança
          </span>
          <ChevronRight size={18} style={{ color: '#00451f', flexShrink: 0 }} aria-hidden="true" />
        </button>
      </div>
    </div>
  )

  // ════════════════════════════════════
  //  TELA 2 — MODO SEGURO PIX
  // ════════════════════════════════════
  const renderPix = () => {
    if (mostrarEmpatia) return <TelaEmpatia />

    // ── Passo 1: Conhece a pessoa? ──
    if (pixPasso === 1) {
      return (
        <div className="animate-fadeIn" style={{ backgroundColor: '#F0F4F8' }}>
          <Cabecalho />
          <div className="text-center mb-2" style={{ fontSize: '16px', color: '#4B5563' }}>
            Passo 1 de 4
          </div>
          <div className="w-full bg-gray-200 rounded-full mb-6" style={{ height: '6px' }}>
            <div className="rounded-full" style={{ width: '25%', height: '6px', backgroundColor: '#2563EB' }} />
          </div>

          <div className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: '72px', height: '72px', backgroundColor: '#ECFDF5' }}
            >
              <UserCheck size={40} className="text-[#1D6F42]" aria-hidden="true" />
            </div>
          </div>

          <h2 className="font-bold text-center mb-8" style={{ fontSize: '22px', color: '#1C1C1E', lineHeight: '1.4' }}>
            Você conhece a pessoa que pediu o PIX?
          </h2>

          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => {
                setPixRespostas(prev => ({ ...prev, conhece: 'sim' }))
                setPixPasso(2)
                setAnimKey(prev => prev + 1)
              }}
              aria-label="Sim, conheço bem a pessoa"
              className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-white transition-all"
              style={{ backgroundColor: '#1D6F42', fontSize: '18px', minHeight: '56px' }}
            >
              <CheckCircle size={24} aria-hidden="true" />
              Sim, conheço bem
            </button>

            <button
              onClick={() => {
                setPixRespostas(prev => ({ ...prev, conhece: 'nao' }))
                mostrarEmpatiaAntes('Entendo. Vamos ver isso juntos...', () => setPixPasso(2))
                setAnimKey(prev => prev + 1)
              }}
              aria-label="Não conheço a pessoa que pediu o PIX"
              className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-white transition-all"
              style={{ backgroundColor: '#D97706', fontSize: '18px', minHeight: '56px' }}
            >
              <XCircle size={24} aria-hidden="true" />
              Não conheço
            </button>

            <button
              onClick={() => {
                setPixRespostas(prev => ({ ...prev, conhece: 'duvida' }))
                mostrarEmpatiaAntes('Tudo bem ter dúvida. Vamos continuar...', () => setPixPasso(2))
                setAnimKey(prev => prev + 1)
              }}
              aria-label="Tenho dúvida se conheço a pessoa"
              className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all"
              style={{ backgroundColor: '#E5E7EB', color: '#374151', fontSize: '18px', minHeight: '56px' }}
            >
              <HelpCircle size={24} aria-hidden="true" />
              Tenho dúvida
            </button>
          </div>

          <p className="text-center" style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.6' }}>
            Se não conhece, há grande risco de golpe. Não pague ainda.
          </p>
          <Rodape />
        </div>
      )
    }

    // ── Passo 2: Pressão? ──
    if (pixPasso === 2) {
      return (
        <div className="animate-fadeIn" style={{ backgroundColor: '#F0F4F8' }}>
          <Cabecalho />
          <div className="text-center mb-2" style={{ fontSize: '16px', color: '#4B5563' }}>
            Passo 2 de 4
          </div>
          <div className="w-full bg-gray-200 rounded-full mb-6" style={{ height: '6px' }}>
            <div className="rounded-full" style={{ width: '50%', height: '6px', backgroundColor: '#2563EB' }} />
          </div>

          <div className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: '72px', height: '72px', backgroundColor: '#FFFBEB' }}
            >
              <Clock size={40} className="text-[#D97706]" aria-hidden="true" />
            </div>
          </div>

          <h2 className="font-bold text-center mb-8" style={{ fontSize: '22px', color: '#1C1C1E', lineHeight: '1.4' }}>
            Alguém está te pressionando para pagar rápido?
          </h2>

          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => {
                setPixRespostas(prev => ({ ...prev, pressa: 'sim' }))
                mostrarEmpatiaAntes('Calma, vamos verificar juntos...', () => setPixPasso(3))
                setAnimKey(prev => prev + 1)
              }}
              aria-label="Sim, estão me pressionando com pressa"
              className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-white transition-all"
              style={{ backgroundColor: '#D97706', fontSize: '18px', minHeight: '56px' }}
            >
              <AlertTriangle size={24} aria-hidden="true" />
              Sim, está com pressa
            </button>

            <button
              onClick={() => {
                setPixRespostas(prev => ({ ...prev, pressa: 'nao' }))
                setPixPasso(3)
                setAnimKey(prev => prev + 1)
              }}
              aria-label="Não, ninguém está me pressionando"
              className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-white transition-all"
              style={{ backgroundColor: '#1D6F42', fontSize: '18px', minHeight: '56px' }}
            >
              <CheckCircle size={24} aria-hidden="true" />
              Não, nenhuma pressa
            </button>
          </div>

          <p className="text-center" style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.6' }}>
            Golpistas criam urgência. Pressa é sinal de perigo.
          </p>
          <Rodape />
        </div>
      )
    }

    // ── Passo 3: Valor ──
    if (pixPasso === 3) {
      return (
        <div className="animate-fadeIn" style={{ backgroundColor: '#F0F4F8' }}>
          <Cabecalho />
          <div className="text-center mb-2" style={{ fontSize: '16px', color: '#4B5563' }}>
            Passo 3 de 4
          </div>
          <div className="w-full bg-gray-200 rounded-full mb-6" style={{ height: '6px' }}>
            <div className="rounded-full" style={{ width: '75%', height: '6px', backgroundColor: '#2563EB' }} />
          </div>

          <div className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: '72px', height: '72px', backgroundColor: '#EFF6FF' }}
            >
              <span style={{ fontSize: '32px' }} aria-hidden="true">💰</span>
            </div>
          </div>

          <h2 className="font-bold text-center mb-4" style={{ fontSize: '22px', color: '#1C1C1E', lineHeight: '1.4' }}>
            Qual o valor do PIX que estão pedindo?
          </h2>

          <p className="text-center mb-6" style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.6' }}>
            Digite o valor para verificarmos juntos.
          </p>

          <div className="mb-6">
            <label htmlFor="pix-valor" className="block font-medium mb-2" style={{ fontSize: '16px', color: '#374151' }}>
              Valor em reais (R$)
            </label>
            <input
              id="pix-valor"
              type="text"
              inputMode="decimal"
              placeholder="Ex: 150,00"
              value={pixValor}
              onChange={(e) => setPixValor(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white border-2 border-gray-200"
              style={{ fontSize: '20px', minHeight: '56px', color: '#1C1C1E' }}
              aria-label="Digite o valor do PIX em reais"
            />
          </div>

          <button
            onClick={() => {
              setPixPasso(4)
              setAnimKey(prev => prev + 1)
            }}
            aria-label="Continuar para ver o resultado da análise"
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white transition-all"
            style={{ backgroundColor: '#2563EB', fontSize: '18px', minHeight: '56px' }}
          >
            Continuar
            <ChevronRight size={22} aria-hidden="true" />
          </button>
          <Rodape />
        </div>
      )
    }

    // ── Passo 4: Resultado ──
    if (pixPasso === 4) {
      const risco = calcularRiscoPix()

      if (risco === 'seguro') {
        return (
          <div className="animate-fadeIn" style={{ backgroundColor: '#F0F4F8' }}>
            <Cabecalho />
            <div className="text-center mb-2" style={{ fontSize: '16px', color: '#4B5563' }}>
              Passo 4 de 4
            </div>
            <div className="w-full bg-gray-200 rounded-full mb-6" style={{ height: '6px' }}>
              <div className="rounded-full" style={{ width: '100%', height: '6px', backgroundColor: '#16A34A' }} />
            </div>

            <div
              className="rounded-2xl p-6 text-center mb-6"
              style={{ backgroundColor: '#ECFDF5', border: '2px solid #BBF7D0' }}
            >
              <div className="flex justify-center mb-4">
                <ShieldCheck size={64} className="text-[#1D6F42]" aria-hidden="true" />
              </div>
              <h2 className="font-bold mb-3" style={{ fontSize: '24px', color: '#1D6F42', lineHeight: '1.3' }}>
                Parece seguro!
              </h2>
              <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>
                Você conhece a pessoa e não há pressa. Ainda assim, confirme o nome no PIX antes de pagar.
              </p>
              {pixValor && (
                <p className="font-semibold mt-3" style={{ fontSize: '18px', color: '#1D6F42' }}>
                  Valor: R$ {pixValor}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => irParaTela('menu')}
                aria-label="Entendi, vou confirmar o nome antes de pagar"
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white transition-all"
                style={{ backgroundColor: '#1D6F42', fontSize: '18px', minHeight: '56px' }}
              >
                <CheckCircle size={22} aria-hidden="true" />
                Entendi, vou confirmar
              </button>
              <button
                onClick={() => irParaTela('menu')}
                aria-label="Sair e não fazer o PIX"
                className="w-full p-3 rounded-2xl font-semibold transition-all"
                style={{ backgroundColor: '#E5E7EB', color: '#374151', fontSize: '16px', minHeight: '48px' }}
              >
                Sair e não fazer o PIX
              </button>
            </div>

            <MensagemFinal />
            <Rodape />
          </div>
        )
      }

      if (risco === 'medio') {
        return (
          <div className="animate-fadeIn" style={{ backgroundColor: '#F0F4F8' }}>
            <Cabecalho />
            <div className="text-center mb-2" style={{ fontSize: '16px', color: '#4B5563' }}>
              Passo 4 de 4
            </div>
            <div className="w-full bg-gray-200 rounded-full mb-6" style={{ height: '6px' }}>
              <div className="rounded-full" style={{ width: '100%', height: '6px', backgroundColor: '#D97706' }} />
            </div>

            <div
              className="rounded-2xl p-6 text-center mb-6"
              style={{ backgroundColor: '#FFFBEB', border: '2px solid #FDE68A' }}
            >
              <div className="flex justify-center mb-4">
                <AlertTriangle size={64} className="text-[#D97706]" aria-hidden="true" />
              </div>
              <h2 className="font-bold mb-3" style={{ fontSize: '24px', color: '#92400E', lineHeight: '1.3' }}>
                Atenção! Pode ser golpe.
              </h2>
              <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>
                Não pague agora. Ligue para a pessoa pelo número que você já tem salvo no celular. Nunca use o número que veio na mensagem.
              </p>
              {pixValor && (
                <p className="font-semibold mt-3" style={{ fontSize: '18px', color: '#D97706' }}>
                  Valor: R$ {pixValor}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => irParaTela('menu')}
                aria-label="Entendi, não vou pagar agora"
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white transition-all"
                style={{ backgroundColor: '#D97706', fontSize: '18px', minHeight: '56px' }}
              >
                <CheckCircle size={22} aria-hidden="true" />
                Entendi, não vou pagar
              </button>
              <a
                href="tel:00000000000"
                aria-label="Ligar para um familiar antes de decidir"
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white transition-all"
                style={{ backgroundColor: '#2563EB', fontSize: '18px', minHeight: '56px', textDecoration: 'none' }}
              >
                <Phone size={22} aria-hidden="true" />
                Falar com familiar
              </a>
            </div>

            <MensagemFinal />
            <Rodape />
          </div>
        )
      }

      // Alto risco
      return (
        <div className="animate-fadeIn" style={{ backgroundColor: '#F0F4F8' }}>
          <Cabecalho />
          <div className="text-center mb-2" style={{ fontSize: '16px', color: '#4B5563' }}>
            Passo 4 de 4
          </div>
          <div className="w-full bg-gray-200 rounded-full mb-6" style={{ height: '6px' }}>
            <div className="rounded-full" style={{ width: '100%', height: '6px', backgroundColor: '#DC2626' }} />
          </div>

          <div
            className="rounded-2xl p-6 text-center mb-6"
            style={{ backgroundColor: '#FEF3C7', border: '2px solid #F59E0B' }}
          >
            <div className="flex justify-center mb-4">
              <XCircle size={64} className="text-[#DC2626]" aria-hidden="true" />
            </div>
            <h2 className="font-bold mb-3" style={{ fontSize: '26px', color: '#991B1B', lineHeight: '1.3' }}>
              PARE! Isso parece golpe.
            </h2>
            <p className="font-semibold" style={{ fontSize: '18px', color: '#374151', lineHeight: '1.6' }}>
              Não pague de jeito nenhum. Desligue. Ligue para alguém de confiança agora.
            </p>
            {pixValor && (
              <p className="font-semibold mt-3" style={{ fontSize: '18px', color: '#DC2626' }}>
                Valor suspeito: R$ {pixValor}
              </p>
            )}
          </div>

          <button
            onClick={() => irParaTela('menu')}
            aria-label="Não vou pagar. Vou pedir ajuda a alguém de confiança."
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white transition-all animate-shake"
            style={{ backgroundColor: '#991B1B', fontSize: '18px', minHeight: '56px' }}
          >
            <X size={22} aria-hidden="true" />
            Não vou pagar. Vou pedir ajuda.
          </button>

          <MensagemFinal />
          <Rodape />
        </div>
      )
    }

    return null
  }

  // ════════════════════════════════════
  //  TELA 3 — ANALISAR MENSAGEM
  // ════════════════════════════════════
  const renderMensagem = () => {
    if (analisando) {
      return (
        <div style={{ backgroundColor: '#F0F4F8' }}>
          <Cabecalho />
          <SpinnerAnalise texto="Analisando com cuidado..." />
          <Rodape />
        </div>
      )
    }

    // Resultado
    if (resultado) {
      return (
        <div className="animate-fadeIn" style={{ backgroundColor: '#F0F4F8' }}>
          <Cabecalho />

          {(resultado.nivel === 'alto' || resultado.nivel === 'medio') ? (
            <div
              className="rounded-2xl p-6 mb-6"
              style={{
                backgroundColor: resultado.nivel === 'alto' ? '#FEF3C7' : '#FFFBEB',
                border: `2px solid ${resultado.nivel === 'alto' ? '#F59E0B' : '#FDE68A'}`
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={40} className="text-[#D97706] shrink-0" aria-hidden="true" />
                <h2 className="font-bold" style={{ fontSize: '22px', color: '#92400E', lineHeight: '1.3' }}>
                  {resultado.nivel === 'alto' ? 'Cuidado! Mensagem suspeita.' : 'Essa mensagem merece atenção.'}
                </h2>
              </div>

              <p className="font-semibold mb-4" style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>
                Encontramos esses sinais de alerta:
              </p>

              <ul className="flex flex-col gap-3 mb-4">
                {resultado.sinais.map((sinal, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 p-3 rounded-xl"
                    style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
                  >
                    <AlertTriangle size={20} className="text-[#D97706] shrink-0 mt-0.5" aria-hidden="true" />
                    <span style={{ fontSize: '16px', color: '#374151', lineHeight: '1.5' }}>
                      {sinal}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="font-semibold" style={{ fontSize: '16px', color: '#92400E', lineHeight: '1.6' }}>
                {resultado.nivel === 'alto'
                  ? 'Não responda. Não clique em nada. Mostre para um familiar.'
                  : 'Tenha cuidado. Não clique em endereços desconhecidos.'}
              </p>
            </div>
          ) : (
            <div
              className="rounded-2xl p-6 mb-6"
              style={{ backgroundColor: '#ECFDF5', border: '2px solid #BBF7D0' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={40} className="text-[#1D6F42] shrink-0" aria-hidden="true" />
                <h2 className="font-bold" style={{ fontSize: '22px', color: '#1D6F42', lineHeight: '1.3' }}>
                  Parece uma mensagem normal.
                </h2>
              </div>
              <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>
                Não encontramos sinais suspeitos. Mas sempre desconfie de pedidos de dinheiro ou dados pessoais.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setMensagem('')
                setResultado(null)
                irParaTela('menu')
              }}
              aria-label={
                resultado.nivel === 'alto' || resultado.nivel === 'medio'
                  ? 'Entendi, não vou responder a mensagem suspeita'
                  : 'Ok, entendi que a mensagem parece segura'
              }
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white transition-all"
              style={{
                backgroundColor: (resultado.nivel === 'alto' || resultado.nivel === 'medio') ? '#D97706' : '#1D6F42',
                fontSize: '18px',
                minHeight: '56px'
              }}
            >
              <CheckCircle size={22} aria-hidden="true" />
              {(resultado.nivel === 'alto' || resultado.nivel === 'medio')
                ? 'Entendi, não vou responder'
                : 'Ok, entendi'}
            </button>
            <button
              onClick={() => irParaTela('menu')}
              aria-label="Voltar ao início"
              className="w-full flex items-center justify-center gap-1 p-3 rounded-2xl font-semibold transition-all"
              style={{ color: '#1A4A8A', fontSize: '16px', minHeight: '48px' }}
            >
              <ArrowLeft size={18} aria-hidden="true" />
              Início
            </button>
          </div>

          <MensagemFinal />
          <Rodape />
        </div>
      )
    }

    // Tutorial de copiar e colar
    if (tutorialCopiarPasso > 0) {
      return (
        <div className="animate-fadeIn flex flex-col" style={{ backgroundColor: '#F0F4F8', minHeight: '100dvh' }}>
          <Cabecalho onVoltar={() => setTutorialCopiarPasso(0)} />

          <div className="flex flex-col items-center justify-center text-center mt-4 flex-grow">
            {tutorialCopiarPasso === 1 && (
              <div className="animate-fadeIn w-full">
                <h2 className="font-bold mb-4" style={{ fontSize: '24px', color: '#1C1C1E', lineHeight: '1.4' }}>
                  Vamos fazer juntos
                </h2>
                <p style={{ fontSize: '18px', color: '#374151', lineHeight: '1.6' }}>
                  Vou mostrar como copiar uma mensagem para analisarmos com segurança.
                </p>
              </div>
            )}

            {tutorialCopiarPasso === 2 && (
              <div className="animate-fadeIn w-full flex flex-col items-center">
                <div className="mb-6 flex items-center justify-center bg-blue-100 rounded-full" style={{ width: '100px', height: '100px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  </svg>
                </div>
                <p className="font-medium" style={{ fontSize: '18px', color: '#1C1C1E', lineHeight: '1.6' }}>
                  Abra o aplicativo onde você recebeu a mensagem.
                </p>
              </div>
            )}

            {tutorialCopiarPasso === 3 && (
              <div className="animate-fadeIn w-full flex flex-col items-center">
                <div className="mb-6 flex items-center justify-center bg-amber-100 rounded-full" style={{ width: '100px', height: '100px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 14a8 8 0 0 1-8 8"></path>
                    <path d="M18 11v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
                    <path d="M14 10V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1"></path>
                    <path d="M10 9.5V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v10"></path>
                    <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
                  </svg>
                </div>
                <p className="font-medium" style={{ fontSize: '18px', color: '#1C1C1E', lineHeight: '1.6' }}>
                  Toque e segure a mensagem até aparecer um menu.
                </p>
              </div>
            )}

            {tutorialCopiarPasso === 4 && (
              <div className="animate-fadeIn w-full flex flex-col items-center">
                <div className="mb-6 flex items-center justify-center bg-purple-100 rounded-full" style={{ width: '100px', height: '100px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7e5ce6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </div>
                <p className="font-medium" style={{ fontSize: '18px', color: '#1C1C1E', lineHeight: '1.6' }}>
                  Toque na opção <strong>'Copiar'</strong>.
                </p>
              </div>
            )}

            {tutorialCopiarPasso === 5 && (
              <div className="animate-fadeIn w-full flex flex-col items-center">
                <div className="mb-6 flex items-center justify-center bg-green-100 rounded-full" style={{ width: '100px', height: '100px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    <path d="M12 11v6"></path>
                    <path d="M9 14l3 3 3-3"></path>
                  </svg>
                </div>
                <p className="font-medium" style={{ fontSize: '18px', color: '#1C1C1E', lineHeight: '1.6' }}>
                  Volte para o Clareza Digital, toque dentro da caixa de mensagem e escolha <strong>'Colar'</strong>.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 mb-6 flex flex-col items-center w-full">
            <button
              onClick={() => {
                if (tutorialCopiarPasso < 5) {
                  setTutorialCopiarPasso(prev => prev + 1)
                } else {
                  setTutorialCopiarPasso(0)
                }
              }}
              aria-label={tutorialCopiarPasso < 5 ? "Continuar para o próximo passo" : "Entendi, voltar para colar a mensagem"}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white transition-all shadow-md"
              style={{ backgroundColor: '#2563EB', fontSize: '18px', minHeight: '56px' }}
            >
              {tutorialCopiarPasso < 5 ? 'Continuar' : 'Entendi'}
              {tutorialCopiarPasso < 5 && <ChevronRight size={22} aria-hidden="true" />}
            </button>
            
            <p className="mt-4 font-medium" style={{ fontSize: '14px', color: '#6B7280' }}>
              Passo {tutorialCopiarPasso} de 5
            </p>
          </div>
        </div>
      )
    }

    // Formulário
    return (
      <div className="animate-fadeIn flex flex-col" style={{ backgroundColor: '#F0F4F8', minHeight: '100dvh' }}>
        <Cabecalho />

        <div className="flex flex-col flex-grow">
          <div className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: '72px', height: '72px', backgroundColor: '#EFF6FF' }}
            >
              <MessageSquare size={40} className="text-[#2563EB]" aria-hidden="true" />
            </div>
          </div>

          <h2 className="font-bold text-center mb-2" style={{ fontSize: '22px', color: '#1C1C1E', lineHeight: '1.4' }}>
            Escreva ou cole aqui a mensagem que você recebeu
          </h2>

          <p className="text-center mb-6" style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.6' }}>
            Você pode escrever a mensagem ou colar o texto recebido.
          </p>

          <div className="mb-4">
            <textarea
              id="mensagem-texto"
              rows={6}
              placeholder="Escreva ou cole aqui..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white border-2 border-gray-200 resize-none"
              style={{ fontSize: '16px', lineHeight: '1.6', color: '#1C1C1E' }}
              aria-label="Cole ou escreva aqui a mensagem que você recebeu para ser analisada"
            />
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={() => setTutorialCopiarPasso(1)}
              aria-label="Abrir tutorial que ensina como copiar e colar uma mensagem"
              className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-2 rounded-xl transition-colors hover:bg-blue-50"
              style={{ color: '#2563EB', fontSize: '15px', fontWeight: '500' }}
            >
              <HelpCircle size={18} aria-hidden="true" />
              <span style={{ textDecoration: 'underline' }}>
                Não sabe como copiar e colar uma mensagem?
              </span>
            </button>
          </div>

          <button
            onClick={analisarMensagem}
            disabled={!mensagem.trim()}
            aria-label="Analisar a mensagem que você escreveu"
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-auto mb-6"
            style={{ backgroundColor: '#2563EB', fontSize: '18px', minHeight: '56px' }}
          >
            Verificar mensagem
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>
      </div>
    )
  }

  // ════════════════════════════════════
  //  TELA 4 — VERIFICAR LINK
  // ════════════════════════════════════
  // ── renderLink removido — refatorado para o componente VerificarLink ──

  // ════════════════════════════════════

  // ════════════════════════════════════
  //  TELA 6 — DICAS RÁPIDAS DE SEGURANÇA (Stepper)
  // ════════════════════════════════════
  const dicasConteudo = [
    {
      titulo: 'Confirme quem é a pessoa',
      texto: 'Se alguém que você conhece pedir dinheiro ou PIX por mensagem com um número desconhecido, não pague. Ligue para o número antigo da pessoa ou faça uma chamada de vídeo para ter certeza.',
      icone: UserCheck,
      cor: 'verde'
    },
    {
      titulo: 'Confira os dados antes de transferir',
      texto: 'Na hora de fazer qualquer PIX, antes de confirmar, olhe com atenção o nome completo e o CPF de quem vai receber. Confira se são exatamente os da pessoa que você deseja pagar.',
      icone: ShieldCheck,
      cor: 'verde'
    },
    {
      titulo: 'Cuidado com promoções e links grátis',
      texto: 'Desconfie de mensagens com links prometendo prêmios ou bônus em conta. Empresas e bancos reais não enviam esse tipo de mensagem por WhatsApp ou SMS.',
      icone: LinkIcon,
      cor: 'ambar'
    },
    {
      titulo: 'Bancos nunca pedem sua senha',
      texto: 'Nenhum banco real liga, manda e-mail ou mensagem pedindo sua senha, código do cartão ou foto do aplicativo. Se alguém pedir isso, é golpe. Desligue.',
      icone: Lock,
      cor: 'ambar'
    },
    {
      titulo: 'Desconfie da urgência e pressão',
      texto: 'Golpistas tentam te assustar dizendo que sua conta vai ser bloqueada ou que alguém precisa de socorro imediato. Respire. Converse com alguém de confiança antes de qualquer decisão.',
      icone: Clock,
      cor: 'ambar'
    }
  ]

  const totalDicas = dicasConteudo.length

  const avancarDica = () => {
    if (dicaAtual < totalDicas - 1) {
      setDicaAtual(prev => prev + 1)
    } else {
      setDicasConcluido(true)
    }
  }

  const renderDicas = () => {
    // ── Tela de conclusão ──
    if (dicasConcluido) {
      return (
        <div
          className="animate-fadeIn flex flex-col"
          style={{ backgroundColor: '#F0F4F8', minHeight: '100dvh' }}
        >
          {/* Cabeçalho simplificado */}
          <div
            className="flex items-center justify-between"
            style={{
              backgroundColor: '#FFFFFF',
              padding: '12px 16px',
              borderBottom: '0.5px solid #E5E7EB'
            }}
          >
            <button
              onClick={() => irParaTela('menu')}
              aria-label="Voltar para o menu principal"
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl font-semibold hover:bg-[#1A4A8A]/10 transition-colors"
              style={{ color: '#1A4A8A', fontSize: '16px', minHeight: '48px' }}
            >
              <ArrowLeft size={20} aria-hidden="true" />
              <span>Voltar</span>
            </button>
          </div>

          {/* Conteúdo centralizado */}
          <div style={{ padding: '0 32px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Ícone de conclusão */}
            <div
              className="flex items-center justify-center"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#F0FDF4',
                marginTop: '40px'
              }}
            >
              <ShieldCheck size={40} style={{ color: '#16A34A' }} aria-hidden="true" />
            </div>

            <h1
              className="font-bold text-center"
              style={{ fontSize: '28px', color: '#1A4A8A', marginTop: '20px' }}
            >
              Muito bem!
            </h1>

            <h2
              className="font-bold text-center"
              style={{ fontSize: '20px', color: '#1C1C1E', marginTop: '8px' }}
            >
              Você já sabe como se proteger.
            </h2>

            <p
              className="text-center"
              style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.75', marginTop: '16px' }}
            >
              Você leu as 5 dicas de segurança. Agora está mais preparada para reconhecer golpes e proteger seu dinheiro. Parabéns por cuidar da sua segurança!
            </p>

            {/* Card de lembrete */}
            <div
              className="flex items-start gap-3 w-full"
              style={{
                backgroundColor: '#FFFBEB',
                border: '0.5px solid #FCD34D',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '24px'
              }}
            >
              <Lightbulb size={20} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
              <p style={{ fontSize: '16px', color: '#92400E', lineHeight: '1.6', margin: 0 }}>
                Lembre-se: na dúvida, espere. O tempo é o pior inimigo do golpista.
              </p>
            </div>

            {/* Botão principal */}
            <button
              onClick={() => irParaTela('menu')}
              aria-label="Voltar ao início"
              className="w-full font-bold text-white transition-all active:scale-[0.97]"
              style={{
                backgroundColor: '#1A4A8A',
                fontSize: '18px',
                minHeight: '58px',
                borderRadius: '14px',
                marginTop: '28px',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 150ms ease'
              }}
            >
              Voltar ao início
            </button>
          </div>

          {/* Rodapé */}
          <footer className="text-center py-6 mt-8" style={{ color: '#9CA3AF' }}>
            <p className="font-medium" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
              CLAREZA DIGITAL — SEU ASSISTENTE DE SEGURANÇA
            </p>
          </footer>
        </div>
      )
    }

    // ── Tela de dica individual (stepper) ──
    const dica = dicasConteudo[dicaAtual]
    const IconeAtual = dica.icone
    const isVerde = dica.cor === 'verde'
    const iconeBg = isVerde ? '#F0FDF4' : '#FFFBEB'
    const iconeCor = isVerde ? '#16A34A' : '#D97706'
    const progresso = ((dicaAtual + 1) / totalDicas) * 100
    const isUltima = dicaAtual === totalDicas - 1

    return (
      <div
        className="animate-fadeIn flex flex-col"
        style={{ backgroundColor: '#F0F4F8', minHeight: '100dvh' }}
      >
        {/* ── Cabeçalho ── */}
        <div
          className="flex items-center justify-between"
          style={{
            backgroundColor: '#FFFFFF',
            padding: '12px 16px',
            borderBottom: '0.5px solid #E5E7EB'
          }}
        >
          <button
            onClick={() => irParaTela('menu')}
            aria-label="Voltar para o menu principal"
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl font-semibold hover:bg-[#1A4A8A]/10 transition-colors"
            style={{ color: '#1A4A8A', fontSize: '16px', minHeight: '48px' }}
          >
            <ArrowLeft size={20} aria-hidden="true" />
            <span>Voltar</span>
          </button>
        </div>

        {/* ── Indicador de progresso ── */}
        <div style={{ padding: '14px 16px' }}>
          <p
            className="text-center font-medium"
            style={{ fontSize: '16px', color: '#4B5563', marginBottom: '10px' }}
          >
            Dica {dicaAtual + 1} de {totalDicas}
          </p>
          <div
            role="progressbar"
            aria-valuenow={dicaAtual + 1}
            aria-valuemin={0}
            aria-valuemax={totalDicas}
            aria-label={`Progresso: dica ${dicaAtual + 1} de ${totalDicas}`}
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#E5E7EB',
              borderRadius: '3px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${progresso}%`,
                height: '100%',
                backgroundColor: '#16A34A',
                borderRadius: '3px',
                transition: 'width 400ms ease'
              }}
            />
          </div>
        </div>

        {/* ── Card da dica ── */}
        <div style={{ padding: '0 16px', flex: 1 }}>
          <div
            key={dicaAtual}
            style={{
              backgroundColor: '#FFFFFF',
              border: '0.5px solid #E5E7EB',
              borderRadius: '16px',
              padding: '28px 24px',
              animation: 'dicaFadeIn 300ms ease forwards'
            }}
          >
            {/* Círculo do ícone */}
            <div
              className="flex items-center justify-center"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: iconeBg
              }}
            >
              <IconeAtual size={28} style={{ color: iconeCor }} aria-hidden="true" />
            </div>

            {/* Título */}
            <h2
              aria-live="polite"
              className="font-bold"
              style={{
                fontSize: '22px',
                color: '#1C1C1E',
                marginTop: '20px',
                lineHeight: '1.3'
              }}
            >
              {dica.titulo}
            </h2>

            {/* Texto */}
            <p
              style={{
                fontSize: '17px',
                color: '#374151',
                lineHeight: '1.75',
                marginTop: '14px'
              }}
            >
              {dica.texto}
            </p>
          </div>

          {/* ── Botão de ação principal ── */}
          <button
            onClick={avancarDica}
            aria-label={isUltima ? 'Ver conclusão das dicas de segurança' : 'Ir para a próxima dica'}
            className="w-full font-bold text-white transition-all active:scale-[0.97]"
            style={{
              backgroundColor: '#1D6F42',
              fontSize: '18px',
              minHeight: '58px',
              borderRadius: '14px',
              marginTop: '20px',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 150ms ease'
            }}
          >
            {isUltima ? 'Ver conclusão →' : 'Próxima dica →'}
          </button>
        </div>

        {/* ── Rodapé ── */}
        <footer className="text-center py-6" style={{ color: '#9CA3AF', marginTop: '20px' }}>
          <p className="font-medium" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
            CLAREZA DIGITAL — SEU ASSISTENTE DE SEGURANÇA
          </p>
        </footer>
      </div>
    )
  }

  // ════════════════════════════════════
  //  TELA 6 — ANÁLISE DE SITUAÇÃO LIVRE (redesign completo)
  // ════════════════════════════════════
  const renderAnaliseLivre = () => {
    const r = resultadoAnaliseLivre
    if (!r) return null

    // ── Sub-render: resultado de mensagem suspeita ──
    if (r.tipo === 'mensagem') {
      const isRisco = r.nivel === 'alto' || r.nivel === 'medio'
      return (
        <div className="animate-fadeIn" style={{ backgroundColor: '#F0F4F8', minHeight: '100dvh' }}>
          <Cabecalho onVoltar={() => irParaTela('menu')} />

          <div
            className="rounded-2xl p-6 mb-6"
            style={{
              backgroundColor: isRisco ? '#FFFBEB' : '#ECFDF5',
              border: `2px solid ${isRisco ? '#FDE68A' : '#BBF7D0'}`
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              {isRisco
                ? <AlertTriangle size={40} className="text-[#D97706] shrink-0" aria-hidden="true" />
                : <ShieldCheck size={40} className="text-[#1D6F42] shrink-0" aria-hidden="true" />
              }
              <h2 className="font-bold" style={{ fontSize: '22px', color: isRisco ? '#92400E' : '#1D6F42', lineHeight: '1.3' }}>
                {r.nivel === 'alto' ? 'Cuidado! Mensagem suspeita.' : r.nivel === 'medio' ? 'Essa mensagem merece atenção.' : 'Parece uma mensagem normal.'}
              </h2>
            </div>
            {isRisco && r.sinais && r.sinais.length > 0 && (
              <>
                <p className="font-semibold mb-3" style={{ fontSize: '16px', color: '#374151' }}>Sinais encontrados:</p>
                <ul className="flex flex-col gap-2 mb-4">
                  {r.sinais.map((sinal, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
                      <AlertTriangle size={18} className="text-[#D97706] shrink-0 mt-0.5" aria-hidden="true" />
                      <span style={{ fontSize: '15px', color: '#374151', lineHeight: '1.5' }}>{sinal}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="font-semibold" style={{ fontSize: '16px', color: isRisco ? '#92400E' : '#374151', lineHeight: '1.6' }}>
              {r.nivel === 'alto' ? 'Não responda. Não clique em nada. Mostre para um familiar.' : r.nivel === 'medio' ? 'Tenha cuidado. Não clique em endereços desconhecidos.' : 'Mas sempre desconfie de pedidos de dinheiro ou dados pessoais.'}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={() => irParaTela('menu')} className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white"
              style={{ backgroundColor: isRisco ? '#D97706' : '#1D6F42', fontSize: '18px', minHeight: '56px' }}>
              <CheckCircle size={22} aria-hidden="true" />
              {isRisco ? 'Entendi, não vou responder' : 'Ok, entendi'}
            </button>
            <button onClick={() => irParaTela('menu')} className="w-full flex items-center justify-center gap-1 p-3 rounded-2xl font-semibold"
              style={{ color: '#1A4A8A', fontSize: '16px', minHeight: '48px' }}>
              <ArrowLeft size={18} aria-hidden="true" /> Início
            </button>
          </div>
          <MensagemFinal />
          <Rodape />
        </div>
      )
    }

    // ── Sub-render: resultado de PIX ──
    if (r.tipo === 'pix') {
      const isAlto = r.nivel === 'alto'
      return (
        <div className="animate-fadeIn" style={{ backgroundColor: '#F0F4F8', minHeight: '100dvh' }}>
          <Cabecalho onVoltar={() => irParaTela('menu')} />
          <div className="rounded-2xl p-6 mb-6"
            style={{ backgroundColor: isAlto ? '#FEF3C7' : '#FFFBEB', border: `2px solid ${isAlto ? '#F59E0B' : '#FDE68A'}` }}>
            <div className="flex justify-center mb-4">
              {isAlto
                ? <XCircle size={64} className="text-[#DC2626]" aria-hidden="true" />
                : <AlertTriangle size={64} className="text-[#D97706]" aria-hidden="true" />
              }
            </div>
            <h2 className="font-bold text-center mb-3" style={{ fontSize: isAlto ? '26px' : '24px', color: isAlto ? '#991B1B' : '#92400E', lineHeight: '1.3' }}>
              {isAlto ? 'PARE! Isso parece golpe.' : 'Atenção! Pode ser golpe de PIX.'}
            </h2>
            <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6', textAlign: 'center' }}>
              {isAlto
                ? 'Não pague de jeito nenhum. Desligue. Ligue para alguém de confiança agora.'
                : 'Não pague agora. Ligue para a pessoa pelo número que você já tem salvo no celular. Nunca use o número que veio na mensagem.'}
            </p>
            {r.temPressa && (
              <div className="mt-4 p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
                <p style={{ fontSize: '15px', color: '#92400E' }}>⚠ Detectamos urgência no relato — isso é sinal de golpe. Golpistas criam pressa para você não pensar.</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => irParaTela('menu')} className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white"
              style={{ backgroundColor: isAlto ? '#991B1B' : '#D97706', fontSize: '18px', minHeight: '56px' }}>
              <X size={22} aria-hidden="true" /> Não vou pagar. Vou pedir ajuda.
            </button>
            <a href="tel:00000000000" className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white"
              style={{ backgroundColor: '#2563EB', fontSize: '18px', minHeight: '56px', textDecoration: 'none' }}>
              <Phone size={22} aria-hidden="true" /> Falar com familiar
            </a>
          </div>
          <MensagemFinal />
          <Rodape />
        </div>
      )
    }

    // ── Sub-render: resultado de link ──
    if (r.tipo === 'link') {
      const isAlto = r.nivel === 'alto'
      const isMedio = r.nivel === 'medio'
      return (
        <div className="animate-fadeIn" style={{ backgroundColor: '#F0F4F8', minHeight: '100dvh' }}>
          <Cabecalho onVoltar={() => irParaTela('menu')} />
          <div className="rounded-2xl p-6 mb-6"
            style={{ backgroundColor: isAlto ? '#FEF2F2' : isMedio ? '#FFFBEB' : '#F0FDF4', border: `2px solid ${isAlto ? '#FECACA' : isMedio ? '#FDE68A' : '#BBF7D0'}` }}>
            <div className="flex justify-center mb-4">
              {isAlto ? <XCircle size={64} className="text-[#DC2626]" aria-hidden="true" />
                : isMedio ? <AlertTriangle size={64} className="text-[#D97706]" aria-hidden="true" />
                : <ShieldCheck size={64} className="text-[#16A34A]" aria-hidden="true" />}
            </div>
            <h2 className="font-bold text-center mb-3" style={{ fontSize: '24px', color: isAlto ? '#991B1B' : isMedio ? '#92400E' : '#166534', lineHeight: '1.3' }}>
              {isAlto ? 'Não clique nesse link!' : isMedio ? 'Atenção — tome cuidado' : 'Não encontramos sinais óbvios'}
            </h2>
            <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6', textAlign: 'center' }}>
              {isAlto ? 'Esse endereço tem características muito usadas em golpes. Apague a mensagem.'
                : isMedio ? 'Encontramos características suspeitas. Não clique por enquanto.'
                : 'Mas lembre-se: nunca clique em links para digitar sua senha ou dados bancários.'}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => irParaTela('menu')} className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white"
              style={{ backgroundColor: isAlto ? '#991B1B' : isMedio ? '#D97706' : '#1D6F42', fontSize: '18px', minHeight: '56px' }}>
              <CheckCircle size={22} aria-hidden="true" />
              {isAlto || isMedio ? 'Entendi, não vou clicar' : 'Entendido'}
            </button>
            <button onClick={() => irParaTela('menu')} className="w-full flex items-center justify-center gap-1 p-3 rounded-2xl font-semibold"
              style={{ color: '#1A4A8A', fontSize: '16px', minHeight: '48px' }}>
              <ArrowLeft size={18} aria-hidden="true" /> Início
            </button>
          </div>
          <MensagemFinal />
          <Rodape />
        </div>
      )
    }

    // ── Sub-render: orientação livre (situação não classificada) ──
    const ori = r.orientacao
    if (!ori) return null

    const iconeOrientacao = {
      ligacao: { emoji: '📞', bg: '#EFF6FF', cor: '#1A4A8A' },
      familiar: { emoji: '👨‍👩‍👧', bg: '#ECFDF5', cor: '#1D6F42' },
      codigo: { emoji: '🔐', bg: '#FEF3C7', cor: '#D97706' },
      remoto: { emoji: '⚠️', bg: '#FEF2F2', cor: '#DC2626' },
      premio: { emoji: '🎁', bg: '#FEF3C7', cor: '#D97706' },
      geral: { emoji: '🛡️', bg: '#F5F3FF', cor: '#7e5ce6' },
    }
    const iconeConfig = iconeOrientacao[ori.icone] || iconeOrientacao.geral

    return (
      <div className="animate-fadeIn" style={{ backgroundColor: '#F0F4F8', minHeight: '100dvh' }}>
        <Cabecalho onVoltar={() => irParaTela('menu')} />

        {/* Ícone e título */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center justify-center rounded-full mb-4"
            style={{ width: '72px', height: '72px', backgroundColor: iconeConfig.bg, fontSize: '36px' }}>
            {ori.icone !== 'geral' ? ori.icone === 'ligacao' ? <Phone size={36} style={{ color: iconeConfig.cor }} aria-hidden="true" />
              : ori.icone === 'remoto' ? <AlertTriangle size={36} style={{ color: iconeConfig.cor }} aria-hidden="true" />
              : <ShieldCheck size={36} style={{ color: iconeConfig.cor }} aria-hidden="true" />
            : <ShieldCheck size={36} style={{ color: iconeConfig.cor }} aria-hidden="true" />}
          </div>
          <h2 className="font-bold" style={{ fontSize: '22px', color: '#1C1C1E', lineHeight: '1.3' }}>
            {ori.titulo}
          </h2>
          <p style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.6', marginTop: '6px' }}>
            {ori.subtitulo}
          </p>
        </div>

        {/* Passos */}
        <div className="flex flex-col gap-3 mb-4">
          {ori.passos.map((passo, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-white"
              style={{ border: '1px solid #E5E7EB' }}>
              <div className="flex items-center justify-center rounded-full font-bold shrink-0"
                style={{ width: '28px', height: '28px', backgroundColor: iconeConfig.bg, color: iconeConfig.cor, fontSize: '14px' }}>
                {idx + 1}
              </div>
              <p style={{ fontSize: '16px', color: '#1C1C1E', lineHeight: '1.6' }}>{passo.texto}</p>
            </div>
          ))}
        </div>

        {/* Card de alerta final */}
        <div className="flex items-start gap-3 p-4 rounded-2xl mb-6"
          style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D' }}>
          <Lightbulb size={20} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
          <p style={{ fontSize: '15px', color: '#92400E', lineHeight: '1.6' }}>{ori.alerta}</p>
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={() => irParaTela('menu')}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white"
            style={{ backgroundColor: '#1A4A8A', fontSize: '18px', minHeight: '56px' }}>
            <CheckCircle size={22} aria-hidden="true" /> Entendi, estou mais segura
          </button>
          <button onClick={() => irParaTela('dicas')}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl font-semibold"
            style={{ backgroundColor: '#e8f4e7', color: '#00451f', fontSize: '16px', minHeight: '48px', border: 'none' }}>
            <BookOpen size={18} aria-hidden="true" /> Dicas rápidas de segurança
          </button>
        </div>

        <MensagemFinal />
        <Rodape />
      </div>
    )
  }

  // ════════════════════════════════════
  //  RENDER PRINCIPAL
  // ════════════════════════════════════
  return (
    <div
      role="main"
      className="app-container"
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Conteúdo com padding responsivo, exceto splash/menu que são full */}
      <div
        key={animKey}
        className={(tela === 'splash' || tela === 'menu' || tela === 'cadastro') ? 'app-content-splash' : 'app-content'}
      >
        {tela === 'splash' && <BoasVindas onEntrar={handleEntrar} isLogin={temConta} />}
        {tela === 'cadastro' && <Cadastro onConcluir={handleConcluirCadastro} />}
        {tela === 'menu' && renderMenu()}
        {tela === 'pix' && renderPix()}
        {tela === 'mensagem' && renderMensagem()}
        {tela === 'link' && <VerificarLink onVoltar={() => irParaTela('menu')} onConcluir={() => irParaTela('menu')} autoAnalisarTexto={linkAutoAnalisarTexto} />}
        {tela === 'dicas' && renderDicas()}
        {tela === 'analise-livre' && renderAnaliseLivre()}
      </div>
    </div>
  )
}

export default ClarezaDigital
