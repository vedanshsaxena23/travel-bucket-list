import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function AddMore() {
    // Toggle between URL and Upload
    const [imageType, setImageType] = useState("url"); 
    const fileInputRef = useRef(null);
    
    // Submitting, Error, and Success UX States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // New Success State

    // Auto-clear success message after 4 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Updated state to include three separate fields for characteristics
    const [formData, setFormData] = useState({
        destination: "",
        location: "",
        tagline: "",
        moreaboutplace: "",
        notes: "",
        articleLink: "",
        imageLink: "",
        imageFile: null,
        char1: "",
        char2: "",
        char3: ""
    });

    const handleChange = (e) => {
        if (e.target.type === "file") {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null); 
        setSuccessMessage(null); // Clear previous success messages
        
        // Bundle characteristics into a single array for the frontend / backend payload
        const main_characteristics_array = [formData.char1.trim(), formData.char2.trim(), formData.char3.trim()].filter(Boolean);
        const main_characteristics_string = main_characteristics_array.join(",");
        
        const dataPayload = new FormData();
        dataPayload.append("destination", formData.destination);
        dataPayload.append("location", formData.location);
        dataPayload.append("tagline", formData.tagline);
        dataPayload.append("moreaboutplace", formData.moreaboutplace);
        dataPayload.append("notes", formData.notes);
        dataPayload.append("articleLink", formData.articleLink);
        dataPayload.append("main_characteristics", main_characteristics_string);
        dataPayload.append("imageType", imageType);

        if(imageType === "url") {
            dataPayload.append("imageLink", formData.imageLink);
        } else if (imageType === "upload" && formData.imageFile) {
            dataPayload.append("imageFile", formData.imageFile);
        }

        try {
            const response = await fetch("/api/destinations", {
                method: "POST",
                body: dataPayload,
            });

            if(response.ok) {
                const result = await response.json();
                
                // Set the success message container
                setSuccessMessage(`${formData.destination || "Destination"} has been successfully saved to your list.`);
                
                // Clear all fields after submission
                setFormData({ 
                    destination: "", 
                    location: "", 
                    tagline: "",
                    moreaboutplace: "",
                    notes: "",
                    articleLink: "",
                    imageLink: "",
                    imageFile: null,
                    char1: "",
                    char2: "",
                    char3: ""
                });

                // FORCE THE BROWSER DOM TO CLEAR THE FILE INPUT FIELD
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; 
                }
            } else {
                console.error("Server Error", response.statusText);
                setError(`Submission failed: ${response.statusText || "Server Error"}`);
            }
        } catch (error) {
            console.error("Network Error:", error);
            setError("A network error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md mx-auto mt-12 px-4"
        >
            <div className="text-center mb-10">
                <h2 className="text-3xl text-neutral-800 font-serif italic mb-2">
                    Add a Destination
                </h2>
                <p className="text-xs text-neutral-500 uppercase tracking-[0.2em]">
                    Where to next?
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-8">
                
                {/* Destination Input */}
                <div className="flex flex-col text-left">
                    <label htmlFor="destination" className="text-xs uppercase tracking-[0.15em] text-neutral-500 mb-2">
                        Destination Name
                    </label>
                    <input 
                        type="text" 
                        id="destination"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="e.g. Kyoto"
                        className="w-full border-b border-neutral-300 bg-transparent pb-2 outline-none focus:border-neutral-800 transition-colors text-neutral-800 placeholder:text-neutral-300 disabled:opacity-50"
                    />
                </div>

                {/* Location Input */}
                <div className="flex flex-col text-left">
                    <label htmlFor="location" className="text-xs uppercase tracking-[0.15em] text-neutral-500 mb-2">
                        Country / Region
                    </label>
                    <input 
                        type="text" 
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="e.g. Japan"
                        className="w-full border-b border-neutral-300 bg-transparent pb-2 outline-none focus:border-neutral-800 transition-colors text-neutral-800 placeholder:text-neutral-300 disabled:opacity-50"
                    />
                </div>

                {/* Tag Line Input */}
                <div className="flex flex-col text-left">
                    <label htmlFor="tagline" className="text-xs uppercase tracking-[0.15em] text-neutral-500 mb-2">
                        Tag Line for Post
                    </label>
                    <input 
                        type="text" 
                        id="tagline"
                        name="tagline"
                        value={formData.tagline}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="e.g. Venice: A city of reflections"
                        className="w-full border-b border-neutral-300 bg-transparent pb-2 outline-none focus:border-neutral-800 transition-colors text-neutral-800 placeholder:text-neutral-300 disabled:opacity-50"
                    />
                </div>

                {/* Three-Word Characteristics Input */}
                <div className="flex flex-col text-left">
                    <label className="text-xs uppercase tracking-[0.15em] text-neutral-500 mb-2">
                        Main Characteristics (3 Words)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        <input 
                            type="text" 
                            name="char1"
                            value={formData.char1}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                            placeholder="Word 1"
                            maxLength={15}
                            className="w-full border-b border-neutral-300 bg-transparent pb-2 outline-none focus:border-neutral-800 transition-colors text-neutral-800 placeholder:text-neutral-300 text-center text-sm disabled:opacity-50"
                        />
                        <input 
                            type="text" 
                            name="char2"
                            value={formData.char2}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                            placeholder="Word 2"
                            maxLength={15}
                            className="w-full border-b border-neutral-300 bg-transparent pb-2 outline-none focus:border-neutral-800 transition-colors text-neutral-800 placeholder:text-neutral-300 text-center text-sm disabled:opacity-50"
                        />
                        <input 
                            type="text" 
                            name="char3"
                            value={formData.char3}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                            placeholder="Word 3"
                            maxLength={15}
                            className="w-full border-b border-neutral-300 bg-transparent pb-2 outline-none focus:border-neutral-800 transition-colors text-neutral-800 placeholder:text-neutral-300 text-center text-sm disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* About Place Textarea */}
                <div className="flex flex-col text-left">
                    <label htmlFor="moreaboutplace" className="text-xs uppercase tracking-[0.15em] text-neutral-500 mb-2">
                        More about Place
                    </label>
                    <textarea 
                        id="moreaboutplace"
                        name="moreaboutplace"
                        value={formData.moreaboutplace}
                        onChange={handleChange}
                        rows="3"
                        disabled={isSubmitting}
                        placeholder="Tell us a bit about this location..."
                        className="w-full border-b border-neutral-300 bg-transparent pb-2 outline-none focus:border-neutral-800 transition-colors text-neutral-800 placeholder:text-neutral-300 resize-none disabled:opacity-50"
                    ></textarea>
                </div>

                {/* Notes Textarea */}
                <div className="flex flex-col text-left">
                    <label htmlFor="notes" className="text-xs uppercase tracking-[0.15em] text-neutral-500 mb-2">
                        Why do you want to go?
                    </label>
                    <textarea 
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="3"
                        disabled={isSubmitting}
                        placeholder="To see the cherry blossoms..."
                        className="w-full border-b border-neutral-300 bg-transparent pb-2 outline-none focus:border-neutral-800 transition-colors text-neutral-800 placeholder:text-neutral-300 resize-none disabled:opacity-50"
                    ></textarea>
                </div>

                {/* Article Link Input */}
                <div className="flex flex-col text-left">
                    <label htmlFor="articleLink" className="text-xs uppercase tracking-[0.15em] text-neutral-500 mb-2">
                        Inspiration Link
                    </label>
                    <input 
                        type="url" 
                        id="articleLink"
                        name="articleLink"
                        value={formData.articleLink}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="https://example.com/travel-blog"
                        className="w-full border-b border-neutral-300 bg-transparent pb-2 outline-none focus:border-neutral-800 transition-colors text-neutral-800 placeholder:text-neutral-300 disabled:opacity-50"
                    />
                </div>

                {/* Image Type Radio Buttons */}
                <div className="flex flex-col text-left">
                    <span className="text-xs uppercase tracking-[0.15em] text-neutral-500 mb-3">
                        Image Source
                    </span>
                    <div className="flex space-x-6">
                        <label className="flex items-center space-x-2 cursor-pointer text-sm text-neutral-700">
                            <input 
                                type="radio" 
                                name="imageType"
                                value="url"
                                checked={imageType === "url"}
                                disabled={isSubmitting}
                                onChange={(e) => setImageType(e.target.value)}
                                className="accent-neutral-800"
                            />
                            <span>URL Link</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer text-sm text-neutral-700">
                            <input 
                                type="radio" 
                                name="imageType"
                                value="upload"
                                checked={imageType === "upload"}
                                disabled={isSubmitting}
                                onChange={(e) => setImageType(e.target.value)}
                                className="accent-neutral-800"
                            />
                            <span>Upload File</span>
                        </label>
                    </div>
                </div>

                {/* Conditional Rendering based on Image Type selection */}
                {imageType === "url" ? (
                    <div className="flex flex-col text-left">
                        <label htmlFor="imageLink" className="text-xs uppercase tracking-[0.15em] text-neutral-500 mb-2">
                            Image URL
                        </label>
                        <input 
                            type="url" 
                            id="imageLink"
                            name="imageLink"
                            value={formData.imageLink}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            placeholder="https://example.com/image.jpg"
                            className="w-full border-b border-neutral-300 bg-transparent pb-2 outline-none focus:border-neutral-800 transition-colors text-neutral-800 placeholder:text-neutral-300 disabled:opacity-50"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col text-left">
                        <label htmlFor="imageFile" className="text-xs uppercase tracking-[0.15em] text-neutral-500 mb-2">
                            Upload Photo
                        </label>
                        <input 
                            type="file" 
                            id="imageFile"
                            name="imageFile"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="w-full border-b border-neutral-300 bg-transparent pb-2 outline-none focus:border-neutral-800 transition-colors text-sm text-neutral-500 file:mr-4 file:py-1.5 file:px-4 file:border-0 file:text-xs file:uppercase file:tracking-[0.15em] file:bg-neutral-100 file:text-neutral-800 hover:file:bg-neutral-200 file:cursor-pointer file:transition-colors cursor-pointer disabled:opacity-50"
                        />
                    </div>
                )}

                {/* Submit Button */}
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full border border-neutral-300 text-neutral-800 px-8 py-3 mt-4 text-xs tracking-[0.2em] uppercase hover:bg-neutral-900 hover:text-[#fafafa] transition-colors duration-300 cursor-pointer disabled:bg-neutral-100 disabled:text-neutral-400 disabled:border-neutral-200 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Saving..." : "Save to List"}
                </button>

                {/* Status/Notification Banners Container */}
                <div className="min-h-10 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {/* Error Banner */}
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xs text-red-600 tracking-wide bg-red-50/50 border border-red-200 p-3 text-center rounded"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Success Banner */}
                        {successMessage && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-xs text-emerald-700 tracking-wide bg-emerald-50/60 border border-emerald-200 p-3 text-center rounded font-medium"
                            >
                                {successMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                
                
            </form>
        </motion.div>
    );
}