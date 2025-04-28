const mongoose = require('mongoose');
const User = require('../models/sportPeople/User');
const Post = require('../models/sportPeople/Post');
const Notification = require('../models/sportPeople/Notification.js');
const path = require('path');

// ✅ Get full user profile data (user + userProfile)
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error in getProfile:', err.message);
    res.status(500).json({ error: 'Server error in getProfile' });
  }
};

// ✅ Update or create userProfile data
exports.upsertProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const profileData = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { $set: profileData },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error in upsertProfile:', err.message);
    res.status(500).json({ error: 'Update failed' });
  }
};

// ✅ Get basic user data
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error in getUser:', err.message);
    res.status(500).json({ error: 'Server error in getUser' });
  }
};

// ✅ Update User document
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    console.error('Error in updateUser:', err.message);
    res.status(500).json({ error: 'Update failed' });
  }
};

// ✅ Upload profile photo (sync to User)
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = path.posix.join('/uploads/profile_photos', req.file.filename);

    // 🔄 Save the profile photo directly to the User model
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { profilePhoto: filePath } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, profilePhoto: filePath, user });
  } catch (err) {
    console.error('Error uploading profile photo:', err.message);
    res.status(500).json({ error: 'Profile photo upload failed' });
  }
};

// ✅ Upload cover photo
exports.uploadCoverPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = path.posix.join('/uploads/cover_photos', req.file.filename);

    let profile = await UserProfile.findOne({ user: req.params.id });
    if (!profile) {
      profile = new UserProfile({ user: req.params.id });
    }

    profile.coverPhoto = filePath;
    await profile.save();

    const populated = await profile.populate('user');
    res.json({ success: true, coverPhoto: filePath, profile: populated });
  } catch (err) {
    console.error('Error uploading cover photo:', err.message);
    res.status(500).json({ error: 'Cover photo upload failed' });
  }
};

// ✅ Create a new post
exports.createPost = async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/post_images/${req.file.filename}` : '';
    const newPost = new Post({
      userId: req.params.id,
      description: req.body.description || '',
      image: imagePath,
    });
    await newPost.save();

    const populatedPost = await Post.findById(newPost._id)
      .populate('userId', 'firstName profilePhoto')
      .populate('comments.userId', 'firstName profilePhoto');

    res.json(populatedPost);
  } catch (err) {
    console.error('Error creating post:', err.message);
    res.status(500).json({ error: 'Post creation failed' });
  }
};

// ✅ Get all posts for user
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName profilePhoto')
      .populate('comments.userId', 'firstName profilePhoto');
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err.message);
    res.status(500).json({ error: 'Could not fetch posts' });
  }
};

// ✅ Like / Unlike post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const index = post.likes.indexOf(req.body.userId);
    if (index === -1) {
      post.likes.push(req.body.userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json(post);

    if (req.body.userId.toString() !== post.userId.toString()) {
      const notification = new Notification({
        recipient: post.userId,
        type: 'like',
        relatedUser: req.body.userId,
        relatedPost: post._id,
      });
      await notification.save();
    }

  } catch (err) {
    console.error('Error liking post:', err.message);
    res.status(500).json({ error: 'Failed to like post' });
  }
};

// ✅ Comment on post
exports.commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    post.comments.push({
      userId: req.body.userId,
      text: req.body.text,
      timestamp: new Date()
    });
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('userId', 'firstName profilePhoto')
      .populate('comments.userId', 'firstName profilePhoto');

    res.json(updatedPost);

    if (req.body.userId !== post.userId.toString()) {
      const notification = new Notification({
        recipient: post.userId,
        type: 'comment',
        relatedUser: req.body.userId,
        relatedPost: post._id,
      });
      await notification.save();
    }

  } catch (err) {
    console.error('Error commenting on post:', err.message);
    res.status(500).json({ error: 'Failed to comment' });
  }
};

// ✅ Repost logic
exports.repostPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post.reposts.includes(req.body.userId)) {
      post.reposts.push(req.body.userId);
    }
    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Error reposting:', err.message);
    res.status(500).json({ error: 'Failed to repost' });
  }
};

// ✅ Delete post
exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    console.error('Error deleting post:', err.message);
    res.status(500).json({ error: 'Delete failed' });
  }
};

// ✅ Friend toggle
exports.toggleFriend = async (req, res) => {
  const { id, friendId } = req.params;
  if (id === friendId) return res.status(400).json({ error: "Can't friend yourself" });

  try {
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if (!user || !friend) return res.status(404).json({ error: 'User not found' });

    const isFriend = user.friends?.includes(friendId);
    if (isFriend) {
      user.friends.pull(friendId);
    } else {
      user.friends.push(friendId);
    }

    await user.save();
    res.json({ success: true, isFriend: !isFriend });
  } catch (err) {
    console.error('Error toggling friend:', err.message);
    res.status(500).json({ error: 'Friend toggle failed' });
  }
};
