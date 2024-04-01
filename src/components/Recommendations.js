import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import AnalyticsHeader from './typography/AnalyticsHeader';


function Recommendations() {
    return (
        <Stack
            direction="column"
            spacing={2}>
            <Box bgcolor="grey.main" padding='0.2em' borderRadius='0.5em' id='recommendation'>
                <AnalyticsHeader variant='h5'>Recommendations based on customer sentiment</AnalyticsHeader>
            </Box>
            <Box width='100%' height='100%' justifyContent="center" alignItems="center" sx={{ backgroundColor: 'yellow.main', borderRadius: '0.5em', boxSizing: 'border-box', padding: '1em' }}>
                <Box textAlign='justify' sx={{ border: 1, margin: '0.5em', padding: '0.3em', backgroundColor: 'white', borderRadius: '0.5em', border: 0 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra imperdiet enim, at tincidunt eros cursus sed. Duis mattis semper aliquet. Sed non mattis purus. Etiam ex est, porttitor eu sem at, ornare semper quam. Praesent vestibulum risus auctor lacus interdum, et sollicitudin ante cursus. Quisque sit amet lectus tristique, fringilla elit in, pharetra tortor. Pellentesque a massa vitae ligula viverra feugiat ut ut tellus. Aenean semper vitae mauris a convallis. In a tellus sed dolor euismod condimentum. Nunc posuere molestie turpis, vel efficitur enim facilisis ut. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus vestibulum neque et felis consectetur rhoncus. Mauris volutpat laoreet accumsan. Cras ultricies leo diam, in accumsan justo ultricies id. Fusce auctor leo orci, ut vehicula ligula placerat ut.
                </Box>
            </Box>

        </Stack>
    );
}

export default Recommendations;