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
        <Box bgcolor="grey.main" padding='0.2em' borderRadius='0.5em' id='reportoverview'>
            <AnalyticsHeader variant='h5'>Report and data overview</AnalyticsHeader>
        </Box>
        <Stack 
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
        </Stack>
        <Box bgcolor="yellow.light" padding='0.5em' borderRadius='0.5em' id="reviewperproduct">
            <GraphTitle variant='subtitle1'>Number of customer reviews per product</GraphTitle>
            <Waterfall/>
        </Box>

        <Box bgcolor="yellow.light" padding='0.5em' borderRadius='0.5em' id="sentimentperproduct">
            <GraphTitle variant='subtitle1'>Customer sentiment per product (positive vs neutral vs negative reviews)</GraphTitle>
            <Waterfall/>
        </Box>
    </Stack>
  );
}

export default Overview;