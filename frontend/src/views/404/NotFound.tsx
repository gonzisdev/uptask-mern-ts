import { Link } from "react-router-dom"

export const NotFound = () => {
  return (
    <>
        <h1 className="font-black text-center text-4xl text-white">Página no encontrada</h1>
        <p className="mt-10 text-center text-white">
            Tal vez quieras volver a {' '}
            <Link className="text-fuchsia-500 hover:text-fuchsia-600" to={'/'}>proyectos</Link>
        </p>
    </>
  )
}
