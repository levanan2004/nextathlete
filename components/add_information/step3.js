export default function Step3({ form, onChange, prevStep, loading }) {
  const role = form.role;
  return (
    <>
      <h3 className="font-semibold text-xl mb-4">Review Information</h3>
      <div className="mb-3">
        <b>Role:</b> {role}
      </div>
      <div className="mb-3">
        <b>Full Name:</b> {form.full_name}
      </div>
      <div className="mb-3">
        <b>Location:</b> {form.location}
      </div>
      {/* Hiển thị các trường riêng theo role */}
      {role === "student" && (
        <>
          <div>
            <b>Age:</b> {form.age}
          </div>
          <div>
            <b>Sport Interest:</b> {form.sport_interest}
          </div>
          <div>
            <b>Goals:</b> {form.goals}
          </div>
          <div>
            <b>Bio:</b> {form.bio}
          </div>
          <div>
            <b>Videos Uploaded Count:</b> {form.videos_uploaded_count || 0}
          </div>
          <div>
            <b>Public Profile:</b> Yes
          </div>
        </>
      )}
      {role === "coach" && (
        <>
          <div>
            <b>Experience Years:</b> {form.experience_years}
          </div>
          <div>
            <b>Specialization:</b> {form.specialization}
          </div>
          <div>
            <b>Academy Name:</b> {form.academy_name}
          </div>
          <div>
            <b>Bio:</b> {form.coach_bio}
          </div>
          <div>
            <b>Contact Email:</b> {form.contact_email}
          </div>
        </>
      )}
      {role === "parent" && (
        <>
          <div>
            <b>Child Name:</b> {form.child_name}
          </div>
          <div>
            <b>Child Age:</b> {form.child_age}
          </div>
          <div>
            <b>Child Sport:</b> {form.child_sport}
          </div>
          <div>
            <b>Goal Support:</b> {form.goal_support}
          </div>
        </>
      )}
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          className="flex-1 bg-gray-200 text-gray-900 rounded-lg py-3 font-medium text-lg cursor-pointer"
          onClick={prevStep}
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-semibold text-lg cursor-pointer"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Information"}
        </button>
      </div>
    </>
  );
}
