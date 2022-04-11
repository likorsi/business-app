import React from "react";
import PropTypes from 'prop-types';
import {Badge, Button, ButtonGroup, Card, Carousel, Image, Stack} from "react-bootstrap";
import Delete from '../../public/icons/delete.svg';
import Edit from '../../public/icons/edit.svg';
import EmptyCard from '../../public/icons/emptyCard.svg';
import {lang} from "../lang";

const CardItem = ({style, img, price, title, badge, onEdit, onDelete, onCardClick, onAddToCart, onRemoveFromCart, productCountInCart, notAvailable}) => (
        <Card style={{minHeight: 350, height: '100%', ...style}}>
            <Carousel interval={null} controls={img.length > 1}>
                {
                    img.length !== 0 ?
                        img.map( (item, index) => (
                            <Carousel.Item key={index}>
                                <Image
                                    fluid={true}
                                    style={{height: 150}}
                                    alt=''
                                    className="d-block w-100"
                                    src={item.src}
                                />
                            </Carousel.Item>
                        ))
                        : <div style={{height: 150, display: 'flex', justifyContent: 'center', alignItems: 'center'}} ><EmptyCard/></div>

                }
            </Carousel>

            <Card.Body
                style={{display: 'flex', flexDirection: 'column'}}
            >
                <div onClick={() => onCardClick && onCardClick()} style={{flexGrow: 1}}>
                    <Card.Title>
                        {title}
                    </Card.Title>
                    <Stack direction="horizontal" gap={2} style={{flexWrap: 'wrap'}}>
                        { (badge || notAvailable) && <><Badge pill bg={notAvailable ? "danger" : "info"}>{notAvailable ? lang.notAvailable : badge}</Badge><br/></> }
                        <p style={{marginTop: 10, fontSize: '1.6em'}} className='ms-auto wrap'>{price} &#8381;</p>
                    </Stack>
                </div>
                <Stack direction="horizontal" gap={3}>
                    { onAddToCart &&
                        <ButtonGroup style={{width: '100%'}}>
                            { productCountInCart > 0 &&
                                <Button
                                    onClick={() => onRemoveFromCart()}
                                    variant="outline-danger"
                                    size='sm'
                                    style={{width: '20%'}}
                                >
                                    -
                                </Button>
                            }
                            <Button
                                disabled={notAvailable}
                                onClick={() => onAddToCart()}
                                variant="outline-success"
                                size='sm'
                                style={{width: '100%'}}
                            >
                                { productCountInCart > 0 ? lang.productsInCart + productCountInCart : lang.addToCart}
                            </Button>
                            { productCountInCart > 0 &&
                                <Button
                                    onClick={() => onAddToCart()}
                                    variant="outline-success"
                                    size='sm'
                                    style={{width: '20%'}}
                                >
                                    +
                                </Button>
                            }
                        </ButtonGroup>

                    }
                    { onEdit &&
                        <Button
                            onClick={() => onEdit()}
                            variant="light"
                            size='sm'
                            className='ms-auto my-btn'
                        >
                            <Edit/>
                        </Button>
                    }
                    { onDelete &&
                        <Button
                            className='my-btn'
                            onClick={() => onDelete()}
                            variant="light"
                            size='sm'
                        >
                            <Delete/>
                        </Button>
                    }
                </Stack>
            </Card.Body>
        </Card>
)

CardItem.propTypes = {
    img: PropTypes.array,
    style: PropTypes.object,
    price: PropTypes.string,
    title: PropTypes.string,
    badge: PropTypes.string,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onCardClick: PropTypes.func,
    onAddToCart: PropTypes.func,
    onRemoveFromCart: PropTypes.func,
    productCountInCart: PropTypes.number,
    notAvailable: PropTypes.bool
}

export default CardItem