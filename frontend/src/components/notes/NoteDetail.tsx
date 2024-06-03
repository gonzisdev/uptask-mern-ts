import { useMemo } from "react"
import { useAuth } from "../../hooks/useAuth"
import type { Note } from "../../types"
import { formatDate } from "../../utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteNote } from "../../api/NoteAPI"
import { toast } from "react-toastify"
import { useLocation, useParams } from "react-router-dom"

type NoteDetailProps = {
    note: Note
}

export const NoteDetail = ({note} : NoteDetailProps) => {

    const { data, isLoading } = useAuth()
    const canDelete = useMemo(() => data?._id === note.createdBy._id, [data])
    
    const params = useParams()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)

    const projectId = params.projectId!
    const taskId = queryParams.get('viewTask')!

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
        }
    })

    if (isLoading) return 'Cargando...'

  return (
    <div className="p-3 flex justify-between items-center">
        <div>
            <p>
                {note.content} | {note.createdBy.name}
            </p>
            <p className="text-xs text-slate-500">
                {formatDate(note.createdAt)}
            </p>
        </div>
        {canDelete && (
            <button
                type="button"
                className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold transition-colors"
                onClick={() => mutate({projectId, taskId, noteId: note._id})}
            >
                Eliminar
            </button>
        )}
    </div>
  )
}
