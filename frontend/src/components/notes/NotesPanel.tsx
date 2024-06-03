import { AddNoteForm } from "./AddNoteForm"
import type { Task } from "../../types"
import { NoteDetail } from "./NoteDetail"

type NotesPanelProps = {
    notes: Task['notes']
}

export const NotesPanel = ({notes} : NotesPanelProps) => {
  return (
    <>
        <AddNoteForm />
        <div className="divide-y divide-gray-100 mt-7">
            {notes.length ? (
                <>
                    <p className="font-bold text-lg text-slate-500 my-3">Notas:</p>
                    {notes.map(note => (
                        <NoteDetail key={note._id} note={note}/>
                    ))}
                </>
            ) : <p className="text-gray-500 text-center pt-3">No hay notas</p>}
        </div>
    </>
  )
}
