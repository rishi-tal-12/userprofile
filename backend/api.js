import express from 'express';
import { generateWalletPersonaScores } from './deepseek.js';


const app = express();

app.use(express.json());

app.post('/api/persona', async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  try {
    const personaScores = await generateWalletPersonaScores(address);
    if (!personaScores) {
      return res.status(500).json({ error: 'Could not generate persona score at the moment, Please try again' });
    }
    res.json(personaScores);
  } catch (error) {
    console.error('Error generating persona scores:', error);
    res.status(500).json({ error: 'Error in generating persona scores' });
  }
}
);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
}
);