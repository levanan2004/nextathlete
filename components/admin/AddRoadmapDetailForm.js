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
        <div className="text-red-400 text-lg mb-4">{message || 'Bạn có chắc chắn muốn xóa?'}</div>
        <button className="bg-red-600 px-4 py-2 rounded text-white mr-2" onClick={onConfirm}>Xóa</button>
        <button className="bg-gray-500 px-4 py-2 rounded text-white" onClick={onCancel}>Hủy</button>
      </div>
    </div>
  );
}

export default function AddRoadmapDetailForm({ onSuccess }) {
  const [sports, setSports] = useState([]); // List of sports from roadmaps
  const [selectedSport, setSelectedSport] = useState('');
  const [levels, setLevels] = useState([]); // Filtered levels by sport
  const [levelId, setLevelId] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [details, setDetails] = useState([]); // List roadmap_details
  const [editId, setEditId] = useState(null);
  const [editExerciseName, setEditExerciseName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLevelId, setEditLevelId] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Fetch all sports from roadmaps
  useEffect(() => {
    const fetchSports = async () => {
      const { data, error } = await supabase.from('roadmaps').select('id, sport');
      if (!error && data) {
        // Remove duplicate sports
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
      return;
    }
    const fetchLevels = async () => {
      // Get all roadmap ids for this sport
      const { data: roadmaps } = await supabase.from('roadmaps').select('id').eq('sport', selectedSport);
      const roadmapIds = (roadmaps || []).map(r => r.id);
      if (roadmapIds.length === 0) {
        setLevels([]);
        setLevelId('');
        return;
      }
      // Get all levels for these roadmap ids
      const { data: levelsData } = await supabase.from('roadmap_levels').select('id, level, roadmap_id').in('roadmap_id', roadmapIds);
      setLevels(levelsData || []);
      setLevelId('');
    };
    fetchLevels();
  }, [selectedSport]);

  // Fetch roadmap_details for display
  useEffect(() => {
    const fetchDetails = async () => {
      let query = supabase.from('roadmap_details').select('id, roadmap_level_id, exercise_name, description');
      if (levelId) query = query.eq('roadmap_level_id', levelId);
      const { data, error } = await query;
      if (!error) setDetails(data || []);
    };
    fetchDetails();
  }, [levelId, showSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!levelId) {
      setError('Vui lòng chọn cấp độ (level).');
      setLoading(false);
      return;
    }
    // Thêm dữ liệu đúng field cho roadmap_details
    const { error: insertError } = await supabase.from('roadmap_details').insert([
      { roadmap_level_id: levelId, exercise_name: exerciseName, description }
    ]);
    setLoading(false);
    if (insertError) setError(insertError.message);
    else {
      setExerciseName('');
      setDescription('');
      setLevelId('');
      setSelectedSport('');
      setShowSuccess(true);
      if (onSuccess) onSuccess();
    }
  };

  // Delete handler with confirm
  const handleDelete = async (id) => {
    setConfirmDeleteId(id);
  };
  const confirmDelete = async () => {
    await supabase.from('roadmap_details').delete().eq('id', confirmDeleteId);
    setDetails(details => details.filter(d => d.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };
  const cancelDelete = () => setConfirmDeleteId(null);

  // Edit handlers
  const startEdit = (detail) => {
    setEditId(detail.id);
    setEditExerciseName(detail.exercise_name);
    setEditDescription(detail.description);
    setEditLevelId(detail.roadmap_level_id);
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditExerciseName('');
    setEditDescription('');
    setEditLevelId('');
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await supabase.from('roadmap_details').update({
      exercise_name: editExerciseName,
      description: editDescription,
      roadmap_level_id: editLevelId
    }).eq('id', editId);
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
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Tên bài tập (exercise name)"
          value={exerciseName}
          onChange={e => setExerciseName(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Mô tả (description)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        {error && <div className="text-red-400">{error}</div>}
        <button type="submit" className="bg-purple-700 px-4 py-2 rounded text-white" disabled={loading}>
          {loading ? 'Đang thêm...' : 'Thêm chi tiết'}
        </button>
      </form>
      <SuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} message="Thêm chi tiết thành công!" />
      <ConfirmModal show={!!confirmDeleteId} onConfirm={confirmDelete} onCancel={cancelDelete} message="Bạn có chắc chắn muốn xóa mục này?" />
      {/* Danh sách roadmap_details */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2 text-purple-300">Danh sách Roadmap Details</h3>
        <table className="w-full text-sm bg-gray-800 rounded">
          <thead>
            <tr className="text-purple-400">
              <th className="p-2">Tên bài tập</th>
              <th className="p-2">Mô tả</th>
              <th className="p-2">Level ID</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {details.map(detail => (
              editId === detail.id ? (
                <tr key={detail.id} className="bg-gray-700">
                  <td className="p-2"><input className="w-full bg-gray-900 text-white p-1 rounded" value={editExerciseName} onChange={e => setEditExerciseName(e.target.value)} /></td>
                  <td className="p-2"><input className="w-full bg-gray-900 text-white p-1 rounded" value={editDescription} onChange={e => setEditDescription(e.target.value)} /></td>
                  <td className="p-2"><input className="w-full bg-gray-900 text-white p-1 rounded" value={editLevelId} onChange={e => setEditLevelId(e.target.value)} /></td>
                  <td className="p-2">
                    <button className="bg-green-600 px-2 py-1 rounded text-white mr-2" onClick={handleEditSubmit}>Lưu</button>
                    <button className="bg-gray-500 px-2 py-1 rounded text-white" onClick={cancelEdit}>Hủy</button>
                  </td>
                </tr>
              ) : (
                <tr key={detail.id} className="border-b border-gray-700">
                  <td className="p-2">{detail.exercise_name}</td>
                  <td className="p-2">{detail.description}</td>
                  <td className="p-2">{detail.roadmap_level_id}</td>
                  <td className="p-2">
                    <button className="bg-yellow-600 px-2 py-1 rounded text-white mr-2" onClick={() => startEdit(detail)}>Sửa</button>
                    <button className="bg-red-600 px-2 py-1 rounded text-white" onClick={() => handleDelete(detail.id)}>Xóa</button>
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
