import logo from "./assets/logo-nlw-expert.svg"
import { NewNoteCard } from "./components/new-note-card.tsx"
import { NoteCard } from "./components/note-card.tsx"

const note = {
  date: new Date(),
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
}

export function App() {

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <img src={logo} alt="NLW expert" />
      <form className="w-full">
        <input
          className="w-full bg-transparent text-3xl font-semibold tracking-tighter outline-none placeholder:text-slate-500"
          type="text"
          placeholder="Busque em suas notas..."
        />
      </form>
      <div className="h-px bg-slate-700" />
      <div className="grid grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard />
        <NoteCard
          note={note}
        />
      </div>
    </div>
  )
}

