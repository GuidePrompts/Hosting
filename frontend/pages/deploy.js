import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

export default function Deploy() {
  const { token } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', type: 'telegram', envVars: '{}' });
  const [file, setFile] = useState(null);
  const [deploying, setDeploying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    setDeploying(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('type', form.type);
    formData.append('env_vars', form.envVars);
    formData.append('file', file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (res.ok) {
      const project = await res.json();
      router.push(`/project/${project.id}`);
    } else {
      alert('Deployment failed');
    }
    setDeploying(false);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deploy New Service</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="mt-1 block w-full border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600">
              <option value="telegram">Telegram Bot</option>
              <option value="discord">Discord Bot</option>
              <option value="flask">Flask API</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Environment Variables (JSON)</label>
            <textarea value={form.envVars} onChange={e => setForm({...form, envVars: e.target.value})} rows={4} className="mt-1 block w-full border-gray-300 rounded-md font-mono dark:bg-gray-800 dark:border-gray-600" placeholder='{"BOT_TOKEN": "xxx"}' />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Code (ZIP or .py)</label>
            <input type="file" onChange={e => setFile(e.target.files[0])} accept=".zip,.py" className="mt-1 block w-full" required />
          </div>
          <button type="submit" disabled={deploying} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50">
            {deploying ? 'Deploying...' : 'Deploy'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
