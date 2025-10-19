import { useCallback, useEffect, useMemo, useState } from 'react'
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
const FALLBACK_PRODUCTS = [
  {
    id: 101,
    title: 'Audífonos inalámbricos Noise Canceller',
    price: 2499,
    description: 'Disfruta de una experiencia de sonido envolvente con cancelación activa de ruido y hasta 24 horas de batería.',
    category: 'audio',
    image: 'https://images.unsplash.com/photo-1518444028784-87283d1c93ff?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 102,
    title: 'Smartwatch deportivo Pro Fit',
    price: 3199,
    description: 'Monitoriza tu actividad diaria, tu frecuencia cardiaca y recibe notificaciones inteligentes en tu muñeca.',
    category: 'wearables',
    image: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 103,
    title: 'Laptop ultraligera 14"',
    price: 18999,
    description: 'Potencia y portabilidad con 16 GB de RAM, 512 GB SSD y pantalla Full HD antirreflejo.',
    category: 'computadoras',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 104,
    title: 'Mouse ergonómico inalámbrico',
    price: 799,
    description: 'Diseño ergonómico para sesiones largas de trabajo con conectividad Bluetooth y sensor de alta precisión.',
    category: 'accesorios',
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 105,
    title: 'Cámara mirrorless 4K',
    price: 22999,
    description: 'Captura imágenes y video en 4K con estabilización óptica y lente intercambiable 18-55 mm.',
    category: 'fotografía',
    image: 'https://images.unsplash.com/photo-1519183071298-a2962eadcdb2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 106,
    title: 'Bocina inteligente con asistente de voz',
    price: 1599,
    description: 'Controla tu hogar inteligente, escucha música en alta fidelidad y recibe noticias con comandos de voz.',
    category: 'hogar inteligente',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=400&q=80',
  },
]

function getCurrentPath() {
  if (typeof window === 'undefined') {
    return '/'
  }
  const hash = window.location.hash.replace('#', '')
  if (!hash) return '/'
  return hash.startsWith('/') ? hash : `/${hash}`
}

function normalizePath(path) {
  if (!path) return '/'
  return path.startsWith('/') ? path : `/${path}`
}

function matchRoute(pattern, currentPath) {
  if (pattern === '*') {
    return { matches: true, params: {} }
  }

  const patternSegments = pattern.split('/').filter(Boolean)
  const currentSegments = currentPath.split('/').filter(Boolean)

  if (patternSegments.length === 0 && currentSegments.length === 0) {
    return { matches: true, params: {} }
  }

  if (patternSegments.length !== currentSegments.length) {
    return { matches: false, params: {} }
  }

  const params = {}

  for (let index = 0; index < patternSegments.length; index += 1) {
    const patternSegment = patternSegments[index]
    const currentSegment = currentSegments[index]

    if (patternSegment.startsWith(':')) {
      params[patternSegment.slice(1)] = decodeURIComponent(currentSegment)
    } else if (patternSegment !== currentSegment) {
      return { matches: false, params: {} }
    }
  }

  return { matches: true, params }
}

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [currentPath, setCurrentPath] = useState(getCurrentPath())

  const navigate = useCallback((path) => {
    if (typeof window === 'undefined') return
    const target = normalizePath(path)
    if (target === getCurrentPath()) return
    window.location.hash = target
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return () => {}
    const handleHashChange = () => {
      setCurrentPath(getCurrentPath())
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function fetchProducts() {
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
          setProducts((prev) => (prev.length > 0 ? prev : FALLBACK_PRODUCTS))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()

    return () => controller.abort()
  }, [])

  const handleAddToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existingProduct = prev.find((item) => item.id === product.id)
      if (existingProduct) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ]
    })
  }, [])

  const handleRemoveFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const handleUpdateQuantity = useCallback((productId, quantity) => {
    setCartItems((prev) => {
      if (Number.isNaN(quantity) || quantity <= 0) {
        return prev.filter((item) => item.id !== productId)
      }
      return prev.map((item) =>
        item.id === productId
          ? { ...item, quantity }
          : item,
      )
    })
  }, [])

  const handleClearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const routes = useMemo(
    () => [
      {
        path: '/',
        render: () => (
          <HomePage
            products={products}
            onAddToCart={handleAddToCart}
            loading={loading}
            error={error}
            navigate={navigate}
          />
        ),
      },
      {
        path: '/products',
        render: () => (
          <ProductsPage
            products={products}
            onAddToCart={handleAddToCart}
            loading={loading}
            error={error}
            navigate={navigate}
          />
        ),
      },
      {
        path: '/products/:productId',
        render: (params) => (
          <ProductDetailPage
            products={products}
            productId={params.productId}
            onAddToCart={handleAddToCart}
            loading={loading}
            error={error}
            navigate={navigate}
          />
        ),
      },
      {
        path: '/cart',
        render: () => (
          <CartPage
            cartItems={cartItems}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            navigate={navigate}
          />
        ),
      },
      {
        path: '/checkout',
        render: () => (
          <ProtectedRoute
            isAllowed={cartItems.length > 0}
            redirectTo="/cart"
            navigate={navigate}
          >
            <CheckoutPage cartItems={cartItems} onClearCart={handleClearCart} navigate={navigate} />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        render: () => <NotFoundPage navigate={navigate} />,
      },
    ],
    [cartItems, error, handleAddToCart, handleClearCart, handleRemoveFromCart, handleUpdateQuantity, loading, navigate, products],
  )

  const matchedRoute = useMemo(() => {
    for (const route of routes) {
      const { matches, params } = matchRoute(route.path, currentPath)
      if (matches) {
        return { route, params }
      }
    }
    return null
  }, [currentPath, routes])

  const content = matchedRoute ? matchedRoute.route.render(matchedRoute.params) : routes[routes.length - 1].render({})

  return (
    <Layout
      cartItems={cartItems}
      navigate={navigate}
      onRemoveFromCart={handleRemoveFromCart}
      onUpdateQuantity={handleUpdateQuantity}
      currentPath={currentPath}
    >
      {content}
    </Layout>
  )
}

export default App
