import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 mt-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 
                    className="text-8xl md:text-9xl text-neutral-800 tracking-wider mb-2"
                    style={{ fontFamily: "barriecito" }}
                >
                    404
                </h1>
                
                <h2 className="text-2xl md:text-3xl text-neutral-600 font-serif italic mb-6">
                    Off the Beaten Path
                </h2>
                
                <p className="text-sm text-neutral-500 font-light tracking-[0.2em] uppercase mb-10 max-w-md mx-auto">
                    The destination you are looking for seems to have vanished from our maps.
                </p>
                
                <Link 
                    to="/" 
                    className="inline-block border border-neutral-300 text-neutral-600 px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-neutral-900 hover:text-[#fafafa] transition-colors duration-300"
                >
                    Return Home
                </Link>
            </motion.div>
        </div>
    );
}