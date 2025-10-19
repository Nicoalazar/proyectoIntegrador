import { formatCurrency } from '../utils/formatters.js'

function Cart({ items = [], onRemove, onUpdateQuantity, compact = false, navigate }) {
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className={compact ? 'cart cart--compact' : 'cart'}>
      <div className="cart__header">
        <h2 className="cart__title">Carrito</h2>
        <span className="cart__summary">{totalItems} productos</span>
      </div>
      {items.length === 0 ? (
        <p className="cart__empty">Tu carrito está vacío. Agrega productos para comenzar.</p>
      ) : (
        <ul className="cart__list">
          {items.map((item) => (
            <li key={item.id} className="cart__item">
              <div className="cart__item-info">
                <img src={item.image} alt={item.title} className="cart__item-image" loading="lazy" />
                <div>
                  <h3 className="cart__item-title">{item.title}</h3>
                  <p className="cart__item-price">{formatCurrency(item.price)}</p>
                </div>
              </div>
              <div className="cart__item-actions">
                <label className="cart__quantity-label">
                  Cantidad
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => onUpdateQuantity(item.id, Number(event.target.value))}
                  />
                </label>
                <button type="button" className="cart__remove" onClick={() => onRemove(item.id)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="cart__footer">
        <p className="cart__total">
          Total:
          {' '}
          <span>{formatCurrency(totalPrice)}</span>
        </p>
        <button
          type="button"
          className="cart__checkout"
          onClick={() => navigate('/checkout')}
          disabled={items.length === 0}
        >
          Ir al checkout
        </button>
      </div>
    </div>
  )
}

export default Cart
