import { Link as RouterLink } from 'react-router-dom'

const UnauthorizedPage = () => {
  return (
    <div 
      className="p-8 max-w-[600px] mx-auto text-center"
    >
      <h1 className="mb-4 text-3xl font-bold text-red-500">Acesso Negado</h1>
      <p className="text-lg mb-6 text-gray-700">
        Você não tem permissão para acessar esta página. Entre em contato com o administrador se acredita que isso é um erro.
      </p>
      <RouterLink to="/">
        <button className="btn-primary">Voltar para Início</button>
      </RouterLink>
    </div>
  )
}

export default UnauthorizedPage 