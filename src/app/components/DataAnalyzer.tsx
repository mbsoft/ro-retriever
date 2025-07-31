interface SummaryStats {
  vehicles: number;
  jobs: number;
  shipments: number;
  options: number;
  uniqueLocations: number;
  totalDistance?: number;
  totalDuration?: number;
}

interface DataAnalyzerProps {
  data: Record<string, unknown> | null;
}

export default function DataAnalyzer({ data }: DataAnalyzerProps) {
  if (!data) return null;

  const analyzeData = (): SummaryStats => {
    const stats: SummaryStats = {
      vehicles: 0,
      jobs: 0,
      shipments: 0,
      options: 0,
      uniqueLocations: 0,
    };

    try {
      // Extract vehicles
      if (data.vehicles && Array.isArray(data.vehicles)) {
        stats.vehicles = data.vehicles.length;
      }

      // Extract jobs
      if (data.jobs && Array.isArray(data.jobs)) {
        stats.jobs = data.jobs.length;
      }

      // Extract shipments
      if (data.shipments && Array.isArray(data.shipments)) {
        stats.shipments = data.shipments.length;
      }

      // Extract options count (options is now an object, not an array)
      if (data.options && typeof data.options === 'object' && !Array.isArray(data.options)) {
        stats.options = Object.keys(data.options).length;
      }

      // Count unique locations from locations.location array
      if (data.locations && typeof data.locations === 'object' && !Array.isArray(data.locations)) {
        const locationsObj = data.locations as Record<string, unknown>;
        if (locationsObj.location && Array.isArray(locationsObj.location)) {
          const locationSet = new Set<string>();
          
          locationsObj.location.forEach((loc: unknown) => {
            if (typeof loc === 'string') {
              locationSet.add(loc);
            }
          });
          
          stats.uniqueLocations = locationSet.size;
        }
      }

      // Calculate total distance if available
      if (data.total_distance !== undefined) {
        stats.totalDistance = Number(data.total_distance);
      }

      // Calculate total duration if available
      if (data.total_duration !== undefined) {
        stats.totalDuration = Number(data.total_duration);
      }

    } catch (error) {
      console.error('Error analyzing data:', error);
    }

    return stats;
  };

  const stats = analyzeData();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        Data Summary Statistics
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.vehicles}</div>
          <div className="text-sm text-blue-700 font-medium">Vehicles</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.jobs}</div>
          <div className="text-sm text-green-700 font-medium">Jobs</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.shipments}</div>
          <div className="text-sm text-purple-700 font-medium">Shipments</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.options}</div>
          <div className="text-sm text-orange-700 font-medium">Options</div>
        </div>
        
        <div className="bg-indigo-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.uniqueLocations}</div>
          <div className="text-sm text-indigo-700 font-medium">Unique Locations</div>
        </div>
      </div>



      {/* Distance and Duration */}
      {(stats.totalDistance !== undefined || stats.totalDuration !== undefined) && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.totalDistance !== undefined && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 font-medium">Total Distance</div>
              <div className="text-xl font-bold text-gray-900">
                {stats.totalDistance.toLocaleString()} km
              </div>
            </div>
          )}
          
          {stats.totalDuration !== undefined && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 font-medium">Total Duration</div>
              <div className="text-xl font-bold text-gray-900">
                {Math.round(stats.totalDuration / 60)} minutes
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        * Statistics are based on the structure of the retrieved JSON data
      </div>
    </div>
  );
} 