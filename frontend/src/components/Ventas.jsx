import { useEffect, useState } from 'react';

import {
  getProductos,
  registrarVenta
} from '../services/api';

export default function Ventas() {

  const user = JSON.parse(localStorage.getItem('user'));

  const [productos, setProductos] = useState([]);

  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [clienteId, setClienteId] = useState('');

  const [message, setMessage] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    loadProductos();
  }, []);

  async function loadProductos() {

    try {

      const result = await getProductos();

      setProductos(result.data);

    } catch (err) {

      setError('Error cargando productos.');

    } finally {

      setLoading(false);
    }
  }

  function addToCart(producto) {

    const existing = cart.find(
      item => item.id_producto === producto.id_producto
    );

    if (existing) {

      setCart(
        cart.map(item =>
          item.id_producto === producto.id_producto
            ? {
              ...item,
              cantidad: item.cantidad + 1
            }
            : item
        )
      );

    } else {

      setCart([
        ...cart,
        {
          ...producto,
          cantidad: 1
        }
      ]);
    }
  }

  function updateCantidad(id_producto, cantidad) {

    if (cantidad < 1) return;

    setCart(
      cart.map(item =>
        item.id_producto === id_producto
          ? {
            ...item,
            cantidad: Number(cantidad)
          }
          : item
      )
    );
  }

  function removeFromCart(id_producto) {

    setCart(
      cart.filter(
        item => item.id_producto !== id_producto
      )
    );
  }

  const total = cart.reduce(
    (acc, item) =>
      acc + item.precio_venta * item.cantidad,
    0
  );

  async function handleVenta() {

    setError('');
    setMessage('');

    if (cart.length === 0) {

      setError('Debe agregar productos.');

      return;
    }

    if (!clienteId) {

      setError('Debe seleccionar cliente.');

      return;
    }

    try {

      const payload = {

        id_cliente: Number(clienteId),

        id_usuario: user.id_usuario,

        productos: cart.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad
        }))
      };

      const result = await registrarVenta(payload);

      setMessage(
        `Venta registrada. Comprobante: ${result.data.comprobante}`
      );

      setCart([]);

      loadProductos();

    } catch (err) {

      setError(
        err.message || 'Error registrando venta.'
      );
    }
  }

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(
      search.toLowerCase()
    )
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Módulo de Ventas
          </h1>

          <p className="text-gray-500 mt-1">
            Bienvenido {user.nombre}
          </p>

        </div>

        {/* ALERTAS */}
        {message && (
          <div className="mb-4 bg-emerald-100 border border-emerald-300 text-emerald-700 px-4 py-3 rounded-xl">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* PRODUCTOS */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-5">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-semibold text-gray-800">
                Productos
              </h2>

              <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 text-sm"
              />
            </div>

            {loading ? (

              <p>Cargando productos...</p>

            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                {filteredProductos.map(producto => (

                  <div
                    key={producto.id_producto}
                    className="border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-all"
                  >

                    <h3 className="font-semibold text-gray-800">
                      {producto.nombre}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {producto.categoria}
                    </p>

                    <div className="mt-3 space-y-1">

                      <p className="text-emerald-600 font-bold">
                        Bs. {producto.precio_venta}
                      </p>

                      <p className={`text-sm ${producto.stock_actual <= producto.stock_minimo
                          ? 'text-red-500'
                          : 'text-gray-500'
                        }`}>
                        Stock: {producto.stock_actual}
                      </p>

                    </div>

                    <button
                      onClick={() => addToCart(producto)}
                      className="w-full mt-4 bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-xl transition-all"
                    >
                      Agregar
                    </button>

                  </div>
                ))}

              </div>
            )}

          </div>

          {/* CARRITO */}
          <div className="bg-white rounded-2xl shadow p-5">

            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              Venta Actual
            </h2>

            {/* CLIENTE */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-gray-600 mb-2">
                Cliente
              </label>

              <input
                type="number"
                placeholder="ID Cliente"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />

            </div>

            {/* ITEMS */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto">

              {cart.length === 0 && (
                <p className="text-gray-400 text-sm">
                  No hay productos.
                </p>
              )}

              {cart.map(item => (

                <div
                  key={item.id_producto}
                  className="border border-gray-200 rounded-xl p-3"
                >

                  <div className="flex justify-between">

                    <h3 className="font-medium text-gray-800">
                      {item.nombre}
                    </h3>

                    <button
                      onClick={() =>
                        removeFromCart(item.id_producto)
                      }
                      className="text-red-500"
                    >
                      <i className="bi bi-trash"></i>
                    </button>

                  </div>

                  <div className="mt-3 flex items-center gap-3">

                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) =>
                        updateCantidad(
                          item.id_producto,
                          e.target.value
                        )
                      }
                      className="w-20 border border-gray-300 rounded-lg px-2 py-1"
                    />

                    <p className="text-sm text-gray-500">
                      Bs. {item.precio_venta}
                    </p>

                  </div>

                  <p className="mt-2 text-emerald-600 font-semibold">
                    Bs. {
                      item.precio_venta * item.cantidad
                    }
                  </p>

                </div>
              ))}

            </div>

            {/* TOTAL */}
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>Bs. {total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleVenta}
                className="w-full mt-5 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-all"
              >
                Confirmar Venta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}