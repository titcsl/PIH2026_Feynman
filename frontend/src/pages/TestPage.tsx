import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, Key, Lock, Unlock } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface FormState {
  loading: boolean
  result: string | null
  error: string | null
}

const API_URI = "https://backend.whatsgoinon.space"

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
      const response = await fetch(`${API_URI}/encrypt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: qubitId, data: payload }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || "Encryption failed")
      
      setState({ loading: false, result: JSON.stringify(data, null, 2), error: null })
    } catch (err: any) {
      setState({ loading: false, result: null, error: err.message })
    }
  }

  return (
    <Card className="border-sky-500/20 bg-slate-900/40">
      <CardHeader>
        <CardTitle className="text-sky-300 flex items-center gap-2"><Lock size={18}/> Encrypt Data</CardTitle>
        <CardDescription>Generate a quantum-secured ID for your text</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>ID for the text</Label>
          <Input placeholder="e.g. secret-123" value={qubitId} onChange={(e) => setQubitId(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Text to Encrypt</Label>
          <Textarea placeholder="Enter sensitive data..." value={payload} onChange={(e) => setPayload(e.target.value)} rows={3} />
        </div>
        <Button className="w-full bg-sky-600 hover:bg-sky-500" onClick={handleEncrypt} disabled={state.loading}>
          {state.loading ? <Loader2 size={15} className="mr-2 animate-spin" /> : "Encrypt & Store"}
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
      setState({ loading: false, result: null, error: "Please enter an ID to search." })
      return
    }

    setState({ loading: true, result: null, error: null })
    try {
      const response = await fetch(`${API_URI}/decrypt/${searchId}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || "ID not found")
      
      setState({ loading: false, result: JSON.stringify(data, null, 2), error: null })
    } catch (err: any) {
      setState({ loading: false, result: null, error: err.message })
    }
  }

  return (
    <Card className="border-indigo-500/20 bg-slate-900/40">
      <CardHeader>
        <CardTitle className="text-indigo-300 flex items-center gap-2"><Unlock size={18}/> Decrypt Data</CardTitle>
        <CardDescription>Retrieve data using the ID created during encryption</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Enter Reference ID</Label>
          <div className="flex gap-2">
            <Input placeholder="e.g. secret-123" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
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

function ResponseView({ state, color }: { state: FormState, color: string }) {
  const isError = color === "red"
  return (
    <div className={`mt-4 rounded-md border p-3 bg-slate-950/60 ${isError ? 'border-red-500/40' : 'border-emerald-500/40'}`}>
      <div className="flex items-center gap-2 mb-2">
        {isError ? <AlertCircle size={14} className="text-red-400" /> : <CheckCircle2 size={14} className="text-emerald-400" />}
        <span className={`text-xs font-mono ${isError ? 'text-red-400' : 'text-emerald-400'}`}>
          {isError ? "Error" : "Result"}
        </span>
      </div>
      <pre className="text-[10px] text-slate-300 font-mono overflow-auto">{state.error ?? state.result}</pre>
    </div>
  )
}

export default function TestPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/")}><ArrowLeft size={16} /> Back</Button>
          <h1 className="text-2xl font-bold">Quantum Vault API</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <EncryptForm />
          <DecryptForm />
        </div>
      </div>
    </div>
  )
}