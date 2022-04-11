import React, {useEffect, useState} from "react";
import {Button, Form, InputGroup} from "react-bootstrap";
import PropTypes from "prop-types";
import {lang} from "../lang";

const Options = ({onChange, defaultOptions, loading}) => {

    const [options, setOptions] = useState(defaultOptions || [])
    const [name, setName] = useState('')
    const [value, setValue] = useState('')

    useEffect(() => {
        onChange(options);
    }, [options]);

    return (
        <>
            <InputGroup className="mb-3">
                <Button
                    style={{width: 40}}
                    variant="outline-success"
                    disabled={value.trim() === '' || name.trim() === ''}
                    onClick={() => {
                        setOptions(() => [...options, {name: name, value: value}])
                        setName('')
                        setValue('')
                    }}>
                    +
                </Button>
                <Form.Control
                    placeholder={lang.product.name}
                    disabled={loading}
                    type='text'
                    value={name}
                    onChange={event => setName(event.target.value)}
                />
                <Form.Control
                    placeholder={lang.product.value}
                    disabled={loading}
                    type='text'
                    value={value}
                    onChange={event => setValue(event.target.value)}
                />
            </InputGroup>

            {
                options?.map((option, index) => (
                    <InputGroup key={index} className="mb-3">
                        <Button
                            variant="outline-danger"
                            disabled={loading}
                            style={{width: 40}}
                            onClick={() => setOptions(options.filter(({name}) => option.name !== name))}
                        >
                            -
                        </Button>
                        <Form.Control
                            disabled
                            type='text'
                            value={option.name}
                        />
                        <Form.Control
                            disabled
                            type='text'
                            value={option.value}
                        />
                    </InputGroup>
                ))
            }
        </>
    )
}

Options.propTypes = {
    onChange: PropTypes.func,
    defaultOptions: PropTypes.array,
    loading: PropTypes.bool
}

export default Options