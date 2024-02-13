import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { ChangeEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from 'sonner'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

const newNoteCardFormValidationSchema = zod.object({
  content: zod.string().min(1)
})

type NewNoteCardFormData = zod.infer<typeof newNoteCardFormValidationSchema>

export const NewNoteCard = ({ onNoteCreated }: NewNoteCardProps) => {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState<boolean>(true)
  const newNote = useForm<NewNoteCardFormData>({
    resolver: zodResolver(newNoteCardFormValidationSchema)
  })

  const { register, handleSubmit, reset } = newNote

  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const hasValue = event.target.value !== ""
    if (!hasValue) {
      setShouldShowOnboarding(true)
    }
  }

  function handleSaveNote({ content }: NewNoteCardFormData) {
    onNoteCreated(content)
    reset()
    toast.success("Nota criada com sucesso!")
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 p-5 gap-3 text-left overflow-hidden outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none overflow-hidden">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>
          <form onSubmit={handleSubmit(handleSaveNote)} className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>
              {
                shouldShowOnboarding ? (
                  <p className="text-sm leading-6 text-slate-400">
                    Comece <button className="text-lime-400 hover:underline">gravando uma nota</button> em áudio ou se preferir <button onClick={handleStartEditor} className="text-lime-400 hover:underline">utilize apenas texto</button>.
                  </p>
                ) : (
                  <textarea
                    {...register("content")}
                    autoFocus
                    className="text-sm leading-6 text-slate-400 bg-transparent outline-none resize-none flex-1"
                    onChange={handleContentChange}
                  />
                )
              }
            </div>
            <button
              className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
              type="submit"
            >
              Salvar nota
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}