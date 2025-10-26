import { useEffect, useState } from 'react'
import './App.css'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const API_URL = 'https://fakestoreapi.com/products'

// Lista fija que usamos cuando la API falla. Mantengo estos datos sencillos.
const FALLBACK_PRODUCTS = [
  {
    id: 101,
    title: 'Audífonos inalámbricos Noise Canceller',
    price: 2499,
    description:
      'Disfruta de una experiencia de sonido envolvente con cancelación activa de ruido y hasta 24 horas de batería.',
    category: 'audio',
    image:
      'https://images.unsplash.com/photo-1518444028784-87283d1c93ff?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 102,
    title: 'Smartwatch deportivo Pro Fit',
    price: 3199,
    description:
      'Monitoriza tu actividad diaria, tu frecuencia cardiaca y recibe notificaciones inteligentes en tu muñeca.',
    category: 'wearables',
    image:
      'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 103,
    title: 'Laptop ultraligera 14"',
    price: 18999,
    description:
      'Potencia y portabilidad con 16 GB de RAM, 512 GB SSD y pantalla Full HD antirreflejo.',
    category: 'computadoras',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 104,
    title: 'Mouse ergonómico inalámbrico',
    price: 799,
    description:
      'Diseño ergonómico para sesiones largas de trabajo con conectividad Bluetooth y sensor de alta precisión.',
    category: 'accesorios',
    image:
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 105,
    title: 'Cámara mirrorless 4K',
    price: 22999,
    description:
      'Captura imágenes y video en 4K con estabilización óptica y lente intercambiable 18-55 mm.',
    category: 'fotografía',
    image:
      'https://images.unsplash.com/photo-1519183071298-a2962eadcdb2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 106,
    title: 'Bocina inteligente con asistente de voz',
    price: 1599,
    description:
      'Controla tu hogar inteligente, escucha música en alta fidelidad y recibe noticias con comandos de voz.',
    category: 'hogar inteligente',
    image:
      'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=400&q=80',
  },
]

// Obtengo la ruta actual leyendo el hash. Si no existe devuelvo la raíz.
function getCurrentPath() {
  if (typeof window === 'undefined') {
    return '/'
  }

  const hash = window.location.hash.replace('#', '')
  if (!hash) {
    return '/'
  }

  return hash.startsWith('/') ? hash : `/${hash}`
}

// Aseguro que todas las rutas tengan formato con barra inicial.
function normalizePath(path) {
  if (!path) {
    return '/'
  }

  return path.startsWith('/') ? path : `/${path}`
}

function App() {
  // Estado con los productos que muestro en el sitio.
  const [products, setProducts] = useState([])
  // Estado simple para indicar cuando estoy cargando.
  const [loading, setLoading] = useState(true)
  // Estado con un mensaje de error básico.
  const [error, setError] = useState(null)
  // Lista de productos en el carrito.
  const [cartItems, setCartItems] = useState([])
  // Ruta actual que controla qué pantalla mostrar.
  const [currentPath, setCurrentPath] = useState(getCurrentPath())

  // Con esta función cambio la ruta usando el hash.
  const navigate = (path) => {
    if (typeof window === 'undefined') {
      return
    }

    const target = normalizePath(path)
    const actual = getCurrentPath()

    if (target !== actual) {
      window.location.hash = target
    }
  }

  // Cada vez que cambia el hash actualizo el estado para re-renderizar.
  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => {}
    }

    const handleHashChange = () => {
      setCurrentPath(getCurrentPath())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Descargo los productos de la API una vez al montar el componente.
  useEffect(() => {
    const controller = new AbortController()

    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(API_URL, { signal: controller.signal })

        if (!response.ok) {
          throw new Error('No fue posible obtener los productos. Intenta más tarde.')
        }

        const data = await response.json()
        setProducts(data)
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message)
          setProducts((prev) => {
            if (prev.length > 0) {
              return prev
            }
            return FALLBACK_PRODUCTS
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()

    return () => controller.abort()
  }, [])

  // Agrego un producto al carrito. Si ya existe solo aumento la cantidad.
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const foundItem = prevItems.find((item) => item.id === product.id)

      if (foundItem) {
        return prevItems.map((item) => {
          if (item.id === product.id) {
            return { ...item, quantity: item.quantity + 1 }
          }
          return item
        })
      }

      return [
        ...prevItems,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ]
    })
  }

  // Elimino un producto del carrito por id.
  const handleRemoveFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  // Cambio la cantidad manualmente. Si es inválida lo saco del carrito.
  const handleUpdateQuantity = (productId, quantity) => {
    setCartItems((prevItems) => {
      if (Number.isNaN(quantity) || quantity <= 0) {
        return prevItems.filter((item) => item.id !== productId)
      }

      return prevItems.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity }
        }
        return item
      })
    })
  }

  // Limpio el carrito después de pagar.
  const handleClearCart = () => {
    setCartItems([])
  }

  // Según la ruta actual muestro la pantalla correcta.
  const renderCurrentScreen = () => {
    if (currentPath === '/') {
      return (
        <HomePage
          products={products}
          onAddToCart={handleAddToCart}
          loading={loading}
          error={error}
          navigate={navigate}
        />
      )
    }

    if (currentPath === '/products') {
      return (
        <ProductsPage
          products={products}
          onAddToCart={handleAddToCart}
          loading={loading}
          error={error}
          navigate={navigate}
        />
      )
    }

    if (currentPath.startsWith('/products/')) {
      const parts = currentPath.split('/')
      const productId = parts[2] || ''

      return (
        <ProductDetailPage
          products={products}
          productId={productId}
          onAddToCart={handleAddToCart}
          loading={loading}
          error={error}
          navigate={navigate}
        />
      )
    }

    if (currentPath === '/cart') {
      return (
        <CartPage
          cartItems={cartItems}
          onRemoveFromCart={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          navigate={navigate}
        />
      )
    }

    if (currentPath === '/checkout') {
      return (
        <ProtectedRoute isAllowed={cartItems.length > 0} redirectTo="/cart" navigate={navigate}>
          <CheckoutPage cartItems={cartItems} onClearCart={handleClearCart} navigate={navigate} />
        </ProtectedRoute>
      )
    }

    return <NotFoundPage navigate={navigate} />
  }

  const pageContent = renderCurrentScreen()

  return (
    <Layout
      cartItems={cartItems}
      navigate={navigate}
      onRemoveFromCart={handleRemoveFromCart}
      onUpdateQuantity={handleUpdateQuantity}
      currentPath={currentPath}
    >
      {pageContent}
    </Layout>
  )
}

export default App
