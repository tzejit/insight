import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';


function createData(
    name,
    calories,
    fat,
    carbs,
    protein,
  ) {
    return { name, calories, fat };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

function AppTable() {
    return (
      <TableContainer>
        <Table sx={{ width: '100%' }} aria-label="simple table">
          <TableHead sx={{border: 0}}>
            <TableRow sx={{borderBottom: '1px solid'}}>
              <TableCell sx={{border: 0}}>Date generated</TableCell>
              <TableCell sx={{border: 0}}>Report title</TableCell>
              <TableCell sx={{border: 0}}>Uploaded data file name</TableCell>
              <TableCell sx={{border: 0}}>Select</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{  borderTop: '1px dotted', borderSpacing: 1, '&:last-child td, &:last-child th': { border: 0 }}}
              >
                <TableCell sx={{border: 0}}>{row.name}</TableCell>
                <TableCell sx={{border: 0}}>{row.calories}</TableCell>
                <TableCell sx={{border: 0}}>{row.fat}</TableCell>
                <TableCell sx={{border: 0}}>
                    <Checkbox iconStyle={{fill: 'white'}} sx={{
                                paddingLeft: 0,
                                '&.Mui-checked': {
                                color: 'white',
                                },
                                 }}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

export default AppTable;
