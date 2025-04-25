import React, { useEffect, useState } from 'react';

const ClubCard = ({ club }) => (
  <div className="flex items-start bg-yellow-100 p-4 rounded-lg shadow hover:shadow-lg transition duration-200">
    <img
      src={'https://via.placeholder.com/50'} // Update this if you store logos
      alt="Club Logo"
      className="w-14 h-14 rounded-full border-2 border-gray-700 mr-4"
    />
    <div>
      <h3 className="text-xl font-semibold text-gray-800">{club.ClubName}</h3>
      <p className="text-sm text-gray-600 italic">{club.address}</p>
      <p className="text-gray-700 mt-1">{club.email}</p>
    </div>
  </div>
);

const ClubList = () => {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/registered-clubs')
      .then((res) => res.json())
      .then((data) => setClubs(data))
      .catch((err) => console.error('Error fetching clubs:', err));
  }, []);

  return (
    <div className="p-6 md:p-12 bg-blue-50 min-h-screen font-sans">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 drop-shadow-sm">Registered Clubs</h2>
      <div className="space-y-4 bg-blue-100 p-4 rounded-xl mb-12">
        {clubs.map((club) => (
          <ClubCard key={club._id} club={club} />
        ))}
      </div>
    </div>
  );
};

export default ClubList;
