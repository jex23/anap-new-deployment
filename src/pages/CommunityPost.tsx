import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; // Adjust the path as necessary
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

interface CommunityPostData {
    id: string;
    content: string;
    createdAt: any; // Firestore timestamp
    images: string[]; // Array of image URLs
    userId: string;
    userName: string;
    feeling?: string; // Optional feeling field
    photoUrl: string; // URL for user profile photo
    reactionsCount?: number; // Count of reactions
    commentsCount?: number; // Count of comments
}

const CommunityPost: React.FC = () => {
    const [communityPosts, setCommunityPosts] = useState<CommunityPostData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReactionsCount = async (postId: string): Promise<number> => {
        const reactionsCollection = collection(db, `posts/${postId}/reactions`);
        const reactionsSnapshot = await getDocs(reactionsCollection);
        return reactionsSnapshot.size; // Count the number of documents in the reactions collection
    };

    const fetchCommentsCount = async (postId: string): Promise<number> => {
        const commentsCollection = collection(db, `posts/${postId}/comments`);
        const commentsSnapshot = await getDocs(commentsCollection);
        return commentsSnapshot.size; // Count the number of documents in the comments collection
    };

    const fetchCommunityPosts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'posts'));
            const postsData: CommunityPostData[] = [];

            for (const doc of querySnapshot.docs) {
                const reactionsCount = await fetchReactionsCount(doc.id); // Get reactions count for each post
                const commentsCount = await fetchCommentsCount(doc.id); // Get comments count for each post
                postsData.push({
                    id: doc.id,
                    ...doc.data(),
                    reactionsCount,
                    commentsCount
                } as CommunityPostData);
            }

            setCommunityPosts(postsData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching community posts: ", error);
            setLoading(false);
        }
    };

    const handleDeletePost = async (postId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
            try {
                await deleteDoc(doc(db, 'posts', postId)); // Delete the post
                setCommunityPosts(communityPosts.filter(post => post.id !== postId)); // Update the state
                alert("Post deleted successfully.");
            } catch (error) {
                console.error("Error deleting post: ", error);
                alert("Failed to delete post. Please try again.");
            }
        }
    };

    useEffect(() => {
        fetchCommunityPosts(); // Fetch posts when the component mounts
    }, []);

    if (loading) {
        return <div className="loading">Loading community posts...</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold">Community Posts</h2>
            {communityPosts.length === 0 ? (
                <div>No community posts available.</div>
            ) : (
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">User</th>
                            <th className="border p-2">Feeling</th>
                            <th className="border p-2">Content</th>
                            <th className="border p-2">Created At</th>
                            <th className="border p-2">Reactions</th>
                            <th className="border p-2">Comments</th>
                            <th className="border p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {communityPosts.map((post) => (
                            <tr key={post.id} className="border-b hover:bg-gray-100">
                                <td className="border p-2 flex items-center">
                                    <img
                                        src={post.photoUrl}
                                        alt={post.userName}
                                        className="w-10 h-10 rounded-full mr-2"
                                    />
                                    {post.userName}
                                </td>
                                <td className="border p-2">{post.feeling || 'N/A'}</td>
                                <td className="border p-2">{post.content}</td>
                                <td className="border p-2">
                                    {post.createdAt?.toDate().toLocaleString()}
                                </td>
                                <td className="border p-2">
                                    {post.reactionsCount !== undefined ? post.reactionsCount : 0}
                                </td>
                                <td className="border p-2">
                                    {post.commentsCount !== undefined ? post.commentsCount : 0}
                                </td>
                                <td className="border p-2 flex space-x-2">
                                    <Link to={`/post-details/${post.id}`} className="text-blue-600">
                                        View Details
                                    </Link>
                                    <button 
                                        onClick={() => handleDeletePost(post.id)} 
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CommunityPost;
