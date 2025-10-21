import ProductList from '../components/ProductList.jsx'

// Listado general de productos.
function ProductsPage({ products = [], onAddToCart, loading, error, navigate }) {
  return (
    <div className="page">
      <header className="section__header">
        <div>
          <h2>Catálogo de productos</h2>
          <p>Selecciona tus artículos favoritos y agrégalos a tu carrito.</p>
        </div>
      </header>
      <ProductList
        products={products}
        onAddToCart={onAddToCart}
        loading={loading}
        error={error}
        navigate={navigate}
      />
    </div>
  )
}

export default ProductsPage
