import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Den {
  id: number;
  name: string;
  description: string;
  iconUrl?: string;
}

interface DensListProps {
  onMenuOpen: () => void;
}

export default function DensList({ onMenuOpen }: DensListProps) {
  const [dens, setDens] = useState<Den[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Temporary mock data – replace with real API call when backend is ready
    const mockDens: Den[] = [
      { id: 1, name: "Language Learners", description: "Practice speaking with native speakers" },
      { id: 2, name: "Tech & Programming", description: "Discuss coding, AI, and tech careers" },
      { id: 3, name: "Book Club", description: "Monthly reads and literary discussions" },
    ];
    setDens(mockDens);
    setLoading(false);

    // Real implementation (uncomment when backend is running):
    // fetch('/api/dens')
    //   .then(res => res.json())
    //   .then(data => {
    //     setDens(data);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     console.error('Failed to fetch dens:', err);
    //     setLoading(false);
    //   });
  }, []);

  if (loading) return <div className="p-4">Loading dens...</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Optional menu button that uses onMenuOpen */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Explore Dens</h1>
        <button
          onClick={onMenuOpen}
          className="lg:hidden p-2 rounded hover:bg-gray-100"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dens.map(den => (
          <div key={den.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">{den.name}</h3>
            <p className="text-gray-600 mb-4">{den.description}</p>
            <Link
              to={`/dens/${den.id}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Enter Den
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}