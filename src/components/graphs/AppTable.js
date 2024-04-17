import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from "@mui/material";
import BlackButton from '../buttons/BlackButton';


function AppTable({ rows }) {
    const navigate = useNavigate();

    if (rows === null) {
        return (
            <Box
                justifyContent="center"
                alignItems="center"
                display="flex">
                <CircularProgress color="black" />
            </Box>
        )
    }

    return (
        <TableContainer>
            <Table sx={{ width: '100%' }} aria-label="simple table">
                <TableHead sx={{ border: 0 }}>
                    <TableRow sx={{ borderBottom: '1px solid' }}>
                        <TableCell sx={{ border: 0 }}>Date generated</TableCell>
                        <TableCell sx={{ border: 0 }}>Report title</TableCell>
                        <TableCell sx={{ border: 0 }}>Uploaded data file name</TableCell>
                        <TableCell sx={{ border: 0 }}>Product name</TableCell>
                        <TableCell sx={{ border: 0 }}>View</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.length === 0 ?
                        <TableRow
                            sx={{ borderTop: '1px dotted', borderSpacing: 1, '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell sx={{ border: 0 }}>No history found!</TableCell>

                        </TableRow>

                        : rows.map((row) => (
                            <TableRow
                                key={row.date}
                                sx={{ borderTop: '1px dotted', borderSpacing: 1, '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell sx={{ border: 0 }}>{row.date}</TableCell>
                                <TableCell sx={{ border: 0 }}>{row.title}</TableCell>
                                <TableCell sx={{ border: 0 }}>{row.file}</TableCell>
                                <TableCell sx={{ border: 0 }}>{row.name}</TableCell>
                                <TableCell sx={{ border: 0 }} onClick={()=>navigate(`/dashboard?id=${row.id}`)}><BlackButton>Link</BlackButton></TableCell>
                                {/* <TableCell sx={{border: 0}}>
                    <Checkbox iconStyle={{fill: 'white'}} sx={{
                                paddingLeft: 0,
                                '&.Mui-checked': {
                                color: 'white',
                                },
                                 }}/>
                </TableCell> */}
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default AppTable;
