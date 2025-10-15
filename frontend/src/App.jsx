import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">¡Hola Mundo!</h1>
        <p className="text-gray-600 mb-6">
          Bienvenido a tu proyecto React con TailwindCSS.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300">
          Comenzar
        </button>
      </div>
    </div>  
  )
}

export default App
