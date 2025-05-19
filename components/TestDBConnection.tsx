import { useState } from 'react';

export default function TestDBConnection() {
  const [status, setStatus] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
    envState?: any;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      setStatus({
        success: false,
        message: 'Failed to test connection',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-4">Database Connection Test</h3>
      
      <button
        onClick={testConnection}
        disabled={isLoading}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Test Connection'}
      </button>

      {status.message && (
        <div className={`mt-4 p-4 rounded-lg ${
          status.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <p className="font-medium">{status.message}</p>
          {status.error && <p className="mt-2 text-sm">{status.error}</p>}
          {status.envState && (
            <div className="mt-2 text-sm">
              <p>Environment State:</p>
              <pre className="mt-1 p-2 bg-black/5 rounded overflow-auto">
                {JSON.stringify(status.envState, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 