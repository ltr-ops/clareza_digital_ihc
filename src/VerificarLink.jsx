import { useState } from 'react'
import {
  Link as LinkIcon,
  ExternalLink,
  AlertTriangle,
  Copy,
  Lightbulb,
  ShieldAlert,
  Building2,
  Scissors,
  Clock,
  Search,
  ShieldX,
  ShieldCheck,
} from 'lucide-react'

const VerificarLink = ({ onVoltar, onConcluir }) => {
  const [etapa, setEtapa] = useState('edu1')
  const [link, setLink] = useState('')
  const [descricao, setDescricao] = useState('')
  const [modoDescricao, setModoDescricao] = useState(false)
  const [mostrarAjuda, setMostrarAjuda] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [analisando, setAnalisando] = useState(false)

  const analisarLink = () => {
    setAnalisando(true)
    setTimeout(() => {
      const texto = (link + ' ' + descricao).toLowerCase()

      const altissmoRisco = [
        'bit.ly', 'tinyurl', 'encr.pw', 'gg.gg', 'is.gd',
        'senha', 'codigo', 'cpf', 'dados', 'confirme', 'bloqueado',
        'urgente', 'ganhou', 'premio', 'beneficio', 'gov-', 'banco-',
        'bradesco-', 'itau-', 'caixa-', 'nubank-', 'inter-'
      ]
      const medioRisco = [
        'gratis', 'free', 'clique', 'acesse', 'cadastro',
        'promoção', 'oferta', 'desconto', 'verificar', 'atualizar'
      ]

      const achouAltissimo = altissmoRisco.filter(p => texto.includes(p))
      const achouMedio = medioRisco.filter(p => texto.includes(p))

      if (achouAltissimo.length > 0) {
        setResultado({ nivel: 'alto', palavras: achouAltissimo })
      } else if (achouMedio.length > 0) {
        setResultado({ nivel: 'medio', palavras: achouMedio })
      } else {
        setResultado({ nivel: 'seguro', palavras: [] })
      }
      setAnalisando(false)
      setEtapa('resultado')
    }, 2000)
  }

  const cabecalho = (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <button
        onClick={onVoltar}
        aria-label="Voltar à tela anterior"
        className="text-[#1A4A8A] text-[16px] font-medium p-2 -ml-2"
        style={{ minHeight: '48px', minWidth: '48px' }}
      >
        ← Voltar
      </button>
      <button
        onClick={() => {}} // Apenas visual, ou conectar à função global se passado via props
        aria-label="Pare e respire, ajuda emocional"
        className="bg-[#D97706] text-white font-bold text-[13px] px-[14px] py-[6px] rounded-[20px]"
        style={{ minHeight: '44px' }}
      >
        PARE E RESPIRE
      </button>
    </div>
  )

  const indicadorProgresso = (passo) => {
    const p = passo === 1 ? '33%' : passo === 2 ? '66%' : '100%'
    return (
      <div className="px-4 py-3" aria-live="polite">
        <p className="text-center text-[14px] text-[#4B5563] mb-2">Passo {passo} de 3 — Antes de começar</p>
        <div className="w-full bg-[#E5E7EB] h-[5px] rounded-[3px]" role="progressbar" aria-valuenow={passo} aria-valuemin="1" aria-valuemax="3">
          <div className="bg-[#2563EB] h-[5px] rounded-[3px] transition-all duration-350 ease-out" style={{ width: p }}></div>
        </div>
      </div>
    )
  }

  if (analisando) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center">
        <Search size={56} className="text-[#2563EB] animate-spin mb-4" aria-hidden="true" style={{ animationDuration: '1.5s' }} />
        <h2 className="text-[18px] font-bold text-[#1A4A8A] text-center" aria-live="polite">Verificando o endereço...</h2>
        <p className="text-[15px] text-[#4B5563] text-center mt-2">Só um momento, estamos analisando com cuidado.</p>
      </div>
    )
  }

  if (etapa === 'resultado' && resultado) {
    if (resultado.nivel === 'alto') {
      return (
        <div className="min-h-screen bg-[#F0F4F8] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-[#FEF2F2] px-5 py-8 flex flex-col items-center text-center rounded-b-2xl shadow-sm">
            <div className="w-[72px] h-[72px] bg-[#FEE2E2] rounded-full flex items-center justify-center mb-4">
              <ShieldX size={40} className="text-[#DC2626]" aria-hidden="true" />
            </div>
            <h1 className="text-[26px] font-bold text-[#991B1B] mb-3" aria-live="polite">Não clique nesse link!</h1>
            <p className="text-[17px] text-[#7F1D1D] leading-relaxed mb-6">
              Esse endereço tem características muito usadas em golpes. Apague a mensagem e não compartilhe com ninguém.
            </p>
            
            <div className="w-full bg-white border border-red-200 rounded-xl p-4 text-left">
              <h3 className="font-bold text-[#991B1B] mb-2 text-[15px]">Sinais encontrados:</h3>
              <ul className="space-y-2">
                {resultado.palavras.map((p, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <ShieldX size={18} className="text-[#DC2626] shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-[15px] text-[#4B5563]">Contém a palavra suspeita "{p}"</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="px-4 py-5 space-y-4">
            <div className="bg-[#FFFBEB] border border-[#FCD34D] rounded-xl p-4">
              <p className="text-[15px] text-[#92400E] leading-relaxed">
                <span className="font-bold">O que fazer:</span> Não clique. Apague a mensagem. Se tiver dúvida, mostre para um familiar ou ligue para o banco pelo número atrás do seu cartão.
              </p>
            </div>
            <button
              onClick={onVoltar}
              className="w-full bg-[#991B1B] text-white font-bold text-[18px] h-[58px] rounded-[14px]"
            >
              Entendi, não vou clicar
            </button>
            <button
              onClick={() => { setEtapa('campo'); setLink(''); setDescricao(''); setResultado(null); }}
              className="w-full border border-[#1A4A8A] text-[#1A4A8A] font-medium text-[16px] h-[48px] rounded-[14px]"
            >
              Checar outro link
            </button>
            <button onClick={onVoltar} className="w-full text-[#1A4A8A] text-[16px] py-2 mt-3">← Voltar ao início</button>
          </div>
        </div>
      )
    }

    if (resultado.nivel === 'medio') {
      return (
        <div className="min-h-screen bg-[#F0F4F8] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-[#FFFBEB] px-5 py-8 flex flex-col items-center text-center rounded-b-2xl shadow-sm">
            <div className="w-[72px] h-[72px] bg-[#FEF3C7] rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={40} className="text-[#D97706]" aria-hidden="true" />
            </div>
            <h1 className="text-[26px] font-bold text-[#92400E] mb-3" aria-live="polite">Atenção — tome cuidado</h1>
            <p className="text-[17px] text-[#78350F] leading-relaxed">
              Encontramos algumas características suspeitas. Não clique por enquanto. Mostre para alguém de confiança antes.
            </p>
          </div>

          <div className="px-4 py-5 space-y-4">
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
              <p className="text-[15px] text-[#4B5563] leading-relaxed">
                Se a mensagem veio de um desconhecido ou promete algo muito bom, é melhor não clicar. Na dúvida, não clique.
              </p>
            </div>
            <button
              onClick={onVoltar}
              className="w-full bg-[#D97706] text-white font-bold text-[18px] h-[58px] rounded-[14px]"
            >
              Entendi, não vou clicar agora
            </button>
            <button
              onClick={() => { setEtapa('campo'); setLink(''); setDescricao(''); setResultado(null); }}
              className="w-full border border-[#1A4A8A] text-[#1A4A8A] font-medium text-[16px] h-[48px] rounded-[14px]"
            >
              Checar outro link
            </button>
            <button onClick={onVoltar} className="w-full text-[#1A4A8A] text-[16px] py-2 mt-3">← Voltar ao início</button>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-[#F0F4F8] animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="bg-[#F0FDF4] px-5 py-8 flex flex-col items-center text-center rounded-b-2xl shadow-sm">
          <div className="w-[72px] h-[72px] bg-[#DCFCE7] rounded-full flex items-center justify-center mb-4">
            <ShieldCheck size={40} className="text-[#16A34A]" aria-hidden="true" />
          </div>
          <h1 className="text-[24px] font-bold text-[#166534] mb-3" aria-live="polite">Não encontramos sinais óbvios</h1>
          <p className="text-[17px] text-[#166534] leading-relaxed">
            Não identificamos padrões suspeitos nesse endereço. Mas lembre-se: nunca clique em links para digitar sua senha ou dados bancários.
          </p>
        </div>

        <div className="px-4 py-5 space-y-4">
          <div className="bg-[#FFFBEB] border border-[#FCD34D] rounded-xl p-4">
            <p className="text-[15px] text-[#92400E] leading-relaxed">
              Mesmo links aparentemente seguros podem ser perigosos. Quando em dúvida, não clique.
            </p>
          </div>
          <button
            onClick={onConcluir}
            className="w-full bg-[#1D6F42] text-white font-bold text-[18px] h-[58px] rounded-[14px]"
          >
            Entendido
          </button>
          <button
            onClick={() => { setEtapa('campo'); setLink(''); setDescricao(''); setResultado(null); }}
            className="w-full border border-[#1A4A8A] text-[#1A4A8A] font-medium text-[16px] h-[48px] rounded-[14px]"
          >
            Checar outro link
          </button>
          <button onClick={onVoltar} className="w-full text-[#1A4A8A] text-[16px] py-2 mt-3">← Voltar ao início</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      {cabecalho}
      {etapa !== 'campo' && indicadorProgresso(etapa === 'edu1' ? 1 : etapa === 'edu2' ? 2 : 3)}

      <div className="px-4 pb-8 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {etapa === 'edu1' && (
          <div className="flex flex-col items-center">
            <div className="w-[64px] h-[64px] bg-[#EFF6FF] rounded-full flex items-center justify-center">
              <LinkIcon size={30} className="text-[#2563EB]" aria-hidden="true" />
            </div>
            <h1 className="text-[24px] font-bold text-[#1C1C1E] mt-[18px] text-center">O que é um link?</h1>
            <p className="text-[16px] text-[#4B5563] mt-2 text-center leading-[1.6]">
              Antes de checar, veja o que é um link e por que ele pode ser perigoso.
            </p>

            <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-5 mt-5 w-full">
              <ExternalLink size={24} className="text-[#2563EB] mb-2" aria-hidden="true" />
              <h2 className="text-[18px] font-bold text-[#1C1C1E] mb-2">Link é um endereço de site</h2>
              <p className="text-[16px] text-[#4B5563] leading-[1.7]">
                É aquele texto azul ou sublinhado que aparece em mensagens do WhatsApp, SMS ou e-mail. Quando você toca nele, ele abre um site no seu celular.
              </p>
            </div>

            <div className="bg-[#F0F4F8] rounded-[12px] p-4 mt-3 w-full border border-[#E5E7EB]">
              <p className="text-[13px] text-[#4B5563] mb-2">Como aparece numa mensagem:</p>
              <div className="bg-white rounded-[12px] rounded-br-none p-3 border border-[#E5E7EB]">
                <p className="text-[15px] text-[#1C1C1E]">Seu benefício foi aprovado! Acesse agora:</p>
                <p className="text-[15px] text-[#2563EB] underline mt-1 break-all">www.gov-beneficio.com/acesso</p>
                <p className="text-[13px] text-[#D97706] font-bold mt-2">← Isso é o link</p>
              </div>
            </div>

            <div className="bg-[#FFFBEB] border border-[#FCD34D] rounded-[12px] p-[14px] mt-3 w-full flex gap-3">
              <AlertTriangle size={18} className="text-[#D97706] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-[15px] text-[#92400E] leading-[1.6]">
                Golpistas enviam links falsos que parecem de bancos, governo ou correios para roubar seus dados.
              </p>
            </div>

            <button
              onClick={() => setEtapa('edu2')}
              className="w-full bg-[#1A4A8A] text-white font-bold text-[18px] h-[58px] rounded-[14px] mt-6 hover:bg-[#153b6e] transition-colors"
            >
              Entendi, continuar →
            </button>
          </div>
        )}

        {etapa === 'edu2' && (
          <div className="flex flex-col items-center">
            <div className="w-[64px] h-[64px] bg-[#F0FDF4] rounded-full flex items-center justify-center">
              <Copy size={30} className="text-[#16A34A]" aria-hidden="true" />
            </div>
            <h1 className="text-[24px] font-bold text-[#1C1C1E] mt-[18px] text-center">Como copiar o link recebido</h1>
            <p className="text-[16px] text-[#4B5563] mt-2 text-center">
              Siga esses 3 passos simples no seu celular.
            </p>

            <div className="w-full mt-5 space-y-[10px]">
              <div className="bg-white border border-[#E5E7EB] border-l-[3px] border-l-[#2563EB] rounded-[12px] rounded-l-none p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-[28px] h-[28px] bg-[#DBEAFE] text-[#1A4A8A] font-bold rounded-full flex items-center justify-center text-[14px]">1</div>
                  <h2 className="text-[16px] font-bold text-[#1C1C1E]">Abra a mensagem com o link</h2>
                </div>
                <p className="text-[15px] text-[#4B5563] ml-10">Entre no WhatsApp ou SMS onde você recebeu a mensagem suspeita.</p>
              </div>

              <div className="bg-white border border-[#E5E7EB] border-l-[3px] border-l-[#2563EB] rounded-[12px] rounded-l-none p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-[28px] h-[28px] bg-[#DBEAFE] text-[#1A4A8A] font-bold rounded-full flex items-center justify-center text-[14px]">2</div>
                  <h2 className="text-[16px] font-bold text-[#1C1C1E]">Segure o dedo sobre o link</h2>
                </div>
                <p className="text-[15px] text-[#4B5563] ml-10">Toque no link e mantenha o dedo pressionado por 1 ou 2 segundos. Vai aparecer um menu na tela.</p>
              </div>

              <div className="bg-white border border-[#E5E7EB] border-l-[3px] border-l-[#2563EB] rounded-[12px] rounded-l-none p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-[28px] h-[28px] bg-[#DBEAFE] text-[#1A4A8A] font-bold rounded-full flex items-center justify-center text-[14px]">3</div>
                  <h2 className="text-[16px] font-bold text-[#1C1C1E]">Toque em 'Copiar'</h2>
                </div>
                <p className="text-[15px] text-[#4B5563] ml-10">No menu que abriu, procure a opção 'Copiar link' ou 'Copiar'. Depois volte para o Clareza Digital e cole aqui.</p>
              </div>
            </div>

            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-[12px] p-[14px] mt-3 w-full flex gap-3">
              <Lightbulb size={18} className="text-[#166534] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-[15px] text-[#166534] leading-relaxed">
                <span className="font-bold">Dica:</span> se não conseguir copiar, você pode apenas digitar o que está escrito no link. Qualquer ajuda é válida.
              </p>
            </div>

            <button
              onClick={() => setEtapa('edu3')}
              className="w-full bg-[#1A4A8A] text-white font-bold text-[18px] h-[58px] rounded-[14px] mt-6 hover:bg-[#153b6e] transition-colors"
            >
              Entendi, continuar →
            </button>
          </div>
        )}

        {etapa === 'edu3' && (
          <div className="flex flex-col items-center">
            <div className="w-[64px] h-[64px] bg-[#FEF2F2] rounded-full flex items-center justify-center">
              <ShieldAlert size={30} className="text-[#DC2626]" aria-hidden="true" />
            </div>
            <h1 className="text-[24px] font-bold text-[#1C1C1E] mt-[18px] text-center">3 sinais de link suspeito</h1>
            <p className="text-[16px] text-[#4B5563] mt-2 text-center">
              Veja o que costuma indicar que um link é falso.
            </p>

            <div className="w-full mt-5 space-y-[10px]">
              <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={20} className="text-[#D97706]" aria-hidden="true" />
                  <h2 className="text-[16px] font-bold text-[#1C1C1E]">Nome de banco escrito diferente</h2>
                </div>
                <p className="text-[15px] text-[#4B5563] mb-3">Golpistas usam nomes parecidos: 'bradesco-seguro.com' ou 'itau-acesso.net'. O banco real usa apenas 'bradesco.com.br' ou 'itau.com.br'.</p>
                <div className="grid grid-cols-2 gap-2 text-[13px] font-medium">
                  <div className="bg-[#F0FDF4] text-[#166534] p-2 rounded">bradesco.com.br ✓ Real</div>
                  <div className="bg-[#FEF2F2] text-[#991B1B] p-2 rounded break-all">bradesco-seguro.com ✗ Falso</div>
                </div>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Scissors size={20} className="text-[#D97706]" aria-hidden="true" />
                  <h2 className="text-[16px] font-bold text-[#1C1C1E]">Link muito curto e estranho</h2>
                </div>
                <p className="text-[15px] text-[#4B5563] mb-3">Links como 'bit.ly/3xYZ' ou 'encr.pw/abc' escondem o endereço real. Bancos e governo nunca enviam links assim.</p>
                <div className="bg-[#FEF2F2] text-[#991B1B] p-2 rounded text-[13px] font-medium w-fit">bit.ly/banco123 ✗ Suspeito</div>
              </div>

              <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={20} className="text-[#D97706]" aria-hidden="true" />
                  <h2 className="text-[16px] font-bold text-[#1C1C1E]">A mensagem diz que é urgente</h2>
                </div>
                <p className="text-[15px] text-[#4B5563]">Se a mensagem diz 'clique agora', 'sua conta será bloqueada' ou 'oferta expira hoje', é sinal de golpe. Pare e respire.</p>
              </div>
            </div>

            <button
              onClick={() => setEtapa('campo')}
              className="w-full bg-[#1D6F42] text-white font-bold text-[18px] h-[58px] rounded-[14px] mt-6 hover:bg-[#166534] transition-colors"
            >
              Estou pronta para checar →
            </button>
          </div>
        )}

        {etapa === 'campo' && (
          <div className="flex flex-col items-center">
            <div className="w-[56px] h-[56px] bg-[#EFF6FF] rounded-full flex items-center justify-center mt-2">
              <LinkIcon size={26} className="text-[#2563EB]" aria-hidden="true" />
            </div>
            <h1 className="text-[22px] font-bold text-[#1C1C1E] mt-[14px] text-center">Cole o link aqui</h1>
            <p className="text-[16px] text-[#4B5563] mt-[6px] text-center">
              É o endereço azul da mensagem que você recebeu.
            </p>

            <div className="w-full mt-6">
              {!modoDescricao ? (
                <div>
                  <label htmlFor="link-input" className="block text-[14px] text-[#4B5563] mb-[6px]">Link recebido</label>
                  <input
                    id="link-input"
                    type="text"
                    placeholder="Ex: www.banco-oferta.com.br"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full h-[52px] text-[16px] border-[1.5px] border-[#E5E7EB] rounded-[10px] px-[14px] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="descricao-input" className="block text-[14px] text-[#4B5563] mb-[6px]">Descreva o que você viu no link</label>
                  <textarea
                    id="descricao-input"
                    rows="4"
                    placeholder="Ex: tinha o nome do banco e um número, ou dizia acesse aqui..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="w-full text-[16px] border-[1.5px] border-[#E5E7EB] rounded-[10px] p-[14px] focus:outline-none focus:border-[#2563EB] resize-none"
                  ></textarea>
                </div>
              )}

              {mostrarAjuda && (
                <div className="bg-[#F0F4F8] rounded-[12px] p-4 mt-[10px] animate-in fade-in duration-200">
                  <h3 className="text-[14px] font-bold text-[#1C1C1E] mb-2">Como copiar o link:</h3>
                  <ol className="text-[15px] text-[#4B5563] leading-[1.8] list-decimal ml-4 mb-3">
                    <li>Abra o WhatsApp ou SMS</li>
                    <li>Segure o dedo sobre o link por 2 segundos</li>
                    <li>Toque em 'Copiar link'</li>
                    <li>Volte aqui e cole no campo acima</li>
                  </ol>
                  <button onClick={() => setMostrarAjuda(false)} className="text-[#2563EB] text-[14px] font-medium p-1 -ml-1">
                    Entendi, fechar
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-2 mt-3">
                {!mostrarAjuda && (
                  <button
                    onClick={() => setMostrarAjuda(true)}
                    className="w-full border border-[#2563EB] text-[#2563EB] bg-transparent rounded-[10px] py-3 text-[15px] font-medium"
                    style={{ minHeight: '48px' }}
                  >
                    Não sei como copiar — me ajuda
                  </button>
                )}
                <button
                  onClick={() => { setModoDescricao(!modoDescricao); setMostrarAjuda(false); }}
                  className="w-full border border-[#4B5563] text-[#4B5563] bg-transparent rounded-[10px] py-3 text-[15px] font-medium"
                  style={{ minHeight: '48px' }}
                >
                  {modoDescricao ? 'Cancelar — quero colar o link' : 'Não consigo copiar — vou descrever'}
                </button>
              </div>

              <button
                onClick={analisarLink}
                disabled={link === '' && descricao === ''}
                className="w-full bg-[#1A4A8A] text-white font-bold text-[18px] h-[58px] rounded-[14px] mt-5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#153b6e] transition-colors"
                aria-disabled={link === '' && descricao === ''}
              >
                Checar se é seguro →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerificarLink
