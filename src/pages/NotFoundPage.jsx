function NotFoundPage({ navigate }) {
  return (
    <div className="page">
      <div className="state state--empty" role="status">
        <h2>Página no encontrada</h2>
        <p>La sección que buscas no está disponible.</p>
        <button type="button" onClick={() => navigate('/')} className="state__action">
          Ir al inicio
        </button>
      </div>
    </div>
  )
}

export default NotFoundPage
