import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProjectCard from '../components/Dashboard/ProjectCard';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error(err));
  }, [token]);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
