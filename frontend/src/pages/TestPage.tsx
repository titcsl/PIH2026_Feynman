import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle2, AlertCircle, Lock, Unlock, Activity, Wifi, WifiOff } from "lucide-react"

const API_URI = "https://backend.whatsgoinon.space"

type BackendStatus = "checking" | "online" | "offline"

function BackendBadge({ status }: { status: BackendStatus }) {
  const cfg = {
    checking: { icon: <Loader2 size={13} className="animate-spin" />, label: "Checking backend...", cls: "border-slate-600 text-slate-400 bg-slate-900/60" },
    online: { icon: <Wifi size={13} />, label: "backend.whatsgoinon.space — LIVE", cls: "border-emerald-600/50 text-emerald-400 bg-emerald-950/40" },
    offline: { icon: <WifiOff size={13} />, label: "Backend unreachable", cls: "border-red-600/50   text-red-400   bg-red-950/40" },
  }[status]

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono ${cfg.cls}`}>
      {cfg.icon}
      {cfg.label}
    </div>
  )
}

interface FormState { loading: boolean; result: string | null; error: string | null }

function ResponseView({ state, color }: { state: FormState; color: string }) {
  const isError = color === "red"
  return (
    <div className={`mt-4 rounded-md border p-3 bg-slate-950/60 ${isError ? "border-red-500/40" : "border-emerald-500/40"}`}>
      <div className="flex items-center gap-2 mb-2">
        {isError
          ? <AlertCircle size={14} className="text-red-400" />
          : <CheckCircle2 size={14} className="text-emerald-400" />}
        <span className={`text-xs font-mono ${isError ? "text-red-400" : "text-emerald-400"}`}>
          {isError ? "Error" : "Response"}
        </span>
      </div>
      <pre className="text-[10px] text-slate-300 font-mono overflow-auto whitespace-pre-wrap break-words">
        {state.error ?? state.result}
      </pre>
    </div>
  )
}

function EncryptForm() {
  const [qubitId, setQubitId] = useState("")
  const [payload, setPayload] = useState("")
  const [state, setState] = useState<FormState>({ loading: false, result: null, error: null })

  const handleEncrypt = async () => {
    if (!qubitId.trim() || !payload.trim()) {
      setState({ loading: false, result: null, error: "ID and Text are required." })
      return
    }
    setState({ loading: true, result: null, error: null })
    try {
      const res = await fetch(`${API_URI}/encrypt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: qubitId, data: payload }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? "Encryption failed")
      setState({ loading: false, result: JSON.stringify(data, null, 2), error: null })
    } catch (err: any) {
      setState({ loading: false, result: null, error: err.message })
    }
  }

  return (
    <Card className="border-sky-500/20 bg-slate-900/40">
      <CardHeader>
        <CardTitle className="text-sky-300 flex items-center gap-2">
          <Lock size={18} /> Encrypt Data
        </CardTitle>
        <CardDescription>
          POST <code className="text-slate-400">/encrypt</code> — stores quantum-encrypted payload against an ID
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Reference ID</Label>
          <Input
            placeholder="e.g. secret-123"
            value={qubitId}
            onChange={e => setQubitId(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Plaintext to Encrypt</Label>
          <Textarea
            placeholder="Enter sensitive data..."
            value={payload}
            onChange={e => setPayload(e.target.value)}
            rows={3}
          />
        </div>
        <Button className="w-full bg-sky-600 hover:bg-sky-500" onClick={handleEncrypt} disabled={state.loading}>
          {state.loading ? <><Loader2 size={15} className="mr-2 animate-spin" /> Encrypting...</> : "Encrypt & Store"}
        </Button>
        {state.result && <ResponseView state={state} color="emerald" />}
        {state.error && <ResponseView state={state} color="red" />}
      </CardContent>
    </Card>
  )
}

function DecryptForm() {
  const [searchId, setSearchId] = useState("")
  const [state, setState] = useState<FormState>({ loading: false, result: null, error: null })

  const handleDecrypt = async () => {
    if (!searchId.trim()) {
      setState({ loading: false, result: null, error: "Please enter an ID." })
      return
    }
    setState({ loading: true, result: null, error: null })
    try {
      const res = await fetch(`${API_URI}/decrypt/${encodeURIComponent(searchId)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? "ID not found")
      setState({ loading: false, result: JSON.stringify(data, null, 2), error: null })
    } catch (err: any) {
      setState({ loading: false, result: null, error: err.message })
    }
  }

  return (
    <Card className="border-indigo-500/20 bg-slate-900/40">
      <CardHeader>
        <CardTitle className="text-indigo-300 flex items-center gap-2">
          <Unlock size={18} /> Decrypt Data
        </CardTitle>
        <CardDescription>
          GET <code className="text-slate-400">/decrypt/&#123;id&#125;</code> — retrieves and decrypts stored payload
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Reference ID</Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. secret-123"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleDecrypt()}
            />
            <Button variant="secondary" onClick={handleDecrypt} disabled={state.loading}>
              {state.loading ? <Loader2 size={15} className="animate-spin" /> : "Decrypt"}
            </Button>
          </div>
        </div>
        {state.result && <ResponseView state={state} color="indigo" />}
        {state.error && <ResponseView state={state} color="red" />}
      </CardContent>
    </Card>
  )
}

function EndpointRef() {
  const endpoints = [
    { method: "GET", path: "/ping", desc: "Health check — returns { message: 'pong' }" },
    { method: "POST", path: "/encrypt", desc: "Body: { id, data } — encrypts & stores" },
    { method: "GET", path: "/decrypt/{item_id}", desc: "Retrieves & decrypts by reference ID" },
  ]
  return (
    <Card className="border-slate-700/50 bg-slate-900/30">
      <CardHeader>
        <CardTitle className="text-slate-300 flex items-center gap-2 text-sm">
          <Activity size={16} /> API Endpoints
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {endpoints.map(ep => (
            <div key={ep.path} className="flex gap-3 items-start text-xs font-mono">
              <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold ${ep.method === "GET" ? "bg-emerald-900/60 text-emerald-400" : "bg-sky-900/60 text-sky-400"
                }`}>{ep.method}</span>
              <span className="text-slate-300 font-mono">{ep.path}</span>
              <span className="text-slate-500 text-[10px] leading-5">{ep.desc}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-600 mt-3 font-mono">
          base: {API_URI}
        </p>
      </CardContent>
    </Card>
  )
}

export default function TestPage() {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("checking")

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_URI}/ping`, { signal: AbortSignal.timeout(5000) })
        setBackendStatus(res.ok ? "online" : "offline")
      } catch {
        setBackendStatus("offline")
      }
    }
    check()
    const id = setInterval(check, 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Quantum Vault — Console</h1>
            <p className="text-slate-500 text-sm mt-1">Test encrypt/decrypt against the live backend</p>
          </div>
          <BackendBadge status={backendStatus} />
        </div>

        <EndpointRef />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EncryptForm />
          <DecryptForm />
        </div>
      </div>
    </div>
  )
}