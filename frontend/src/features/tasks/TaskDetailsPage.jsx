import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import taskService from '../../services/taskService';
import attachmentService from '../../services/attachmentService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [attachmentError, setAttachmentError] = useState(null);

  useEffect(() => {
    const loadTaskAndAttachments = async () => {
      try {
        setLoading(true);
        const taskData = await taskService.getTaskById(id);
        setTask(taskData);
        const attachmentData = await attachmentService.getAttachments({ task: id, limit: 50, offset: 0 });
        setAttachments(attachmentData.results || []);
      } catch (err) {
        setFetchError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTaskAndAttachments();
  }, [id]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setAttachmentError('File size must be less than 5 MB.');
      return;
    }

    const formData = new FormData();
    formData.append('task', id);
    formData.append('file', file);

    try {
      setUploading(true);
      setAttachmentError(null);
      const data = await attachmentService.uploadAttachment(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        // TODO: could show percentCompleted if desired
      });
      setAttachments((prev) => [data, ...prev]);
      toast.success('Attachment uploaded successfully.');
    } catch (err) {
      setAttachmentError(err.response?.data || err.message);
      toast.error('Failed to upload attachment.');
    } finally {
      setUploading(false);
      event.target.value = null;
    }
  };

  const handleDownload = async (attachment) => {
    try {
      const response = await fetch(attachment.file, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.file.split('/').pop();
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Unable to download attachment.');
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!window.confirm('Delete this attachment?')) return;
    try {
      await attachmentService.deleteAttachment(attachmentId);
      setAttachments((prev) => prev.filter((item) => item.id !== attachmentId));
      toast.success('Attachment deleted.');
    } catch (err) {
      toast.error('Unable to delete attachment.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (fetchError) {
    return <div className="rounded-3xl bg-white p-6 shadow-sm text-red-600">{String(fetchError)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Task Details</h2>
            <p className="mt-2 text-sm text-slate-500">View full task details and attachments.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Back to Tasks
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <dl className="grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500">Title</dt>
            <dd className="mt-2 text-base text-slate-900">{task.title}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Project</dt>
            <dd className="mt-2 text-base text-slate-900">{task.project_details?.title || 'Unknown'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Status</dt>
            <dd className="mt-2 text-base text-slate-900">{task.status}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Priority</dt>
            <dd className="mt-2 text-base text-slate-900">
              {task.priority === '1' ? 'High' : task.priority === '2' ? 'Medium' : 'Low'}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-slate-500">Description</dt>
            <dd className="mt-2 text-base text-slate-900 whitespace-pre-wrap">{task.description}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Attachments</h3>
            <p className="mt-1 text-sm text-slate-500">Upload and manage files for this task.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            {uploading ? 'Uploading...' : 'Upload Attachment'}
            <input type="file" accept="*/*" onChange={handleFileUpload} className="sr-only" disabled={uploading} />
          </label>
        </div>

        {attachmentError && <div className="mt-4 text-sm text-red-600">{String(attachmentError)}</div>}

        {attachments.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            No attachments yet. Upload a file to attach it to this task.
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">File</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Uploaded At</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {attachments.map((attachment) => (
                  <tr key={attachment.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-700">{attachment.file.split('/').pop()}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{new Date(attachment.uploaded_at).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownload(attachment)}
                          className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          Download
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAttachment(attachment.id)}
                          className="rounded-2xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsPage;
