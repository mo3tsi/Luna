import type { ReactNode } from 'react'

interface BottomSheetProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export default function BottomSheet({ open, title, onClose, children }: BottomSheetProps) {
  return (
    <div
      className={`fixed inset-0 z-20 transition-opacity duration-200 ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close date details"
        className="absolute inset-0 h-full w-full bg-plum-950/35"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute bottom-0 left-0 right-0 mx-auto max-h-[80vh] max-w-2xl overflow-y-auto rounded-t-2xl bg-cream-50 p-5 shadow-2xl transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-plum-200" />
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl text-plum-900">{title}</h2>
          <button type="button" onClick={onClose} className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Close
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </section>
    </div>
  )
}
