import React, {useEffect, useState} from "react";
import {DropdownButton, Dropdown} from "react-bootstrap";
import PropTypes from "prop-types";

const Select = ({items, onChange, currentItem}) => {

    const [current, setCurrent] = useState(currentItem)

    useEffect(() => {
        onChange(current);
    }, [current]);

    return (
        <DropdownButton
            variant="light"
            title={current.value}
            onSelect={e => {
                const selected = items.find(item => item.id === e)
                setCurrent(selected)
            }}
        >
            { items.map(item =>
                <Dropdown.Item
                    eventKey={item.id}
                    key={item.id}
                    active={item.id === current.id}
                >
                    {item.value}
                </Dropdown.Item>
            )}
        </DropdownButton>
    )
}

Select.propTypes = {
    onChange: PropTypes.func,
    items: PropTypes.array
}

export default Select