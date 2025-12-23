interface ProfileSummaryProps {
  profile: any;
}

export function ProfileSummary({ profile }: ProfileSummaryProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/15 border border-sky-400/40 text-sky-300 text-[11px] font-bold">
            AI
          </span>
          Profile Summary
        </h3>
        <span className="text-[11px] text-slate-500" id="profile-name-label">
          {profile?.name || 'Waiting for input…'}
        </span>
      </div>
      <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
        {profile?.profileSummary || (
          <span className="text-slate-500">
            Fill in your details and click "Generate Profile & Skills" to see a draft summary of how CareerPilot AI™ will describe you to recruiters.
          </span>
        )}
      </p>
    </div>
  );
}
