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

      // Extract options
      if (data.options && Array.isArray(data.options)) {
        stats.options = data.options.length;
      }

      // Count unique locations from various sources
      const locations = new Set<string>();

      // From vehicles
      if (data.vehicles && Array.isArray(data.vehicles)) {
        data.vehicles.forEach((vehicle: Record<string, unknown>) => {
          if (vehicle.start_location) {
            locations.add(JSON.stringify(vehicle.start_location));
          }
          if (vehicle.end_location) {
            locations.add(JSON.stringify(vehicle.end_location));
          }
        });
      }

      // From jobs
      if (data.jobs && Array.isArray(data.jobs)) {
        data.jobs.forEach((job: Record<string, unknown>) => {
          if (job.location) {
            locations.add(JSON.stringify(job.location));
          }
          if (job.pickup_location) {
            locations.add(JSON.stringify(job.pickup_location));
          }
          if (job.delivery_location) {
            locations.add(JSON.stringify(job.delivery_location));
          }
        });
      }

      // From shipments
      if (data.shipments && Array.isArray(data.shipments)) {
        data.shipments.forEach((shipment: Record<string, unknown>) => {
          if (shipment.pickup_location) {
            locations.add(JSON.stringify(shipment.pickup_location));
          }
          if (shipment.delivery_location) {
            locations.add(JSON.stringify(shipment.delivery_location));
          }
        });
      }

      // From options
      if (data.options && Array.isArray(data.options)) {
        data.options.forEach((option: Record<string, unknown>) => {
          if (option.location) {
            locations.add(JSON.stringify(option.location));
          }
        });
      }

      stats.uniqueLocations = locations.size;

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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📊 Data Summary Statistics
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