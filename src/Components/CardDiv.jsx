import { useEffect, useState } from "react";
import Card from "./Card";

export default function CardDiv() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);


    useEffect(() => {
        setIsLoading(true);
        const fetchdata = async () => {
            try {
                const response = await fetch("/api/sendall")
                if (!response.ok) {
                    throw new Error("Server error");
                }
                const data  = await response.json();
                setData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
                // 2. Trigger the error state if the fetch fails
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        }
        fetchdata();
        
    }, [])

   const ifthereisdata = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-15">
            {data.map((place) => {
                // Parse "Romance,Elegance,Timelessness" smoothly into ["Romance", "Elegance", "Timelessness"]
                const characteristicsArray = place.main_characteristics 
                    ? place.main_characteristics.split(",") 
                    : [];

                return (
                    <Card
                        key={place.id}
                        image={place.image_url}
                        imagequote={place.notes} 
                        title={place.tagline}
                        paragraph={place.moreaboutplace}
                        button_text={`More about ${place.destination}`}
                        button_link={place.article_link}
                        main_Characteristics={characteristicsArray} 
                    />
                );
            })}
        </div>
    );
};

    const ifthereisnodata = () => {
        return(
            // Changed "class" to "className"
            <div className="max-w-full min-w-200 flex flex-col items-center justify-center p-12 mt-15 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-75" onClick={() => window.location.href = "/form"}>
            {/* SVG attributes updated to React's camelCase standard */}
            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">No destinations found</h3>
            <p className="mt-2 text-sm text-gray-500">It looks like there are no travel cards to display right now.</p>
            <p className="mt-2 text-sm text-gray-500 font-bold">Click to add one right now.</p>
            </div>
        )
    }

    const LoadingState = () => {
        return (
            <div className="w-full flex flex-col items-center justify-center p-12 mt-15 text-center min-h-75">
                {/* The spinning circle */}
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
                
                <h3 className="text-lg font-medium text-gray-900">Loading destinations...</h3>
                <p className="mt-2 text-sm text-gray-500">Please wait while we fetch the latest travel cards.</p>
            </div>
        );
    }

    const ErrorState = () => {
        return (
            <div className="max-w-full min-w-200 flex flex-col items-center justify-center p-12 mt-15 text-center border-2 border-red-200 bg-red-50 rounded-lg min-h-75">
                {/* Warning Triangle Icon */}
                <svg className="w-12 h-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-lg font-medium text-red-900">Oops! Something went wrong</h3>
                <p className="mt-2 text-sm text-red-700">We couldn't connect to the server to fetch your destinations.</p>
                
                {/* A quick way for the user to retry by refreshing the page */}
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-6 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }
    /* --- THE FINAL RETURN CONDITION --- */
    if (isLoading) {
        return <LoadingState />;
    }

    if (isError) {
        return <ErrorState />;
    }

    if (data && data.length > 0) {
        return ifthereisdata();
    }

    return ifthereisnodata();
}