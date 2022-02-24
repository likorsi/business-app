import {Form} from "react-bootstrap";
import React, {useState} from "react";
import {lang} from "../lang";

const Multiselect = ({style, items, checked, onChange}) => (
    <div style={style || {}}>
        <Form.Check
            style={{paddingBottom: 5}}
            type="checkbox"
            checked={items.length === checked.length}
            label={lang.checkAll}
            onChange={(event) =>
                onChange(event.target.checked ? items.map(item => item.id) : [])
            }
        />
        { items.map(item => {
            return (
                <Form.Check
                    key={item.id}
                    type="checkbox"
                    checked={checked.includes(item.id)}
                    value={item.id}
                    label={item.name}
                    onChange={(event) =>
                        onChange(!checked.includes(event.target.value) ? [...checked, event.target.value] : checked.filter(item => item != event.target.value))
                    }
                />
            )
        })}
    </div>
)

export default Multiselect