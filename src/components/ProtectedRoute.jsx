import { useEffect } from 'react'

function ProtectedRoute({ isAllowed, redirectTo, navigate, children }) {
  useEffect(() => {
    if (!isAllowed) {
      navigate(redirectTo)
    }
  }, [isAllowed, redirectTo, navigate])

  if (!isAllowed) {
    return (
      <div className="state state--error" role="alert">
        <p>Para continuar necesitas al menos un producto en tu carrito.</p>
        <button type="button" onClick={() => navigate('/products')} className="state__action">
          Explorar productos
        </button>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
