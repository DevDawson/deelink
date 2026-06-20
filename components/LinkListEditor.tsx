'use client'

import { useState } from 'react'
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Link as LinkType, LinkType as LType } from '@/lib/types'
import { artistApi } from '@/lib/api'
import toast from 'react-hot-toast'
import {
  GripVertical, Trash2, Eye, EyeOff, ExternalLink, Loader, Plus,
  PlayCircle, Music, Camera, MessageCircle, Video, Link, Pencil, Check, X, MousePointerClick,
} from 'lucide-react'
import clsx from 'clsx'

const TYPE_ICONS: Record<LType, React.ReactNode> = {
  youtube:   <PlayCircle   size={13} className="text-red-400" />,
  spotify:   <Music        size={13} className="text-green-400" />,
  audiomack: <Music        size={13} className="text-orange-400" />,
  instagram: <Camera       size={13} className="text-pink-400" />,
  whatsapp:  <MessageCircle size={13} className="text-emerald-400" />,
  tiktok:    <Video        size={13} className="text-slate-400" />,
  custom:    <Link         size={13} className="text-slate-500" />,
}

function SortableLink({
  link,
  onToggle,
  onDelete,
  onUpdate,
}: {
  link: LinkType
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onUpdate: (id: number, title: string, url: string) => Promise<void>
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id })

  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(link.title)
  const [editUrl, setEditUrl]     = useState(link.url)
  const [saving, setSaving]       = useState(false)

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }

  const handleSave = async () => {
    if (!editTitle.trim() || !editUrl.trim()) return
    setSaving(true)
    await onUpdate(link.id, editTitle.trim(), editUrl.trim())
    setSaving(false)
    setEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(link.title)
    setEditUrl(link.url)
    setEditing(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'bg-white/5 border border-white/8 rounded-xl transition-all',
        !link.is_active && 'opacity-40',
        isDragging && 'shadow-2xl shadow-violet-900/30',
      )}
    >
      {editing ? (
        <div className="p-3 space-y-2">
          <input
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Link title"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <input
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            placeholder="URL"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 text-xs font-medium bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? <Loader size={11} className="animate-spin" /> : <Check size={11} />}
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <X size={11} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button
            {...attributes}
            {...listeners}
            className="text-slate-700 hover:text-slate-400 cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
          >
            <GripVertical size={14} />
          </button>

          <div className="flex-shrink-0">{TYPE_ICONS[link.type]}</div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{link.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-slate-600 truncate max-w-[160px]">{link.url}</p>
              {link.click_count > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-slate-500 flex-shrink-0">
                  <MousePointerClick size={9} />
                  {link.click_count}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-white/8 transition-colors"
              title="Edit"
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={() => onToggle(link.id)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-white/8 transition-colors"
              title={link.is_active ? 'Hide' : 'Show'}
            >
              {link.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-600 hover:text-white hover:bg-white/8 transition-colors"
            >
              <ExternalLink size={12} />
            </a>
            <button
              onClick={() => onDelete(link.id)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface Props {
  initialLinks: LinkType[]
  canAdd: boolean
  maxLinks: number
}

export default function LinkListEditor({ initialLinks, canAdd, maxLinks }: Props) {
  const [links, setLinks] = useState(initialLinks)
  const [saving, setSaving] = useState(false)
  const [addForm, setAddForm] = useState({ title: '', url: '' })
  const [showAdd, setShowAdd] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = links.findIndex((l) => l.id === active.id)
    const newIndex = links.findIndex((l) => l.id === over.id)
    const reordered = arrayMove(links, oldIndex, newIndex)
    setLinks(reordered)
    try {
      await artistApi.reorderLinks(reordered.map((l) => l.id))
    } catch {
      setLinks(links)
      toast.error('Failed to reorder links.')
    }
  }

  const handleToggle = async (id: number) => {
    const link = links.find((l) => l.id === id)
    if (!link) return
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, is_active: !l.is_active } : l)))
    try {
      await artistApi.updateLink(id, { is_active: !link.is_active })
    } catch {
      setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, is_active: link.is_active } : l)))
      toast.error('Failed to update link.')
    }
  }

  const handleDelete = async (id: number) => {
    const link = links.find((l) => l.id === id)
    if (!link) return
    const prev = [...links]
    setLinks((l) => l.filter((x) => x.id !== id))
    try {
      await artistApi.deleteLink(id)
      toast.success(`"${link.title}" deleted.`)
    } catch {
      setLinks(prev)
      toast.error('Failed to delete link.')
    }
  }

  const handleUpdate = async (id: number, title: string, url: string) => {
    const prev = [...links]
    try {
      const res = await artistApi.updateLink(id, { title, url })
      setLinks((l) => l.map((x) => (x.id === id ? res.data.data : x)))
      toast.success('Link updated.')
    } catch {
      setLinks(prev)
      toast.error('Failed to update link.')
      throw new Error()
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await artistApi.createLink({ title: addForm.title, url: addForm.url })
      setLinks((prev) => [...prev, res.data.data])
      setAddForm({ title: '', url: '' })
      setShowAdd(false)
      toast.success('Link added!')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(msg || 'Failed to add link.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {links.length === 0 && !showAdd && (
            <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-xl">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Link size={18} className="text-slate-600" />
              </div>
              <p className="text-slate-500 text-sm font-medium">No links yet</p>
              <p className="text-slate-700 text-xs mt-0.5">Add your first link below</p>
            </div>
          )}
          {links.map((link) => (
            <SortableLink
              key={link.id}
              link={link}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </SortableContext>
      </DndContext>

      {showAdd ? (
        <form
          onSubmit={handleAdd}
          className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5 mt-2"
        >
          <input
            type="text"
            required
            autoFocus
            placeholder="Link title (e.g. New Single – Mapendo)"
            value={addForm.title}
            onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <input
            type="url"
            required
            placeholder="https://..."
            value={addForm.url}
            onChange={(e) => setAddForm({ ...addForm, url: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {saving && <Loader size={13} className="animate-spin" />}
              {saving ? 'Adding…' : 'Add link'}
            </button>
            <button
              type="button"
              onClick={() => { setShowAdd(false); setAddForm({ title: '', url: '' }) }}
              className="px-4 text-sm text-slate-500 hover:text-white border border-white/10 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : canAdd ? (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-white/10 rounded-xl text-slate-500 hover:border-violet-500/50 hover:text-violet-400 transition-colors text-sm font-medium mt-2"
        >
          <Plus size={15} />
          Add link
        </button>
      ) : (
        <div className="flex items-center justify-between text-sm p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl mt-2">
          <p className="text-amber-400 text-xs font-medium">
            You&apos;ve reached the {maxLinks}-link limit on your plan.
          </p>
          <a href="/dashboard/upgrade" className="text-violet-400 hover:underline text-xs flex-shrink-0 ml-3">
            Upgrade →
          </a>
        </div>
      )}
    </div>
  )
}
