import Cart from '../components/Cart.jsx'

function CartPage({ cartItems, onRemoveFromCart, onUpdateQuantity, navigate }) {
  return (
    <div className="page">
      <header className="section__header">
        <div>
          <h2>Resumen del carrito</h2>
          <p>Revisa tus productos antes de completar la compra.</p>
        </div>
      </header>
      <Cart
        items={cartItems}
        onRemove={onRemoveFromCart}
        onUpdateQuantity={onUpdateQuantity}
        navigate={navigate}
      />
    </div>
  )
}

export default CartPage
