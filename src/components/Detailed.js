import Box from '@mui/material/Box';
import { Grid, Stack, Typography, Select, MenuItem } from '@mui/material';
import Waterfall from './graphs/Waterfall';
import AnalyticsHeader from './typography/AnalyticsHeader';
import GraphTitle from './typography/GraphTitle';
import BarGraph from './graphs/BarGraph';

function Detailed() {
  return (
    <Stack 
    direction="column"
    spacing={2}>
        <Box bgcolor="grey.main" padding='0.2em' borderRadius='0.5em' id='productselection'>
            <AnalyticsHeader variant='h5'>Product selection</AnalyticsHeader>
        </Box>

        <Grid container boxSizing='border-box' width='inherit'>
            <Grid item xs={6}>
                <Box bgcolor="yellow.light" padding='0.2em' borderRadius='0.5em' marginRight='0.5em' id="positivereviews">
                    <GraphTitle variant='subtitle1'>Top 5 most positive rated products</GraphTitle>
                    <Waterfall/>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box bgcolor="yellow.light" padding='0.2em' borderRadius='0.5em' marginLeft='0.5em' id="negativereviews">
                    <GraphTitle variant='subtitle1'>Top 5 most negative rated products</GraphTitle>
                    <Waterfall/>
                </Box>
            </Grid>
        </Grid>
        <Box bgcolor="yellow.main" padding='0 0.5em' borderRadius='0.5em' display='flex' alignItems='center' justifyContent='space-between'>
            <Typography variant='body1' fontWeight='fontWeightMedium'>Select product for in-depth sentiment analysis</Typography>
            <Select size="small" sx={{
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
                "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    border: 0,
                  },
                "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    border: 0,
                  },
              }} defaultValue={1}>
                <MenuItem value={1}>Product 1</MenuItem>
                <MenuItem value={2}>Product 2</MenuItem>
                <MenuItem value={3}>Product 3</MenuItem>
            </Select>
        </Box>
        <Grid container boxSizing='border-box' width='inherit'>
            <Grid item xs={12} marginBottom="1em">
                <Box bgcolor="yellow.light" padding='0.2em' borderRadius='0.5em' id="sentimentovertime">
                    <GraphTitle variant='subtitle1'>Customer sentiment over time for selected product</GraphTitle>
                    <Waterfall/>
                </Box>
            </Grid>
            <Grid item xs={6} marginBottom="1em">
                <Box bgcolor="yellow.light" padding='0.2em' borderRadius='0.5em' marginRight='0.5em' id='positiveevaluation'>
                    <GraphTitle variant='subtitle1'>Most mentioned reaons for positive review</GraphTitle>
                    <BarGraph/>
                </Box>
            </Grid>
            <Grid item xs={6} marginBottom="1em">
                <Box bgcolor="yellow.light" padding='0.2em' borderRadius='0.5em' marginLeft='0.5em' id='negativeevaluation'>
                    <GraphTitle variant='subtitle1'>Most mentioned reasons for negative review</GraphTitle>
                    <BarGraph/>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box bgcolor="yellow.light" padding='0.2em' borderRadius='0.5em' marginRight='0.5em' id='positivequalitative'>
                    <GraphTitle variant='subtitle1'>Qualitative report for positive reviews</GraphTitle>
                    <Box textAlign='justify' sx={{ border: 1,  margin: '0.5em',  padding: '0.3em', backgroundColor: 'white', borderRadius: '0.5em', border: 0}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra imperdiet enim, at tincidunt eros cursus sed. Duis mattis semper aliquet. Sed non mattis purus. Etiam ex est, porttitor eu sem at, ornare semper quam. Praesent vestibulum risus auctor lacus interdum, et sollicitudin ante cursus. Quisque sit amet lectus tristique, fringilla elit in, pharetra tortor. Pellentesque a massa vitae ligula viverra feugiat ut ut tellus. Aenean semper vitae mauris a convallis. In a tellus sed dolor euismod condimentum. Nunc posuere molestie turpis, vel efficitur enim facilisis ut. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus vestibulum neque et felis consectetur rhoncus. Mauris volutpat laoreet accumsan. Cras ultricies leo diam, in accumsan justo ultricies id. Fusce auctor leo orci, ut vehicula ligula placerat ut.
                    </Box>
                </Box>

            </Grid>
            <Grid item xs={6}>
                <Box bgcolor="yellow.light" padding='0.2em' borderRadius='0.5em' marginLeft='0.5em' id='negativequalitative'>
                    <GraphTitle variant='subtitle1'>Qualitative report for negative reviews</GraphTitle>
                    <Box textAlign='justify' sx={{ border: 1, margin: '0.5em', padding: '0.3em', backgroundColor: 'white', borderRadius: '0.5em', border: 0}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra imperdiet enim, at tincidunt eros cursus sed. Duis mattis semper aliquet. Sed non mattis purus. Etiam ex est, porttitor eu sem at, ornare semper quam. Praesent vestibulum risus auctor lacus interdum, et sollicitudin ante cursus. Quisque sit amet lectus tristique, fringilla elit in, pharetra tortor. Pellentesque a massa vitae ligula viverra feugiat ut ut tellus. Aenean semper vitae mauris a convallis. In a tellus sed dolor euismod condimentum. Nunc posuere molestie turpis, vel efficitur enim facilisis ut. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus vestibulum neque et felis consectetur rhoncus. Mauris volutpat laoreet accumsan. Cras ultricies leo diam, in accumsan justo ultricies id. Fusce auctor leo orci, ut vehicula ligula placerat ut.
                    </Box>
                </Box>

            </Grid>
        </Grid>
    </Stack>
  );
}

export default Detailed;