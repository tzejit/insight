import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Waterfall from './graphs/Waterfall';
import AnalyticsHeader from './typography/AnalyticsHeader';
import GraphTitle from './typography/GraphTitle';



function Overview() {
  return (
    <Stack 
    direction="column"
    spacing={2}>
        <Box bgcolor="yellow.main" padding='0.2em'>
            <AnalyticsHeader variant='h5'>Overview of customer reviews</AnalyticsHeader>
        </Box>
        <Stack 
        direction="row"
        spacing={2}
        justifyContent='space-between' >
            <Box bgcolor="grey.main" flex={1} padding='0.5em'>
                <AnalyticsHeader variant='subtitle1'># reviews</AnalyticsHeader>
                <AnalyticsHeader variant='h5'>61,581</AnalyticsHeader>
            </Box>
            <Box bgcolor="grey.main" flex={1} padding='0.5em'>
                <AnalyticsHeader variant='subtitle1'># products reviewed</AnalyticsHeader>
                <AnalyticsHeader variant='h5'>37</AnalyticsHeader>
            </Box>
            <Box bgcolor="grey.main" flex={1} padding='0.5em'>
                <AnalyticsHeader variant='subtitle1'># Review period</AnalyticsHeader>
                <AnalyticsHeader variant='h5'>01.11.23-01.12.23</AnalyticsHeader>
            </Box>
            <Box bgcolor="grey.main" flex={1} padding='0.5em'>
                <AnalyticsHeader variant='subtitle1'>Product category</AnalyticsHeader>
                <AnalyticsHeader variant='h5'>Books & Kindle</AnalyticsHeader>
            </Box>
        </Stack>
        <Box bgcolor="yellow.transparent">
            <GraphTitle variant='subtitle1'>Number of customer reviews per product [absolute (share)]</GraphTitle>
        </Box>
        <Waterfall/>
        <Box bgcolor="yellow.transparent">
            <GraphTitle variant='subtitle1'>Share of positive vs negative customer reviews per product [absolute (share)]</GraphTitle>
        </Box>
        <Waterfall/>
    </Stack>
  );
}

export default Overview;