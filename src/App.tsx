import { ChangeEvent, useState } from "react"
import logo from "./assets/logo-nlw-expert.svg"
import { NewNoteCard } from "./components/new-note-card.tsx"
import { NoteCard } from "./components/note-card.tsx"

interface Note {
  id: string
  date: Date
  content: string
}

export function App() {
  const [search, setSearch] = useState<string>("")
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesFromLocalStorage = localStorage.getItem("notes")

    if (notesFromLocalStorage) {
      return JSON.parse(notesFromLocalStorage)
    }

    return []
  })

  function onNoteCreated(content: string) {
    const newNote: Note = {
      id: crypto.randomUUID(),
      date: new Date(),
      content
    }

    const notesArray = [newNote, ...notes]
    setNotes([newNote, ...notes])
    localStorage.setItem("notes", JSON.stringify(notesArray))
  }

  function onNoteDeleted(id: string) {
    const newNotesList = notes.filter(note => note.id !== id)
    setNotes(newNotesList)
    localStorage.setItem("notes", JSON.stringify(newNotesList))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value
    setSearch(query)
  }

  const filteredNotes = search !== ''
    ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    : notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="NLW expert" />
      <form className="w-full">
        <input
          className="w-full bg-transparent text-3xl font-semibold tracking-tighter outline-none placeholder:text-slate-500"
          type="text"
          placeholder="Busque em suas notas..."
          onChange={handleSearch}
        />
      </form>
      <div className="h-px bg-slate-700" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => {
          return (
            <NoteCard
              onNoteDeleted={onNoteDeleted}
              key={note.id}
              note={note}
            />)
        })}
      </div>
    </div>
  )
}

