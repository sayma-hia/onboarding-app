import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" align="center">
          Onboarding
        </Typography>
      </Container>
    </Box>
  )
}

export default App
