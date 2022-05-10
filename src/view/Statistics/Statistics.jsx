import React, {useEffect} from "react";
import {inject, observer} from "mobx-react";
import {useLocation} from "react-router-dom";
import {Badge, Nav, OverlayTrigger, Stack, Tooltip} from "react-bootstrap";
import {Loader} from "../../components/Loader/Loader";
import OrdersChart from "./OrdersChart.jsx";
import TopProductsChart from "./TopProductsChart.jsx";
import {lang} from "../../lang";
import IncomeChart from "./IncomeChart";

const Statistics = inject('StatisticsStore')(observer(({StatisticsStore}) => {

    const location = useLocation()

    useEffect(() => {
        location.pathname.startsWith('/statistics') && StatisticsStore.onInit()
    }, [location.pathname])

    return StatisticsStore.loading
        ? <div className='centered'><Loader/></div>
        : StatisticsStore.isNotEnoughData
            ? <div className='centered'>{lang.noStatistics}</div>
            : <>
            <Stack
                direction='horizontal'
                gap={2}
                style={{justifyContent: 'space-around', textAlign: "center", marginTop: 40, marginBottom: 40}}
            >
                { StatisticsStore.nalogInfo.useMyNalogOption &&
                    <div>
                        <h5>{lang.statisticsGraphics.taxToPay}</h5>
                        <h4>{StatisticsStore.taxToPay.toFixed().toString()} &#8381;</h4>
                    </div>
                }
                <div>
                    <h5>{lang.statisticsGraphics.allIncome}</h5>
                    <h4>{StatisticsStore.mainInfo.allIncome.toFixed().toString()} &#8381;</h4>
                </div>
                <div>
                    <h5>{lang.statisticsGraphics.ordersCount}</h5>
                    <Stack direction='horizontal'>
                        <h5>{StatisticsStore.mainInfo.allOrders} /
                            <OverlayTrigger placement='top' overlay={<Tooltip>{lang.statisticsTooltip.finished}</Tooltip>}>
                                <Badge text="success" bg='light' style={{marginRight: 10, marginLeft: 10}}>{StatisticsStore.mainInfo.finishedOrders}</Badge>
                            </OverlayTrigger>
                            <OverlayTrigger placement='top' overlay={<Tooltip>{lang.statisticsTooltip.canceled}</Tooltip>}>
                                <Badge text="danger" bg='light' style={{marginRight: 10}}>{StatisticsStore.mainInfo.canceledOrders}</Badge>
                            </OverlayTrigger>
                            <OverlayTrigger placement='top' overlay={<Tooltip>{lang.statisticsTooltip.other}</Tooltip>}>
                                <Badge text="secondary" bg='light'>{StatisticsStore.mainInfo.otherOrders}</Badge>
                            </OverlayTrigger>
                        </h5>
                    </Stack>
                </div>
            </Stack>

            <div style={{paddingBottom: 30}}>
                <Nav
                    justify
                    variant="tabs"
                    defaultActiveKey="month"
                    className='nav-tabs-dark'
                    onSelect={eventKey => StatisticsStore.filterStatistics(eventKey)}
                >
                    <Nav.Item>
                        <Nav.Link eventKey="month">{lang.statisticsFilters.month}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="year">{lang.statisticsFilters.year}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="all">{lang.statisticsFilters.all}</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>


            <h5 className='title'>{lang.statisticsGraphics.income}</h5>
            <div className='chart'><IncomeChart data={StatisticsStore.incomeData}/></div>

            <h5 className='title'>{lang.statisticsGraphics.orders}</h5>
            <div className='chart'><OrdersChart data={StatisticsStore.ordersData}/></div>

            <h5 className='title'>{lang.statisticsGraphics.topProducts}</h5>
            <div className='chart'><TopProductsChart data={StatisticsStore.topProductsData}/></div>

        </>
}))

export default Statistics