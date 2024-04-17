import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Overview from './Overview';
import Detailed from './Detailed';
import Recommendations from './Recommendations';


function Analytics({ refProp, data, rawData }) {
    return (
        <Stack ref={refProp}
            direction="column"
            spacing={2}>
            <Overview data={rawData}/>
            <Detailed data={data}/>
            {/* <Recommendations /> */}
            <Box />
        </Stack>
    );
}

export default Analytics;