import React, { useState, useEffect } from 'react';
import '../../App.css';
import 'react-multi-carousel/lib/styles.css';

const SportPage03 = () => {
  const [person, setPerson] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch person data from API
    const fetchPerson = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/persons'); // <-- Change this URL to your API
        const data = await response.json();
        console.log('Fetched person:', data);
        setPerson(data);
      } catch (error) {
        console.error('Error fetching person:', error);
      }
    };

    fetchPerson();
  }, []);

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // Add search logic here
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/4 space-y-4">
            <div className="bg-blue-100 p-4 rounded">
              <div className="h-6"></div>
            </div>
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-blue-100 p-4 rounded">
                <div className="h-6"></div>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-3/4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="bg-blue-100 p-4 rounded w-full md:w-1/2">
                <h2 className="font-medium">Search</h2>
                <div className="mt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="p-2 rounded-l w-full"
                    />
                    <button
                      onClick={handleSearch}
                      className="p-2 bg-blue-500 text-white rounded-r"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <button className="bg-blue-100 p-4 rounded w-full">
                  Requesting a Donation
                </button>
              </div>
            </div>

            {/* Person Details */}
            <div className="bg-yellow-100 p-4 rounded mb-4">
              <h2 className="font-medium text-center">PERSON DETAILS</h2>
            </div>

            {/* Show Loading while fetching */}
            {!person ? (
              <div className="bg-yellow-100 p-8 rounded mb-4 text-center">
                Loading person details...
              </div>
            ) : (
              <div className="bg-yellow-100 p-8 rounded mb-4">
                <div className="flex flex-col gap-2">
                  <p><strong>Name:</strong> {person.name}</p>
                  <p><strong>Address:</strong> {person.address}</p>
                  <p><strong>Email:</strong> {person.email}</p>
                  <p><strong>Phone:</strong> {person.phone}</p>
                  <p><strong>Description:</strong> {person.description}</p>
                  <p><strong>Created At:</strong> {new Date(person.createdAt).toLocaleString()}</p>
                  <p><strong>Updated At:</strong> {new Date(person.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportPage03;
