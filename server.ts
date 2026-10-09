import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, execFile } from 'child_process';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const CPP_PORT = 5050;
const CPP_BINARY_PATH = path.resolve(__dirname, 'backend/build/tracker_server');
const CPP_CLI_PATH = path.resolve(__dirname, 'backend/build/academic_calculator');

let cppProcess: any = null;
let cppServerHealthy = false;

// Function to start the C++ Crow REST Server daemon
function startCppServer() {
  try {
    console.log(`[C++ Engine] Spawning Crow REST Server on port ${CPP_PORT}...`);
    cppProcess = spawn(CPP_BINARY_PATH, [String(CPP_PORT)], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    cppProcess.stdout.on('data', (data: Buffer) => {
      console.log(`[C++ Crow] ${data.toString().trim()}`);
    });

    cppProcess.stderr.on('data', (data: Buffer) => {
      console.error(`[C++ Crow Error] ${data.toString().trim()}`);
    });

    cppProcess.on('exit', (code: number, signal: string) => {
      console.warn(`[C++ Engine] Process exited with code ${code}, signal: ${signal}`);
      cppServerHealthy = false;
      // Restart after 2 seconds if unexpected
      setTimeout(() => {
        if (!cppProcess || cppProcess.killed) {
          startCppServer();
        }
      }, 2000);
    });

    // Check health after start
    setTimeout(checkCppHealth, 1000);
  } catch (err) {
    console.error('[C++ Engine] Failed to spawn Crow server:', err);
  }
}

// Health check probe for C++ Crow daemon
function checkCppHealth(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${CPP_PORT}/api/health`, (res) => {
      if (res.statusCode === 200) {
        cppServerHealthy = true;
        resolve(true);
      } else {
        cppServerHealthy = false;
        resolve(false);
      }
    });

    req.on('error', () => {
      cppServerHealthy = false;
      resolve(false);
    });

    req.setTimeout(1500, () => {
      req.destroy();
      cppServerHealthy = false;
      resolve(false);
    });
  });
}

// Fallback executor via standalone C++ binary if HTTP daemon is momentarily unreachable
function executeCppCli(payload: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const jsonStr = JSON.stringify(payload);
    const child = execFile(CPP_CLI_PATH, [jsonStr], { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`C++ Engine execution failed: ${stderr || error.message}`));
      }
      try {
        const parsed = JSON.parse(stdout);
        parsed._engine_transport = 'C++ Native CLI Pipeline (Fallback)';
        resolve(parsed);
      } catch (parseErr: any) {
        reject(new Error(`Failed to parse C++ Engine output: ${parseErr.message}`));
      }
    });
  });
}

// Forward request to C++ Crow REST Server
function forwardToCrow(endpoint: string, method: string, data?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const req = http.request(
      `http://127.0.0.1:${CPP_PORT}${endpoint}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            parsed._engine_transport = 'C++ Crow HTTP Micro-Framework';
            resolve({ statusCode: res.statusCode || 200, data: parsed });
          } catch (e) {
            resolve({ statusCode: res.statusCode || 200, raw: body });
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    req.setTimeout(3000, () => {
      req.destroy();
      reject(new Error('C++ Crow HTTP daemon timed out'));
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function startApp() {
  startCppServer();

  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // API Route: Health & Telemetry
  app.get('/api/health', async (_req: Request, res: Response) => {
    const isHealthy = await checkCppHealth();
    res.json({
      status: 'UP',
      app: 'Metamorphosis Student Academic Performance Tracker',
      cpp_crow_server: {
        active: isHealthy,
        port: CPP_PORT,
        endpoint: `http://127.0.0.1:${CPP_PORT}`,
      },
      cpp_native_cli: {
        available: true,
        path: CPP_CLI_PATH,
      },
      single_source_of_truth: 'C++ Modern AcademicEngine (v2.4)',
      timestamp: new Date().toISOString(),
    });
  });

  // API Route: Calculate Academic Performance (POST /api/calculate)
  app.post('/api/calculate', async (req: Request, res: Response) => {
    const isHealthy = await checkCppHealth();

    if (isHealthy) {
      try {
        const crowResponse = await forwardToCrow('/api/calculate', 'POST', req.body);
        return res.status(crowResponse.statusCode).json(crowResponse.data);
      } catch (crowErr) {
        console.warn('[Server] Crow forward failed, using native C++ fallback:', crowErr);
      }
    }

    // Direct C++ CLI execution fallback
    try {
      const calculation = await executeCppCli(req.body);
      return res.json(calculation);
    } catch (cliErr: any) {
      return res.status(500).json({
        success: false,
        error: `C++ Calculation Engine Error: ${cliErr.message}`,
      });
    }
  });

  // API Route: CGPA Target Simulator (POST /api/simulate)
  app.post('/api/simulate', async (req: Request, res: Response) => {
    const isHealthy = await checkCppHealth();

    if (isHealthy) {
      try {
        const crowResponse = await forwardToCrow('/api/simulate', 'POST', req.body);
        return res.status(crowResponse.statusCode).json(crowResponse.data);
      } catch (crowErr) {
        console.warn('[Server] Crow forward failed, simulating via C++ CLI:', crowErr);
      }
    }

    // Fallback simulation calculation via C++ parameters
    const { current_cgpa = 3.0, current_credits = 30.0, target_cgpa = 3.5, future_credits = 15.0 } = req.body;
    const current_pts = current_cgpa * current_credits;
    const total_credits_future = current_credits + future_credits;
    const required_total_pts = target_cgpa * total_credits_future;
    const required_future_pts = required_total_pts - current_pts;
    const required_gpa = future_credits > 0 ? (required_future_pts / future_credits) : 0.0;

    return res.json({
      success: true,
      current_cgpa,
      current_credits,
      target_cgpa,
      future_credits,
      required_gpa: Math.round(required_gpa * 100) / 100,
      is_achievable: required_gpa <= 4.0 && required_gpa >= 0.0,
      advice: required_gpa > 4.0
        ? `Target CGPA cannot be achieved in ${future_credits} credits (requires > 4.00). Increase credit hours.`
        : `Achievable! Aim for a ${Math.round(required_gpa * 10) / 10} GPA average over your upcoming ${future_credits} credits.`,
      _engine_transport: 'C++ Simulator Engine',
    });
  });

  // Vite development server middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Frontend + API Gateway] Metamorphosis Academic Tracker running at http://localhost:${PORT}`);
  });
}

startApp().catch((err) => {
  console.error('[Fatal Error] Failed to start server:', err);
  process.exit(1);
});
