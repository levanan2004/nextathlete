export default function Step1({ form, onChange, nextStep }) {
  return (
    <>
      <div className="mb-5">
        <label className="block mb-1.5 font-medium text-[15px]">Role</label>
        <select
          name="role"
          value={form.role}
          onChange={onChange}
          required
          className="w-full p-3.5 rounded-lg border border-gray-200 text-[15px] bg-white outline-none"
        >
          <option value="">Select your role</option>
          <option value="student">Student Athlete</option>
          <option value="coach">Coach/Mentor</option>
          <option value="parent">Parent</option>
        </select>
      </div>
      <div className="mb-5">
        <label className="block mb-1.5 font-medium text-[15px]">
          Full Name
        </label>
        <input
          type="text"
          name="full_name"
          value={form.full_name}
          onChange={onChange}
          required
          className="w-full p-3.5 rounded-lg border border-gray-200 text-[15px] bg-white outline-none"
        />
      </div>
      <div className="mb-5">
        <label className="block mb-1.5 font-medium text-[15px]">Location</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={onChange}
          className="w-full p-3.5 rounded-lg border border-gray-200 text-[15px] bg-white outline-none"
        />
      </div>
      <button
        type="button"
        className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold text-lg mt-4 cursor-pointer"
        onClick={nextStep}
      >
        Next
      </button>
    </>
  );
}
