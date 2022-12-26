import { AuthContext } from "@contexts/AuthContexts"

import { useContext } from "react"

export function useAuth(){
    const context = useContext( AuthContext )

    return context
}