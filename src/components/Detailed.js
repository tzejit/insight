import Box from '@mui/material/Box';
import { Grid, Stack } from '@mui/material';
import Waterfall from './graphs/Waterfall';
import AnalyticsHeader from './typography/AnalyticsHeader';
import GraphTitle from './typography/GraphTitle';
import BarGraph from './graphs/BarGraph';

function Detailed() {
  return (
    <Stack 
    direction="column"
    spacing={2}>
        <Box bgcolor="yellow.main"  padding='0.2em'>
            <AnalyticsHeader variant='h5'>Detailed sentiment and root cause analysis</AnalyticsHeader>
        </Box>

        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Box bgcolor="yellow.transparent">
                    <GraphTitle variant='subtitle1'>Best 5 reviewed products</GraphTitle>
                </Box>
                <Waterfall/>
            </Grid>
            <Grid item xs={6}>
                <Box bgcolor="yellow.transparent">
                    <GraphTitle variant='subtitle1'>Worst 5 reviewed products</GraphTitle>
                </Box>
                <Waterfall/>
            </Grid>
            <Grid item xs={6}>
                <Box bgcolor="yellow.transparent">
                    <GraphTitle variant='subtitle1'>Most mentioned reaons for positive review</GraphTitle>
                </Box>
                <BarGraph/>
            </Grid>
            <Grid item xs={6}>
                <Box bgcolor="yellow.transparent">
                    <GraphTitle variant='subtitle1'>Most mentioned reasons for negative review</GraphTitle>
                </Box>
                <BarGraph/>
            </Grid>
            <Grid item xs={6}>
                <Box bgcolor="yellow.transparent">
                    <GraphTitle variant='subtitle1'>Qualitative report for positive reviews</GraphTitle>
                </Box>
                <Box textAlign='justify' sx={{ border: 1,  margin: '0.5em',  padding: '0.3em' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra imperdiet enim, at tincidunt eros cursus sed. Duis mattis semper aliquet. Sed non mattis purus. Etiam ex est, porttitor eu sem at, ornare semper quam. Praesent vestibulum risus auctor lacus interdum, et sollicitudin ante cursus. Quisque sit amet lectus tristique, fringilla elit in, pharetra tortor. Pellentesque a massa vitae ligula viverra feugiat ut ut tellus. Aenean semper vitae mauris a convallis. In a tellus sed dolor euismod condimentum. Nunc posuere molestie turpis, vel efficitur enim facilisis ut. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus vestibulum neque et felis consectetur rhoncus. Mauris volutpat laoreet accumsan. Cras ultricies leo diam, in accumsan justo ultricies id. Fusce auctor leo orci, ut vehicula ligula placerat ut.
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box bgcolor="yellow.transparent">
                    <GraphTitle variant='subtitle1'>Qualitative report for negative reviews</GraphTitle>
                </Box>
                <Box textAlign='justify' sx={{ border: 1, margin: '0.5em', padding: '0.3em' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra imperdiet enim, at tincidunt eros cursus sed. Duis mattis semper aliquet. Sed non mattis purus. Etiam ex est, porttitor eu sem at, ornare semper quam. Praesent vestibulum risus auctor lacus interdum, et sollicitudin ante cursus. Quisque sit amet lectus tristique, fringilla elit in, pharetra tortor. Pellentesque a massa vitae ligula viverra feugiat ut ut tellus. Aenean semper vitae mauris a convallis. In a tellus sed dolor euismod condimentum. Nunc posuere molestie turpis, vel efficitur enim facilisis ut. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus vestibulum neque et felis consectetur rhoncus. Mauris volutpat laoreet accumsan. Cras ultricies leo diam, in accumsan justo ultricies id. Fusce auctor leo orci, ut vehicula ligula placerat ut.
                </Box>
            </Grid>
        </Grid>
    </Stack>
  );
}

export default Detailed;