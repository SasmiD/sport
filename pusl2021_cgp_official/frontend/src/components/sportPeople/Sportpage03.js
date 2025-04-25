import React, { useState } from 'react';
import '../../App.css';
import 'react-multi-carousel/lib/styles.css';

const SportPage03 = () => {
  const persons = [
    {
      name: "John Doe",
      location: "New York, USA",
      bio: "Passionate about sports and community events. Always looking for new friends and challenges!",
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Emily Smith",
      location: "London, UK",
      bio: "Avid football fan and marathon runner. Loves connecting with other sport enthusiasts.",
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Raj Patel",
      location: "Mumbai, India",
      bio: "Cricket lover and social volunteer. Promotes sportsmanship among youth.",
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Sofia González",
      location: "Madrid, Spain",
      bio: "Gymnast and fitness coach. Passionate about a healthy lifestyle and teamwork.",
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Chen Wei",
      location: "Beijing, China",
      bio: "Table tennis champion and motivational speaker. Encourages perseverance through sports.",
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Liam Brown",
      location: "Toronto, Canada",
      bio: "Ice hockey player and community leader. Believes sports bring people together.",
      image: "https://via.placeholder.com/80",
    },
  ];


    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        console.log('Searching for:', searchQuery);
        // You can add logic for searching here
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
                        {/* Search Bar (Block style for input and button) */}
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
                                            className="p-2 rounded-l w-full" // Rounded left edge
                                        />
                                        <button
                                            onClick={handleSearch}
                                            className="p-2 bg-blue-500 text-white rounded-r" // Rounded right edge
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div >
                                <button className="bg-blue-100 p-4 rounded w-full">
                                    Requesting a Donation
                                </button>

                            </div>
                        </div>

                        {/* Person Details */}
                        <div className="bg-yellow-100 p-4 rounded mb-4">
                            <h2 className="font-medium text-center">PERSON DETAILS</h2>
                        </div>

                        {/* Yellow Content Blocks */}
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="bg-yellow-100 p-8 rounded mb-4"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default SportPage03;
