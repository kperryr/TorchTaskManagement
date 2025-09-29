import app, { startServer } from './app';
import { env } from './config/env';

const PORT = env.port;

const start = async () => {
  try {
    await startServer(); 
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();