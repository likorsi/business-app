import React from "react";
import {inject, observer} from "mobx-react";
import ModalWindow from "../../components/ModalWindow";
import {Badge, Button, Card, Carousel, Col, Image, Row, Stack, Table} from "react-bootstrap";
import EmptyCard from "../../../public/icons/emptyCard.svg";
import Ruble from "../../../public/icons/ruble.svg";
import {lang} from "../../lang";
import Store from "../../store/Store";


const ShowProduct = inject("ProductsStore")(observer(({ProductsStore}) => {
    return (
        <ModalWindow
            title={ProductsStore.selected.name}
            subtitle={ProductsStore.categories.find(({id}) => id === ProductsStore.selected.category)?.name}
            hideFooter={true}
            show={ProductsStore.isShowProductWindowOpen}
            fullscreen={ProductsStore.selected.hasMoreInfo}
            onClose={() => ProductsStore.onCloseWindow()}
        >
            <Row md={1} className="g-4" style={{padding: 10}}>
                <Col md={ProductsStore.selected.images.length > 0 ? 4 : 8} xs={12} style={{alignSelf:'center'}}>
                    <p style={{marginTop: 10, fontSize: '2.2em'}}><Ruble style={{width: 35, height: 35}}/>{ProductsStore.selected.price}</p>
                    { ProductsStore.selected.badge && <div><Badge pill bg="info">{ProductsStore.selected.badge}</Badge></div> }
                    <Button
                        onClick={() => ProductsStore.addToCart()}
                        variant="outline-success"
                        size="lg"
                        style={{marginBottom: 15, marginTop: 15}}
                    >
                        {lang.addToCart}
                    </Button>
                </Col>
                <Col md={8} xs={12}>  {
                    ProductsStore.selected.images.length > 0 &&
                    <Carousel
                        interval={null}
                        controls={ProductsStore.selected.images.length > 1}
                    >
                        {
                            ProductsStore.selected.images.map(({src}, index) => (
                                <Carousel.Item key={index}>
                                    <Image
                                        fluid={true}
                                        alt=''
                                        className="d-block w-100"
                                        src={src}
                                    />
                                </Carousel.Item>
                            ))
                        }
                    </Carousel>
                }
                </Col>
            </Row>
            {ProductsStore.selected.hasMoreInfo &&
                <Row md={1} className="g-4" style={{padding: 10}}>
                    <Card body>
                        <div style={{marginBottom: 20}}>{ProductsStore.selected.description}</div>
                        {ProductsStore.selected.options.length > 0 &&
                            <Table borderless size="sm">
                                <tbody>
                                <tr><td colSpan={2}>{lang.product.options}</td></tr>
                                {ProductsStore.selected.options.map((option, index) => (
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
}))

export default ShowProduct