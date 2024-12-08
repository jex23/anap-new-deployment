import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; // Adjust the path as necessary
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
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
    status?: string; // New status field
}

const CommunityPost: React.FC = () => {
    const [communityPosts, setCommunityPosts] = useState<CommunityPostData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchCommunityPosts = async () => {
        try {
            const postsSnapshot = await getDocs(collection(db, 'posts'));
            const postsData: CommunityPostData[] = await Promise.all(
                postsSnapshot.docs.map(async (doc) => {
                    const reactionsCount = await fetchReactionsCount(doc.id);
                    const commentsCount = await fetchCommentsCount(doc.id);
                    return {
                        id: doc.id,
                        ...doc.data(),
                        reactionsCount,
                        commentsCount,
                    } as CommunityPostData;
                })
            );
            setCommunityPosts(postsData);
        } catch (error) {
            console.error("Error fetching community posts: ", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReactionsCount = async (postId: string): Promise<number> => {
        const reactionsCollection = collection(db, `posts/${postId}/reactions`);
        const reactionsSnapshot = await getDocs(reactionsCollection);
        return reactionsSnapshot.size;
    };

    const fetchCommentsCount = async (postId: string): Promise<number> => {
        const commentsCollection = collection(db, `posts/${postId}/comments`);
        const commentsSnapshot = await getDocs(commentsCollection);
        return commentsSnapshot.size;
    };

    const handleUpdateStatus = async (postId: string, status: string) => {
        try {
            await updateDoc(doc(db, 'posts', postId), { status });
            setCommunityPosts((prevPosts) =>
                prevPosts.map((post) => 
                    post.id === postId ? { ...post, status } : post
                )
            );
            alert(`Post ${status} successfully.`);
        } catch (error) {
            console.error("Error updating status: ", error);
            alert("Failed to update status. Please try again.");
        }
    };

    const handleDeletePost = async (postId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
            try {
                await deleteDoc(doc(db, 'posts', postId));
                setCommunityPosts(communityPosts.filter(post => post.id !== postId));
                alert("Post deleted successfully.");
            } catch (error) {
                console.error("Error deleting post: ", error);
                alert("Failed to delete post. Please try again.");
            }
        }
    };

    useEffect(() => {
        fetchCommunityPosts();
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
                            <th className="border p-2">Status</th>
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
                                <td className="border p-2 text-center">
                                    {post.status || 'Pending'}
                                </td>
                                <td className="border p-2 flex space-x-2 justify-center">
                                    <Link 
                                        to={`/post-details/${post.id}`} 
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        View Details
                                    </Link>
                                    <button 
                                        onClick={() => handleDeletePost(post.id)} 
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(post.id, 'Accepted')}
                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(post.id, 'Declined')}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Decline
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
