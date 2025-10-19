import { useMemo, useRef, useState } from 'react'
import { formatCurrency } from '../utils/formatters.js'

function CheckoutPage({ cartItems, onClearCart, navigate }) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingOrder, setPendingOrder] = useState(null)
  const formRef = useRef(null)

  const total = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems],
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const orderData = {
      name: formData.get('name')?.trim(),
      address: formData.get('address')?.trim(),
      email: formData.get('email')?.trim(),
      paymentMethod: formData.get('paymentMethod'),
    }

    setPendingOrder(orderData)
    setShowConfirmation(true)
  }

  const handleCloseConfirmation = () => {
    setShowConfirmation(false)
  }

  const handleConfirmPurchase = () => {
    setShowConfirmation(false)

    navigate('/')

    setTimeout(() => {
      onClearCart()
      if (formRef.current) {
        formRef.current.reset()
      }
    }, 0)
  }

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
        <form ref={formRef} onSubmit={handleSubmit}>
          <label>
            Nombre completo
            <input name="name" type="text" required />
          </label>
          <label>
            Dirección
            <input name="address" type="text" required />
          </label>
          <label>
            Correo electrónico
            <input name="email" type="email" required />
          </label>
          <label>
            Método de pago
            <select name="paymentMethod" required>
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
      {showConfirmation && pendingOrder && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="checkout-confirmation-title">
          <div className="modal__content">
            <h4 id="checkout-confirmation-title">¿Deseas finalizar tu compra?</h4>
            <p>
              {pendingOrder.name ? `Hola ${pendingOrder.name}, ` : ''}
              tu pedido por un total de {formatCurrency(total)} será enviado a {pendingOrder.address}.
            </p>
            <p>Confirma para completar el proceso o cancela si deseas revisar tus datos.</p>
            <div className="modal__actions">
              <button type="button" className="button button--secondary" onClick={handleCloseConfirmation}>
                Revisar datos
              </button>
              <button type="button" className="button" onClick={handleConfirmPurchase}>
                Confirmar compra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutPage
