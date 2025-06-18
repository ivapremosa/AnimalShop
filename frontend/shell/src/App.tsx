import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import { Pets, ShoppingCart, LocalOffer, Person } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Micro frontend loading states :)
  const [authLoaded, setAuthLoaded] = useState(false);
  const [offersLoaded, setOffersLoaded] = useState(false);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  const HomePage: React.FC = () => (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        🐾 Dobrodošli v AnimalShop 🐾
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
        Vaša trgovina za hišne ljubljenčke
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <LocalOffer sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Ponudbe in Popusti
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Raziskujte najnovejše ponudbe in popuste za vaše hišne ljubljenčke.
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/offers"
                sx={{ mt: 2 }}
                fullWidth
              >
                Poglej ponudbe
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <ShoppingCart sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Naročila
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Upravljajte svoja naročila in spremljajte status dostave.
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/orders"
                sx={{ mt: 2 }}
                fullWidth
              >
                Moja naročila
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Person sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Uporabniški profil
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Upravljajte svoj profil in nastavitve računa.
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/auth"
                sx={{ mt: 2 }}
                fullWidth
              >
                {isLoggedIn ? 'Moj profil' : 'Prijava'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {!isLoggedIn && (
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Za polno funkcionalnost se prijavite
          </Typography>
          <Button
            variant="outlined"
            component={Link}
            to="/auth"
            size="large"
          >
            Prijava / Registracija
          </Button>
        </Box>
      )}
    </Container>
  );

  const AuthMicroFrontend: React.FC = () => (
    <div id="auth-micro-frontend">
      <iframe
        src="http://localhost:3002/auth"
        style={{ width: '100%', height: '80vh', border: 'none' }}
        onLoad={() => setAuthLoaded(true)}
      />
    </div>
  );

  const OffersMicroFrontend: React.FC = () => (
    <div id="offers-micro-frontend">
      <iframe
        src="http://localhost:3003/offers"
        style={{ width: '100%', height: '80vh', border: 'none' }}
        onLoad={() => setOffersLoaded(true)}
      />
    </div>
  );

  const OrdersMicroFrontend: React.FC = () => (
    <div id="orders-micro-frontend">
      <iframe
        src="http://localhost:3004/orders"
        style={{ width: '100%', height: '80vh', border: 'none' }}
        onLoad={() => setOrdersLoaded(true)}
      />
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Pets sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                AnimalShop
              </Typography>
              <Button color="inherit" component={Link} to="/">
                Domov
              </Button>
              <Button color="inherit" component={Link} to="/offers">
                Ponudbe
              </Button>
              <Button color="inherit" component={Link} to="/orders">
                Naročila
              </Button>
              {isLoggedIn ? (
                <>
                  <Button color="inherit" component={Link} to="/auth">
                    {currentUser?.name || 'Profil'}
                  </Button>
                  <Button color="inherit" onClick={handleLogout}>
                    Odjava
                  </Button>
                </>
              ) : (
                <Button color="inherit" component={Link} to="/auth">
                  Prijava
                </Button>
              )}
            </Toolbar>
          </AppBar>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthMicroFrontend />} />
            <Route path="/offers" element={<OffersMicroFrontend />} />
            <Route path="/orders" element={<OrdersMicroFrontend />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App; 