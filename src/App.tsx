import { Box, Container } from "@chakra-ui/react";
import { Header } from "@/components";
import { Router } from "@/Router";

function App() {
  return (
    <Box bg="gray.50" minHeight="100vh">
      <Header />
      <Container py={8}>
        <Router />
      </Container>
    </Box>
  );
}

export default App;
