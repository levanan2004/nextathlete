export default function Step2({ form, onChange, nextStep, prevStep }) {
  const role = form.role;
  return (
    <>
      {role === "student" && (
        <>
          <Input
            label="Age"
            type="number"
            name="age"
            value={form.age}
            onChange={onChange}
          />
          <Input
            label="Sport Interest"
            name="sport_interest"
            value={form.sport_interest}
            onChange={onChange}
          />
          <Input
            label="Goals"
            name="goals"
            value={form.goals}
            onChange={onChange}
          />
          <Textarea
            label="Bio"
            name="bio"
            value={form.bio}
            onChange={onChange}
          />
        </>
      )}

      {role === "coach" && (
        <>
          <Input
            label="Experience Years"
            type="number"
            name="experience_years"
            value={form.experience_years}
            onChange={onChange}
          />
          <Input
            label="Specialization"
            name="specialization"
            value={form.specialization}
            onChange={onChange}
          />
          <Input
            label="Academy Name"
            name="academy_name"
            value={form.academy_name}
            onChange={onChange}
          />
          <Textarea
            label="Bio"
            name="coach_bio"
            value={form.coach_bio}
            onChange={onChange}
          />
          <Input
            label="Contact Email"
            type="email"
            name="contact_email"
            value={form.contact_email}
            onChange={onChange}
          />
        </>
      )}

      {role === "parent" && (
        <>
          <Input
            label="Child Name"
            name="child_name"
            value={form.child_name}
            onChange={onChange}
          />
          <Input
            label="Child Age"
            type="number"
            name="child_age"
            value={form.child_age}
            onChange={onChange}
          />
          <Input
            label="Child Sport"
            name="child_sport"
            value={form.child_sport}
            onChange={onChange}
          />
          <Textarea
            label="Goal Support"
            name="goal_support"
            value={form.goal_support}
            onChange={onChange}
          />
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
          type="button"
          className="flex-1 bg-blue-600 text-white rounded-lg py-3 font-semibold text-lg cursor-pointer"
          onClick={nextStep}
        >
          Next
        </button>
      </div>
    </>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="block mb-1.5 font-medium text-[15px]">{label}</label>
      <input
        {...props}
        className="w-full p-3.5 rounded-lg border border-gray-200 text-[15px] bg-white outline-none"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="block mb-1.5 font-medium text-[15px]">{label}</label>
      <textarea
        {...props}
        className="w-full p-3.5 rounded-lg border border-gray-200 text-[15px] bg-white outline-none resize-none"
      />
    </div>
  );
}
