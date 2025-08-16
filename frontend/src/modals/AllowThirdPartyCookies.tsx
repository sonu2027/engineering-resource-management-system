import React from "react";

interface AllowThirdPartyCookiesProps {
    isOpen: boolean;
    onClose: () => void;
}

const AllowThirdPartyCookies: React.FC<AllowThirdPartyCookiesProps> = ({
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md relative overflow-y-auto max-h-[200vh]">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                    ✖
                </button>

                
                <div>
                    <h1 className="text-center text-red-600 text-2xl">Please read this</h1>
                    <h2 className="text-xl font-bold mb-4 text-center text-blue-600">
                    Allow Third-Party Cookies
                </h2>
                </div>

                <p className="text-gray-700 mb-4">
                    Please make sure you have allowed third-party cookies in your browser
                    before using this website. <br />
                    For <span className="font-semibold">Google Chrome</span>:
                </p>

                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li>Click on the <strong>three dots (⋮)</strong> in the top-right corner.</li>
                    <li>Select <strong>Settings</strong>.</li>
                    <li>Go to <strong>Privacy and security</strong>.</li>
                    <li>Click on <strong>Cookies and other site data</strong>.</li>
                    <li>Enable <strong>Allow third-party cookies</strong>.</li>
                </ol>

                <p className="mt-4 text-green-600 font-medium text-center">
                    ✅ Now you are ready to use this website.
                </p>

                <div className="flex justify-center mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Got It
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AllowThirdPartyCookies;
