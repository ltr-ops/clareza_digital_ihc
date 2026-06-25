import { useState } from 'react'
import { ShieldCheck, X, Headphones } from 'lucide-react'

const BoasVindas = ({ onEntrar, isLogin }) => {
  // Modal abre automaticamente na 1ª visita (sem conta criada ainda)
  const [modalAberto, setModalAberto] = useState(!isLogin)

  const abrirModal  = () => setModalAberto(true)
  const fecharModal = () => setModalAberto(false)

  return (
    <div
      className="animate-fadeIn flex flex-col items-center justify-center px-6"
      style={{ height: '100dvh', backgroundColor: '#F0F4F8', position: 'relative' }}
    >

      {/* ════════════════════════════════
          MODAL DE ÁUDIO
      ════════════════════════════════ */}
      {modalAberto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Áudio explicando como usar o Clareza Digital"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.60)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '24px 16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '420px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            {/* ── Cabeçalho ── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 20px',
                borderBottom: '0.5px solid #E5E7EB',
              }}
            >
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1C1C1E', margin: 0 }}>
                  Como funciona o Clareza Digital
                </h2>
                <p style={{ fontSize: '14px', color: '#4B5563', margin: '3px 0 0' }}>
                  Ouça a apresentação do aplicativo
                </p>
              </div>
              <button
                onClick={fecharModal}
                aria-label="Fechar áudio e continuar"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#F3F4F6',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <X size={18} color="#374151" aria-hidden="true" />
              </button>
            </div>

            {/* ── Área do áudio ── */}
            <div
              style={{
                padding: '28px 24px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              {/* Ícone decorativo */}
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: '#DCFCE7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Headphones size={36} color="#16A34A" aria-hidden="true" />
              </div>

              <p style={{ fontSize: '15px', color: '#4B5563', textAlign: 'center', lineHeight: '1.55', margin: 0 }}>
                Toque em <strong style={{ color: '#1C1C1E' }}>▶ Play</strong> para ouvir como o aplicativo funciona e como ele pode te proteger de golpes.
              </p>

              {/* Player nativo — não inicia automaticamente (sem autoPlay) */}
              <audio
                controls
                preload="metadata"
                aria-label="Áudio explicando como usar o Clareza Digital"
                style={{ width: '100%', borderRadius: '10px' }}
              >
                <source src="/como-funciona.mp3" type="audio/mpeg" />
                Seu navegador não suporta o player de áudio.
              </audio>
            </div>

            {/* ── Rodapé do modal ── */}
            <div style={{ padding: '0 20px 20px' }}>
              <button
                onClick={fecharModal}
                aria-label="Fechar áudio e continuar para o aplicativo"
                style={{
                  width: '100%',
                  minHeight: '54px',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '17px',
                  border: 'none',
                  borderRadius: '14px',
                  cursor: 'pointer',
                }}
              >
                Entendi, continuar →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════
          CONTEÚDO PRINCIPAL DA TELA
      ════════════════════════════════ */}

      {/* Escudo */}
      <div
        className="flex items-center justify-center rounded-full mb-6"
        style={{ width: '100px', height: '100px', backgroundColor: '#DCFCE7' }}
      >
        <ShieldCheck size={56} style={{ color: '#16A34A' }} aria-hidden="true" />
      </div>

      {/* Nome */}
      <h1
        className="font-bold text-center"
        style={{ fontSize: '32px', color: '#1C1C1E', lineHeight: '1.2' }}
      >
        Clareza Digital
      </h1>

      {/* Subtítulo */}
      <p
        className="text-center mt-2"
        style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.5' }}
      >
        Seu assistente de segurança digital.
      </p>

      {/* Botão "Ver como funciona" */}
      <button
        onClick={abrirModal}
        aria-label="Ouvir áudio explicando como funciona o aplicativo"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '24px',
          padding: '10px 20px',
          backgroundColor: 'transparent',
          border: '1.5px solid #2563EB',
          borderRadius: '12px',
          color: '#2563EB',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          minHeight: '44px',
        }}
      >
        <Headphones size={16} aria-hidden="true" />
        Ver como funciona
      </button>

      {/* Botão principal */}
      <button
        onClick={onEntrar}
        aria-label={isLogin ? 'Entrar no aplicativo' : 'Criar sua conta no aplicativo'}
        className="w-full font-bold text-white rounded-2xl transition-all hover:opacity-90 active:scale-[0.98] mt-6"
        style={{
          backgroundColor: '#16A34A',
          fontSize: '20px',
          minHeight: '60px',
          maxWidth: '320px',
        }}
      >
        {isLogin ? 'Entrar' : 'Criar conta'}
      </button>

    </div>
  )
}

export default BoasVindas
