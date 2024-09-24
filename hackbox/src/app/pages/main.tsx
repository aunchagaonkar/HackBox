import Link from 'next/link';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow-md p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">HackBox</h1>
                    <div>
                        <Link href="/login">
                            <button className="mr-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Login</button>
                        </Link>
                        <Link href="/signup">
                            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Sign Up</button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Dashboard Content */}
            <div className="flex flex-col lg:flex-row justify-between max-w-7xl mx-auto mt-10 p-4 space-y-8 lg:space-y-0 lg:space-x-8">

                {/* Website Info */}
                <div className="bg-white shadow-md rounded-lg p-6 lg:w-2/3">
                    <h2 className="text-2xl font-semibold mb-4">Welcome to HackBox</h2>
                    <p className="text-gray-700 mb-4">
                        HackBox is a platform for hosting and managing hackathons. Participants can register, submit their projects, and receive real-time updates.
                    </p>
                    <p className="text-gray-700">
                        Our platform is built to scale, allowing organizers to manage their events seamlessly. Login or sign up to get started with the latest hackathons.
                    </p>
                </div>

                {/* User Actions (Login/Sign Up) */}
                <div className="bg-white shadow-md rounded-lg p-6 lg:w-1/3">
                    <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
                    <p className="text-gray-700 mb-6">Login or sign up to participate in ongoing or upcoming hackathons.</p>
                    <Link href="/login">
                        <button className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Login
                        </button>
                    </Link>
                    <Link href="/signup">
                        <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
