import { useState, useEffect } from 'react'
import { X, CheckCircle, Phone } from 'lucide-react'

export default function PareERespire({ onVoltar }) {
  const [respiraInspire, setRespiraInspire] = useState(true)
  const [dicaIdx, setDicaIdx] = useState(0)

  const dicas = [
    { emoji: '🏦', texto: 'Nenhum banco real pede sua senha por mensagem.' },
    { emoji: '💪', texto: 'Dinheiro perdido pode ser recuperado. Fique com calma.' },
    { emoji: '📞', texto: 'Ligue para um familiar antes de qualquer decisão.' },
  ]

  // Animação de respiração
  useEffect(() => {
    const intervaloResp = setInterval(() => {
      setRespiraInspire(prev => !prev)
    }, 4000)
    return () => clearInterval(intervaloResp)
  }, [])

  // Rotação de dicas
  useEffect(() => {
    const intervaloDica = setInterval(() => {
      setDicaIdx(prev => (prev + 1) % dicas.length)
    }, 6000)
    return () => clearInterval(intervaloDica)
  }, [dicas.length])

  const dicaAtual = dicas[dicaIdx]

  return (
    <div 
      className="animate-fadeIn flex flex-col justify-between p-4" 
      style={{ backgroundColor: '#F0F4F8', height: '100dvh', overflow: 'hidden' }}
    >
      {/* Topo: Botão fechar */}
      <div className="flex justify-end shrink-0">
        <button
          onClick={onVoltar}
          aria-label="Fechar modo calma e voltar"
          className="flex items-center gap-1 px-3 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          style={{ color: '#4B5563', fontSize: '16px', minHeight: '44px' }}
        >
          <X size={20} aria-hidden="true" />
          Fechar
        </button>
      </div>

      {/* Título e Texto */}
      <div className="shrink-0 text-center px-2">
        <h1 className="font-bold mb-2" style={{ fontSize: '24px', color: '#1A4A8A', lineHeight: '1.2' }}>
          Calma. Você está em segurança.
        </h1>
        <p style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.4' }}>
          Nenhum golpista pode te forçar a fazer nada. Você tem tempo.
        </p>
      </div>

      {/* Círculo de respiração */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 py-2">
        <div
          className="flex items-center justify-center rounded-full animate-breathe"
          style={{
            width: '160px',
            height: '160px',
            backgroundColor: '#93C5FD',
            boxShadow: '0 0 40px rgba(147, 197, 253, 0.5)',
          }}
        >
          <span
            className="font-semibold text-white text-center transition-opacity duration-700"
            style={{ fontSize: '20px' }}
          >
            {respiraInspire ? 'Inspire...' : 'Expire...'}
          </span>
        </div>
      </div>

      {/* Cartão de Dica Dinâmico */}
      <div className="shrink-0 mb-4 px-2">
        <div
          className="flex items-center gap-3 p-4 rounded-2xl bg-white shadow-sm transition-all duration-500 ease-in-out"
          style={{ border: '1px solid #E5E7EB', minHeight: '88px' }}
          role="status"
          aria-live="polite"
        >
          <span className="text-2xl shrink-0" aria-hidden="true">{dicaAtual.emoji}</span>
          <p className="font-medium" style={{ fontSize: '15px', color: '#374151', lineHeight: '1.4' }}>
            {dicaAtual.texto}
          </p>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="shrink-0 flex flex-col gap-3">
        <button
          onClick={onVoltar}
          aria-label="Já me sinto melhor, voltar para onde eu estava"
          className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl font-bold text-white transition-all"
          style={{ backgroundColor: '#1A4A8A', fontSize: '17px', minHeight: '52px' }}
        >
          <CheckCircle size={20} aria-hidden="true" fill="white" />
          Já me sinto melhor. Voltar.
        </button>
        <a
          href="tel:00000000000"
          aria-label="Ligar para um familiar de confiança"
          className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl font-semibold transition-all"
          style={{
            backgroundColor: '#E5E7EB',
            color: '#374151',
            fontSize: '16px',
            minHeight: '48px',
            textDecoration: 'none'
          }}
        >
          <Phone size={18} aria-hidden="true" />
          Falar com familiar
        </a>
      </div>
    </div>
  )
}
