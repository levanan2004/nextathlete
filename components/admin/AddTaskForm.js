import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

function SuccessModal({ show, onClose, message }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-900 p-6 rounded shadow-lg text-center">
        <div className="text-green-400 text-lg mb-4">{message || 'Thêm thành công!'}</div>
        <button className="bg-purple-700 px-4 py-2 rounded text-white" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}

function ConfirmModal({ show, onConfirm, onCancel, message }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-900 p-6 rounded shadow-lg text-center">
        <div className="text-red-400 text-lg mb-4">{message || 'Bạn có chắc chắn muốn xóa?'} </div>
        <button className="bg-red-600 px-4 py-2 rounded text-white mr-2" onClick={onConfirm}>Xóa</button>
        <button className="bg-gray-500 px-4 py-2 rounded text-white" onClick={onCancel}>Hủy</button>
      </div>
    </div>
  );
}

export default function AddTaskForm({ onSuccess }) {
  const [sports, setSports] = useState([]); // List of sports from roadmaps
  const [selectedSport, setSelectedSport] = useState('');
  const [levels, setLevels] = useState([]); // Filtered levels by sport
  const [levelId, setLevelId] = useState('');
  const [details, setDetails] = useState([]); // Filtered details by level
  const [detailId, setDetailId] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editDetailId, setEditDetailId] = useState('');

  // Fetch all sports from roadmaps
  useEffect(() => {
    const fetchSports = async () => {
      const { data, error } = await supabase.from('roadmaps').select('id, sport');
      if (!error && data) {
        const uniqueSports = Array.from(new Set(data.map(r => r.sport)));
        setSports(uniqueSports);
      }
    };
    fetchSports();
  }, []);

  // Fetch levels for selected sport
  useEffect(() => {
    if (!selectedSport) {
      setLevels([]);
      setLevelId('');
      setDetails([]);
      setDetailId('');
      return;
    }
    const fetchLevels = async () => {
      const { data: roadmaps } = await supabase.from('roadmaps').select('id').eq('sport', selectedSport);
      const roadmapIds = (roadmaps || []).map(r => r.id);
      if (roadmapIds.length === 0) {
        setLevels([]);
        setLevelId('');
        setDetails([]);
        setDetailId('');
        return;
      }
      const { data: levelsData } = await supabase.from('roadmap_levels').select('id, level, roadmap_id').in('roadmap_id', roadmapIds);
      setLevels(levelsData || []);
      setLevelId('');
      setDetails([]);
      setDetailId('');
    };
    fetchLevels();
  }, [selectedSport]);

  // Fetch details for selected level
  useEffect(() => {
    if (!levelId) {
      setDetails([]);
      setDetailId('');
      return;
    }
    const fetchDetails = async () => {
      const { data: detailsData } = await supabase.from('roadmap_details').select('id, exercise_name').eq('roadmap_level_id', levelId);
      setDetails(detailsData || []);
      setDetailId('');
    };
    fetchDetails();
  }, [levelId]);

  // Fetch all tasks for display
  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from('tasks').select('id, roadmap_detail_id, description');
      if (!error) setTasks(data || []);
    };
    fetchTasks();
  }, [showSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!detailId) {
      setError('Vui lòng chọn bài tập (exercise name).');
      setLoading(false);
      return;
    }
    // Thêm dữ liệu đúng field cho tasks
    const { error: insertError } = await supabase.from('tasks').insert([
      { roadmap_detail_id: detailId, description }
    ]);
    setLoading(false);
    if (insertError) setError(insertError.message);
    else {
      setDescription('');
      setDetailId('');
      setLevelId('');
      setSelectedSport('');
      setShowSuccess(true);
      if (onSuccess) onSuccess();
    }
  };

  // Delete handler with confirm
  const handleDelete = (id) => setConfirmDeleteId(id);
  const confirmDelete = async () => {
    await supabase.from('tasks').delete().eq('id', confirmDeleteId);
    setTasks(tasks => tasks.filter(t => t.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };
  const cancelDelete = () => setConfirmDeleteId(null);

  // Edit handlers
  const startEdit = (task) => {
    setEditId(task.id);
    setEditDescription(task.description);
    setEditDetailId(task.roadmap_detail_id);
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditDescription('');
    setEditDetailId('');
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('tasks').update({ description: editDescription, roadmap_detail_id: editDetailId }).eq('id', editId);
    setEditId(null);
    setShowSuccess(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={selectedSport}
          onChange={e => setSelectedSport(e.target.value)}
          required
        >
          <option value="">Chọn môn thể thao (sport)</option>
          {sports.map(sport => (
            <option key={sport} value={sport}>{sport}</option>
          ))}
        </select>
        <select
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={levelId}
          onChange={e => setLevelId(e.target.value)}
          required
          disabled={!selectedSport || levels.length === 0}
        >
          <option value="">Chọn cấp độ (level)</option>
          {levels.map(l => (
            <option key={l.id} value={l.id}>{l.level}</option>
          ))}
        </select>
        <select
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={detailId}
          onChange={e => setDetailId(e.target.value)}
          required
          disabled={!levelId || details.length === 0}
        >
          <option value="">Chọn bài tập (exercise name)</option>
          {details.map(d => (
            <option key={d.id} value={d.id}>{d.exercise_name}</option>
          ))}
        </select>
        <textarea
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Mô tả (description)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        {error && <div className="text-red-400">{error}</div>}
        <button type="submit" className="bg-purple-700 px-4 py-2 rounded text-white" disabled={loading}>
          {loading ? 'Đang thêm...' : 'Thêm Task'}
        </button>
      </form>
      <SuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} message="Thêm task thành công!" />
      <ConfirmModal show={!!confirmDeleteId} onConfirm={confirmDelete} onCancel={cancelDelete} message="Bạn có chắc chắn muốn xóa mục này?" />
      {/* Danh sách tasks */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2 text-purple-300">Danh sách Tasks</h3>
        <table className="w-full text-sm bg-gray-800 rounded">
          <thead>
            <tr className="text-purple-400">
              <th className="p-2">Description</th>
              <th className="p-2">Roadmap Detail ID</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              editId === task.id ? (
                <tr key={task.id} className="bg-gray-700">
                  <td className="p-2"><input className="w-full bg-gray-900 text-white p-1 rounded" value={editDescription} onChange={e => setEditDescription(e.target.value)} /></td>
                  <td className="p-2"><input className="w-full bg-gray-900 text-white p-1 rounded" value={editDetailId} onChange={e => setEditDetailId(e.target.value)} /></td>
                  <td className="p-2">
                    <button className="bg-green-600 px-2 py-1 rounded text-white mr-2" onClick={handleEditSubmit}>Lưu</button>
                    <button className="bg-gray-500 px-2 py-1 rounded text-white" onClick={cancelEdit}>Hủy</button>
                  </td>
                </tr>
              ) : (
                <tr key={task.id} className="border-b border-gray-700">
                  <td className="p-2">{task.description}</td>
                  <td className="p-2">{task.roadmap_detail_id}</td>
                  <td className="p-2">
                    <button className="bg-yellow-600 px-2 py-1 rounded text-white mr-2" onClick={() => startEdit(task)}>Sửa</button>
                    <button className="bg-red-600 px-2 py-1 rounded text-white" onClick={() => handleDelete(task.id)}>Xóa</button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
