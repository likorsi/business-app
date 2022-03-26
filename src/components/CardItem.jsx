import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {Badge, Button, Card, Carousel, Image, Spinner, Stack} from "react-bootstrap";
import Delete from '../../public/icons/delete.svg';
import Edit from '../../public/icons/edit.svg';
import Ruble from '../../public/icons/ruble.svg';
import EmptyCard from '../../public/icons/emptyCard.svg';
import {lang} from "../lang";

const CardItem = ({img, price, title, badge, onEdit, onDelete, onCardClick, onAddToCart}) => {

    return (
        <Card style={{minHeight: 315}}>
            <Carousel interval={null} controls={img.length > 1}>
                {
                    img.length !== 0 ?
                        img.map( ({src}, index) => (
                            <Carousel.Item key={index}>
                                <Image
                                    fluid={true}
                                    style={{height: 150}}
                                    alt=''
                                    className="d-block w-100"
                                    src={src}
                                />
                            </Carousel.Item>
                        ))
                        : <div style={{height: 150, display: 'flex', justifyContent: 'center', alignItems: 'center'}} ><EmptyCard/></div>

                }
            </Carousel>

            <Card.Body>
                <div onClick={() => onCardClick && onCardClick()}>
                    <Card.Title>
                        {title}
                    </Card.Title>
                    <Stack direction="horizontal" gap={2}>
                        { badge && <><Badge pill bg="info">{badge}</Badge><br/></> }
                        <p style={{marginTop: 10, fontSize: '1.6em'}} className='ms-auto'><Ruble/>{price}</p>
                    </Stack>
                </div>
                <Stack direction="horizontal" gap={3}>
                    <Button
                        onClick={() => onAddToCart()}
                        variant="outline-success"
                        size='sm'
                    >
                        {lang.addToCart}
                    </Button>
                    <Button
                        onClick={() => onEdit()}
                        variant="light"
                        size='sm'
                        className='ms-auto my-btn'
                    ><Edit/></Button>
                    <Button
                        className='my-btn'
                        onClick={() => onDelete()}
                        variant="light"
                        size='sm'
                    ><Delete/></Button>
                </Stack>
            </Card.Body>
        </Card>
)}

CardItem.propTypes = {
    img: PropTypes.array,
    price: PropTypes.string,
    title: PropTypes.string,
    badge: PropTypes.string,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onCardClick: PropTypes.func,
    onAddToCart: PropTypes.func
}

export default CardItem