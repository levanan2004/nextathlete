import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

function SuccessModal({ show, onClose, message }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-900 p-6 rounded shadow-lg text-center">
        <div className="text-green-400 text-lg mb-4">
          {message || "Thêm thành công!"}
        </div>
        <button
          className="bg-purple-700 px-4 py-2 rounded text-white"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}

function ConfirmModal({ show, onConfirm, onCancel, message }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-900 p-6 rounded shadow-lg text-center">
        <div className="text-red-400 text-lg mb-4">
          {message || "Bạn có chắc chắn muốn xóa?"}
        </div>
        <button
          className="bg-red-600 px-4 py-2 rounded text-white mr-2"
          onClick={onConfirm}
        >
          Xóa
        </button>
        <button
          className="bg-gray-500 px-4 py-2 rounded text-white"
          onClick={onCancel}
        >
          Hủy
        </button>
      </div>
    </div>
  );
}

export default function AddRoadmapForm({ onSuccess }) {
  const [sport, setSport] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [roadmaps, setRoadmaps] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editSport, setEditSport] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Lấy user hiện tại
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (!user || userError) {
      setError("Bạn cần đăng nhập để thêm roadmap.");
      setLoading(false);
      return;
    }
    // Thêm dữ liệu đúng field
    const { error: insertError } = await supabase
      .from("roadmaps")
      .insert([{ sport, title, athlete_count: 0 }]);
    setLoading(false);
    if (insertError) setError(insertError.message);
    else {
      setSport("");
      setTitle("");
      setShowSuccess(true);
      if (onSuccess) onSuccess();
    }
  };

  // Fetch all roadmaps for display
  useEffect(() => {
    const fetchRoadmaps = async () => {
      const { data, error } = await supabase
        .from("roadmaps")
        .select("id, sport, title, athlete_count");
      if (!error) setRoadmaps(data || []);
    };
    fetchRoadmaps();
  }, [showSuccess]);

  // Delete handler with confirm
  const handleDelete = (id) => setConfirmDeleteId(id);
  const confirmDelete = async () => {
    await supabase.from("roadmaps").delete().eq("id", confirmDeleteId);
    setRoadmaps((roadmaps) =>
      roadmaps.filter((r) => r.id !== confirmDeleteId)
    );
    setConfirmDeleteId(null);
  };
  const cancelDelete = () => setConfirmDeleteId(null);

  // Edit handlers
  const startEdit = (roadmap) => {
    setEditId(roadmap.id);
    setEditSport(roadmap.sport);
    setEditTitle(roadmap.title);
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditSport("");
    setEditTitle("");
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await supabase
      .from("roadmaps")
      .update({ sport: editSport, title: editTitle })
      .eq("id", editId);
    setEditId(null);
    setShowSuccess(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Name Sport"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          required
        />
        <input
          className="w-full p-2 rounded bg-gray-800 text-white"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {error && <div className="text-red-400">{error}</div>}
        <button
          type="submit"
          className="bg-purple-700 px-4 py-2 rounded text-white"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Roadmap"}
        </button>
      </form>
      <SuccessModal
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Thêm roadmap thành công!"
      />
      <ConfirmModal
        show={!!confirmDeleteId}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Bạn có chắc chắn muốn xóa mục này?"
      />
      {/* Danh sách roadmaps */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2 text-purple-300">
          Danh sách Roadmaps
        </h3>
        <table className="w-full text-sm bg-gray-800 rounded">
          <thead>
            <tr className="text-purple-400">
              <th className="p-2">Sport</th>
              <th className="p-2">Title</th>
              <th className="p-2">Athlete Count</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {roadmaps.map((rm) =>
              editId === rm.id ? (
                <tr key={rm.id} className="bg-gray-700">
                  <td className="p-2">
                    <input
                      className="w-full bg-gray-900 text-white p-1 rounded"
                      value={editSport}
                      onChange={(e) => setEditSport(e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-full bg-gray-900 text-white p-1 rounded"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </td>
                  <td className="p-2">{rm.athlete_count}</td>
                  <td className="p-2">
                    <button
                      className="bg-green-600 px-2 py-1 rounded text-white mr-2"
                      onClick={handleEditSubmit}
                    >
                      Lưu
                    </button>
                    <button
                      className="bg-gray-500 px-2 py-1 rounded text-white"
                      onClick={cancelEdit}
                    >
                      Hủy
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={rm.id} className="border-b border-gray-700">
                  <td className="p-2">{rm.sport}</td>
                  <td className="p-2">{rm.title}</td>
                  <td className="p-2">{rm.athlete_count}</td>
                  <td className="p-2">
                    <button
                      className="bg-yellow-600 px-2 py-1 rounded text-white mr-2"
                      onClick={() => startEdit(rm)}
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-600 px-2 py-1 rounded text-white"
                      onClick={() => handleDelete(rm.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
