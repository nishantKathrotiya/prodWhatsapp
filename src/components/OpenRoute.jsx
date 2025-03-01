import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const OpenRoute = ({ children }) => {

    const { token  } = useSelector((state) => state.profile)

    if (token == null) {
        return children
    } else {
        return <Navigate to={`/admin`} />
    }
}

export default OpenRoute