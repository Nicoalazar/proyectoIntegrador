const dolarPrice = 1450

// Convierto un precio en dólares a pesos argentinos en formato amigable.
export function formatCurrency(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(value * dolarPrice)
}
