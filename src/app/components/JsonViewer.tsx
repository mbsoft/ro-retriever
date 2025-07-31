'use client';

import { useState } from 'react';

interface JsonViewerProps {
  data: Record<string, unknown> | null;
  title?: string;
}

interface JsonNodeProps {
  data: unknown;
  level: number;
  path: string;
}

function JsonNode({ data, level, path }: JsonNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed by default
  const indent = level * 20;

  if (data === null) {
    return <span className="text-gray-500">null</span>;
  }

  if (typeof data === 'undefined') {
    return <span className="text-gray-500">undefined</span>;
  }

  if (typeof data === 'string') {
    return <span className="text-green-600">"{data}"</span>;
  }

  if (typeof data === 'number') {
    return <span className="text-blue-600">{data}</span>;
  }

  if (typeof data === 'boolean') {
    return <span className="text-purple-600">{data.toString()}</span>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className="text-gray-500">[]</span>;
    }

    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <span className="text-gray-400">
            {isExpanded ? '▼' : '▶'}
          </span>
          <span className="text-gray-600">[</span>
          <span className="text-gray-500 text-sm">({data.length} items)</span>
          {!isExpanded && <span className="text-gray-600">]</span>}
        </button>
        
        {isExpanded && (
          <div style={{ marginLeft: indent }}>
            {data.map((item, index) => (
              <div key={index} className="flex">
                <span className="text-gray-500 mr-2">{index}:</span>
                <div className="flex-1">
                  <JsonNode
                    data={item}
                    level={level + 1}
                    path={`${path}[${index}]`}
                  />
                </div>
              </div>
            ))}
            <span className="text-gray-600">]</span>
          </div>
        )}
      </div>
    );
  }

  if (typeof data === 'object' && data !== null) {
    const keys = Object.keys(data);
    
    if (keys.length === 0) {
      return <span className="text-gray-500">{'{ }'}</span>;
    }

    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <span className="text-gray-400">
            {isExpanded ? '▼' : '▶'}
          </span>
          <span className="text-gray-600">{'{'}</span>
          <span className="text-gray-500 text-sm">({keys.length} keys)</span>
          {!isExpanded && <span className="text-gray-600">{'}'}</span>}
        </button>
        
        {isExpanded && (
          <div style={{ marginLeft: indent }}>
            {keys.map((key, index) => (
              <div key={key} className="flex">
                <span className="text-red-600 mr-2">"{key}":</span>
                <div className="flex-1">
                  <JsonNode
                    data={(data as Record<string, unknown>)[key]}
                    level={level + 1}
                    path={`${path}.${key}`}
                  />
                </div>
              </div>
            ))}
            <span className="text-gray-600">{'}'}</span>
          </div>
        )}
      </div>
    );
  }

  return <span className="text-gray-500">{String(data)}</span>;
}

export default function JsonViewer({ data, title = "JSON Data" }: JsonViewerProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!data) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          {title}
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          {isExpanded ? 'Collapse All' : 'Expand All'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <JsonNode data={data} level={0} path="root" />
        </div>
      )}
    </div>
  );
} 