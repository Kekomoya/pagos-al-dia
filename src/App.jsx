import { useState } from "react";
import "./App.css";
const obtenerMesActual = () => {
  const ahora = new Date();
  return `${ahora.getFullYear()}-${ahora.getMonth() + 1}`;
};

const pagosIniciales = [
  { id: 1, nombre: "Electricidad", fecha: "2024-04-30", monto: 25000, tipo: "Personal", pagado: false },
  { id: 2, nombre: "Arriendo", fecha: "2024-05-05", monto: 450000, tipo: "Empresa", pagado: false },
  { id: 3, nombre: "Internet", fecha: "2024-05-16", monto: 20000, tipo: "Personal", pagado: false },
];

export default function App() {
  const [pagos, setPagos] = useState(pagosIniciales);
  useEffect(() => {
    const mesGuardado = localStorage.getItem("mes");
    const mesActual = obtenerMesActual();
  
    let pagosGuardados = JSON.parse(localStorage.getItem("pagos")) || pagosIniciales;
  
    if (mesGuardado !== mesActual) {
      pagosGuardados = pagosGuardados.filter(p => !p.pagado);
      localStorage.setItem("mes", mesActual);
    }
  
    setPagos(pagosGuardados);
  }, []);
  useEffect(() => {
    localStorage.setItem("pagos", JSON.stringify(pagos));
  }, [pagos]);
  
  
  const [fechaEditando, setFechaEditando] = useState(null);

  const togglePagado = (id) => {
    setPagos(pagos.map(p => p.id === id ? { ...p, pagado: !p.pagado } : p));
  };

  const cambiarFecha = (id, nuevaFecha) => {
    setPagos(pagos.map(p => p.id === id ? { ...p, fecha: nuevaFecha } : p));
    setFechaEditando(null);
  };

  const estadoPago = (pago) => {
    if (pago.pagado) return "🟢 Pagado";
    const hoy = new Date();
    const fechaPago = new Date(pago.fecha);
    if (fechaPago < hoy) return "🔴 Atrasado";
    const diff = (fechaPago - hoy) / (1000 * 60 * 60 * 24);
    return diff <= 7 ? "🟡 Próximo" : "🔘 Futuro";
  };
  const [nuevoGasto, setNuevoGasto] = useState("");

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
    <button onClick={() => {
  const nuevo = {
    id: Date.now(),
    nombre: nuevoGasto,
    fecha: new Date().toISOString().split("T")[0],
    tipo: "Personal",
    pagado: false
  };
  setPagos([...pagos, nuevo]);
  setNuevoGasto("");
}}>
  Agregar gasto
</button>

    <input
  type="text"
  placeholder="Nombre del gasto"
  value={nuevoGasto}
  onChange={(e) => setNuevoGasto(e.target.value)}
/>

      <h1>📋 Pagos al Día</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {pagos.map(pago => (
          <li key={pago.id} style={{ marginBottom: 10, padding: 10, border: "1px solid #ccc", borderRadius: 8 }}>
<strong>{estadoPago(pago)}</strong> — {pago.nombre} — Vence: {pago.fecha}
<br /><button onClick={() => setPagos(pagos.filter(p => p.id !== pago.id))} style={{ marginLeft: 10 }}>
  🗑️ Eliminar
</button>

            <button onClick={() => togglePagado(pago.id)}>✓ Marcar como {pago.pagado ? "no pagado" : "pagado"}</button>
            <button onClick={() => setFechaEditando(pago.id)} style={{ marginLeft: 10 }}>✏️ Editar fecha</button>

            {fechaEditando === pago.id && (
              <div>
                <input
                  type="date"
                  defaultValue={pago.fecha}
                  onChange={(e) => cambiarFecha(pago.id, e.target.value)}
                />
                <button onClick={() => setFechaEditando(null)}>Cancelar</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
