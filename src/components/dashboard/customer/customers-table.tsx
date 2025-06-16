'use client';

import React, { useCallback, useState } from 'react';
import dayjs from 'dayjs';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { User } from '@/redux/slices/customerSlice';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { AllCommunityModule, ColDef, ICellRendererParams, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';

import { deleteCustomer, fetchCustomer } from '@/lib/api/auth/customersApi';

import AddCustomerForm from './add-customers';

ModuleRegistry.registerModules([AllCommunityModule]);

interface ActionCellRendererParams extends ICellRendererParams {
  setEditProduct: React.Dispatch<React.SetStateAction<User | null>>;
  fetchData: () => Promise<void>;
}

const ActionsCellRenderer: React.FC<ActionCellRendererParams> = (props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    props.setEditProduct(props.data);
    handleClose();
  };

  const handleDelete = async () => {
    try {
      const actionResult = await dispatch(deleteCustomer(props.data._id));
      if (deleteCustomer.fulfilled.match(actionResult)) {
        toast.success('customer deleted successfully');
        props.fetchData();
      } else {
        toast.error('Failed to delete Customer');
      }
    } catch (err: any) {
      toast.error(err.message || 'Something Went Wrong');
    }
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <MoreVertIcon sx={{ color: 'white' }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { backgroundColor: '#1e1e1e', color: 'white' } }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
};

const InventoryTable = () => {
  const [clients, setClients] = useState<User[]>([]);
  const [editProduct, setEditProduct] = useState<User | null>(null);
  const { loading, customers } = useAppSelector((state) => state.customers);
  const dispatch = useAppDispatch();

  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);

  const fetchData = React.useCallback(async (): Promise<void> => {
    try {
      const data = await dispatch(fetchCustomer()).unwrap();
      if (data?.customers) {
        setClients(
          data.customers.map((client: any) => ({
            ...client,
            id: client._id,
          }))
        );
      } else {
        toast.error('Failed to fetch clients');
      }
    } catch (error) {
      console.error('Error fetching client:', error);
    }
  }, [dispatch]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columnDefs: ColDef<User>[] = [
    {
      headerName: 'ID',
      field: '_id',
      sortable: true,
      headerClass: 'smoke-white-header',
      flex: 4,
    },
    {
      headerName: 'Name',
      field: 'name',
      sortable: true,
      headerClass: 'smoke-white-header',
      cellRenderer: (params: ICellRendererParams) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src={params.data.image ? `http://localhost:8001/uploads/${params.data.image}` : undefined}
              alt="Image"
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
            <span>{params.value}</span>
          </div>
        );
      },
      flex: 4,
    },
    {
      headerName: 'location',
      field: 'location',
      sortable: true,
      headerClass: 'smoke-white-header',
      flex: 4,
    },

    {
      headerName: 'Email',
      field: 'email',
      sortable: true,
      headerClass: 'smoke-white-header',
      flex: 4,
    },
    {
      headerName: 'Phone',
      field: 'phone',
      sortable: true,
      headerClass: 'smoke-white-header',
      flex: 4,
    },
    {
      headerName: 'Joined Date',
      field: 'joinedDate',
      sortable: true,
      valueFormatter: (params) => dayjs(params.value).format('MMM D, YYYY'),
      headerClass: 'smoke-white-header',
      flex: 2,
    },
    {
      headerName: '',
      width: 80,
      cellRenderer: (params: ICellRendererParams) => (
        <ActionsCellRenderer {...params} setEditProduct={setEditProduct} fetchData={fetchData} />
      ),
      menuTabs: [],
      sortable: false,
      headerClass: 'smoke-white-header',
      flex: 2,
    },
  ];

  const getRowHeight = useCallback((params: any) => {
    return params.data?.rowHeight || 70;
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['ID', 'Name', 'location', 'phone', 'joinedDate', 'email'];
    const tableRows: string[][] = [];

    const filteredData = customers.filter((inv: any) => {
      const joined = dayjs(inv.joinedDate);
      if (startDate && joined.isBefore(startDate, 'day')) return false;
      if (endDate && joined.isAfter(endDate, 'day')) return false;
      return true;
    });

    filteredData.forEach((inv: any) => {
      const row: string[] = [inv._id, inv.name, inv.location, dayjs(inv.joinedDate).format('MMM D, YYYY')];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
    });

    doc.save('inventory-report.pdf');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Stack direction="row" spacing={3} sx={{ marginBottom: 4 }}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Stock Inventory</Typography>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
              <DatePicker label="End Date" value={endDate} onChange={setEndDate} />
            </LocalizationProvider>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />} onClick={exportPDF}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <AddCustomerForm editProduct={editProduct} setEditProduct={setEditProduct} fetchData={fetchData} />
        </div>
      </Stack>

      <div className="p-6 bg-gray-900 text-white rounded-lg shadow-xl">
        <div className="ag-theme-alpine-dark rounded-lg shadow-lg">
          <AgGridReact
            rowData={customers}
            columnDefs={columnDefs}
            defaultColDef={{
              flex: 1,
              filter: true,
              sortable: true,
            }}
            getRowHeight={getRowHeight}
            pagination={true}
            paginationPageSize={5}
            paginationPageSizeSelector={[100, 200, 400]}
            rowSelection="multiple"
          />
        </div>
      </div>
    </>
  );
};

export default InventoryTable;
