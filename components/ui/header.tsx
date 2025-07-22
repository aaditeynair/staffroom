export default function Header({ heading }: { heading: string }) {
  return (
    <div className="bg-teal-700 shadow-md py-4 px-6 sticky top-0 z-50 flex">
      <h1 className="text-2xl font-stretch-expanded text-white">{heading}</h1>
    </div>
  );
}

