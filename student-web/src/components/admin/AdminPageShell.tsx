/**
 * AdminPageShell – wraps all admin list/table pages in the white card
 * container that matches the original Freshes admin design.
 */
export default function AdminPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0 overflow-hidden">
      {children}
    </div>
  );
}
