import { useEffect, useRef, useState } from 'react';

import {
  getProductos,
  getClientes,
  registrarVenta
} from '../services/api';

const API_URL = 'http://localhost:8000';

export default function Ventas() {

  const user = JSON.parse(localStorage.getItem('user'));

  const [productos, setProductos] = useState([]);

  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [clientes, setClientes] = useState([]);
  const [clienteSearch, setClienteSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  const [message, setMessage] = useState('');

  const [error, setError] = useState('');

  const clienteRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (clienteRef.current && !clienteRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    loadProductos();
    loadClientes();
  }, []);

  async function loadClientes() {
    try {
      const result = await getClientes();
      if (result.success) {
        setClientes(result.data);
      }
    } catch (err) {
      console.error('Error cargando clientes', err);
    }
  }

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

    if (!selectedCliente) {

      setError('Debe seleccionar cliente.');

      return;
    }

    try {

      const payload = {

        id_cliente: Number(selectedCliente.id_cliente),

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

                    {producto.imagen ? (
                      <div className="w-full h-32 rounded-lg overflow-hidden mb-3 bg-gray-100">
                        <img
                          src={`${API_URL}/${producto.imagen}`}
                          alt={producto.nombre}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-32 rounded-lg mb-3 bg-gray-100 flex items-center justify-center">
                        <i className="bi bi-image text-gray-400 text-3xl"></i>
                      </div>
                    )}

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
            <div className="mb-5 relative" ref={clienteRef}>

              <label className="block text-sm font-medium text-gray-600 mb-2">
                Cliente
              </label>

              <input
                type="text"
                placeholder="Buscar cliente por nombre..."
                value={selectedCliente ? `${selectedCliente.nombre} ${selectedCliente.apellido}` : clienteSearch}
                onChange={(e) => {
                  setSelectedCliente(null);
                  setClienteSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3"
              />

              {showDropdown && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {clientes
                    .filter(c =>
                      !clienteSearch ||
                      c.nombre.toLowerCase().includes(clienteSearch.toLowerCase()) ||
                      c.apellido.toLowerCase().includes(clienteSearch.toLowerCase())
                    )
                    .map(c => (
                      <button
                        key={c.id_cliente}
                        type="button"
                        onClick={() => {
                          setSelectedCliente(c);
                          setClienteSearch('');
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium text-gray-800">{c.nombre} {c.apellido}</span>
                        <span className="text-xs text-gray-400 ml-2">({c.correo})</span>
                      </button>
                    ))}
                  {clientes.length === 0 && (
                    <p className="px-4 py-3 text-sm text-gray-400">No hay clientes registrados</p>
                  )}
                </div>
              )}

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