import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaThumbsUp, FaCommentDots, FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Import React Icons
import { db } from '../firebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

const PostDetails: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [reactionsCount, setReactionsCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [comments, setComments] = useState<any[]>([]);
    const [showComments, setShowComments] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);

    const fetchPostDetails = async () => {
        if (!id) {
            console.error("Post ID is undefined");
            setLoading(false);
            return;
        }

        try {
            const docRef = doc(db, 'posts', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const postData = { id: docSnap.id, ...docSnap.data() };
                setPost(postData);

                const reactionsCollection = collection(db, `posts/${id}/reactions`);
                const reactionsSnapshot = await getDocs(reactionsCollection);
                setReactionsCount(reactionsSnapshot.size);

                const commentsCollection = collection(db, `posts/${id}/comments`);
                const commentsSnapshot = await getDocs(commentsCollection);
                setCommentsCount(commentsSnapshot.size);
            } else {
                console.error("No such document!");
            }
        } catch (error) {
            console.error("Error fetching post details: ", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        setLoadingComments(true);
        const commentsCollection = collection(db, `posts/${id}/comments`);
        const commentsSnapshot = await getDocs(commentsCollection);
        const fetchedComments = commentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setComments(fetchedComments);
        setLoadingComments(false);
    };

    const handleCommentToggle = () => {
        setShowComments(!showComments);
        if (!showComments) {
            fetchComments();
        }
    };

    useEffect(() => {
        fetchPostDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="loading flex items-center justify-center h-screen">
                <p className="text-gray-500 text-lg">Loading post details...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500 text-lg">No post found.</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-10">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{post.userName}'s Post</h2>
                <div className="flex items-center mb-4 space-x-4">
                    <img
                        src={post.photoUrl}
                        alt={post.userName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                    />
                    <div>
                        <p className="text-lg font-semibold">{post.userName}</p>
                        <p className="text-gray-500 text-sm">
                            {post.createdAt?.toDate().toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {post.feeling && (
                <p className="text-xl italic text-indigo-600 mb-4">Feeling: {post.feeling}</p>
            )}

            <p className="text-gray-700 text-lg mb-6 leading-relaxed">{post.content}</p>

            {post.images.length > 0 && (
                <div className="flex items-center overflow-x-auto gap-4 mt-4 scrollbar-hide">
                    {post.images.map((imageUrl: string, index: number) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`Post Image ${index + 1}`}
                            className="w-64 h-64 object-cover rounded-lg shadow-md"
                        />
                    ))}
                </div>
            )}

            <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-inner flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-800 flex items-center">
                    <FaThumbsUp className="mr-2 text-indigo-600" />
                    Reactions: <span className="ml-1 text-indigo-600">{reactionsCount}</span>
                </p>
                <button
                    onClick={handleCommentToggle}
                    className="text-lg font-semibold text-gray-800 flex items-center focus:outline-none"
                >
                    <FaCommentDots className="mr-2 text-indigo-600" />
                    Comments: <span className="ml-1 text-indigo-600">{commentsCount}</span>
                    {showComments ? <FaChevronUp className="ml-2 text-indigo-600" /> : <FaChevronDown className="ml-2 text-indigo-600" />}
                </button>
            </div>

            {showComments && (
                <div className="mt-4">
                    <div className="border-t border-gray-300 pt-4">
                        {loadingComments ? (
                            <p className="text-gray-500">Loading comments...</p>
                        ) : comments.length === 0 ? (
                            <p className="text-gray-500">No comments yet.</p>
                        ) : (
                            <ul>
                                {comments.map(comment => (
                                    <li key={comment.id} className="mb-4">
                                        <div className="flex items-start space-x-2">
                                            <div>
                                                <p className="text-sm font-semibold">
                                                    {comment.userName}
                                                </p>
                                                <p className="text-gray-700">{comment.content}</p>
                                                <p className="text-xs text-gray-500">
                                                    {comment.createdAt?.toDate().toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostDetails;
