import { useState } from 'react'
import {
  LinkIcon,
  AlertTriangle,
  Search,
  ShieldX,
  ShieldCheck,
  X,
} from 'lucide-react'

const VerificarLink = ({ onVoltar, onConcluir }) => {
  const [link, setLink] = useState('')
  const [descricao, setDescricao] = useState('')
  const [modoDescricao, setModoDescricao] = useState(false)
  const [mostrarAjuda, setMostrarAjuda] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [analisando, setAnalisando] = useState(false)

  // ── Lógica de análise ──
  const analisarLink = () => {
    setAnalisando(true)
    setTimeout(() => {
      const texto = (link + ' ' + descricao).toLowerCase()

      const altissmoRisco = [
        'bit.ly', 'tinyurl', 'encr.pw', 'gg.gg', 'is.gd',
        'senha', 'codigo', 'cpf', 'dados', 'confirme', 'bloqueado',
        'urgente', 'ganhou', 'premio', 'beneficio', 'gov-', 'banco-',
        'bradesco-', 'itau-', 'caixa-', 'nubank-', 'inter-',
      ]
      const medioRisco = [
        'gratis', 'free', 'clique', 'acesse', 'cadastro',
        'promoção', 'oferta', 'desconto', 'verificar', 'atualizar',
      ]

      const achouAlto  = altissmoRisco.filter(p => texto.includes(p))
      const achouMedio = medioRisco.filter(p => texto.includes(p))

      if (achouAlto.length > 0) {
        setResultado({ nivel: 'alto', palavras: achouAlto })
      } else if (achouMedio.length > 0) {
        setResultado({ nivel: 'medio', palavras: achouMedio })
      } else {
        setResultado({ nivel: 'seguro', palavras: [] })
      }

      setAnalisando(false)
    }, 2000)
  }

  const resetar = () => {
    setLink('')
    setDescricao('')
    setModoDescricao(false)
    setMostrarAjuda(false)
    setResultado(null)
    setAnalisando(false)
  }

  // ── Cabeçalho simples (apenas "Voltar", sem "Pare e Respire") ──
  // Usado em todas as telas do fluxo "Recebi algo para clicar"
  const CabecalhoSimples = ({ aoVoltar }) => (
    <div
      className="flex items-center bg-white border-b border-gray-200"
      style={{ padding: '12px 16px' }}
    >
      <button
        onClick={aoVoltar}
        aria-label="Voltar para o menu principal"
        className="text-[#1A4A8A] font-medium"
        style={{ fontSize: '16px', minHeight: '48px', minWidth: '48px', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        ← Voltar
      </button>
    </div>
  )

  // ── Rodapé ──
  const Rodape = () => (
    <p
      className="text-center text-[#9CA3AF] uppercase tracking-wide"
      style={{ fontSize: '11px', padding: '16px 16px 20px', whiteSpace: 'nowrap', overflow: 'visible' }}
    >
      🛡 CLAREZA DIGITAL — SEU ASSISTENTE DE SEGURANÇA
    </p>
  )

  // ── Tela: analisando ──
  if (analisando) {
    return (
      <div
        className="min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center"
        style={{ padding: '32px 20px' }}
      >
        <Search
          size={56}
          className="text-[#2563EB]"
          aria-hidden="true"
          style={{ animation: 'spin 1.5s linear infinite', marginBottom: '20px' }}
        />
        <h2
          className="font-bold text-[#1A4A8A] text-center"
          style={{ fontSize: '20px' }}
          aria-live="polite"
        >
          Verificando o endereço...
        </h2>
        <p className="text-[#4B5563] text-center" style={{ fontSize: '16px', marginTop: '8px' }}>
          Só um momento, estamos analisando com cuidado.
        </p>
      </div>
    )
  }

  // ── Tela: resultado ──
  if (resultado) {
    // ALTO RISCO
    if (resultado.nivel === 'alto') {
      return (
        <div className="min-h-screen bg-[#F0F4F8]" style={{ animation: 'fadeIn 300ms ease' }}>
          <CabecalhoSimples aoVoltar={onVoltar} />

          <div
            className="flex flex-col items-center text-center"
            style={{ backgroundColor: '#FEF2F2', padding: '32px 20px', borderRadius: '0 0 16px 16px' }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: '72px', height: '72px', backgroundColor: '#FEE2E2', marginBottom: '16px' }}
            >
              <ShieldX size={40} className="text-[#DC2626]" aria-hidden="true" />
            </div>
            <h1
              className="font-bold text-[#991B1B]"
              style={{ fontSize: '26px', lineHeight: '1.3', marginBottom: '12px' }}
              aria-live="polite"
            >
              Não clique nesse link!
            </h1>
            <p className="text-[#7F1D1D]" style={{ fontSize: '17px', lineHeight: '1.6', marginBottom: '20px' }}>
              Esse endereço tem características muito usadas em golpes. Apague a mensagem e não compartilhe com ninguém.
            </p>

            {resultado.palavras.length > 0 && (
              <div
                className="w-full text-left bg-white border border-red-200 rounded-xl"
                style={{ padding: '16px' }}
              >
                <h3 className="font-bold text-[#991B1B]" style={{ fontSize: '15px', marginBottom: '10px' }}>
                  Sinais encontrados:
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {resultado.palavras.map((p, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <X size={18} className="text-[#DC2626] shrink-0" style={{ marginTop: '2px' }} aria-hidden="true" />
                      <span className="text-[#4B5563]" style={{ fontSize: '15px' }}>
                        Contém "{p}" — sinal comum em golpes
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              className="rounded-xl"
              style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', padding: '16px' }}
            >
              <p className="text-[#92400E]" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                <strong>O que fazer:</strong> Não clique. Apague a mensagem. Se tiver dúvida, mostre para um familiar ou ligue para o banco pelo número atrás do seu cartão.
              </p>
            </div>
            <button
              onClick={onVoltar}
              className="w-full text-white font-bold rounded-[14px]"
              style={{ backgroundColor: '#991B1B', fontSize: '18px', height: '58px', border: 'none', cursor: 'pointer' }}
            >
              Entendi, não vou clicar
            </button>
            <button
              onClick={resetar}
              className="w-full font-medium rounded-[14px]"
              style={{ border: '1.5px solid #1A4A8A', color: '#1A4A8A', fontSize: '16px', height: '48px', background: 'none', cursor: 'pointer' }}
            >
              Checar outro link
            </button>
            <button
              onClick={onVoltar}
              className="w-full text-[#1A4A8A]"
              style={{ fontSize: '16px', padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ← Voltar ao início
            </button>
          </div>
          <Rodape />
        </div>
      )
    }

    // MÉDIO RISCO
    if (resultado.nivel === 'medio') {
      return (
        <div className="min-h-screen bg-[#F0F4F8]" style={{ animation: 'fadeIn 300ms ease' }}>
          <CabecalhoSimples aoVoltar={onVoltar} />

          <div
            className="flex flex-col items-center text-center"
            style={{ backgroundColor: '#FFFBEB', padding: '32px 20px', borderRadius: '0 0 16px 16px' }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: '72px', height: '72px', backgroundColor: '#FEF3C7', marginBottom: '16px' }}
            >
              <AlertTriangle size={40} className="text-[#D97706]" aria-hidden="true" />
            </div>
            <h1
              className="font-bold text-[#92400E]"
              style={{ fontSize: '26px', lineHeight: '1.3', marginBottom: '12px' }}
              aria-live="polite"
            >
              Atenção — tome cuidado
            </h1>
            <p className="text-[#78350F]" style={{ fontSize: '17px', lineHeight: '1.6' }}>
              Encontramos algumas características suspeitas. Não clique por enquanto. Mostre para alguém de confiança antes.
            </p>
          </div>

          <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              className="rounded-xl"
              style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', padding: '16px' }}
            >
              <p className="text-[#92400E]" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                Se a mensagem veio de um desconhecido ou promete algo muito bom, é melhor não clicar. <strong>Na dúvida, não clique.</strong>
              </p>
            </div>
            <button
              onClick={onVoltar}
              className="w-full text-white font-bold rounded-[14px]"
              style={{ backgroundColor: '#D97706', fontSize: '18px', height: '58px', border: 'none', cursor: 'pointer' }}
            >
              Entendi, não vou clicar agora
            </button>
            <button
              onClick={resetar}
              className="w-full font-medium rounded-[14px]"
              style={{ border: '1.5px solid #1A4A8A', color: '#1A4A8A', fontSize: '16px', height: '48px', background: 'none', cursor: 'pointer' }}
            >
              Checar outro link
            </button>
            <button
              onClick={onVoltar}
              className="w-full text-[#1A4A8A]"
              style={{ fontSize: '16px', padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ← Voltar ao início
            </button>
          </div>
          <Rodape />
        </div>
      )
    }

    // SEGURO
    return (
      <div className="min-h-screen bg-[#F0F4F8]" style={{ animation: 'fadeIn 300ms ease' }}>
        <CabecalhoSimples aoVoltar={onVoltar} />

        <div
          className="flex flex-col items-center text-center"
          style={{ backgroundColor: '#F0FDF4', padding: '32px 20px', borderRadius: '0 0 16px 16px' }}
        >
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: '72px', height: '72px', backgroundColor: '#DCFCE7', marginBottom: '16px' }}
          >
            <ShieldCheck size={40} className="text-[#16A34A]" aria-hidden="true" />
          </div>
          <h1
            className="font-bold text-[#166534]"
            style={{ fontSize: '24px', lineHeight: '1.3', marginBottom: '12px' }}
            aria-live="polite"
          >
            Não encontramos sinais óbvios
          </h1>
          <p className="text-[#166534]" style={{ fontSize: '17px', lineHeight: '1.6' }}>
            Mas lembre-se: nunca clique em links para digitar sua senha ou dados bancários.
          </p>
        </div>

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            className="rounded-xl"
            style={{ backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', padding: '16px' }}
          >
            <p className="text-[#92400E]" style={{ fontSize: '15px', lineHeight: '1.6' }}>
              Mesmo links aparentemente seguros podem ser perigosos. <strong>Quando em dúvida, não clique.</strong>
            </p>
          </div>
          <button
            onClick={onConcluir || onVoltar}
            className="w-full text-white font-bold rounded-[14px]"
            style={{ backgroundColor: '#1D6F42', fontSize: '18px', height: '58px', border: 'none', cursor: 'pointer' }}
          >
            Entendido
          </button>
          <button
            onClick={resetar}
            className="w-full font-medium rounded-[14px]"
            style={{ border: '1.5px solid #1A4A8A', color: '#1A4A8A', fontSize: '16px', height: '48px', background: 'none', cursor: 'pointer' }}
          >
            Checar outro link
          </button>
        </div>
        <Rodape />
      </div>
    )
  }

  // ── Tela: campo (entrada do link) — exibida diretamente ao abrir ──
  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      <CabecalhoSimples aoVoltar={onVoltar} />

      <div style={{ padding: '24px 16px' }}>
        {/* Ícone e título */}
        <div className="flex flex-col items-center text-center" style={{ marginBottom: '28px' }}>
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: '64px', height: '64px', backgroundColor: '#EFF6FF', marginBottom: '14px' }}
          >
            <LinkIcon size={30} className="text-[#2563EB]" aria-hidden="true" />
          </div>
          <h1 className="font-bold text-[#1C1C1E]" style={{ fontSize: '24px', lineHeight: '1.3' }}>
            Cole o link aqui
          </h1>
          <p className="text-[#4B5563]" style={{ fontSize: '16px', marginTop: '8px', lineHeight: '1.5' }}>
            É o endereço azul da mensagem que você recebeu.
          </p>
        </div>

        {/* Campo de entrada */}
        {!modoDescricao ? (
          <div style={{ marginBottom: '8px' }}>
            <label
              htmlFor="link-input"
              className="block text-[#4B5563]"
              style={{ fontSize: '14px', marginBottom: '6px' }}
            >
              Link recebido
            </label>
            <input
              id="link-input"
              type="text"
              placeholder="Ex: www.banco-oferta.com.br"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full border-[1.5px] border-[#E5E7EB] rounded-[10px] focus:outline-none focus:border-[#2563EB]"
              style={{ height: '52px', fontSize: '16px', padding: '0 14px' }}
            />
          </div>
        ) : (
          <div style={{ marginBottom: '8px' }}>
            <label
              htmlFor="descricao-input"
              className="block text-[#4B5563]"
              style={{ fontSize: '14px', marginBottom: '6px' }}
            >
              Descreva o que você viu no link
            </label>
            <textarea
              id="descricao-input"
              rows="4"
              placeholder="Ex: tinha o nome do banco e um número, ou dizia 'acesse aqui'..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full border-[1.5px] border-[#E5E7EB] rounded-[10px] focus:outline-none focus:border-[#2563EB] resize-none"
              style={{ fontSize: '16px', padding: '14px' }}
            />
          </div>
        )}

        {/* Painel de ajuda para copiar */}
        {mostrarAjuda && (
          <div
            className="rounded-[12px]"
            style={{ backgroundColor: '#F0F4F8', padding: '16px', marginTop: '10px' }}
          >
            <h3 className="font-bold text-[#1C1C1E]" style={{ fontSize: '14px', marginBottom: '8px' }}>
              Como copiar o link:
            </h3>
            <ol className="text-[#4B5563]" style={{ fontSize: '15px', lineHeight: '1.8', paddingLeft: '18px', marginBottom: '10px' }}>
              <li>Abra o WhatsApp ou SMS</li>
              <li>Segure o dedo sobre o link por 2 segundos</li>
              <li>Toque em 'Copiar link'</li>
              <li>Volte aqui e cole no campo acima</li>
            </ol>
            <button
              onClick={() => setMostrarAjuda(false)}
              className="text-[#2563EB] font-medium"
              style={{ fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}
            >
              Entendi, fechar
            </button>
          </div>
        )}

        {/* Botões auxiliares */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
          {!mostrarAjuda && (
            <button
              onClick={() => setMostrarAjuda(true)}
              className="w-full font-medium rounded-[10px]"
              style={{ border: '1.5px solid #2563EB', color: '#2563EB', fontSize: '15px', minHeight: '48px', background: 'none', cursor: 'pointer' }}
            >
              Não sei como copiar — me ajuda
            </button>
          )}
          <button
            onClick={() => { setModoDescricao(!modoDescricao); setMostrarAjuda(false) }}
            className="w-full font-medium rounded-[10px]"
            style={{ border: '1.5px solid #4B5563', color: '#4B5563', fontSize: '15px', minHeight: '48px', background: 'none', cursor: 'pointer' }}
          >
            {modoDescricao ? 'Cancelar — quero colar o link' : 'Não consigo copiar — vou descrever'}
          </button>
        </div>

        {/* Botão principal */}
        <button
          onClick={analisarLink}
          disabled={link === '' && descricao === ''}
          className="w-full text-white font-bold rounded-[14px]"
          style={{
            backgroundColor: '#1A4A8A',
            fontSize: '18px',
            height: '58px',
            border: 'none',
            cursor: link === '' && descricao === '' ? 'not-allowed' : 'pointer',
            opacity: link === '' && descricao === '' ? 0.5 : 1,
            marginTop: '20px',
          }}
          aria-disabled={link === '' && descricao === ''}
        >
          Checar se é seguro →
        </button>
      </div>

      <Rodape />
    </div>
  )
}

export default VerificarLink
