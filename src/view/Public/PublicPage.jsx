import React from "react";
import {useParams} from "react-router-dom";

const PublicPage = () => {
    const {user} = useParams()
    console.log(useParams())
    return (
        <div>Public Page for {user}</div>
    )
}

export default PublicPage