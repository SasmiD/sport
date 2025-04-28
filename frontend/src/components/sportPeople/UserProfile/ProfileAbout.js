import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdEdit } from "react-icons/md";
import { MdCancel } from "react-icons/md";

function ProfileAbout({ user, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [profileInfo, setProfileInfo] = useState({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [userRes, profileRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/user/${user._id}`),
          axios.get(`http://localhost:5000/api/user/${user._id}/profile-data`),
        ]);
        setUserInfo(userRes.data || {});
        setProfileInfo(profileRes.data || {});
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };

    if (user?._id) {
      fetchAll();
    }
  }, [user]);

  const handleChange = (e, source) => {
    const { name, value } = e.target;
    if (source === 'user') {
      setUserInfo((prev) => ({ ...prev, [name]: value }));
    } else {
      setProfileInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/user/${user._id}`, {
        firstName: userInfo.firstName,
        email: userInfo.email,
        mobile: userInfo.mobile,
        address: userInfo.address,
      });

      await axios.put(`http://localhost:5000/api/user/${user._id}/profile-data`, profileInfo);
      setStatus('Saved successfully!');
      setEditing(false);
    } catch (err) {
      console.error('Failed to save:', err);
      setStatus('Failed to save data');
    }
  };

  const renderField = (label, name, value, source = 'profile') => (
    <div key={name}>
      <p className="font-medium text-sm text-gray-800">{label}:</p>
      {editing ? (
        <input
          type="text"
          name={name}
          value={value || ''}
          onChange={(e) => handleChange(e, source)}
          className="w-full p-2 border rounded mt-1 text-sm"
        />
      ) : (
        <p className="text-sm text-gray-700 mt-1">{value || '—'}</p>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-[1252px] mx-auto space-y-6">
      <div className="bg-primary-light p-6 rounded-md w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="bg-secondary-light font-semibold text-gray-800 px-3 py-1 inline-block rounded">
            About
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(!editing)}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 text-sm rounded shadow hover:bg-gray-700"
              >
                {editing ? <MdCancel /> : <MdEdit />} {editing ? 'Cancel' : 'Edit Details'}
              </button>
              {editing && (
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-6 py-1 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              )}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderField('Name', 'firstName', userInfo.firstName || user.name, 'user')}
          {renderField('Email', 'email', userInfo.email, 'user')}
          {renderField('Location', 'city', profileInfo.city, 'profile')}
          {renderField('Contact No', 'mobile', userInfo.mobile, 'user')}
          {renderField('Birthday', 'birthday', profileInfo.birthday, 'profile')}
          {renderField('Job', 'job', profileInfo.job, 'profile')}
        </div>
      </div>

      {/* Sports Interests & History */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-primary-light p-6 rounded-md w-full">
          <div className="bg-secondary-light font-semibold text-gray-800 px-3 py-1 inline-block mb-3 rounded">
            Sports Interests and Skills
          </div>
          <div className="space-y-4">
            {renderField(
              'Favorite Sports',
              'sports',
              Array.isArray(profileInfo.sports) ? profileInfo.sports.join(', ') : profileInfo.sports || '—',
              'profile'
            )}
            {renderField('Skill level', 'skillLevel', profileInfo.skillLevel, 'profile')}
            {renderField('Preferred Positions/Disciplines', 'positions', profileInfo.positions, 'profile')}
          </div>

          <div className="bg-secondary-light font-semibold text-gray-800 px-3 py-1 inline-block mt-6 mb-3 rounded">
            Sports History
          </div>
          <div className="space-y-4">
            {renderField('Training Background', 'trainingBackground', profileInfo.trainingBackground)}
            {renderField('Clubs and Teams', 'clubsAndTeams', profileInfo.clubsAndTeams)}
            {renderField('How Many Year Playing', 'yearsPlaying', profileInfo.yearsPlaying)}
          </div>
        </div>

        <div className="bg-primary-light p-6 rounded-md w-full">
          <div className="bg-secondary-light font-semibold text-gray-800 px-3 py-1 inline-block mb-3 rounded">
            Personal Achievements and Milestones
          </div>
          <div className="space-y-4">
            {renderField('Personal Records', 'personalRecords', profileInfo.personalRecords)}
            {renderField('Recent Highlights', 'recentHighlights', profileInfo.recentHighlights)}
          </div>

          <div className="bg-secondary-light font-semibold text-gray-800 px-3 py-1 inline-block mt-6 mb-3 rounded">
            Goals and Motivations
          </div>
          <div className="space-y-4">
            {renderField('Short-Term Goals', 'shortTermGoals', profileInfo.shortTermGoals)}
            {renderField('Long-Term Aspirations', 'longTermGoals', profileInfo.longTermGoals)}
          </div>
        </div>
      </div>

      {/* Other Sports */}
      <div className="bg-primary-light p-6 rounded-md w-full">
        <div className="bg-secondary-light font-semibold text-gray-800 px-3 py-1 inline-block mb-4 rounded">
          Other Sports that He Interesting
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderField('Sport', 'otherSports', profileInfo.otherSports)}
          {renderField('Skill level', 'otherSkill', profileInfo.otherSkill)}
          {renderField('Clubs and Teams', 'otherClubs', profileInfo.otherClubs)}
          {renderField('Achievements and Milestones', 'otherAchievements', profileInfo.otherAchievements)}
        </div>
      </div>

      {status && <p className="text-sm text-green-600 mt-2">{status}</p>}
    </div>
  );
}

export default ProfileAbout;
