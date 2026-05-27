export default function ClienteDashboard() {

    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="p-8">

            <h1 className="text-3xl font-bold text-gray-800">
                Bienvenido, {user.nombre}
            </h1>

            <div className="mt-6 bg-white rounded-2xl shadow p-6">

                <p>
                    <strong>Nombre:</strong> {user.nombre} {user.apellido}
                </p>

                <p>
                    <strong>Correo:</strong> {user.correo}
                </p>

                <p>
                    <strong>Rol:</strong> {user.rol}
                </p>

            </div>

        </div>
    );
}