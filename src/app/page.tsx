'use client';

import { useState } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import DataAnalyzer from './components/DataAnalyzer';
import JsonViewer from './components/JsonViewer';

interface RouteOptimizationData {
  requestId: string;
  inputData: Record<string, unknown> | null;
  timestamp: string;
  status: 'loading' | 'success' | 'error';
  error?: string;
  location?: string;
  sourceBucket?: string;
}

export default function RouteOptimizationRetriever() {
  const [requestId, setRequestId] = useState('');
  const [data, setData] = useState<RouteOptimizationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestId.trim()) return;

    setIsLoading(true);
    setData({
      requestId: requestId.trim(),
      inputData: null,
      timestamp: new Date().toISOString(),
      status: 'loading'
    });

    try {
      const response = await fetch('/api/retrieve-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId: requestId.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to retrieve request data');
      }

      setData({
        requestId: requestId.trim(),
        inputData: result.data,
        timestamp: new Date().toISOString(),
        status: 'success',
        location: result.location,
        sourceBucket: result.sourceBucket
      });
    } catch (error) {
      setData({
        requestId: requestId.trim(),
        inputData: null,
        timestamp: new Date().toISOString(),
        status: 'error',
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (data?.inputData) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(data.inputData, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  const handleDownloadJSON = () => {
    if (data?.inputData) {
      const jsonString = JSON.stringify(data.inputData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.requestId}-input.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Route Optimization Request Retriever
          </h1>
          <p className="text-lg text-gray-600">
            Retrieve input data from NextBillion route optimization service
          </p>
        </div>

        {/* Request Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="requestId" className="block text-base font-semibold text-gray-900 mb-2">
                Request ID
              </label>
              <input
                type="text"
                id="requestId"
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
                placeholder="Enter the route optimization request ID"
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 font-medium"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !requestId.trim()}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Retrieving...' : 'Retrieve Request Data'}
            </button>
          </form>
        </div>

        {/* Results Display */}
        {data && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Request Results
              </h2>
              <div className="text-sm text-gray-500">
                {new Date(data.timestamp).toLocaleString()}
              </div>
            </div>

            <div className="mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                data.status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
                data.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  data.status === 'loading' ? 'bg-yellow-500' :
                  data.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                {data.status === 'loading' ? 'Loading...' :
                 data.status === 'success' ? 'Success' : 'Error'}
              </span>
              <span className="ml-2 text-sm font-medium text-gray-700">
                Request ID: {data.requestId}
              </span>
              {data.status === 'success' && data.location && (
                <span className="ml-2 text-sm font-medium text-blue-700">
                  • Location: {data.location}
                </span>
              )}
            </div>

            {data.status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error retrieving request data
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {data.error}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {data.status === 'success' && data.inputData && (
              <div className="space-y-6">
                {/* Summary Statistics */}
                <DataAnalyzer data={data.inputData} />
                
                {/* JSON Data */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">

                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopyToClipboard}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {copied ? (
                          <>
                            <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy JSON
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleDownloadJSON}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download JSON
                      </button>
                    </div>
                  </div>
                  <JsonViewer data={data.inputData} title="Input Data" />
                </div>
              </div>
            )}

            {data.status === 'loading' && (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner 
                  size="lg" 
                  text="Retrieving data from NextBillion storage..." 
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
