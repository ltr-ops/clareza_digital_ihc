import { ShieldCheck } from 'lucide-react'

const BoasVindas = ({ onEntrar, isLogin }) => {
  return (
    <div
      className="animate-fadeIn flex flex-col items-center justify-center px-6"
      style={{
        height: '100dvh',
        backgroundColor: '#F0F4F8',
      }}
    >
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

      {/* Botão Principal */}
      <button
        onClick={onEntrar}
        aria-label={isLogin ? 'Entrar no aplicativo' : 'Criar sua conta no aplicativo'}
        className="w-full font-bold text-white rounded-2xl transition-all hover:opacity-90 active:scale-[0.98] mt-12"
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
