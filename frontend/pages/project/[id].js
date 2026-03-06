import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import LogViewer from '../../components/Dashboard/LogViewer';
import { useAuth } from '../../contexts/AuthContext';

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useAuth();
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (!id || !token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProject(data))
      .catch(err => console.error(err));
  }, [id, token]);

  if (!project) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">Type: {project.type} | Status: {project.status}</p>
        {project.port && <p>Access at: http://localhost:{project.port}</p>}

        <h2 className="text-xl font-semibold mt-6 mb-2">Real-time Logs</h2>
        <LogViewer projectId={id} token={token} />
      </div>
    </Layout>
  );
}
