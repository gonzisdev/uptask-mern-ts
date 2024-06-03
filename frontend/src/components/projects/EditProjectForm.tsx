import { Link, useNavigate } from "react-router-dom"
import type { Project, ProjectFormData } from "../../types"
import { useForm } from "react-hook-form"
import { ProjectForm } from "./ProjectForm"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProject } from "../../api/ProjectAPI"
import { toast } from "react-toastify"

type EditProjectFormProps = {
    data: ProjectFormData
    projectId : Project['_id']
}

export const EditProjectForm = ({data, projectId} : EditProjectFormProps ) => {

    const initialValues : ProjectFormData = {
        projectName: data.projectName,
        clientName: data.clientName,
        description: data.description
    }

    const { register, handleSubmit, formState: {errors} } = useForm({defaultValues: initialValues})
    const navigate = useNavigate()

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['projects']})
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]})
            toast.success(data)
            navigate('/')
        }
    })

    const handleForm = (formData : ProjectFormData) => {
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }

  return (
    <>
        <h1 className="text-5xl font-black">Editar proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Usa el siguiente formulario para editar el proyecto</p>
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
                    value="Guardar cambios"
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                />
            </form>
        </div>
    </>
  )
}
