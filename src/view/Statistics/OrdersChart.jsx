import React from "react";
import {ResponsiveBar} from "@nivo/bar";
import {lang} from "../../lang";

const OrdersChart = ({data}) => {
    return (
        <ResponsiveBar
            data={data}
            keys={[
                lang.statisticsGraphics.individual,
                lang.statisticsGraphics.entity,
            ]}
            indexBy="period"
            groupMode="grouped"
            margin={{ top: 0, right: 80, bottom: 40, left: 50 }}
            padding={0.4}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'pastel1' }}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        '0.9'
                    ]
                ]
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0
            }}
            axisLeft={{
                format: value => value + ' ₽',
                tickSize: 5,
                tickPadding: 3,
                tickRotation: 0
            }}
            valueFormat={value => value + ' ₽'}
            labelSkipWidth={13}
            labelSkipHeight={12}
            labelTextColor={{
                from: 'color',
                modifiers: [['darker', '1.5']]
            }}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 90,
                    translateY: 1,
                    itemsSpacing: 0,
                    itemWidth: 90,
                    itemHeight: 26,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 17,
                    effects: [
                        {
                            on: 'hover',
                            style: {itemOpacity: 1}
                        }
                    ]
                }
            ]}
        />
    )
}

export default OrdersChart