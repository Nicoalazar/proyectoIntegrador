import ProductList from '../components/ProductList.jsx'

// Página inicial con productos destacados.
function HomePage({ products = [], onAddToCart, loading, error, navigate }) {
  const featuredProducts = products.slice(0, 4)

  return (
    <div className="page">
      <section className="hero">
        <div>
          <h2>Bienvenido a Tech Market</h2>
          <p>
            Descubre la mejor selección de productos tecnológicos, accesorios y gadgets.
            Explora nuestro catálogo y lleva tu experiencia digital al siguiente nivel.
          </p>
          <button type="button" onClick={() => navigate('/products')} className="hero__cta">
            Ver catálogo completo
          </button>
        </div>
        <div className="hero__highlight" aria-hidden="true">
          <span>Novedades</span>
          <p>Ofertas exclusivas cada semana.</p>
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <h3>Productos destacados</h3>
          <button type="button" onClick={() => navigate('/products')} className="section__link">
            Ver todos
          </button>
        </div>
        <ProductList
          products={featuredProducts}
          onAddToCart={onAddToCart}
          loading={loading}
          error={error}
          navigate={navigate}
        />
      </section>
    </div>
  )
}

export default HomePage
