import { DataGrid } from '@mui/x-data-grid';


import {FC} from 'react';

// interface Student  {
//     id: number;
//     name: string;
//     location: string;
//     timestamp: string;
// }



    // const [tableData, setTableData] = useState([])

    // useEffect(() => {
    //     fetch("https://jsonplaceholder.typicode.com/posts") //TODO: replace with real call
    //     .then((data) => data.json())
    //     .then((data) => setTableData(data))
    //
    // }, [])


    const rows = [
        {id:1, name: "john doe", location:"inside", lastModified: "234234"},
        {id:2, name: "jane doe", location:"outside", lastModified: "12312312"},
        {id:3, name: "jim doe", location:"outside", lastModified: "12312312"},
    ]


    const columns = [
        { field: 'id', headerName: 'ID' },
        { field: 'name', headerName: 'Name'},
        { field: 'location', headerName: 'Location'},
        { field: 'lastModified', headerName: 'Last Modified'},

    ]

export const ClassroomView: FC = () => {
        return (
        <div style={{ height: 700, width: '100%' }}>
            <DataGrid
            rows={rows}
            columns={columns}
            // autoPageSize=True
            />
        </div>
    );
};