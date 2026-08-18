import { useQuery } from '@tanstack/react-query';

interface ServerStatusResponse {
  online: boolean;
  players: {
    online: number;
    max: number;
  };
  version: string;
  motd: string;
}

export function useServerStatus(serverAddress: string) {
  const fetchStatus = async (): Promise<ServerStatusResponse> => {
    const res = await fetch(`https://api.mcsrvstat.us/2/${serverAddress}`);
    if (!res.ok) throw new Error('Failed to fetch server status');
    const data = await res.json();
    return {
      online: data.online,
      players: {
        online: data.players?.online || 0,
        max: data.players?.max || 0,
      },
      version: data.version || 'Unknown',
      motd: data.motd?.clean?.[0] || 'A Minecraft Server',
    };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['serverStatus', serverAddress],
    queryFn: fetchStatus,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  return { 
    status: data || null, 
    loading: isLoading, 
    error: error instanceof Error ? error.message : null 
  };
}