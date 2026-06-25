import { useState } from 'react'
import { ShieldCheck, X, Play } from 'lucide-react'

const BoasVindas = ({ onEntrar, isLogin }) => {
  // Modal de vídeo: abre automaticamente na 1ª visita (sem conta)
  const [modalAberto, setModalAberto] = useState(!isLogin)

  const fecharModal = () => setModalAberto(false)

  return (
    <div
      className="animate-fadeIn flex flex-col items-center justify-center px-6"
      style={{
        height: '100dvh',
        backgroundColor: '#F0F4F8',
        position: 'relative',
      }}
    >
      {/* ── Modal de vídeo ── */}
      {modalAberto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vídeo explicando como usar o Clareza Digital"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '20px',
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
            {/* Cabeçalho do modal */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '0.5px solid #E5E7EB',
              }}
            >
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1C1C1E', margin: 0 }}>
                  Como usar o Clareza Digital
                </h2>
                <p style={{ fontSize: '14px', color: '#4B5563', margin: '2px 0 0' }}>
                  Veja como o aplicativo pode te ajudar
                </p>
              </div>
              <button
                onClick={fecharModal}
                aria-label="Fechar vídeo e continuar"
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

            {/* Área do vídeo */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%', /* 16:9 */
                backgroundColor: '#000',
              }}
            >
              {/*
                INSTRUÇÃO PARA O DESENVOLVEDOR:
                Substitua o src abaixo pelo link embed do seu vídeo.

                Para YouTube, use o formato:
                https://www.youtube.com/embed/SEU_ID_AQUI

                Para vídeo próprio hospedado, use a tag <video> abaixo (descomente).
              */}
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Como usar o Clareza Digital"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />

              {/*
                ALTERNATIVA — vídeo próprio (descomente e preencha o src):
                <video
                  controls
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  aria-label="Vídeo tutorial do Clareza Digital"
                >
                  <source src="/seu-video.mp4" type="video/mp4" />
                  Seu navegador não suporta vídeo.
                </video>
              */}
            </div>

            {/* Rodapé do modal */}
            <div style={{ padding: '16px 20px' }}>
              <button
                onClick={fecharModal}
                aria-label="Fechar vídeo e continuar para o aplicativo"
                style={{
                  width: '100%',
                  minHeight: '52px',
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

      {/* ── Conteúdo principal da tela ── */}

      {/* Ícone do Escudo */}
      <div
        className="flex items-center justify-center rounded-full mb-6"
        style={{
          width: '100px',
          height: '100px',
          backgroundColor: '#DCFCE7',
        }}
      >
        <ShieldCheck size={56} style={{ color: '#16A34A' }} aria-hidden="true" />
      </div>

      {/* Nome do Aplicativo */}
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

      {/* Botão "Ver como funciona" — sempre visível */}
      <button
        onClick={() => setModalAberto(true)}
        aria-label="Ver vídeo explicando como funciona o aplicativo"
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
        <Play size={16} aria-hidden="true" />
        Ver como funciona
      </button>

      {/* Botão Principal */}
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
