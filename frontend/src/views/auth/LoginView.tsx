import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import type { UserLoginForm } from "../../types"
import { ErrorMessage } from "../../components/ErrorMessage"
import { autenticateUser } from "../../api/AuthAPI"
import { toast } from "react-toastify"

export const LoginView = () => {
    const initialValues: UserLoginForm = {
        email: '',
        password: '',
    }
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })
    const navigate = useNavigate()
    const { mutate } = useMutation({
        mutationFn: autenticateUser,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            navigate('/')
        }
    })

    const handleLogin = (formData : UserLoginForm) => mutate(formData)

    return (
        <>
        	<h1 className="text-5xl font-black text-white">Iniciar sesión</h1>
			<p className="text-2xl font-light text-white mt-5">
				Gestiona tus proyectos {""}
				<span className=" text-fuchsia-500 font-bold">iniciando sesión</span>
			</p>
            <form
                onSubmit={handleSubmit(handleLogin)}
                className="space-y-8 p-10 mt-10 bg-white"
                noValidate
            >
                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                    >Email</label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        className="w-full p-3  border-gray-300 border"
                        {...register("email", {
                            required: "El email es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Email no válido",
                            },
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                    >Contraseña</label>

                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full p-3  border-gray-300 border"
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    value='Iniciar sesión'
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-xl cursor-pointer"
                />
            </form>
            <nav className="mt-10 flex flex-col space-y-4">
                    <Link 
                        className="text-center text-gray-300 font-normal"
                        to={'/auth/register'}
                    >¿No tienes una cuenta? Regístrate</Link>
                    <Link 
                        className="text-center text-gray-300 font-normal"
                        to={'/auth/forgot-password'}
                    >¿Olvidaste tu contraseña?</Link>
            </nav>
        </>
    )
}