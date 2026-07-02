const express = require('express');
const app = express();
app.use(express.json({ limit: '10mb' }));

const DELTAAI_URL = process.env.DELTAAI_URL || 'https://kopabdo-delta-ai-v2.hf.space';
const JOB_SECRET = process.env.JOB_SECRET || 'your-job-webhook-secret';

app.get('/', (req, res) => res.json({ status: 'ok', service: 'Webhook Handler' }));
app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

app.post('/webhook/deltaai', async (req, res) => {
  const { job_id, type, inputs } = req.body;
  if (!job_id) return res.status(400).json({ error: 'job_id required' });
  res.json({ success: true, job_id });
  
  try {
    let result = { processed: true, type, inputs };
    switch (type) {
      case 'test': result.message = 'Test completed'; break;
      case 'echo': result.echo = inputs; break;
      default: result.message = 'Workflow completed';
    }
    await new Promise(r => setTimeout(r, 1000));
    
    await fetch(`${DELTAAI_URL}/api/mcp/job-complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Job-Secret': JOB_SECRET },
      body: JSON.stringify({ job_id, status: 'done', result, progress: 100 }),
    });
  } catch (err) {
    console.error(`[Job ${job_id}] Error:`, err.message);
  }
});

app.listen(7860, '0.0.0.0', () => console.log('Webhook handler on port 7860'));
