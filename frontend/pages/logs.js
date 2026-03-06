import Layout from '../components/Layout';

export default function Logs() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Logs</h1>
        <p className="mt-4">Aggregated logs from all projects.</p>
      </div>
    </Layout>
  );
}
