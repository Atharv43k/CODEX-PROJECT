import { CalculationRequest, CalculationResponse, ApiHealthResponse, SimulationResult } from '../types/academic';

export async function calculateAcademicPerformance(
  request: CalculationRequest
): Promise<{ data: CalculationResponse; latencyMs: number }> {
  const startTime = performance.now();
  const response = await fetch('/api/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const latencyMs = Math.round(performance.now() - startTime);

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: Failed to calculate`;
    try {
      const errJson = await response.json();
      if (errJson.error) errorMessage = errJson.error;
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  const data: CalculationResponse = await response.json();
  return { data, latencyMs };
}

export async function checkBackendHealth(): Promise<ApiHealthResponse> {
  const response = await fetch('/api/health');
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`);
  }
  return response.json();
}

export async function simulateTargetCgpa(params: {
  current_cgpa: number;
  current_credits: number;
  target_cgpa: number;
  future_credits: number;
}): Promise<SimulationResult> {
  const response = await fetch('/api/simulate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Simulation failed');
  }

  return response.json();
}
