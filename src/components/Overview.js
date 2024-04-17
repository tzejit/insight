import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import StackedBarGraph from './graphs/StackedBarGraph';
import AnalyticsHeader from './typography/AnalyticsHeader';
import GraphTitle from './typography/GraphTitle';



function Overview({data}) {

    function prepData(data) {
        if (!data){return}
        let acc = {}
        data.forEach(e=> {
            if (!(e.topic in  acc)) {
                acc[e.topic] = {}
            }
            if(e.sentiment === 0) {
                acc[e.topic]['neutral'] = acc[e.topic]['neutral']??0 + e.frequency
            } else if (e.sentiment > 0) {
                acc[e.topic]['positive'] = acc[e.topic]['positive']??0 + e.frequency
            } else {
                acc[e.topic]['negative'] = acc[e.topic]['negative']??0 + e.frequency
            }
        })


        let sortable = []
        for (let topic in acc) {
            sortable.push({topic: topic, neutral: acc[topic]['neutral']??0, positive: acc[topic]['positive']??0, negative: acc[topic]['negative']??0})
        }

        sortable.sort((a, b) => b.neutral + b.positive + b.negative - (a.neutral + a.positive + a.negative));

        return sortable.slice(0, 10)
    }

    return (
        <Stack
            direction="column"
            spacing={2}>
            <Box bgcolor="grey.main" padding='0.2em' borderRadius='0.5em' id='reportoverview'>
                <AnalyticsHeader variant='h5'>Report and data overview</AnalyticsHeader>
            </Box>
            {/* <Stack
                direction="row"
                spacing={2}
                justifyContent='space-between'
                id="overview" >
                <Box bgcolor="yellow.main" flex={1} padding='0.5em' borderRadius='0.5em'>
                    <AnalyticsHeader variant='subtitle1'>Customer review entries uploaded</AnalyticsHeader>
                    <AnalyticsHeader variant='h5'>61,581</AnalyticsHeader>
                </Box>
                <Box bgcolor="yellow.main" flex={1} padding='0.5em' borderRadius='0.5em'>
                    <AnalyticsHeader variant='subtitle1'>Customer review period</AnalyticsHeader>
                    <AnalyticsHeader variant='h5'>01.11.23-01.12.23</AnalyticsHeader>
                </Box>
                <Box bgcolor="yellow.main" flex={1} padding='0.5em' borderRadius='0.5em'>
                    <AnalyticsHeader variant='subtitle1'>Number of distinguished products</AnalyticsHeader>
                    <AnalyticsHeader variant='h5'>37</AnalyticsHeader>
                </Box>
                <Box bgcolor="yellow.main" flex={1} padding='0.5em' borderRadius='0.5em'>
                    <AnalyticsHeader variant='subtitle1'>Product category</AnalyticsHeader>
                    <AnalyticsHeader variant='h5'>Books & Kindle</AnalyticsHeader>
                </Box>
            </Stack> */}
            <Box bgcolor="yellow.light" padding='0.5em' borderRadius='0.5em' id="kwsentiment">
                <GraphTitle variant='subtitle1'>Keyword sentiment (positive vs neutral vs negative reviews)</GraphTitle>
                <StackedBarGraph data={prepData(data)} />
            </Box>
        </Stack>
    );
}

export default Overview;