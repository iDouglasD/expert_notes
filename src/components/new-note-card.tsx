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
  content: zod.string().min(1),
  isRecording: zod.boolean()
})

type NewNoteCardFormData = zod.infer<typeof newNoteCardFormValidationSchema>

let speechRecognition: SpeechRecognition | null

export const NewNoteCard = ({ onNoteCreated }: NewNoteCardProps) => {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState<boolean>(true)
  const newNote = useForm<NewNoteCardFormData>({
    resolver: zodResolver(newNoteCardFormValidationSchema),
    defaultValues: {
      isRecording: false
    }
  })

  const { register, handleSubmit, reset, setValue, watch } = newNote
  const isRecording = watch("isRecording")

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
    setShouldShowOnboarding(true)
    toast.success("Nota criada com sucesso!")
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable = "webkitSpeechRecognition" in window || "SpeechRecognition" in window
    if (!isSpeechRecognitionAPIAvailable) {
      toast.error("Seu navegador não suporta a funcionalidade de gravação de voz.")
      return
    }

    setValue("isRecording", true)
    setShouldShowOnboarding(false)

    const speechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new speechRecognitionAPI()
    speechRecognition.lang = "pt-BR"
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcript = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setValue("content", transcript)
    }
    speechRecognition.onerror = (event) => {
      console.error(event)
    }
    speechRecognition.start()
  }

  function handleStopRecording() {
    setValue("isRecording", false)
    speechRecognition?.stop()
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
        <Dialog.Content className="fixed md:left-1/2 inset-0 md:inset-auto md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none overflow-hidden">
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
                    Comece <button type="button" onClick={handleStartRecording} className="text-lime-400 hover:underline">gravando uma nota</button> em áudio ou se preferir <button type="button" onClick={handleStartEditor} className="text-lime-400 hover:underline">utilize apenas texto</button>.
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
            {!isRecording && (
              <button
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
                type="submit"
              >
                Salvar nota
              </button>
            )}
          </form>
          {isRecording && (
            <button
              onClick={handleStopRecording}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
              type="button"
            >
              <div className="size-3 rounded-full bg-red-500 animate-pulse" />
              Gravando! (clique p/ interromper)
            </button>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}