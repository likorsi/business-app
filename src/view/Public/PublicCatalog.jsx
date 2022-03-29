import React from "react";
import {inject, observer} from "mobx-react";
import {useParams} from "react-router-dom";

const PublicCatalog = inject('PublicStore')(observer(({PublicStore}) => {

    const {user} = useParams()

    return (
        <div>Public Catalog for {user}</div>
    )
}))

export default PublicCatalog