import React from "react";
import PropTypes from "prop-types";
import {lang} from "../lang";
import {Button, Form, Stack} from "react-bootstrap";

const Multiselect = ({style, items, checked, onChange, onDelete, onEdit, untitledItem}) => (
    <div style={style || {}} className='overflow-auto'>
        <Form.Check
            style={{paddingBottom: 5}}
            type="checkbox"
            checked={items.length + (untitledItem ? 1 : 0) === checked.length}
            label={lang.checkAll}
            onChange={(event) =>
                onChange(event.target.checked
                    ? untitledItem ? items.map(item => item.id).concat('0') : items.map(item => item.id)
                    : []
                )
            }
        />
        { untitledItem &&
            <Form.Check
                style={{paddingBottom: 5}}
                type="checkbox"
                value={'0'}
                checked={checked.includes('0')}
                label={untitledItem}
                onChange={(event) =>
                    onChange(!checked.includes(event.target.value) ? [...checked, event.target.value] : checked.filter(item => item !== event.target.value))
                }
            />
        }
        { items.map(item => {
            return (
                <div key={item.id}>
                    <Stack direction="horizontal" gap={3} >
                        <Form.Check
                            key={item.id}
                            type="checkbox"
                            checked={checked.includes(item.id)}
                            value={item.id}
                            label={item.name}
                            onChange={(event) =>
                                onChange(!checked.includes(event.target.value) ? [...checked, event.target.value] : checked.filter(item => item !== event.target.value))
                            }
                        />
                        { onEdit &&
                            <Button
                                size='sm'
                                className='ms-auto'
                                variant='outline-light'
                                style={{color: '#3ad166'}}
                                onClick={() => onEdit(item)}
                            >
                                &hellip;
                            </Button>
                        }
                        { onDelete &&
                            <Button
                                size='sm'
                                variant='outline-light'
                                style={{color: 'deeppink'}}
                                onClick={() => onDelete(item)}
                            >
                                &ndash;
                            </Button>
                        }
                    </Stack>
                </div>
            )
        })}
    </div>
)

Multiselect.propTypes = {
    style: PropTypes.object,
    items: PropTypes.array.isRequired,
    checked: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    untitledItem: PropTypes.string
}

export default Multiselect