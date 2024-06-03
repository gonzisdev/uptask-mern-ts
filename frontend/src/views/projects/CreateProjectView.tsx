import { Link, useNavigate } from "react-router-dom"
import type { ProjectFormData } from "../../types"
import { useForm } from "react-hook-form"
import { ProjectForm } from "../../components/projects/ProjectForm"
import { useMutation } from "@tanstack/react-query"
import { createProject } from "../../api/ProjectAPI"
import { toast } from "react-toastify"

export const CreateProjectView = () => {

    const initialValues : ProjectFormData = {
        projectName: '',
        clientName: '',
        description: ''
    }

    const { register, handleSubmit, formState: {errors} } = useForm({defaultValues: initialValues})
    const navigate = useNavigate()

    const { mutate } = useMutation({
        mutationFn: createProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            navigate('/')
        }
    })

    const handleForm = (formData : ProjectFormData) => mutate(formData)

  return (
    <>
        <h1 className="text-5xl font-black">Crear proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Usa el siguiente formulario para crear un proyecto</p>
        <nav className="my-5">
            <Link
                className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold transition-colors"
                to={"/"}
            >Volver a proyectos</Link>
        </nav>
        <div className="max-w-3xl mx-auto">
            <form 
                className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                onSubmit={handleSubmit(handleForm)}
                noValidate
            >
                <ProjectForm 
                    register={register}
                    errors={errors}
                />
                <input 
                    type="submit" 
                    value="Crear proyecto"
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                />
            </form>
        </div>
    </>
  )
}
