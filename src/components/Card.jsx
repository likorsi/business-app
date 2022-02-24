import React from "react";
import {Badge, Button, Card, Stack} from "react-bootstrap";
import Delete from '../../public/icons/delete.svg';
import Edit from '../../public/icons/edit.svg';

export const CardItem = props => {
    return (
        <Card>
            { props.img && <Card.Img variant="top" src={props.img}/> }
            <Card.Body>
                <Card.Title>
                    { props.title }
                </Card.Title>
                <Card.Text>{ props.children }</Card.Text>
                <Stack direction="horizontal" gap={3}>
                    { props.warning && <Badge pill bg="warning">{props.warning}</Badge> }
                    <Button
                        onClick={() => props.onEdit()}
                        variant="light"
                        size='sm'
                        className='ms-auto my-btn'
                    ><Edit/></Button>
                    <Button
                        className='my-btn'
                        onClick={() => props.onDelete()}
                        variant="light"
                        size='sm'
                    ><Delete/></Button>
                </Stack>
            </Card.Body>
        </Card>
    )
}