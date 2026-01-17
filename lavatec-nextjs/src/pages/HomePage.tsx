import { Box, Typography } from '@mui/material'

const HomePage = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1">
        Bem-vindo ao Lavatec
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Sistema de Gerenciamento de Lavanderia
      </Typography>
    </Box>
  )
}

export default HomePage 