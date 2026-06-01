import { useState, useEffect, useCallback } from 'react'
import {
  ShieldCheck,
  MessageSquareWarning,
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
  Shield,
  MessageSquare,
  HelpCircle,
  Phone,
  X,
  Info,
  BookOpen,
  MessageCircle,
  DollarSign,
  Lock,
} from 'lucide-react'

/* ═══════════════════════════════════════════════
   CLAREZA DIGITAL — Assistente de Segurança Digital
   Projeto acadêmico IHC — IFPE Campus Belo Jardim
   Alunos: Liedson Ramos e Adonnys
   Orientador: Prof. Rogério Araújo
   ═══════════════════════════════════════════════ */

const ClarezaDigital = () => {
  // ── Estados principais ──
  const [tela, setTela] = useState('menu')
  const [pixPasso, setPixPasso] = useState(1)
  const [pixRespostas, setPixRespostas] = useState({})
  const [pixValor, setPixValor] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [link, setLink] = useState('')
  const [resultado, setResultado] = useState(null)
  const [analisando, setAnalisando] = useState(false)
  const [telaAnterior, setTelaAnterior] = useState(null)
  const [respiraInspire, setRespiraInspire] = useState(true)
  const [mostrarEmpatia, setMostrarEmpatia] = useState(false)
  const [textoEmpatia, setTextoEmpatia] = useState('')
  const [animKey, setAnimKey] = useState(0)

  // ── Animação de respiração no Modo Calma ──
  useEffect(() => {
    if (tela !== 'calma') return
    const intervalo = setInterval(() => {
      setRespiraInspire(prev => !prev)
    }, 4000)
    return () => clearInterval(intervalo)
  }, [tela])

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
    }
    if (nomeTela === 'link') {
      setLink('')
      setResultado(null)
    }
    setAnalisando(false)
    setMostrarEmpatia(false)
  }, [])

  const abrirCalma = useCallback(() => {
    setTelaAnterior(tela)
    setAnimKey(prev => prev + 1)
    setTela('calma')
    setRespiraInspire(true)
  }, [tela])

  const voltarDeCalma = useCallback(() => {
    setAnimKey(prev => prev + 1)
    setTela(telaAnterior || 'menu')
  }, [telaAnterior])

  // ── Lógica de análise de mensagem ──
  const analisarMensagem = useCallback(() => {
    setAnalisando(true)
    setTimeout(() => {
      const textoLower = mensagem.toLowerCase()
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
        setResultado({
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
        })
      } else if (sinaisMedio.length > 0) {
        setResultado({
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
        })
      } else {
        setResultado({ nivel: 'seguro', sinais: [] })
      }
      setAnalisando(false)
    }, 1500)
  }, [mensagem])

  // ── Lógica de análise de link ──
  const analisarLink = useCallback(() => {
    setAnalisando(true)
    setTimeout(() => {
      const linkLower = link.toLowerCase()
      const padroesSuspeitos = [
        'bit.ly', 'tinyurl', 'encurtador', '.xyz', '.top', '.tk',
        'bonus', 'promo', 'gratis', 'oferta', 'ganhou', 'clique',
        '.ru', '.cn', 'free', 'premio', 'sorteio', 'login-',
        'seguranca-', 'atualizar-', 'confirmar-'
      ]
      const sinais = padroesSuspeitos.filter(p => linkLower.includes(p))
      const muitosHifens = (linkLower.match(/-/g) || []).length > 3
      const muitoLongo = linkLower.length > 60

      if (sinais.length > 0) {
        setResultado({
          nivel: 'suspeito',
          motivos: sinais.map(s => {
            const mapa = {
              'bit.ly': 'Usa endereço encurtado (muito comum em golpes)',
              'tinyurl': 'Usa endereço encurtado (pode esconder o destino real)',
              'encurtador': 'Usa serviço para esconder o endereço real',
              '.xyz': 'Termina com .xyz (incomum para sites confiáveis)',
              '.top': 'Termina com .top (muito usado em golpes)',
              '.tk': 'Termina com .tk (muito usado em golpes)',
              'bonus': 'Promete bônus (sinal de golpe)',
              'promo': 'Fala sobre promoção (cuidado!)',
              'gratis': 'Promete algo grátis',
              'oferta': 'Usa a palavra oferta',
              'ganhou': 'Diz que você ganhou algo',
              'clique': 'Pede para clicar',
              '.ru': 'Domínio estrangeiro suspeito',
              '.cn': 'Domínio estrangeiro suspeito',
              'free': 'Promete algo grátis',
              'premio': 'Fala sobre prêmio',
              'sorteio': 'Fala sobre sorteio',
              'login-': 'Tenta imitar página de entrada',
              'seguranca-': 'Tenta parecer ser sobre segurança',
              'atualizar-': 'Tenta parecer atualização oficial',
              'confirmar-': 'Tenta parecer confirmação oficial'
            }
            return mapa[s] || `Contém "${s}"`
          })
        })
      } else if (muitosHifens || muitoLongo) {
        setResultado({
          nivel: 'atencao',
          motivos: [
            muitosHifens ? 'Endereço com muitos tracinhos (incomum em sites reais)' : null,
            muitoLongo ? 'Endereço muito longo (sites reais costumam ser curtos)' : null
          ].filter(Boolean)
        })
      } else {
        setResultado({ nivel: 'possivelSeguro', motivos: [] })
      }
      setAnalisando(false)
    }, 1500)
  }, [link])

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

  // Botão Calma (fixo no topo direito)
  const BotaoCalma = () => (
    <button
      onClick={abrirCalma}
      aria-label="Modo calma — respire e relaxe"
      className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-white font-bold shadow-lg hover:shadow-xl transition-all"
      style={{ backgroundColor: '#D97706', fontSize: '16px', minHeight: '44px' }}
    >
      <Heart size={20} aria-hidden="true" fill="white" />
      <span>CALMA</span>
    </button>
  )

  // Cabeçalho com botão voltar e calma
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
      <BotaoCalma />
    </div>
  )

  // Rodapé
  const Rodape = () => (
    <footer className="text-center py-6 mt-8" style={{ color: '#9CA3AF' }}>
      <p className="font-medium" style={{ fontSize: '13px', letterSpacing: '0.05em' }}>
        CLAREZA DIGITAL — FOCO EM SEGURANÇA +45
      </p>
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
  //  TELA 1 — MENU PRINCIPAL (fiel à imagem de referência)
  // ════════════════════════════════════
  const renderMenu = () => (
    <div
      className="animate-fadeIn"
      style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', minHeight: '100dvh' }}
    >
      {/* ── HEADER: escudo + nome + ícone info ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px 12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Ícone escudo verde */}
          <div
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#e8f4e7',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={22} style={{ color: '#00451f' }} aria-hidden="true" />
          </div>
          {/* Texto Clareza Digital */}
          <span
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#00451f',
              letterSpacing: '-0.3px',
            }}
          >
            Clareza Digital
          </span>
        </div>
        {/* Ícone info */}
        <button
          aria-label="Informações sobre o aplicativo"
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            color: '#6b7280',
          }}
        >
          <Info size={24} aria-hidden="true" />
        </button>
      </div>

      {/* ── ILUSTRAÇÃO: círculo verde claro + imagem da mulher ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '16px',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            backgroundColor: '#e8f4e7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <img
            src="/assistente.png"
            alt="Assistente digital sorrindo e acenando"
            style={{
              width: '160px',
              height: '160px',
              objectFit: 'contain',
              objectPosition: 'center bottom',
            }}
          />
          {/* Estrelinhas decorativas */}
          <span
            style={{
              position: 'absolute',
              top: '18px',
              left: '18px',
              fontSize: '14px',
              color: '#4ade80',
              opacity: 0.7,
            }}
          >✦</span>
          <span
            style={{
              position: 'absolute',
              top: '22px',
              right: '20px',
              fontSize: '10px',
              color: '#4ade80',
              opacity: 0.6,
            }}
          >✦</span>
        </div>
      </div>

      {/* ── TÍTULO E SUBTÍTULO ── */}
      <div style={{ padding: '0 28px', textAlign: 'center', marginBottom: '28px' }}>
        <h1
          style={{
            fontSize: '34px',
            fontWeight: '800',
            color: '#00451f',
            lineHeight: '1.15',
            margin: '0 0 12px',
          }}
        >
          Vamos resolver{' '}<br />isso juntos.
        </h1>
        <p
          style={{
            fontSize: '17px',
            color: '#1f2937',
            lineHeight: '1.5',
            margin: 0,
          }}
        >
          Qual situação você está enfrentando?
        </p>
      </div>

      {/* ── 4 CARDS DE OPÇÕES ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '0 20px',
          marginBottom: '20px',
        }}
      >
        {/* Card 1 — Mensagem suspeita */}
        <button
          onClick={() => irParaTela('mensagem')}
          aria-label="Analisar mensagem suspeita"
          id="btn-mensagem-suspeita"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '18px 20px',
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            textAlign: 'left',
            minHeight: '76px',
            transition: 'box-shadow 200ms ease, transform 150ms ease',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.13)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'}
        >
          {/* Ícone azul - balão de conversa */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MessageCircle size={26} style={{ color: '#4a90e2' }} fill="#4a90e2" aria-hidden="true" />
          </div>
          <span
            style={{
              flex: 1,
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              lineHeight: '1.3',
            }}
          >
            Mensagem suspeita
          </span>
          <ChevronRight size={22} style={{ color: '#9ca3af', flexShrink: 0 }} aria-hidden="true" />
        </button>

        {/* Card 2 — Pedido de PIX */}
        <button
          onClick={() => irParaTela('pix')}
          aria-label="Verificar pedido de PIX"
          id="btn-pedido-pix"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '18px 20px',
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            textAlign: 'left',
            minHeight: '76px',
            transition: 'box-shadow 200ms ease, transform 150ms ease',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.13)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'}
        >
          {/* Ícone verde - cifrão */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DollarSign size={26} style={{ color: '#ffffff' }} aria-hidden="true" />
          </div>
          <span
            style={{
              flex: 1,
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              lineHeight: '1.3',
            }}
          >
            Pedido de PIX
          </span>
          <ChevronRight size={22} style={{ color: '#9ca3af', flexShrink: 0 }} aria-hidden="true" />
        </button>

        {/* Card 3 — Link desconhecido */}
        <button
          onClick={() => irParaTela('link')}
          aria-label="Verificar link desconhecido"
          id="btn-link-desconhecido"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '18px 20px',
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            textAlign: 'left',
            minHeight: '76px',
            transition: 'box-shadow 200ms ease, transform 150ms ease',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.13)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'}
        >
          {/* Ícone laranja - corrente/link */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: '#fff7ed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <LinkIcon size={26} style={{ color: '#f59d23' }} aria-hidden="true" />
          </div>
          <span
            style={{
              flex: 1,
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              lineHeight: '1.3',
            }}
          >
            Link desconhecido
          </span>
          <ChevronRight size={22} style={{ color: '#9ca3af', flexShrink: 0 }} aria-hidden="true" />
        </button>

        {/* Card 4 — Preciso de ajuda para decidir */}
        <button
          onClick={() => irParaTela('calma')}
          aria-label="Preciso de ajuda para decidir"
          id="btn-ajuda-decidir"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '18px 20px',
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            textAlign: 'left',
            minHeight: '76px',
            transition: 'box-shadow 200ms ease, transform 150ms ease',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.13)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'}
        >
          {/* Ícone roxo - coração */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: '#f5f3ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Heart size={26} style={{ color: '#7e5ce6' }} fill="#7e5ce6" aria-hidden="true" />
          </div>
          <span
            style={{
              flex: 1,
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              lineHeight: '1.3',
            }}
          >
            Preciso de ajuda{' '}<br />para decidir
          </span>
          <ChevronRight size={22} style={{ color: '#9ca3af', flexShrink: 0 }} aria-hidden="true" />
        </button>

        {/* Card 5 — Em constante evolução */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '18px 20px',
            backgroundColor: '#f9fafb',
            border: '2px dashed #e5e7eb',
            borderRadius: '20px',
            textAlign: 'left',
            minHeight: '76px',
          }}
        >
          {/* Ícone cinza - cadeado de bloqueio */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Lock size={24} style={{ color: '#9ca3af' }} aria-hidden="true" />
          </div>
          <div style={{ flex: 1 }}>
            <span
              style={{
                display: 'block',
                fontSize: '18px',
                fontWeight: '600',
                color: '#6b7280',
                lineHeight: '1.3',
              }}
            >
              Em constante evolução
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '14px',
                color: '#9ca3af',
                marginTop: '2px',
                fontWeight: '500',
              }}
            >
              Funcionalidades novas virão em breve
            </span>
          </div>
        </div>
      </div>

      {/* ── CARD VERDE: Dicas rápidas de segurança ── */}
      <div style={{ padding: '0 20px 32px' }}>
        <button
          id="btn-dicas-seguranca"
          aria-label="Ver dicas rápidas de segurança"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '20px 20px',
            backgroundColor: '#e8f4e7',
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'box-shadow 200ms ease',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,69,31,0.15)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)'}
        >
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookOpen size={30} style={{ color: '#00451f' }} aria-hidden="true" />
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: '17px',
                fontWeight: '700',
                color: '#00451f',
                margin: '0 0 3px',
                lineHeight: '1.3',
              }}
            >
              Dicas rápidas de segurança
            </p>
            <p
              style={{
                fontSize: '14px',
                color: '#1a6035',
                margin: 0,
                lineHeight: '1.4',
              }}
            >
              Aprenda a se proteger no dia a dia.
            </p>
          </div>
          <ChevronRight size={22} style={{ color: '#00451f', flexShrink: 0 }} aria-hidden="true" />
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
            O valor do PIX é quanto?
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
                aria-label="Cancelar o PIX e voltar ao início"
                className="w-full p-3 rounded-2xl font-semibold transition-all"
                style={{ backgroundColor: '#E5E7EB', color: '#374151', fontSize: '16px', minHeight: '48px' }}
              >
                Cancelar o PIX
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
              <button
                onClick={() => irParaTela('menu')}
                aria-label="Ligar para um familiar antes de decidir"
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white transition-all"
                style={{ backgroundColor: '#2563EB', fontSize: '18px', minHeight: '56px' }}
              >
                <Phone size={22} aria-hidden="true" />
                Falar com familiar
              </button>
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
                setAnimKey(prev => prev + 1)
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
              onClick={() => {
                setMensagem('')
                setResultado(null)
                setAnimKey(prev => prev + 1)
              }}
              aria-label="Analisar outra mensagem"
              className="w-full p-3 rounded-2xl font-semibold transition-all"
              style={{ backgroundColor: '#E5E7EB', color: '#374151', fontSize: '16px', minHeight: '48px' }}
            >
              Analisar outra mensagem
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

    // Formulário
    return (
      <div className="animate-fadeIn" style={{ backgroundColor: '#F0F4F8' }}>
        <Cabecalho />

        <div className="flex justify-center mb-6">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: '72px', height: '72px', backgroundColor: '#EFF6FF' }}
          >
            <MessageSquare size={40} className="text-[#2563EB]" aria-hidden="true" />
          </div>
        </div>

        <h2 className="font-bold text-center mb-2" style={{ fontSize: '22px', color: '#1C1C1E', lineHeight: '1.4' }}>
          Cole aqui a mensagem que você recebeu
        </h2>

        <p className="text-center mb-6" style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.6' }}>
          Pode ser do WhatsApp, mensagem de texto ou qualquer aplicativo.
        </p>

        <div className="mb-6">
          <label htmlFor="mensagem-texto" className="block font-medium mb-2" style={{ fontSize: '16px', color: '#374151' }}>
            Mensagem recebida
          </label>
          <textarea
            id="mensagem-texto"
            rows={6}
            placeholder="Cole ou escreva a mensagem aqui..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white border-2 border-gray-200 resize-none"
            style={{ fontSize: '16px', lineHeight: '1.6', color: '#1C1C1E' }}
            aria-label="Cole ou escreva aqui a mensagem que você recebeu para ser analisada"
          />
        </div>

        <button
          onClick={analisarMensagem}
          disabled={!mensagem.trim()}
          aria-label="Analisar a mensagem que você escreveu"
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#2563EB', fontSize: '18px', minHeight: '56px' }}
        >
          Analisar mensagem
          <ChevronRight size={22} aria-hidden="true" />
        </button>

        <Rodape />
      </div>
    )
  }

  // ════════════════════════════════════
  //  TELA 4 — VERIFICAR LINK
  // ════════════════════════════════════
  const renderLink = () => {
    if (analisando) {
      return (
        <div style={{ backgroundColor: '#F0F4F8' }}>
          <Cabecalho />
          <SpinnerAnalise texto="Verificando o endereço..." />
          <Rodape />
        </div>
      )
    }

    // Resultado
    if (resultado) {
      const ehSuspeito = resultado.nivel === 'suspeito' || resultado.nivel === 'atencao'

      return (
        <div className="animate-fadeIn" style={{ backgroundColor: '#F0F4F8' }}>
          <Cabecalho />

          {ehSuspeito ? (
            <div
              className="rounded-2xl p-6 mb-6"
              style={{ backgroundColor: '#FFFBEB', border: '2px solid #FDE68A' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <XCircle size={40} className="text-[#D97706] shrink-0" aria-hidden="true" />
                <h2 className="font-bold" style={{ fontSize: '22px', color: '#92400E', lineHeight: '1.3' }}>
                  Não clique nesse link!
                </h2>
              </div>

              {resultado.motivos && resultado.motivos.length > 0 && (
                <ul className="flex flex-col gap-3 mb-4">
                  {resultado.motivos.map((motivo, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 p-3 rounded-xl"
                      style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
                    >
                      <AlertTriangle size={20} className="text-[#D97706] shrink-0 mt-0.5" aria-hidden="true" />
                      <span style={{ fontSize: '16px', color: '#374151', lineHeight: '1.5' }}>
                        {motivo}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6', marginBottom: '8px' }}>
                Esse tipo de endereço é muito usado em golpes. Apague a mensagem.
              </p>
              <p className="font-semibold" style={{ fontSize: '16px', color: '#92400E', lineHeight: '1.6' }}>
                Bancos e o governo nunca mandam endereços assim para pedir dados.
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
                  Não encontramos sinais óbvios de perigo.
                </h2>
              </div>
              <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>
                Mas mesmo assim, nunca clique em endereços para digitar sua senha ou dados bancários.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => irParaTela('menu')}
              aria-label={ehSuspeito ? 'Entendi, não vou clicar no link suspeito' : 'Entendido, vou tomar cuidado'}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white transition-all"
              style={{
                backgroundColor: ehSuspeito ? '#D97706' : '#1D6F42',
                fontSize: '18px',
                minHeight: '56px'
              }}
            >
              <CheckCircle size={22} aria-hidden="true" />
              {ehSuspeito ? 'Entendi, não vou clicar' : 'Entendido'}
            </button>
            <button
              onClick={() => {
                setLink('')
                setResultado(null)
                setAnimKey(prev => prev + 1)
              }}
              aria-label="Verificar outro link"
              className="w-full p-3 rounded-2xl font-semibold transition-all"
              style={{ backgroundColor: '#E5E7EB', color: '#374151', fontSize: '16px', minHeight: '48px' }}
            >
              Verificar outro link
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

    // Formulário
    return (
      <div className="animate-fadeIn" style={{ backgroundColor: '#F0F4F8' }}>
        <Cabecalho />

        <div className="flex justify-center mb-6">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: '72px', height: '72px', backgroundColor: '#EFF6FF' }}
          >
            <LinkIcon size={40} className="text-[#2563EB]" aria-hidden="true" />
          </div>
        </div>

        <h2 className="font-bold text-center mb-2" style={{ fontSize: '22px', color: '#1C1C1E', lineHeight: '1.4' }}>
          Cole o endereço que você recebeu
        </h2>

        <p className="text-center mb-6" style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.6' }}>
          É o endereço que veio na mensagem ou no e-mail.
        </p>

        <div className="mb-6">
          <label htmlFor="link-texto" className="block font-medium mb-2" style={{ fontSize: '16px', color: '#374151' }}>
            Endereço recebido
          </label>
          <input
            id="link-texto"
            type="text"
            placeholder="Ex: www.banco-oferta.com.br"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white border-2 border-gray-200"
            style={{ fontSize: '16px', color: '#1C1C1E', minHeight: '56px' }}
            aria-label="Digite ou cole aqui o endereço que você recebeu"
          />
        </div>

        <button
          onClick={analisarLink}
          disabled={!link.trim()}
          aria-label="Verificar se o endereço é seguro"
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#2563EB', fontSize: '18px', minHeight: '56px' }}
        >
          Verificar endereço
          <ChevronRight size={22} aria-hidden="true" />
        </button>

        <Rodape />
      </div>
    )
  }

  // ════════════════════════════════════
  //  TELA 5 — MODO CALMA
  // ════════════════════════════════════
  const renderCalma = () => (
    <div className="animate-fadeIn" style={{ backgroundColor: '#F0F4F8' }}>
      <div className="flex justify-end mb-4">
        <button
          onClick={voltarDeCalma}
          aria-label="Fechar modo calma e voltar"
          className="flex items-center gap-1 px-3 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          style={{ color: '#4B5563', fontSize: '16px', minHeight: '44px' }}
        >
          <X size={20} aria-hidden="true" />
          Fechar
        </button>
      </div>

      <h1 className="font-bold text-center mb-2" style={{ fontSize: '26px', color: '#1A4A8A', lineHeight: '1.3' }}>
        Respire. Você está segura.
      </h1>

      <p className="text-center mb-10" style={{ fontSize: '18px', color: '#4B5563', lineHeight: '1.6' }}>
        Nenhum golpista pode te forçar a fazer nada. Você tem tempo.
      </p>

      {/* Círculo de respiração */}
      <div className="flex flex-col items-center justify-center mb-10">
        <div
          className="flex items-center justify-center rounded-full animate-breathe"
          style={{
            width: '200px',
            height: '200px',
            backgroundColor: '#93C5FD',
            boxShadow: '0 0 40px rgba(147, 197, 253, 0.5)',
          }}
        >
          <span
            className="font-semibold text-white text-center transition-opacity duration-700"
            style={{ fontSize: '22px' }}
          >
            {respiraInspire ? 'Inspire...' : 'Expire...'}
          </span>
        </div>
      </div>

      {/* Lembretes */}
      <div className="flex flex-col gap-3 mb-8">
        {[
          { emoji: '🏦', texto: 'Nenhum banco real pede sua senha por mensagem.' },
          { emoji: '💪', texto: 'Dinheiro perdido pode ser recuperado. Fique com calma.' },
          { emoji: '📞', texto: 'Ligue para um familiar antes de qualquer decisão.' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-4 rounded-2xl bg-white shadow-sm"
            style={{ border: '1px solid #E5E7EB' }}
          >
            <span className="text-2xl shrink-0" aria-hidden="true">{item.emoji}</span>
            <p className="font-medium" style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>
              {item.texto}
            </p>
          </div>
        ))}
      </div>

      {/* Botões */}
      <div className="flex flex-col gap-3">
        <button
          onClick={voltarDeCalma}
          aria-label="Estou mais calma, voltar para onde eu estava"
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold text-white transition-all"
          style={{ backgroundColor: '#1A4A8A', fontSize: '18px', minHeight: '56px' }}
        >
          <Heart size={22} aria-hidden="true" fill="white" />
          Estou mais calma. Voltar.
        </button>
        <button
          onClick={() => {}}
          aria-label="Simular ligação para um familiar de confiança"
          className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl font-semibold transition-all"
          style={{ backgroundColor: '#E5E7EB', color: '#374151', fontSize: '16px', minHeight: '48px' }}
        >
          <Phone size={20} aria-hidden="true" />
          Ligar para familiar
        </button>
      </div>

      <Rodape />
    </div>
  )

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
      {/* Conteúdo com padding responsivo, exceto splash que é full */}
      <div
        key={animKey}
        className={tela === 'splash' ? 'app-content-splash' : 'app-content'}
      >
        {tela === 'splash' && renderSplash()}
        {tela === 'menu' && renderMenu()}
        {tela === 'pix' && renderPix()}
        {tela === 'mensagem' && renderMensagem()}
        {tela === 'link' && renderLink()}
        {tela === 'calma' && renderCalma()}
      </div>
    </div>
  )
}

export default ClarezaDigital
