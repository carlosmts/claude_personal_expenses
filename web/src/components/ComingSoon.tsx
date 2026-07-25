interface ComingSoonProps {
  title: string;
}

/** Placeholder for pages whose real content hasn't been built yet. */
export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-500">This page is being built in an upcoming step.</p>
    </div>
  );
}
