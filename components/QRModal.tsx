'use client'

import { QRCodeCanvas } from 'qrcode.react'
import { X, Download, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  url: string
  username: string
  onClose: () => void
}

export default function QRModal({ url, username, onClose }: Props) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    toast.success('Link copied!')
  }

  const handleDownload = () => {
    // QRCodeCanvas renders to a <canvas>; find it in the wrapper div
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `deelink-${username}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass rounded-2xl p-6 w-full max-w-sm flex flex-col items-center gap-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>

        <div className="text-center">
          <h3 className="text-white font-bold">Your QR Code</h3>
          <p className="text-slate-500 text-xs mt-0.5">/{username}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-xl shadow-black/40">
          <QRCodeCanvas
            id="qr-canvas"
            value={url}
            size={180}
            bgColor="#ffffff"
            fgColor="#0f0f1a"
            level="H"
            includeMargin={false}
          />
        </div>

        <p className="text-slate-600 text-xs text-center max-w-[200px] truncate">{url}</p>

        <div className="flex gap-2 w-full">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-300 border border-white/10 hover:border-white/20 hover:text-white rounded-xl transition-colors"
          >
            <Copy size={13} />
            Copy link
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors"
          >
            <Download size={13} />
            Download
          </button>
        </div>
      </div>
    </div>
  )
}
