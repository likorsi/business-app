import React from "react";
import {inject, observer} from "mobx-react";
import OrdersByMonths from "./OrdersByMonths";
import TopProducts from "./TopProducts";
import {lang} from "../../lang";
import {Loader} from "../../components/Loader/Loader";

const Statistics = inject('OrdersStore')(observer(({OrdersStore}) => {
    const data2 = [
        {
            "id": "css",
            "label": "css",
            "value": 37,
            "color": "hsl(224, 70%, 50%)"
        },
        {
            "id": "javascript",
            "label": "javascript",
            "value": 100,
            "color": "hsl(307, 70%, 50%)"
        },
        {
            "id": "java",
            "label": "java",
            "value": 202,
            "color": "hsl(12, 70%, 50%)"
        },
        {
            "id": "stylus",
            "label": "stylus",
            "value": 302,
            "color": "hsl(35, 70%, 50%)"
        },
        {
            "id": "haskell",
            "label": "haskell",
            "value": 297,
            "color": "hsl(144, 70%, 50%)"
        }
    ]
    const data1 = [
        {
            "country": "AD",
            "hot dog": 85,
            "hot dogColor": "hsl(9, 70%, 50%)",
            "burger": 57,
            "burgerColor": "hsl(164, 70%, 50%)",
            "sandwich": 182,
            "sandwichColor": "hsl(230, 70%, 50%)",
            "kebab": 8,
            "kebabColor": "hsl(168, 70%, 50%)",
            "fries": 115,
            "friesColor": "hsl(20, 70%, 50%)",
            "donut": 118,
            "donutColor": "hsl(48, 70%, 50%)"
        },
        {
            "country": "AE",
            "hot dog": 183,
            "hot dogColor": "hsl(121, 70%, 50%)",
            "burger": 51,
            "burgerColor": "hsl(277, 70%, 50%)",
            "sandwich": 126,
            "sandwichColor": "hsl(109, 70%, 50%)",
            "kebab": 187,
            "kebabColor": "hsl(22, 70%, 50%)",
            "fries": 128,
            "friesColor": "hsl(210, 70%, 50%)",
            "donut": 11,
            "donutColor": "hsl(297, 70%, 50%)"
        },
        {
            "country": "AF",
            "hot dog": 111,
            "hot dogColor": "hsl(286, 70%, 50%)",
            "burger": 172,
            "burgerColor": "hsl(323, 70%, 50%)",
            "sandwich": 153,
            "sandwichColor": "hsl(239, 70%, 50%)",
            "kebab": 99,
            "kebabColor": "hsl(27, 70%, 50%)",
            "fries": 53,
            "friesColor": "hsl(99, 70%, 50%)",
            "donut": 30,
            "donutColor": "hsl(177, 70%, 50%)"
        },
        {
            "country": "AG",
            "hot dog": 64,
            "hot dogColor": "hsl(352, 70%, 50%)",
            "burger": 189,
            "burgerColor": "hsl(116, 70%, 50%)",
            "sandwich": 72,
            "sandwichColor": "hsl(301, 70%, 50%)",
            "kebab": 85,
            "kebabColor": "hsl(339, 70%, 50%)",
            "fries": 119,
            "friesColor": "hsl(106, 70%, 50%)",
            "donut": 33,
            "donutColor": "hsl(336, 70%, 50%)"
        },
        {
            "country": "AI",
            "hot dog": 13,
            "hot dogColor": "hsl(8, 70%, 50%)",
            "burger": 150,
            "burgerColor": "hsl(153, 70%, 50%)",
            "sandwich": 29,
            "sandwichColor": "hsl(25, 70%, 50%)",
            "kebab": 158,
            "kebabColor": "hsl(276, 70%, 50%)",
            "fries": 135,
            "friesColor": "hsl(27, 70%, 50%)",
            "donut": 149,
            "donutColor": "hsl(261, 70%, 50%)"
        },
        {
            "country": "AL",
            "hot dog": 143,
            "hot dogColor": "hsl(214, 70%, 50%)",
            "burger": 148,
            "burgerColor": "hsl(157, 70%, 50%)",
            "sandwich": 175,
            "sandwichColor": "hsl(72, 70%, 50%)",
            "kebab": 21,
            "kebabColor": "hsl(19, 70%, 50%)",
            "fries": 153,
            "friesColor": "hsl(90, 70%, 50%)",
            "donut": 99,
            "donutColor": "hsl(54, 70%, 50%)"
        },
        {
            "country": "AM",
            "hot dog": 100,
            "hot dogColor": "hsl(162, 70%, 50%)",
            "burger": 149,
            "burgerColor": "hsl(175, 70%, 50%)",
            "sandwich": 86,
            "sandwichColor": "hsl(283, 70%, 50%)",
            "kebab": 124,
            "kebabColor": "hsl(279, 70%, 50%)",
            "fries": 98,
            "friesColor": "hsl(238, 70%, 50%)",
            "donut": 174,
            "donutColor": "hsl(263, 70%, 50%)"
        }
    ]

    return (
        <>
            {/*OrdersStore.loading*/}
            {/*? <div className='centered'><Loader/></div>*/}
            {/*: OrdersStore.orders.length > 0*/}

            {/*<div className='centered'>{lang.noStatistics}</div>*/}

            <h5 className='title'>{lang.ordersByMonth}</h5>
            <div className='chart'><OrdersByMonths data={data1}/></div>

            <h5 className='title'>{lang.topProducts}</h5>
            <div className='chart'><TopProducts data={data2}/></div>
        </>
    )
}))

export default Statistics