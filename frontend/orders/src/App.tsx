import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Add, Edit, Delete, ShoppingCart, CheckCircle, Pending, LocalShipping } from '@mui/icons-material';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryAddress: string;
  customerName: string;
  customerEmail: string;
}

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    deliveryAddress: '',
    status: 'pending'
  });

  const statusColors = {
    pending: 'warning',
    confirmed: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'error'
  };

  const statusLabels = {
    pending: 'Čaka potrditev',
    confirmed: 'Potrjeno',
    shipped: 'Poslano',
    delivered: 'Dostavljeno',
    cancelled: 'Preklicano'
  };

  const statusIcons = {
    pending: <Pending />,
    confirmed: <CheckCircle />,
    shipped: <LocalShipping />,
    delivered: <CheckCircle />,
    cancelled: <Delete />
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/orders');
      if (!response.ok) {
        throw new Error('Napaka pri nalaganju naročil');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Neznana napaka');
      // Mock data for demonstration
      setOrders([
        {
          id: '1',
          userId: 'user1',
          items: [
            {
              id: 'item1',
              productId: 'prod1',
              productName: 'Premium hrana za pse',
              quantity: 2,
              price: 29.99
            }
          ],
          totalAmount: 59.98,
          status: 'confirmed',
          orderDate: '2024-01-15',
          deliveryAddress: 'Slovenska cesta 1, Ljubljana',
          customerName: 'Janez Novak',
          customerEmail: 'janez.novak@email.com'
        },
        {
          id: '2',
          userId: 'user2',
          items: [
            {
              id: 'item2',
              productId: 'prod2',
              productName: 'Igrače za mačke',
              quantity: 1,
              price: 15.99
            }
          ],
          totalAmount: 15.99,
          status: 'shipped',
          orderDate: '2024-01-14',
          deliveryAddress: 'Mariborska cesta 5, Maribor',
          customerName: 'Maja Kovač',
          customerEmail: 'maja.kovac@email.com'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = () => {
    setEditingOrder(null);
    setFormData({
      customerName: '',
      customerEmail: '',
      deliveryAddress: '',
      status: 'pending'
    });
    setOpenDialog(true);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      deliveryAddress: order.deliveryAddress,
      status: order.status
    });
    setOpenDialog(true);
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setOrders(orders.filter(order => order.id !== id));
      }
    } catch (err) {
      console.error('Napaka pri brisanju naročila:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editingOrder 
        ? `http://localhost:3001/api/orders/${editingOrder.id}`
        : 'http://localhost:3001/api/orders';
      
      const method = editingOrder ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchOrders();
        setOpenDialog(false);
      }
    } catch (err) {
      console.error('Napaka pri shranjevanju naročila:', err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          <ShoppingCart sx={{ mr: 1, verticalAlign: 'middle' }} />
          Moja Naročila
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateOrder}
        >
          Novo naročilo
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Naročilo #{order.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Datum: {new Date(order.orderDate).toLocaleDateString('sl-SI')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      icon={statusIcons[order.status]}
                      label={statusLabels[order.status]}
                      color={statusColors[order.status] as any}
                      size="small"
                    />
                    <Typography variant="h6" color="primary">
                      {order.totalAmount}€
                    </Typography>
                  </Box>
                </Box>

                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Izdelek</TableCell>
                        <TableCell align="right">Količina</TableCell>
                        <TableCell align="right">Cena</TableCell>
                        <TableCell align="right">Skupaj</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">{item.price}€</TableCell>
                          <TableCell align="right">{(item.quantity * item.price).toFixed(2)}€</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Stranka:</strong> {order.customerName} ({order.customerEmail})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Naslov dostave:</strong> {order.deliveryAddress}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleEditOrder(order)}
                  >
                    Uredi
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Izbriši
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingOrder ? 'Uredi naročilo' : 'Novo naročilo'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Ime stranke"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.customerEmail}
            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Naslov dostave"
            value={formData.deliveryAddress}
            onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              label="Status"
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Prekliči</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingOrder ? 'Posodobi' : 'Ustvari'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App; 