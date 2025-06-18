import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
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
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, LocalOffer } from '@mui/icons-material';

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  category: string;
  imageUrl: string;
  validUntil: string;
  isActive: boolean;
}

const App: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount: '',
    category: '',
    imageUrl: '',
    validUntil: ''
  });

  const categories = ['Hrana', 'Igrače', 'Oprema', 'Zdravje', 'Higiena'];

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/offers');
      if (!response.ok) {
        throw new Error('Napaka pri nalaganju ponudb');
      }
      const data = await response.json();
      setOffers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Neznana napaka');
      // Mock data for demonstration
      setOffers([
        {
          id: '1',
          title: 'Premium hrana za pse',
          description: 'Visokokakovostna hrana za vse starosti psov',
          price: 29.99,
          discount: 20,
          category: 'Hrana',
          imageUrl: 'https://via.placeholder.com/300x200?text=Premium+Hrana',
          validUntil: '2024-12-31',
          isActive: true
        },
        {
          id: '2',
          title: 'Igrače za mačke',
          description: 'Različne igrače za zabavo vaših mačk',
          price: 15.99,
          discount: 15,
          category: 'Igrače',
          imageUrl: 'https://via.placeholder.com/300x200?text=Igrače+za+Mačke',
          validUntil: '2024-11-30',
          isActive: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffer = () => {
    setEditingOffer(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      discount: '',
      category: '',
      imageUrl: '',
      validUntil: ''
    });
    setOpenDialog(true);
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      price: offer.price.toString(),
      discount: offer.discount.toString(),
      category: offer.category,
      imageUrl: offer.imageUrl,
      validUntil: offer.validUntil
    });
    setOpenDialog(true);
  };

  const handleDeleteOffer = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/offers/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setOffers(offers.filter(offer => offer.id !== id));
      }
    } catch (err) {
      console.error('Napaka pri brisanju ponudbe:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      const offerData = {
        ...formData,
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount)
      };

      const url = editingOffer 
        ? `http://localhost:3001/api/offers/${editingOffer.id}`
        : 'http://localhost:3001/api/offers';
      
      const method = editingOffer ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(offerData)
      });

      if (response.ok) {
        await fetchOffers();
        setOpenDialog(false);
      }
    } catch (err) {
      console.error('Napaka pri shranjevanju ponudbe:', err);
    }
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return (price * (1 - discount / 100)).toFixed(2);
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
          <LocalOffer sx={{ mr: 1, verticalAlign: 'middle' }} />
          Ponudbe in Popusti
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateOffer}
        >
          Dodaj ponudbo
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {offers.map((offer) => (
          <Grid item xs={12} sm={6} md={4} key={offer.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={offer.imageUrl}
                alt={offer.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {offer.title}
                  </Typography>
                  <Chip 
                    label={`-${offer.discount}%`} 
                    color="error" 
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {offer.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', mr: 1 }}>
                    {offer.price}€
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {calculateDiscountedPrice(offer.price, offer.discount)}€
                  </Typography>
                </Box>

                <Chip label={offer.category} size="small" sx={{ mb: 2 }} />
                
                <Typography variant="caption" color="text.secondary" display="block">
                  Velja do: {new Date(offer.validUntil).toLocaleDateString('sl-SI')}
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleEditOffer(offer)}
                  >
                    Uredi
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDeleteOffer(offer.id)}
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
          {editingOffer ? 'Uredi ponudbo' : 'Dodaj novo ponudbo'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Naslov"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Opis"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Cena (€)"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Popust (%)"
            type="number"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Kategorija</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              label="Kategorija"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="URL slike"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Velja do"
            type="date"
            value={formData.validUntil}
            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Prekliči</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingOffer ? 'Posodobi' : 'Dodaj'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App; 