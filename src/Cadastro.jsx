import { useState } from 'react'
import { ShieldCheck, AlertTriangle } from 'lucide-react'

const Cadastro = ({ onConcluir }) => {
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [erroNome, setErroNome] = useState(false)
  const [erroIdade, setErroIdade] = useState(false)

  const handleContinuar = () => {
    let valido = true
    if (!nome.trim()) {
      setErroNome(true)
      valido = false
    } else {
      setErroNome(false)
    }

    if (!idade.trim()) {
      setErroIdade(true)
      valido = false
    } else {
      setErroIdade(false)
    }

    if (valido) {
      localStorage.setItem('clareza_digital_nome', nome)
      localStorage.setItem('clareza_digital_idade', idade)
      localStorage.setItem('clareza_digital_conta', 'true')
      onConcluir()
    }
  }

  return (
    <div
      className="animate-fadeIn flex flex-col px-6 pb-8"
      style={{
        minHeight: '100dvh',
        backgroundColor: '#F0F4F8',
      }}
    >
      {/* Cabeçalho */}
      <div className="flex flex-col items-center justify-center pt-12 pb-8">
        <div
          className="flex items-center justify-center rounded-full mb-4"
          style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#DCFCE7',
          }}
        >
          <ShieldCheck size={40} style={{ color: '#16A34A' }} aria-hidden="true" />
        </div>
        <h1
          className="font-bold text-center"
          style={{ fontSize: '28px', color: '#1C1C1E', lineHeight: '1.2' }}
        >
          Criar sua conta
        </h1>
        <p
          className="text-center mt-3"
          style={{ fontSize: '17px', color: '#4B5563', lineHeight: '1.5' }}
        >
          Precisamos de algumas informações para personalizar sua experiência.
        </p>
      </div>

      {/* Formulário */}
      <div className="flex-1 flex flex-col gap-6 w-full max-w-sm mx-auto">
        {/* Campo Nome */}
        <div className="flex flex-col gap-2">
          <label htmlFor="nome" className="font-bold" style={{ fontSize: '18px', color: '#1C1C1E' }}>
            Qual é o seu nome?
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value)
              if (erroNome) setErroNome(false)
            }}
            placeholder="Digite seu nome"
            className="w-full rounded-2xl border-2 px-4 outline-none transition-colors"
            style={{
              height: '60px',
              fontSize: '18px',
              borderColor: erroNome ? '#EF4444' : '#D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#1C1C1E',
            }}
            aria-invalid={erroNome}
            aria-describedby={erroNome ? "erro-nome" : undefined}
          />
          {erroNome && (
            <div id="erro-nome" className="flex items-center gap-2" style={{ color: '#EF4444' }}>
              <AlertTriangle size={20} />
              <span className="font-medium" style={{ fontSize: '16px' }}>Digite seu nome.</span>
            </div>
          )}
        </div>

        {/* Campo Idade */}
        <div className="flex flex-col gap-2">
          <label htmlFor="idade" className="font-bold" style={{ fontSize: '18px', color: '#1C1C1E' }}>
            Qual é a sua idade?
          </label>
          <input
            id="idade"
            type="number"
            inputMode="numeric"
            value={idade}
            onChange={(e) => {
              setIdade(e.target.value)
              if (erroIdade) setErroIdade(false)
            }}
            placeholder="Digite sua idade"
            className="w-full rounded-2xl border-2 px-4 outline-none transition-colors"
            style={{
              height: '60px',
              fontSize: '18px',
              borderColor: erroIdade ? '#EF4444' : '#D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#1C1C1E',
            }}
            aria-invalid={erroIdade}
            aria-describedby={erroIdade ? "erro-idade" : undefined}
          />
          {erroIdade && (
            <div id="erro-idade" className="flex items-center gap-2" style={{ color: '#EF4444' }}>
              <AlertTriangle size={20} />
              <span className="font-medium" style={{ fontSize: '16px' }}>Digite sua idade.</span>
            </div>
          )}
        </div>
      </div>

      {/* Botão Principal */}
      <div className="pt-8 flex justify-center w-full max-w-sm mx-auto mt-auto">
        <button
          onClick={handleContinuar}
          className="w-full font-bold text-white rounded-2xl transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            backgroundColor: '#16A34A',
            fontSize: '20px',
            minHeight: '60px',
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

export default Cadastro
