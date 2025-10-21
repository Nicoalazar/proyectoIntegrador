import Cart from './Cart.jsx'

function Layout({ children, cartItems = [], navigate, onRemoveFromCart, onUpdateQuantity, currentPath }) {
  return (
    <div className="layout">
      <header className="layout__header">
        <div>
          <h1 className="layout__title" onClick={() => navigate('/')}>Tech Market</h1>
          <p className="layout__subtitle">Tu tienda en línea de confianza</p>
        </div>
        <nav className="layout__nav" aria-label="Navegación principal">
          <button
            type="button"
            className={currentPath === '/' ? 'layout__nav-link layout__nav-link--active' : 'layout__nav-link'}
            onClick={() => navigate('/')}
          >
            Inicio
          </button>
          <button
            type="button"
            className={currentPath.startsWith('/products') ? 'layout__nav-link layout__nav-link--active' : 'layout__nav-link'}
            onClick={() => navigate('/products')}
          >
            Productos
          </button>
          <button
            type="button"
            className={currentPath === '/cart' ? 'layout__nav-link layout__nav-link--active' : 'layout__nav-link'}
            onClick={() => navigate('/cart')}
          >
            Carrito
          </button>
          <button
            type="button"
            className={currentPath === '/checkout' ? 'layout__nav-link layout__nav-link--active' : 'layout__nav-link'}
            onClick={() => navigate('/checkout')}
          >
            Checkout
          </button>
        </nav>
      </header>

      <main className="layout__main">
        <section className="layout__content" aria-live="polite">
          {children}
        </section>
        {cartItems.length > 0 && (
          <aside className="layout__sidebar" aria-label="Carrito">
            <Cart
              items={cartItems}
              onRemove={onRemoveFromCart}
              onUpdateQuantity={onUpdateQuantity}
              navigate={navigate}
              compact
            />
          </aside>
        )}
      </main>

      <footer className="layout__footer">
        <p>© {new Date().getFullYear()} Tech Market. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default Layout
