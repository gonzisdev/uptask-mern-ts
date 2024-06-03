import { useState } from "react"
import { NewPasswordToken } from "../../components/auth/NewPasswordToken"
import { NewPasswordFormComponent } from "../../components/auth/NewPasswordForm"
import { ConfirmToken } from "../../types"

export const NewPasswordView = () => {

    const [token, setToken] = useState<ConfirmToken['token']>('')
    const [isValidToken, setIsValidToken] = useState(false)

  return (
    <>
        <h1 className="text-5xl font-black text-white">Reestablecer contraseña</h1>
        <p className="text-2xl font-light text-white mt-5">
            Introduce el código que recibiste {""}
            <span className=" text-fuchsia-500 font-bold">por email</span>
        </p>
        {!isValidToken ? 
            <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken} /> : 
            <NewPasswordFormComponent token={token} />
        }
    </>
  )
}
