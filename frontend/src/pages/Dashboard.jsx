import { use, useEffect, useState } from "react"
import { Appbar } from "../components/AppBar"
import { Balance } from "../components/Balance"
import {Users} from "../components/Users"
import axios from "axios"

export const Dashboard = () => {
    const [amount, setAmount] = useState(0)
    useEffect(()=>{
        axios.get("http://localhost:3000/api/v1/account/balance",
            {
                headers: {
                    Authorization: "Bearer "+localStorage.getItem("token")
                }
            }
        )
        .then(response => {
            setAmount(response.data.balance)
        })
    
    }, [])
    return <div>
        <div className="flex flex-col justify-center">
            <div className=""><Appbar /></div>
            <div className="pt-4 flex justify-center"><Balance value={amount}/></div>
            <div className="pt-10"><Users /></div>
        </div>
    </div>
}