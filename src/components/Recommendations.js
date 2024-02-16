import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import AnalyticsHeader from './typography/AnalyticsHeader';
import GraphTitle from './typography/GraphTitle';


function Recommendations() {
  return (
    <Stack 
    direction="column"
    spacing={2}>
        <Box bgcolor="yellow.main" padding='0.2em'>
            <AnalyticsHeader variant='h5'>Recommendations to address negative customer reviews</AnalyticsHeader>
        </Box>
        <Box>
            <GraphTitle>Recommendations for the next step to mitigate negative customer experience</GraphTitle>
        </Box>
        <Box textAlign='justify' sx={{ border: 1, margin: '0.5em', padding: '0.3em' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra imperdiet enim, at tincidunt eros cursus sed. Duis mattis semper aliquet. Sed non mattis purus. Etiam ex est, porttitor eu sem at, ornare semper quam. Praesent vestibulum risus auctor lacus interdum, et sollicitudin ante cursus. Quisque sit amet lectus tristique, fringilla elit in, pharetra tortor. Pellentesque a massa vitae ligula viverra feugiat ut ut tellus. Aenean semper vitae mauris a convallis. In a tellus sed dolor euismod condimentum. Nunc posuere molestie turpis, vel efficitur enim facilisis ut. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus vestibulum neque et felis consectetur rhoncus. Mauris volutpat laoreet accumsan. Cras ultricies leo diam, in accumsan justo ultricies id. Fusce auctor leo orci, ut vehicula ligula placerat ut.
        </Box>
    </Stack>
  );
}

export default Recommendations;