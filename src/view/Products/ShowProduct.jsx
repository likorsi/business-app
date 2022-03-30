import React from "react";
import ModalWindow from "../../components/ModalWindow";
import {Badge, Button, Card, Carousel, Col, Image, Row, Table} from "react-bootstrap";
import {lang} from "../../lang";
import PropTypes from "prop-types";
import {Product} from "../../domain/Product";


const ShowProduct = ({show, selected, categories, onCloseWindow, onAddToCart}) => {
    return (
        <ModalWindow
            title={selected.name}
            subtitle={categories.find(({id}) => id === selected.category)?.name}
            hideFooter={true}
            show={show}
            onClose={() => onCloseWindow()}
        >
            <Row md={1} className="g-4" style={{padding: 10}}>
                <Col md={selected.images.length > 0 ? 4 : 8} xs={12} style={{alignSelf:'center'}}>
                    <p style={{marginTop: 10, fontSize: '2.2em'}} className='wrap'>{selected.price} &#8381;</p>
                    { selected.badge && <div><Badge pill bg="info">{selected.badge}</Badge></div> }
                    { onAddToCart &&
                        <Button
                            onClick={() => onAddToCart()}
                            variant="outline-success"
                            size="lg"
                            style={{marginBottom: 15, marginTop: 15}}
                        >
                            {lang.addToCart}
                        </Button>
                    }
                </Col>
                <Col md={8} xs={12}>  {
                    selected.images.length > 0 &&
                    <Carousel
                        interval={null}
                        controls={selected.images.length > 1}
                    >
                        {
                            selected.images.map((img, index) => (
                                <Carousel.Item key={index}>
                                    <Image
                                        fluid={true}
                                        alt=''
                                        className="d-block w-100"
                                        src={img.src}
                                    />
                                </Carousel.Item>
                            ))
                        }
                    </Carousel>
                }
                </Col>
            </Row>
            {selected.hasMoreInfo &&
                <Row md={1} className="g-4" style={{padding: 10}}>
                    <Card body>
                        { selected.description && <div style={{marginBottom: 15}}>{selected.description?.split('\n').map((row, index) => <span key={index}>{row}<br/></span>)}</div> }
                        { selected.options.length > 0 &&
                            <Table borderless size="sm">
                                <tbody>
                                <tr><td colSpan={2}>{lang.product.options}</td></tr>
                                {selected.options.map((option, index) => (
                                    <tr key={index}>
                                        <td style={{fontWeight: 'bold'}}>{option.name}</td>
                                        <td>{option.value}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        }
                    </Card>
                </Row>
            }
        </ModalWindow>
    )
}

ShowProduct.propTypes = {
    show: PropTypes.bool,
    selected: PropTypes.instanceOf(Product),
    categories: PropTypes.array,
    onCloseWindow: PropTypes.func,
    onAddToCart: PropTypes.func
}

export default ShowProduct