import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing"
import TestPage from "./pages/TestPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  )
}
