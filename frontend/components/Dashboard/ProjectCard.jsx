import Link from 'next/link';
import { FaPlay, FaStop, FaSyncAlt, FaTrash } from 'react-icons/fa';

export default function ProjectCard({ project }) {
  const statusColor = {
    running: 'text-green-500',
    stopped: 'text-gray-500',
    error: 'text-red-500',
  }[project.status] || 'text-yellow-500';

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-5 rounded-xl shadow border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h3>
        <span className={`${statusColor} text-sm`}>{project.status}</span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Type: {project.type}</p>
      {project.port && <p className="text-gray-600 dark:text-gray-400 text-sm">Port: {project.port}</p>}
      <div className="flex mt-4 space-x-2">
        <button className="p-2 bg-green-100 dark:bg-green-900 rounded"><FaPlay className="text-green-600 dark:text-green-300" /></button>
        <button className="p-2 bg-red-100 dark:bg-red-900 rounded"><FaStop className="text-red-600 dark:text-red-300" /></button>
        <button className="p-2 bg-blue-100 dark:bg-blue-900 rounded"><FaSyncAlt className="text-blue-600 dark:text-blue-300" /></button>
        <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded"><FaTrash className="text-gray-600 dark:text-gray-300" /></button>
      </div>
      <Link href={`/project/${project.id}`} className="block mt-4 text-indigo-600 dark:text-indigo-400 text-sm">
        View Details →
      </Link>
    </div>
  );
}
