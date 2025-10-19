import { useMemo } from 'react'
import { formatCurrency } from '../utils/formatters.js'

function ProductDetailPage({ products = [], productId, onAddToCart, loading, error, navigate }) {
  const product = useMemo(
    () => products.find((item) => String(item.id) === String(productId)),
    [products, productId],
  )

  if (loading && !product) {
    return (
      <div className="state state--loading" role="status">
        <div className="spinner" aria-hidden="true" />
        <p>Cargando detalle del producto…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="state state--error" role="alert">
        <p>No pudimos recuperar la información del producto.</p>
        <p className="state__details">{error}</p>
        <button type="button" onClick={() => navigate('/products')} className="state__action">
          Volver al catálogo
        </button>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="state state--empty" role="status">
        <p>El producto que buscas no está disponible.</p>
        <button type="button" onClick={() => navigate('/products')} className="state__action">
          Explorar otros productos
        </button>
      </div>
    )
  }

  return (
    <article className="page product-detail">
      <button type="button" className="product-detail__back" onClick={() => navigate('/products')}>
        ← Volver
      </button>
      <div className="product-detail__media">
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>
      <div className="product-detail__info">
        <h2>{product.title}</h2>
        <p className="product-detail__category">{product.category}</p>
        <p className="product-detail__description">{product.description}</p>
        <p className="product-detail__price">{formatCurrency(product.price)}</p>
        <button type="button" className="product-detail__cta" onClick={() => onAddToCart(product)}>
          Agregar al carrito
        </button>
      </div>
    </article>
  )
}

export default ProductDetailPage
