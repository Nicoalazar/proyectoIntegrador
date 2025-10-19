import { formatCurrency } from '../utils/formatters.js'

function CheckoutPage({ cartItems, onClearCart, navigate }) {
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <div className="page checkout">
      <header className="section__header">
        <div>
          <h2>Checkout</h2>
          <p>Completa tus datos para finalizar la compra.</p>
        </div>
      </header>
      <section className="checkout__summary">
        <h3>Resumen de la orden</h3>
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <span>
                {item.title}
                {' '}
                ×
                {' '}
                {item.quantity}
              </span>
              <strong>{formatCurrency(item.price * item.quantity)}</strong>
            </li>
          ))}
        </ul>
        <p className="checkout__total">Total a pagar: {formatCurrency(total)}</p>
      </section>
      <section className="checkout__form">
        <h3>Datos de envío</h3>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onClearCart()
            navigate('/')
          }}
        >
          <label>
            Nombre completo
            <input type="text" required />
          </label>
          <label>
            Dirección
            <input type="text" required />
          </label>
          <label>
            Correo electrónico
            <input type="email" required />
          </label>
          <label>
            Método de pago
            <select required>
              <option value="">Selecciona una opción</option>
              <option value="card">Tarjeta de crédito</option>
              <option value="transfer">Transferencia</option>
              <option value="cash">Pago en efectivo</option>
            </select>
          </label>
          <button type="submit" className="checkout__submit">
            Confirmar pedido
          </button>
        </form>
      </section>
    </div>
  )
}

export default CheckoutPage
