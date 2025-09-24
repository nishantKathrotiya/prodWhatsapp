
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = ({ children }) => {

    const { token } = useSelector((state) => state.profile);


    if (token)
        return children
    else
        return <Navigate to="/" />

}

export default PrivateRoute