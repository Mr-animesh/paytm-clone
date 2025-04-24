import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin"
import { SendMoney } from "./pages/SendMoney"
import { Dashboard } from "./pages/Dashboard"
import { Status } from "./pages/Status"
import { Me } from "./pages/Me"
import './App.css'

function App() {

  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Me />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />}/>
            <Route path="/dashboard" element={<Dashboard /> }/>
            <Route path="/send" element={<SendMoney />}/>
            <Route path="/status" element={<Status />}/>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
