import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export default function LogViewer({ projectId, token }) {
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  useEffect(() => {
    if (!token || !projectId) return;
    const socket = io(process.env.NEXT_PUBLIC_WS_URL, {
      path: '/ws/logs/' + projectId,
      query: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to log stream');
    });

    socket.on('message', (log) => {
      setLogs(prev => [...prev, log]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    return () => socket.disconnect();
  }, [projectId, token]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
      {logs.map((log, i) => (
        <div key={i} className="whitespace-pre-wrap">{log}</div>
      ))}
      <div ref={logsEndRef} />
    </div>
  );
}
