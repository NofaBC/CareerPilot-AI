interface SkillsChipsProps {
  profile: any;
}

export function SkillsChips({ profile }: SkillsChipsProps) {
  const skills = profile?.skills || [];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-100">
          Skills Extracted
        </h3>
        <span className="text-[11px] text-slate-500">
          {skills.length > 0 ? `${skills.length} skills found` : 'From your resume text'}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 text-[11px]">
        {skills.length > 0 ? (
          skills.map((skill: string) => (
            <span
              key={skill}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-100"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
            Resume parsing pending…
          </span>
        )}
      </div>
    </div>
  );
}
