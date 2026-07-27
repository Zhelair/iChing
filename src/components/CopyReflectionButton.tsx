import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function CopyReflectionButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch { /* Clipboard access can be unavailable in a hardened browser context. */ }
  }
  return <button type="button" className="button-text copy-reflection" onClick={() => void copy()}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied' : 'Copy text'}</button>
}
