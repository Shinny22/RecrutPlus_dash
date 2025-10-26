export default function AuthCard({
  children,
  title,
}: {
  children: any;
  title: string;
}) {
  return (
    <div className="w-full max-w-md bg-white shadow rounded-xl p-8">
      <h1 className="text-2xl font-semibold mb-6">{title}</h1>
      {children}
      <div className="flex items-center justify-center mt-6 text-xs text-gray-400">
        © {new Date().getFullYear()} Capshine Technologie 😎
      </div>
    </div>
  );
}
