import Layout from '../components/Layout';

export default function Settings() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-4">API keys, profile settings, etc.</p>
      </div>
    </Layout>
  );
}
