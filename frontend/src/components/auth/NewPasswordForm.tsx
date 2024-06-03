import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import type { ConfirmToken, NewPasswordForm } from "../../types"
import { ErrorMessage } from "../ErrorMessage"
import { useMutation } from "@tanstack/react-query"
import { updatePasswordWithToken } from "../../api/AuthAPI"
import { toast } from "react-toastify"

type NewPasswordFormComponentProps =  {
    token: ConfirmToken['token']
}

export const NewPasswordFormComponent = ({token} : NewPasswordFormComponentProps) => {

    const navigate = useNavigate()
    const initialValues : NewPasswordForm = {
        password: '',
        password_confirmation: '',
    }
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: updatePasswordWithToken,
        onError: (error) => {
            toast.error(error.message)
        }, 
        onSuccess: (data) => {
            toast.error(data)
            reset()
            navigate('/auth/login')
        }
    })

    const handleNewPassword = (formData : NewPasswordForm) => {
        const data = {
            formData,
            token
        }
        mutate(data)
    }

    const password = watch('password');

    return (
        <>
            <form
                onSubmit={handleSubmit(handleNewPassword)}
                className="space-y-8 p-10  bg-white mt-10"
                noValidate
            >

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
                            minLength: {
                                value: 8,
                                message: 'La contraseña debe de tener mínimo 8 caracteres'
                            }
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                    >Repetir contraseña</label>

                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Repetir contraseña"
                        className="w-full p-3  border-gray-300 border"
                        {...register("password_confirmation", {
                            required: "RRepetir la contraseña es obligatorio",
                            validate: value => value === password || 'Las contraseñas no son iguales'
                        })}
                    />

                    {errors.password_confirmation && (
                        <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    value='Guardar contraseña'
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                />
            </form>
        </>
    )
}