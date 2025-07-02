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

export default function AddRoadmapLevelForm({ onSuccess }) {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState('');
  const [level, setLevel] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [levels, setLevels] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editLevel, setEditLevel] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editRoadmapId, setEditRoadmapId] = useState('');

  // Fetch all roadmaps for select options
  useEffect(() => {
    const fetchRoadmaps = async () => {
      const { data, error } = await supabase.from('roadmaps').select('id, sport');
      if (!error) setRoadmaps(data || []);
    };
    fetchRoadmaps();
  }, []);

  // Fetch all roadmap_levels for display
  useEffect(() => {
    const fetchLevels = async () => {
      const { data, error } = await supabase.from('roadmap_levels').select('id, roadmap_id, level, description');
      if (!error) setLevels(data || []);
    };
    fetchLevels();
  }, [showSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!selectedRoadmapId) {
      setError('Vui lòng chọn môn thể thao.');
      setLoading(false);
      return;
    }
    const { error: insertError } = await supabase.from('roadmap_levels').insert([
      { roadmap_id: selectedRoadmapId, level, description }
    ]);
    setLoading(false);
    if (insertError) setError(insertError.message);
    else {
      setSelectedRoadmapId('');
      setLevel('');
      setDescription('');
      setShowSuccess(true);
      if (onSuccess) onSuccess();
    }
  };

  // Delete handler with confirm
  const handleDelete = (id) => setConfirmDeleteId(id);
  const confirmDelete = async () => {
    await supabase.from('roadmap_levels').delete().eq('id', confirmDeleteId);
    setLevels(levels => levels.filter(l => l.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };
  const cancelDelete = () => setConfirmDeleteId(null);

  // Edit handlers
  const startEdit = (level) => {
    setEditId(level.id);
    setEditLevel(level.level);
    setEditDescription(level.description);
    setEditRoadmapId(level.roadmap_id);
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditLevel('');
    setEditDescription('');
    setEditRoadmapId('');
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('roadmap_levels').update({ level: editLevel, description: editDescription, roadmap_id: editRoadmapId }).eq('id', editId);
    setEditId(null);
    setShowSuccess(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={selectedRoadmapId}
          onChange={e => setSelectedRoadmapId(e.target.value)}
          required
        >
          <option value="">Chọn môn thể thao</option>
          {roadmaps.map(rm => (
            <option key={rm.id} value={rm.id}>{rm.sport}</option>
          ))}
        </select>
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Tên cấp độ"
          value={level}
          onChange={e => setLevel(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Mô tả"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        {error && <div className="text-red-400">{error}</div>}
        <button type="submit" className="bg-purple-700 px-4 py-2 rounded text-white" disabled={loading}>
          {loading ? 'Đang thêm...' : 'Thêm cấp độ'}
        </button>
      </form>
      <SuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} message="Thêm cấp độ thành công!" />
      <ConfirmModal show={!!confirmDeleteId} onConfirm={confirmDelete} onCancel={cancelDelete} message="Bạn có chắc chắn muốn xóa mục này?" />
      {/* Danh sách roadmap_levels */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2 text-purple-300">Danh sách Roadmap Levels</h3>
        <table className="w-full text-sm bg-gray-800 rounded">
          <thead>
            <tr className="text-purple-400">
              <th className="p-2">Level</th>
              <th className="p-2">Description</th>
              <th className="p-2">Roadmap ID</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {levels.map(level => (
              editId === level.id ? (
                <tr key={level.id} className="bg-gray-700">
                  <td className="p-2"><input className="w-full bg-gray-900 text-white p-1 rounded" value={editLevel} onChange={e => setEditLevel(e.target.value)} /></td>
                  <td className="p-2"><input className="w-full bg-gray-900 text-white p-1 rounded" value={editDescription} onChange={e => setEditDescription(e.target.value)} /></td>
                  <td className="p-2"><input className="w-full bg-gray-900 text-white p-1 rounded" value={editRoadmapId} onChange={e => setEditRoadmapId(e.target.value)} /></td>
                  <td className="p-2">
                    <button className="bg-green-600 px-2 py-1 rounded text-white mr-2" onClick={handleEditSubmit}>Lưu</button>
                    <button className="bg-gray-500 px-2 py-1 rounded text-white" onClick={cancelEdit}>Hủy</button>
                  </td>
                </tr>
              ) : (
                <tr key={level.id} className="border-b border-gray-700">
                  <td className="p-2">{level.level}</td>
                  <td className="p-2">{level.description}</td>
                  <td className="p-2">{level.roadmap_id}</td>
                  <td className="p-2">
                    <button className="bg-yellow-600 px-2 py-1 rounded text-white mr-2" onClick={() => startEdit(level)}>Sửa</button>
                    <button className="bg-red-600 px-2 py-1 rounded text-white" onClick={() => handleDelete(level.id)}>Xóa</button>
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
